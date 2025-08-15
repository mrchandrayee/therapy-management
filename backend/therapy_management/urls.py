"""
URL configuration for therapy_management project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from django.http import JsonResponse

# Swagger imports
from .swagger import schema_view
from . import health

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Documentation
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('docs/', RedirectView.as_view(url='/swagger/', permanent=False), name='api-docs'),
    
    # API Endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/therapists/', include('therapists.urls')),
    path('api/clients/', include('clients.urls')),
    path('api/sessions/', include('sessions.urls')),
    path('api/companies/', include('companies.urls')),
    path('api/payments/', include('payments.urls')),
    
    # Health Check
    path('health/', health.health_check, name='health-check'),
    path('health/detailed/', health.health_detailed, name='health-detailed'),
    path('health/ready/', health.readiness_check, name='readiness-check'),
    path('health/live/', health.liveness_check, name='liveness-check'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
