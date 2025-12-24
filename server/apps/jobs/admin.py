"""
Admin configuration for Jobs app
"""
from django.contrib import admin
from .models import Job, JobSkillRequirement, JobEligibilityAnalysis


class JobSkillRequirementInline(admin.TabularInline):
    """
    Inline admin for job skill requirements
    """
    model = JobSkillRequirement
    extra = 1
    autocomplete_fields = ['skill']
    fields = ['skill', 'requirement_type', 'minimum_proficiency', 'years_required', 'weight']


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    """
    Admin interface for Job model
    """
    list_display = [
        'title',
        'company_name',
        'location',
        'job_type',
        'experience_level',
        'status',
        'is_remote',
        'posted_date',
        'view_count',
        'created_at',
    ]
    list_filter = [
        'status',
        'job_type',
        'experience_level',
        'is_remote',
        'remote_policy',
        'is_scraped',
        'created_at',
    ]
    search_fields = [
        'title',
        'company_name',
        'description',
        'requirements',
        'location',
    ]
    readonly_fields = [
        'view_count',
        'application_count',
        'created_at',
        'updated_at',
        'last_scraped_at',
    ]
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'title',
                'company_name',
                'company_description',
            )
        }),
        ('Job Details', {
            'fields': (
                'description',
                'responsibilities',
                'requirements',
                'nice_to_have',
                'job_type',
                'experience_level',
            )
        }),
        ('Location & Remote', {
            'fields': (
                'location',
                'is_remote',
                'remote_policy',
            )
        }),
        ('Compensation', {
            'fields': (
                'salary_min',
                'salary_max',
                'salary_currency',
                'salary_period',
            )
        }),
        ('Parsed Data', {
            'fields': (
                'parsed_skills',
                'parsed_requirements',
            ),
            'classes': ('collapse',)
        }),
        ('Source & Metadata', {
            'fields': (
                'source_url',
                'source_platform',
                'posted_date',
                'application_deadline',
                'status',
                'is_scraped',
                'last_scraped_at',
                'added_by',
            )
        }),
        ('Analytics', {
            'fields': (
                'view_count',
                'application_count',
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at',
            )
        }),
    )
    inlines = [JobSkillRequirementInline]
    date_hierarchy = 'created_at'
    ordering = ['-created_at']


@admin.register(JobSkillRequirement)
class JobSkillRequirementAdmin(admin.ModelAdmin):
    """
    Admin interface for JobSkillRequirement model
    """
    list_display = [
        'job',
        'skill',
        'requirement_type',
        'minimum_proficiency',
        'years_required',
        'weight',
        'created_at',
    ]
    list_filter = [
        'requirement_type',
        'minimum_proficiency',
        'created_at',
    ]
    search_fields = [
        'job__title',
        'skill__name',
    ]
    autocomplete_fields = ['job', 'skill']
    readonly_fields = ['created_at']
    ordering = ['-created_at']


@admin.register(JobEligibilityAnalysis)
class JobEligibilityAnalysisAdmin(admin.ModelAdmin):
    """
    Admin interface for JobEligibilityAnalysis model
    """
    list_display = [
        'user',
        'job',
        'eligibility_level',
        'match_score',
        'llm_model',
        'analyzed_at',
    ]
    list_filter = [
        'eligibility_level',
        'llm_model',
        'analyzed_at',
    ]
    search_fields = [
        'user__email',
        'user__first_name',
        'user__last_name',
        'job__title',
        'job__company_name',
    ]
    readonly_fields = [
        'user',
        'job',
        'eligibility_level',
        'match_score',
        'analysis_summary',
        'strengths',
        'gaps',
        'recommendations',
        'matching_skills',
        'missing_skills',
        'experience_match',
        'experience_gap_years',
        'full_analysis',
        'analyzed_at',
        'llm_model',
        'token_usage',
    ]
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'user',
                'job',
                'additional_context',
                'analyzed_at',
            )
        }),
        ('Analysis Results', {
            'fields': (
                'eligibility_level',
                'match_score',
                'analysis_summary',
            )
        }),
        ('Detailed Analysis', {
            'fields': (
                'strengths',
                'gaps',
                'recommendations',
            )
        }),
        ('Skills Analysis', {
            'fields': (
                'matching_skills',
                'missing_skills',
            )
        }),
        ('Experience Analysis', {
            'fields': (
                'experience_match',
                'experience_gap_years',
            )
        }),
        ('Full Response', {
            'fields': (
                'full_analysis',
            ),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': (
                'llm_model',
                'token_usage',
            )
        }),
    )
    date_hierarchy = 'analyzed_at'
    ordering = ['-analyzed_at']

    def has_add_permission(self, request):
        """Analyses should only be created through the API"""
        return False

    def has_change_permission(self, request, obj=None):
        """Analyses are read-only in admin"""
        return False
