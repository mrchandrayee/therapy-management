"""
Health check endpoints for the Therapy Management Platform
"""

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.db import connection
from django.core.cache import cache
import redis
import time
from datetime import datetime


@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """
    Basic health check endpoint
    """
    return JsonResponse({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'environment': getattr(settings, 'ENVIRONMENT', 'development')
    })


@csrf_exempt
@require_http_methods(["GET"])
def health_detailed(request):
    """
    Detailed health check with service status
    """
    health_data = {
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'environment': getattr(settings, 'ENVIRONMENT', 'development'),
        'services': {}
    }
    
    # Check database connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            health_data['services']['database'] = {
                'status': 'healthy',
                'response_time_ms': 0
            }
    except Exception as e:
        health_data['services']['database'] = {
            'status': 'unhealthy',
            'error': str(e)
        }
        health_data['status'] = 'degraded'
    
    # Check Redis connection
    try:
        start_time = time.time()
        cache.set('health_check', 'test', 10)
        cache.get('health_check')
        response_time = (time.time() - start_time) * 1000
        
        health_data['services']['redis'] = {
            'status': 'healthy',
            'response_time_ms': round(response_time, 2)
        }
    except Exception as e:
        health_data['services']['redis'] = {
            'status': 'unhealthy',
            'error': str(e)
        }
        health_data['status'] = 'degraded'
    
    # Check if any critical services are down
    critical_services = ['database']
    for service in critical_services:
        if health_data['services'].get(service, {}).get('status') == 'unhealthy':
            health_data['status'] = 'unhealthy'
            break
    
    status_code = 200 if health_data['status'] == 'healthy' else 503
    return JsonResponse(health_data, status=status_code)


@csrf_exempt
@require_http_methods(["GET"])
def readiness_check(request):
    """
    Readiness check for Kubernetes/Docker deployments
    """
    try:
        # Check if database is ready
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        # Check if Redis is ready
        cache.set('readiness_check', 'ready', 5)
        
        return JsonResponse({
            'status': 'ready',
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return JsonResponse({
            'status': 'not_ready',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }, status=503)


@csrf_exempt
@require_http_methods(["GET"])
def liveness_check(request):
    """
    Liveness check for Kubernetes/Docker deployments
    """
    return JsonResponse({
        'status': 'alive',
        'timestamp': datetime.now().isoformat(),
        'uptime': time.time()
    })