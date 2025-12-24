"""
Management command to create mock profile data for the current user
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from datetime import date, timedelta
from decimal import Decimal

from apps.profiles.models import (
    UserProfile,
    Education,
    WorkExperience,
    Project,
    Certification,
    Skill,
    SkillCategory,
    UserSkill,
)

User = get_user_model()


class Command(BaseCommand):
    help = 'Create mock profile data for a user'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            help='Email of the user to create mock data for',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing profile data before creating new data',
        )

    def handle(self, *args, **options):
        email = options.get('email')
        clear = options.get('clear', False)

        if not email:
            self.stdout.write(self.style.ERROR('Please provide user email with --email'))
            return

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User with email {email} not found'))
            return

        # Get or create profile
        profile, created = UserProfile.objects.get_or_create(user=user)

        if clear:
            self.stdout.write('Clearing existing data...')
            Education.objects.filter(profile=profile).delete()
            WorkExperience.objects.filter(profile=profile).delete()
            Project.objects.filter(profile=profile).delete()
            Certification.objects.filter(profile=profile).delete()
            UserSkill.objects.filter(profile=profile).delete()
            self.stdout.write(self.style.SUCCESS('✓ Cleared existing data'))

        # Create skill categories
        self.stdout.write('Creating skill categories...')
        categories = self._create_skill_categories()
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(categories)} skill categories'))

        # Create skills
        self.stdout.write('Creating skills...')
        skills = self._create_skills(categories)
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(skills)} skills'))

        # Update profile
        self.stdout.write('Updating profile...')
        self._update_profile(profile)
        self.stdout.write(self.style.SUCCESS('✓ Updated profile'))

        # Create education records
        self.stdout.write('Creating education records...')
        education_count = self._create_education(profile)
        self.stdout.write(self.style.SUCCESS(f'✓ Created {education_count} education records'))

        # Create work experiences
        self.stdout.write('Creating work experiences...')
        work_count = self._create_work_experiences(profile, skills)
        self.stdout.write(self.style.SUCCESS(f'✓ Created {work_count} work experiences'))

        # Create projects
        self.stdout.write('Creating projects...')
        project_count = self._create_projects(profile, skills)
        self.stdout.write(self.style.SUCCESS(f'✓ Created {project_count} projects'))

        # Create certifications
        self.stdout.write('Creating certifications...')
        cert_count = self._create_certifications(profile, skills)
        self.stdout.write(self.style.SUCCESS(f'✓ Created {cert_count} certifications'))

        # Create user skills
        self.stdout.write('Creating user skills...')
        user_skills_count = self._create_user_skills(profile, skills)
        self.stdout.write(self.style.SUCCESS(f'✓ Created {user_skills_count} user skills'))

        self.stdout.write(self.style.SUCCESS(f'\n✅ Successfully created mock profile data for {user.email}'))

        # Calculate totals
        total_records = (
            Education.objects.filter(profile=profile).count() +
            WorkExperience.objects.filter(profile=profile).count() +
            Project.objects.filter(profile=profile).count() +
            Certification.objects.filter(profile=profile).count() +
            UserSkill.objects.filter(profile=profile).count()
        )
        self.stdout.write(self.style.SUCCESS(f'Total records created: {total_records}'))

    def _create_skill_categories(self):
        categories = {}

        category_data = [
            ('Programming Languages', 'General-purpose programming languages'),
            ('Web Frameworks', 'Web development frameworks and libraries'),
            ('Databases', 'Database management systems'),
            ('Cloud & DevOps', 'Cloud platforms and DevOps tools'),
            ('Frontend', 'Frontend technologies and frameworks'),
            ('Soft Skills', 'Interpersonal and professional skills'),
        ]

        for name, description in category_data:
            category, _ = SkillCategory.objects.get_or_create(
                name=name,
                defaults={'description': description}
            )
            categories[name] = category

        return categories

    def _create_skills(self, categories):
        skills = {}

        skill_data = [
            # Programming Languages
            ('Python', categories['Programming Languages'], 'TECHNICAL', 'High-level programming language'),
            ('JavaScript', categories['Programming Languages'], 'TECHNICAL', 'Programming language for web'),
            ('TypeScript', categories['Programming Languages'], 'TECHNICAL', 'Typed superset of JavaScript'),
            ('Java', categories['Programming Languages'], 'TECHNICAL', 'Object-oriented programming language'),

            # Web Frameworks
            ('Django', categories['Web Frameworks'], 'FRAMEWORK', 'Python web framework'),
            ('React', categories['Web Frameworks'], 'FRAMEWORK', 'JavaScript library for UIs'),
            ('Node.js', categories['Web Frameworks'], 'FRAMEWORK', 'JavaScript runtime'),
            ('FastAPI', categories['Web Frameworks'], 'FRAMEWORK', 'Modern Python web framework'),

            # Databases
            ('PostgreSQL', categories['Databases'], 'TOOL', 'Relational database'),
            ('MongoDB', categories['Databases'], 'TOOL', 'NoSQL database'),
            ('Redis', categories['Databases'], 'TOOL', 'In-memory data store'),

            # Cloud & DevOps
            ('AWS', categories['Cloud & DevOps'], 'TOOL', 'Amazon Web Services'),
            ('Docker', categories['Cloud & DevOps'], 'TOOL', 'Containerization platform'),
            ('Kubernetes', categories['Cloud & DevOps'], 'TOOL', 'Container orchestration'),
            ('CI/CD', categories['Cloud & DevOps'], 'TECHNICAL', 'Continuous Integration/Deployment'),

            # Frontend
            ('HTML/CSS', categories['Frontend'], 'TECHNICAL', 'Web markup and styling'),
            ('Tailwind CSS', categories['Frontend'], 'FRAMEWORK', 'Utility-first CSS framework'),
            ('Next.js', categories['Frontend'], 'FRAMEWORK', 'React framework'),

            # Soft Skills
            ('Leadership', categories['Soft Skills'], 'SOFT', 'Team leadership abilities'),
            ('Communication', categories['Soft Skills'], 'SOFT', 'Effective communication'),
            ('Problem Solving', categories['Soft Skills'], 'SOFT', 'Analytical thinking'),
        ]

        for name, category, skill_type, description in skill_data:
            skill, _ = Skill.objects.get_or_create(
                name=name,
                defaults={
                    'category': category,
                    'skill_type': skill_type,
                    'description': description,
                    'is_verified': True,
                }
            )
            skills[name] = skill

        return skills

    def _update_profile(self, profile):
        profile.bio = "Passionate software engineer with 5+ years of experience building scalable web applications. Specialized in backend development with Python/Django and modern cloud infrastructure. Strong advocate for clean code, test-driven development, and continuous learning."
        profile.current_title = "Senior Backend Engineer"
        profile.current_company = "Tech Innovations Inc."
        profile.years_of_experience = Decimal('5.5')
        profile.linkedin_url = "https://linkedin.com/in/johndoe"
        profile.github_url = "https://github.com/johndoe"
        profile.portfolio_url = "https://johndoe.dev"
        profile.career_goal = "To become a technical architect leading the design and implementation of large-scale distributed systems, while mentoring junior engineers and contributing to open-source projects."
        profile.target_roles = ["Technical Lead", "Solutions Architect", "Engineering Manager"]
        profile.industry = "Technology"
        profile.domain_expertise = ["Backend Development", "Cloud Architecture", "API Design", "Microservices"]
        profile.save()

    def _create_education(self, profile):
        education_data = [
            {
                'institution': 'Stanford University',
                'degree': 'Bachelor of Science',
                'degree_level': 'BACHELOR',
                'field_of_study': 'Computer Science',
                'start_date': date(2015, 9, 1),
                'end_date': date(2019, 6, 15),
                'is_current': False,
                'grade': '3.8 GPA',
                'description': 'Focused on software engineering, algorithms, and distributed systems. Completed senior thesis on microservices architecture.'
            },
            {
                'institution': 'MIT',
                'degree': 'Master of Science',
                'degree_level': 'MASTER',
                'field_of_study': 'Computer Science',
                'start_date': date(2019, 9, 1),
                'end_date': date(2021, 5, 30),
                'is_current': False,
                'grade': '3.9 GPA',
                'description': 'Specialized in cloud computing and distributed systems. Research on scalable web architectures.'
            }
        ]

        count = 0
        for data in education_data:
            Education.objects.create(profile=profile, **data)
            count += 1

        return count

    def _create_work_experiences(self, profile, skills):
        work_data = [
            {
                'job_title': 'Senior Backend Engineer',
                'company': 'Tech Innovations Inc.',
                'employment_type': 'FULL_TIME',
                'location': 'San Francisco, CA',
                'is_remote': False,
                'start_date': date(2022, 3, 1),
                'end_date': None,
                'is_current': True,
                'description': 'Leading backend development for core platform services handling 10M+ daily active users.',
                'responsibilities': [
                    'Design and implement scalable RESTful APIs using Django and FastAPI',
                    'Architect microservices infrastructure on AWS with Docker and Kubernetes',
                    'Lead code reviews and mentor 5 junior engineers',
                    'Optimize database queries reducing latency by 40%',
                    'Implement CI/CD pipelines improving deployment frequency by 3x'
                ],
                'achievements': [
                    'Reduced API response time from 300ms to 80ms through caching and optimization',
                    'Led migration from monolith to microservices architecture',
                    'Implemented real-time features using WebSockets serving 100K concurrent users'
                ],
                'skills': ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'Kubernetes']
            },
            {
                'job_title': 'Backend Engineer',
                'company': 'StartupCo',
                'employment_type': 'FULL_TIME',
                'location': 'Remote',
                'is_remote': True,
                'start_date': date(2020, 6, 1),
                'end_date': date(2022, 2, 28),
                'is_current': False,
                'description': 'Built backend services for a fintech platform processing millions in transactions.',
                'responsibilities': [
                    'Developed payment processing APIs with Django',
                    'Implemented authentication and authorization systems',
                    'Created automated testing framework with 85% code coverage',
                    'Managed PostgreSQL database with complex queries and indexes'
                ],
                'achievements': [
                    'Built payment gateway integration handling $5M+ monthly volume',
                    'Reduced deployment time from 2 hours to 15 minutes',
                    'Implemented fraud detection system saving $200K annually'
                ],
                'skills': ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker', 'CI/CD']
            },
            {
                'job_title': 'Full Stack Developer',
                'company': 'WebDev Agency',
                'employment_type': 'FULL_TIME',
                'location': 'New York, NY',
                'is_remote': False,
                'start_date': date(2019, 7, 1),
                'end_date': date(2020, 5, 31),
                'is_current': False,
                'description': 'Developed full-stack web applications for various clients using modern technologies.',
                'responsibilities': [
                    'Built client websites using React and Django',
                    'Implemented responsive designs with Tailwind CSS',
                    'Managed client communications and project timelines',
                    'Deployed applications on AWS'
                ],
                'achievements': [
                    'Delivered 12 successful client projects on time and under budget',
                    'Improved website performance scores to 95+ on Lighthouse',
                    'Trained 2 junior developers on React best practices'
                ],
                'skills': ['Python', 'Django', 'React', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'PostgreSQL']
            }
        ]

        count = 0
        for data in work_data:
            skill_names = data.pop('skills')
            work_exp = WorkExperience.objects.create(profile=profile, **data)

            # Add skills
            for skill_name in skill_names:
                if skill_name in skills:
                    work_exp.skills_used.add(skills[skill_name])

            count += 1

        return count

    def _create_projects(self, profile, skills):
        project_data = [
            {
                'title': 'E-Commerce Platform',
                'project_type': 'WORK',
                'description': 'Built a scalable e-commerce platform handling 50K+ daily orders with real-time inventory management, payment processing, and order tracking.',
                'technologies_used': ['Django', 'React', 'PostgreSQL', 'Redis', 'Stripe API', 'Celery'],
                'project_url': 'https://ecommerce-demo.example.com',
                'github_url': 'https://github.com/johndoe/ecommerce-platform',
                'demo_url': 'https://demo.ecommerce.example.com',
                'start_date': date(2022, 6, 1),
                'end_date': date(2023, 3, 31),
                'is_ongoing': False,
                'skills': ['Python', 'Django', 'React', 'PostgreSQL', 'Redis']
            },
            {
                'title': 'AI Chatbot Service',
                'project_type': 'PERSONAL',
                'description': 'Developed an AI-powered chatbot service using OpenAI GPT-4 API with custom fine-tuning for domain-specific conversations.',
                'technologies_used': ['FastAPI', 'Python', 'OpenAI API', 'MongoDB', 'WebSockets'],
                'project_url': '',
                'github_url': 'https://github.com/johndoe/ai-chatbot',
                'demo_url': 'https://chatbot.johndoe.dev',
                'start_date': date(2023, 9, 1),
                'end_date': None,
                'is_ongoing': True,
                'skills': ['Python', 'FastAPI', 'MongoDB']
            },
            {
                'title': 'Real-Time Analytics Dashboard',
                'project_type': 'WORK',
                'description': 'Created a real-time analytics dashboard for monitoring application metrics, user behavior, and system performance.',
                'technologies_used': ['Django', 'React', 'Chart.js', 'WebSockets', 'TimescaleDB'],
                'project_url': 'https://analytics.techinnovations.com',
                'github_url': '',
                'demo_url': '',
                'start_date': date(2023, 1, 15),
                'end_date': date(2023, 5, 30),
                'is_ongoing': False,
                'skills': ['Python', 'Django', 'React', 'PostgreSQL']
            },
            {
                'title': 'Open Source API Framework',
                'project_type': 'OPEN_SOURCE',
                'description': 'Contributing to an open-source API framework for building RESTful services with automatic documentation and validation.',
                'technologies_used': ['Python', 'FastAPI', 'Pydantic', 'pytest'],
                'project_url': 'https://apiframework.org',
                'github_url': 'https://github.com/opensource/api-framework',
                'demo_url': '',
                'start_date': date(2022, 11, 1),
                'end_date': None,
                'is_ongoing': True,
                'skills': ['Python', 'FastAPI']
            }
        ]

        count = 0
        for data in project_data:
            skill_names = data.pop('skills')
            project = Project.objects.create(profile=profile, **data)

            # Add skills
            for skill_name in skill_names:
                if skill_name in skills:
                    project.skills_demonstrated.add(skills[skill_name])

            count += 1

        return count

    def _create_certifications(self, profile, skills):
        cert_data = [
            {
                'name': 'AWS Certified Solutions Architect - Associate',
                'issuing_organization': 'Amazon Web Services',
                'credential_id': 'AWS-SAA-12345',
                'credential_url': 'https://aws.amazon.com/verification',
                'issue_date': date(2022, 5, 15),
                'expiry_date': date(2025, 5, 15),
                'does_not_expire': False,
                'skills': ['AWS', 'Docker', 'Kubernetes']
            },
            {
                'name': 'Professional Scrum Master I',
                'issuing_organization': 'Scrum.org',
                'credential_id': 'PSM-67890',
                'credential_url': 'https://scrum.org/certificates',
                'issue_date': date(2021, 8, 20),
                'expiry_date': None,
                'does_not_expire': True,
                'skills': ['Leadership', 'Communication']
            },
            {
                'name': 'Python Institute Certified Professional',
                'issuing_organization': 'Python Institute',
                'credential_id': 'PCPP-11111',
                'credential_url': 'https://pythoninstitute.org/verify',
                'issue_date': date(2020, 3, 10),
                'expiry_date': None,
                'does_not_expire': True,
                'skills': ['Python', 'Django', 'FastAPI']
            }
        ]

        count = 0
        for data in cert_data:
            skill_names = data.pop('skills')
            cert = Certification.objects.create(profile=profile, **data)

            # Add skills
            for skill_name in skill_names:
                if skill_name in skills:
                    cert.skills_validated.add(skills[skill_name])

            count += 1

        return count

    def _create_user_skills(self, profile, skills):
        user_skill_data = [
            ('Python', 'EXPERT', Decimal('5.5'), True, 'Multiple certifications and projects'),
            ('Django', 'EXPERT', Decimal('5.0'), True, 'Professional experience'),
            ('FastAPI', 'ADVANCED', Decimal('2.0'), False, ''),
            ('JavaScript', 'ADVANCED', Decimal('4.0'), False, ''),
            ('TypeScript', 'INTERMEDIATE', Decimal('2.0'), False, ''),
            ('React', 'ADVANCED', Decimal('3.5'), False, ''),
            ('Node.js', 'INTERMEDIATE', Decimal('2.5'), False, ''),
            ('PostgreSQL', 'EXPERT', Decimal('5.0'), True, 'Professional database optimization'),
            ('MongoDB', 'INTERMEDIATE', Decimal('1.5'), False, ''),
            ('Redis', 'ADVANCED', Decimal('3.0'), False, ''),
            ('AWS', 'ADVANCED', Decimal('3.0'), True, 'AWS Certified Solutions Architect'),
            ('Docker', 'ADVANCED', Decimal('3.5'), True, 'AWS Certification'),
            ('Kubernetes', 'INTERMEDIATE', Decimal('2.0'), True, 'AWS Certification'),
            ('CI/CD', 'ADVANCED', Decimal('4.0'), False, ''),
            ('HTML/CSS', 'EXPERT', Decimal('6.0'), False, ''),
            ('Tailwind CSS', 'ADVANCED', Decimal('2.5'), False, ''),
            ('Next.js', 'INTERMEDIATE', Decimal('1.0'), False, ''),
            ('Leadership', 'ADVANCED', Decimal('2.0'), True, 'Scrum Master Certified'),
            ('Communication', 'EXPERT', Decimal('5.0'), True, 'Scrum Master Certified'),
            ('Problem Solving', 'EXPERT', Decimal('5.5'), False, ''),
        ]

        count = 0
        for skill_name, proficiency, years, is_verified, verified_by in user_skill_data:
            if skill_name in skills:
                UserSkill.objects.create(
                    profile=profile,
                    skill=skills[skill_name],
                    proficiency_level=proficiency,
                    years_of_experience=years,
                    is_verified=is_verified,
                    verified_by=verified_by,
                    last_used=date.today() - timedelta(days=30)
                )
                count += 1

        return count
