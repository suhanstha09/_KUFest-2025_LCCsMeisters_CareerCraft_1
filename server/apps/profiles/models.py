"""
Profile models for SkillSetz platform
"""

from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.users.models import User


class UserProfile(models.Model):
    """
    Detailed user profile information
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    # Basic Info
    bio = models.TextField(blank=True)
    current_title = models.CharField(max_length=255, blank=True)
    current_company = models.CharField(max_length=255, blank=True)
    years_of_experience = models.DecimalField(max_digits=4, decimal_places=1, default=0)

    # Social Links
    linkedin_url = models.URLField(blank=True, default="")
    github_url = models.URLField(blank=True, default="")
    portfolio_url = models.URLField(blank=True, default="")
    twitter_url = models.URLField(blank=True, default="")

    # Documents
    resume = models.FileField(upload_to="resumes/", null=True, blank=True)
    resume_text = models.TextField(blank=True)  # Extracted text from resume
    resume_parsed_data = models.JSONField(default=dict, blank=True)

    # Career Goals
    career_goal = models.TextField(blank=True)
    target_roles = models.JSONField(default=list, blank=True)

    # Industry & Domain
    industry = models.CharField(max_length=100, blank=True)
    domain_expertise = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_profiles"
        verbose_name = _("User Profile")
        verbose_name_plural = _("User Profiles")

    def __str__(self):
        return f"Profile of {self.user.email}"


class Education(models.Model):
    """
    Education records for users
    """

    class DegreeLevel(models.TextChoices):
        HIGH_SCHOOL = "HIGH_SCHOOL", _("High School")
        ASSOCIATE = "ASSOCIATE", _("Associate Degree")
        BACHELOR = "BACHELOR", _("Bachelor's Degree")
        MASTER = "MASTER", _("Master's Degree")
        PHD = "PHD", _("PhD")
        CERTIFICATE = "CERTIFICATE", _("Certificate")
        BOOTCAMP = "BOOTCAMP", _("Bootcamp")

    profile = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="education_records"
    )

    institution = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    degree_level = models.CharField(max_length=20, choices=DegreeLevel.choices)
    field_of_study = models.CharField(max_length=255, blank=True, default="")

    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)

    grade = models.CharField(max_length=50, blank=True)  # GPA or percentage
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "education"
        verbose_name = _("Education")
        verbose_name_plural = _("Education Records")
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.degree} from {self.institution}"


class WorkExperience(models.Model):
    """
    Work experience records for users
    """

    class EmploymentType(models.TextChoices):
        FULL_TIME = "FULL_TIME", _("Full-time")
        PART_TIME = "PART_TIME", _("Part-time")
        CONTRACT = "CONTRACT", _("Contract")
        FREELANCE = "FREELANCE", _("Freelance")
        INTERNSHIP = "INTERNSHIP", _("Internship")

    profile = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="work_experiences"
    )

    job_title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    employment_type = models.CharField(
        max_length=20, choices=EmploymentType.choices, default=EmploymentType.FULL_TIME
    )

    location = models.CharField(max_length=255, blank=True, default="")
    is_remote = models.BooleanField(default=False)

    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)

    description = models.TextField(blank=True, default="")
    responsibilities = models.JSONField(default=list, blank=True)
    achievements = models.JSONField(default=list, blank=True)

    # Skills used in this role
    skills_used = models.ManyToManyField(
        "Skill", related_name="work_experiences", blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "work_experiences"
        verbose_name = _("Work Experience")
        verbose_name_plural = _("Work Experiences")
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.job_title} at {self.company}"


class Project(models.Model):
    """
    User projects (personal, work, or academic)
    """

    class ProjectType(models.TextChoices):
        PERSONAL = "PERSONAL", _("Personal")
        WORK = "WORK", _("Work")
        ACADEMIC = "ACADEMIC", _("Academic")
        OPEN_SOURCE = "OPEN_SOURCE", _("Open Source")

    profile = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="projects"
    )

    title = models.CharField(max_length=255)
    project_type = models.CharField(
        max_length=20, choices=ProjectType.choices, default=ProjectType.PERSONAL
    )

    description = models.TextField(blank=True, default="")
    technologies_used = models.JSONField(default=list, blank=True)

    project_url = models.URLField(blank=True, default="")
    github_url = models.URLField(blank=True, default="")
    demo_url = models.URLField(blank=True, default="")

    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_ongoing = models.BooleanField(default=False)

    # Skills demonstrated in this project
    skills_demonstrated = models.ManyToManyField(
        "Skill", related_name="projects", blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "projects"
        verbose_name = _("Project")
        verbose_name_plural = _("Projects")
        ordering = ["-start_date"]

    def __str__(self):
        return self.title


class Certification(models.Model):
    """
    Professional certifications
    """

    profile = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="certifications"
    )

    name = models.CharField(max_length=255)
    issuing_organization = models.CharField(max_length=255)
    credential_id = models.CharField(max_length=255, blank=True)
    credential_url = models.URLField(blank=True)

    issue_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True)
    does_not_expire = models.BooleanField(default=False)

    # Skills validated by this certification
    skills_validated = models.ManyToManyField(
        "Skill", related_name="certifications", blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "certifications"
        verbose_name = _("Certification")
        verbose_name_plural = _("Certifications")
        ordering = ["-issue_date"]

    def __str__(self):
        return f"{self.name} from {self.issuing_organization}"


class SkillCategory(models.Model):
    """
    Categories for organizing skills
    """

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    parent_category = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True, related_name="subcategories"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "skill_categories"
        verbose_name = _("Skill Category")
        verbose_name_plural = _("Skill Categories")
        ordering = ["name"]

    def __str__(self):
        return self.name


class Skill(models.Model):
    """
    Master skills database
    """

    class SkillType(models.TextChoices):
        TECHNICAL = "TECHNICAL", _("Technical Skill")
        SOFT = "SOFT", _("Soft Skill")
        LANGUAGE = "LANGUAGE", _("Language")
        TOOL = "TOOL", _("Tool/Software")
        FRAMEWORK = "FRAMEWORK", _("Framework/Library")
        DOMAIN = "DOMAIN", _("Domain Knowledge")

    name = models.CharField(max_length=255, unique=True, db_index=True)
    category = models.ForeignKey(
        SkillCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name="skills"
    )
    skill_type = models.CharField(
        max_length=20, choices=SkillType.choices, default=SkillType.TECHNICAL
    )
    description = models.TextField(blank=True)

    # Metadata
    is_verified = models.BooleanField(default=False)
    usage_count = models.IntegerField(default=0)  # Track how many users have this skill

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "skills"
        verbose_name = _("Skill")
        verbose_name_plural = _("Skills")
        ordering = ["name"]

    def __str__(self):
        return self.name


class UserSkill(models.Model):
    """
    User's skills with proficiency levels
    """

    class ProficiencyLevel(models.TextChoices):
        BEGINNER = "BEGINNER", _("Beginner")
        INTERMEDIATE = "INTERMEDIATE", _("Intermediate")
        ADVANCED = "ADVANCED", _("Advanced")
        EXPERT = "EXPERT", _("Expert")

    profile = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="user_skills"
    )
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name="user_skills")

    proficiency_level = models.CharField(
        max_length=20, choices=ProficiencyLevel.choices, default=ProficiencyLevel.INTERMEDIATE
    )
    years_of_experience = models.DecimalField(max_digits=4, decimal_places=1, default=0)

    # Validation
    is_verified = models.BooleanField(default=False)
    verified_by = models.CharField(max_length=255, blank=True)  # Certification, endorsement, etc.

    # Metadata
    last_used = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_skills"
        verbose_name = _("User Skill")
        verbose_name_plural = _("User Skills")
        unique_together = ["profile", "skill"]
        ordering = ["-proficiency_level", "-years_of_experience"]

    def __str__(self):
        return f"{self.skill.name} ({self.proficiency_level})"
