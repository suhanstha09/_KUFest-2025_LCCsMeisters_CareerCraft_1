"""
Views for Jobs app
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import Job, JobEligibilityAnalysis
from .serializers import (
    JobListSerializer,
    JobDetailSerializer,
    JobEligibilityAnalysisSerializer,
    JobEligibilityAnalysisDetailSerializer,
    AnalyzeJobEligibilitySerializer,
    ReanalyzeJobEligibilitySerializer,
)
from .services import JobEligibilityAnalyzer, DreamJobParser


@extend_schema_view(
    list=extend_schema(
        tags=['Jobs'],
        summary='List all jobs',
        description='Get a paginated list of all active jobs with filtering',
    ),
    retrieve=extend_schema(
        tags=['Jobs'],
        summary='Get job details',
        description='Get detailed information about a specific job',
    ),
)
class JobViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for browsing jobs
    """
    queryset = Job.objects.filter(status='ACTIVE').select_related(
        'added_by'
    ).prefetch_related('skill_requirements__skill')
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['job_type', 'experience_level', 'is_remote', 'remote_policy']
    search_fields = ['title', 'company_name', 'description', 'requirements']
    ordering_fields = ['created_at', 'posted_date', 'title', 'salary_min']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return JobDetailSerializer
        return JobListSerializer

    def retrieve(self, request, *args, **kwargs):
        """Increment view count when job is viewed"""
        instance = self.get_object()
        instance.view_count += 1
        instance.save(update_fields=['view_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @extend_schema(
        tags=['Jobs'],
        summary='Analyze job eligibility',
        description='Analyze how well the current user matches this job using AI',
        request=AnalyzeJobEligibilitySerializer,
        responses={200: JobEligibilityAnalysisDetailSerializer},
    )
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def analyze_eligibility(self, request, pk=None):
        """
        Analyze user's eligibility for this job using LangChain AI
        """
        job = self.get_object()
        serializer = AnalyzeJobEligibilitySerializer(data={'job_id': job.id, **request.data})
        serializer.is_valid(raise_exception=True)

        additional_context = serializer.validated_data.get('additional_context', '')

        try:
            # Initialize analyzer
            analyzer = JobEligibilityAnalyzer(model_name="gpt-4")

            # Perform analysis
            analysis = analyzer.analyze_eligibility(
                user=request.user,
                job=job,
                additional_context=additional_context
            )

            # Return analysis
            response_serializer = JobEligibilityAnalysisDetailSerializer(analysis)
            return Response(response_serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Analysis failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@extend_schema_view(
    list=extend_schema(
        tags=['Job Analysis'],
        summary='List my job analyses',
        description='Get all job eligibility analyses for the current user',
    ),
    retrieve=extend_schema(
        tags=['Job Analysis'],
        summary='Get analysis details',
        description='Get detailed information about a specific job analysis',
    ),
)
class JobEligibilityAnalysisViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing job eligibility analyses
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['eligibility_level', 'job']
    ordering_fields = ['analyzed_at', 'match_score']
    ordering = ['-analyzed_at']

    def get_queryset(self):
        """Filter to current user's analyses"""
        return JobEligibilityAnalysis.objects.filter(
            user=self.request.user
        ).select_related('job', 'user')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return JobEligibilityAnalysisDetailSerializer
        return JobEligibilityAnalysisSerializer

    @extend_schema(
        tags=['Job Analysis'],
        summary='Analyze job eligibility',
        description='Analyze eligibility for a job with optional additional context',
        request=AnalyzeJobEligibilitySerializer,
        responses={200: JobEligibilityAnalysisDetailSerializer},
    )
    @action(detail=False, methods=['post'])
    def analyze(self, request):
        """
        Analyze user's eligibility for a job
        """
        serializer = AnalyzeJobEligibilitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        job_id = serializer.validated_data['job_id']
        additional_context = serializer.validated_data.get('additional_context', '')

        try:
            job = Job.objects.get(id=job_id)

            # Initialize analyzer
            analyzer = JobEligibilityAnalyzer(model_name="gpt-4")

            # Perform analysis
            analysis = analyzer.analyze_eligibility(
                user=request.user,
                job=job,
                additional_context=additional_context
            )

            # Return analysis
            response_serializer = JobEligibilityAnalysisDetailSerializer(analysis)
            return Response(response_serializer.data, status=status.HTTP_200_OK)

        except Job.DoesNotExist:
            return Response(
                {'error': 'Job not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Analysis failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        tags=['Job Analysis'],
        summary='Re-analyze with additional context',
        description='Re-run analysis with additional context from user',
        request=ReanalyzeJobEligibilitySerializer,
        responses={200: JobEligibilityAnalysisDetailSerializer},
    )
    @action(detail=False, methods=['post'])
    def reanalyze(self, request):
        """
        Re-analyze with additional context
        """
        serializer = ReanalyzeJobEligibilitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        analysis_id = serializer.validated_data['analysis_id']
        additional_context = serializer.validated_data['additional_context']

        try:
            # Get previous analysis
            previous_analysis = JobEligibilityAnalysis.objects.get(
                id=analysis_id,
                user=request.user
            )

            # Initialize analyzer
            analyzer = JobEligibilityAnalyzer(model_name="gpt-4")

            # Re-analyze
            new_analysis = analyzer.reanalyze_with_context(
                analysis=previous_analysis,
                additional_context=additional_context
            )

            # Return analysis
            response_serializer = JobEligibilityAnalysisDetailSerializer(new_analysis)
            return Response(response_serializer.data, status=status.HTTP_200_OK)

        except JobEligibilityAnalysis.DoesNotExist:
            return Response(
                {'error': 'Analysis not found or you do not have permission to access it'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Re-analysis failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        tags=['Job Analysis'],
        summary='Get analysis statistics',
        description='Get statistics about user\'s job analyses',
    )
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get statistics about user's job analyses
        """
        analyses = self.get_queryset()

        stats = {
            'total_analyses': analyses.count(),
            'by_eligibility_level': {
                'EXCELLENT': analyses.filter(eligibility_level='EXCELLENT').count(),
                'GOOD': analyses.filter(eligibility_level='GOOD').count(),
                'FAIR': analyses.filter(eligibility_level='FAIR').count(),
                'POOR': analyses.filter(eligibility_level='POOR').count(),
            },
            'average_match_score': 0,
            'recent_analyses': JobEligibilityAnalysisSerializer(
                analyses[:5], many=True
            ).data,
        }

        # Calculate average match score
        if analyses.exists():
            from django.db.models import Avg
            avg_score = analyses.aggregate(Avg('match_score'))['match_score__avg']
            stats['average_match_score'] = round(avg_score, 2) if avg_score else 0

        return Response(stats)

    @extend_schema(
        tags=['Job Analysis'],
        summary='Analyze dream job',
        description='Analyze eligibility for a dream job described by the user or pasted job description',
        request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'job_description': {
                        'type': 'string',
                        'description': 'Job description text (from job board) or dream job description',
                    },
                    'additional_context': {
                        'type': 'string',
                        'description': 'Optional additional context about user skills/experience',
                    },
                    'save_job': {
                        'type': 'boolean',
                        'description': 'Whether to save the parsed job to database (default: false)',
                        'default': False,
                    },
                },
                'required': ['job_description'],
            }
        },
        responses={200: JobEligibilityAnalysisDetailSerializer},
    )
    @action(detail=False, methods=['post'])
    def analyze_dream_job(self, request):
        """
        Analyze user's eligibility for their dream job

        User can either:
        1. Paste a job description from a job board
        2. Describe their dream job in natural language

        AI will:
        1. Parse the job description to extract requirements
        2. Create a temporary job object
        3. Analyze user's eligibility
        4. Optionally save the job to database
        """
        job_description = request.data.get('job_description')
        additional_context = request.data.get('additional_context', '')
        save_job = request.data.get('save_job', False)

        if not job_description:
            return Response(
                {'error': 'job_description is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Step 1: Parse job description with AI
            parser = DreamJobParser()
            parsed_job_data = parser.parse_job_description(job_description)

            # Step 2: Create job object (saved or temporary)
            if save_job:
                # Map remote policy to correct values
                remote_policy = parsed_job_data.get("remote_policy", "REMOTE")
                if remote_policy == "FULLY_REMOTE":
                    remote_policy = "REMOTE"
                elif remote_policy == "ON_SITE":
                    remote_policy = "ONSITE"

                # Generate unique source URL for saved dream jobs
                import uuid
                source_url = f"https://skillsetz.com/dream-jobs/{uuid.uuid4()}"

                # Build job kwargs, only include salary_currency if provided
                job_kwargs = {
                    "title": parsed_job_data.get("job_title", "Dream Job"),
                    "company_name": parsed_job_data.get("company_name", "Dream Company"),
                    "company_description": parsed_job_data.get("company_culture", ""),
                    "job_type": parsed_job_data.get("job_type", "FULL_TIME"),
                    "experience_level": parsed_job_data.get("experience_level", "MID"),
                    "location": parsed_job_data.get("location", "Remote"),
                    "is_remote": parsed_job_data.get("is_remote", True),
                    "remote_policy": remote_policy,
                    "description": parsed_job_data.get("description", ""),
                    "responsibilities": "\n".join(
                        [f"• {resp}" for resp in parsed_job_data.get("responsibilities", [])]
                    ) if isinstance(parsed_job_data.get("responsibilities"), list) else str(parsed_job_data.get("responsibilities", "")),
                    "requirements": "\n".join(
                        [f"• {req.get('name', req) if isinstance(req, dict) else req}"
                         for req in parsed_job_data.get("required_skills", [])]
                    ),
                    "salary_min": parsed_job_data.get("min_salary"),
                    "salary_max": parsed_job_data.get("max_salary"),
                    "source_url": source_url,
                    "source_platform": "Dream Job (User Created)",
                    "parsed_skills": parsed_job_data.get("required_skills", [])
                    + parsed_job_data.get("preferred_skills", []),
                    "parsed_requirements": parsed_job_data,
                    "status": 'ACTIVE',
                    "added_by": request.user,
                }

                # Only add salary_currency if provided (let model default handle it otherwise)
                if parsed_job_data.get("salary_currency"):
                    job_kwargs["salary_currency"] = parsed_job_data.get("salary_currency")

                # Save to database
                job = Job.objects.create(**job_kwargs)
            else:
                # Create temporary job (not saved)
                job = parser.create_temporary_job(parsed_job_data)

            # Step 3: Analyze eligibility
            analyzer = JobEligibilityAnalyzer(model_name="gpt-4")
            analysis = analyzer.analyze_eligibility(
                user=request.user,
                job=job,
                additional_context=additional_context
            )

            # Step 4: Return results
            response_data = {
                'message': 'Dream job analyzed successfully',
                'parsed_job': parsed_job_data,
                'job_saved': save_job,
                'analysis': JobEligibilityAnalysisDetailSerializer(analysis).data,
            }

            if save_job:
                response_data['job_id'] = job.id
                response_data['job_url'] = f'/api/jobs/{job.id}/'

            return Response(response_data, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f'Dream job analysis failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
