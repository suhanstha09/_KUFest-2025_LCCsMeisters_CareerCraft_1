"""
URL Configuration for jobs app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    JobViewSet,
    JobEligibilityAnalysisViewSet,
)

app_name = 'jobs'

router = DefaultRouter()
router.register(r'', JobViewSet, basename='job')
router.register(r'analyses', JobEligibilityAnalysisViewSet, basename='analysis')

urlpatterns = [
    path('', include(router.urls)),
]
