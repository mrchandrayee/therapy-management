"""
Swagger/OpenAPI Configuration for Therapy Management Platform
"""

from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from django.conf import settings

# API Information
api_info = openapi.Info(
    title="Therapy Management Platform API",
    default_version='v1',
    description="""
    # Therapy Management Platform API Documentation
    
    Welcome to the comprehensive API documentation for the Therapy Management Platform. 
    This platform provides a complete solution for managing therapy sessions, therapists, 
    clients, and administrative functions.
    
    ## Features
    
    ### 🏥 **Core Modules**
    - **Therapist Management**: Complete therapist lifecycle management
    - **Client Management**: Client profiles and session history
    - **Session Management**: Booking, conducting, and managing therapy sessions
    - **Payment Processing**: Integrated payment gateway support
    - **Company Portal**: Corporate client management
    - **Admin Dashboard**: Comprehensive administrative controls
    
    ### 👨‍⚕️ **Therapist Features**
    - Profile management with credential verification
    - Availability scheduling with 2-day advance notice
    - Session conduct with 5-minute join rule
    - Session extensions (10 min × 3, max 30 min)
    - AI-assisted case sheet generation
    - Document upload and management
    - Client report viewing
    
    ### 👤 **Client Features**
    - Profile management and preferences
    - Therapist search and selection
    - Session booking and rescheduling
    - Payment processing with multiple gateways
    - Test report uploads
    - Session feedback and reviews
    
    ### 🏢 **Company Features**
    - Employee therapy program management
    - Bulk session booking
    - Coupon system for subsidized sessions
    - Comprehensive reporting
    - Agreement management
    
    ### 🔧 **Administrative Features**
    - Therapist approval workflow
    - Session monitoring and intervention
    - Financial reporting and analytics
    - Grievance management
    - System configuration
    
    ## Authentication
    
    This API supports multiple authentication methods:
    
    ### Token Authentication
    ```
    Authorization: Token your-token-here
    ```
    
    ### JWT Authentication
    ```
    Authorization: Bearer your-jwt-token-here
    ```
    
    ### Session Authentication
    Standard Django session authentication for web interface.
    
    ## Rate Limiting
    
    API requests are rate-limited to ensure fair usage:
    - **Authenticated users**: 1000 requests per hour
    - **Anonymous users**: 100 requests per hour
    
    ## Error Handling
    
    The API uses standard HTTP status codes:
    - `200` - Success
    - `201` - Created
    - `400` - Bad Request
    - `401` - Unauthorized
    - `403` - Forbidden
    - `404` - Not Found
    - `429` - Too Many Requests
    - `500` - Internal Server Error
    
    ## Data Formats
    
    - **Request/Response Format**: JSON
    - **Date Format**: ISO 8601 (YYYY-MM-DD)
    - **DateTime Format**: ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)
    - **Currency**: Indian Rupees (INR)
    
    ## Compliance
    
    This platform is designed to comply with:
    - **DPDP Act 2023** (Digital Personal Data Protection)
    - **Healthcare data privacy regulations**
    - **Payment security standards**
    
    ## Support
    
    For API support and questions:
    - **Email**: support@amitacare.com
    - **Documentation**: [Platform Documentation]
    - **Status Page**: [System Status]
    """,
    terms_of_service="https://therapy.amitacare.com/terms/",
    contact=openapi.Contact(
        name="AmitaCare Support",
        email="support@amitacare.com",
        url="https://therapy.amitacare.com/support/"
    ),
    license=openapi.License(
        name="Proprietary License",
        url="https://therapy.amitacare.com/license/"
    ),
)

# Schema View Configuration
schema_view = get_schema_view(
    api_info,
    public=True,
    permission_classes=[permissions.AllowAny],
    authentication_classes=[],
)

# Custom API Tags for better organization
API_TAGS = {
    'authentication': {
        'name': 'Authentication',
        'description': 'User authentication and authorization endpoints'
    },
    'therapists': {
        'name': 'Therapists',
        'description': 'Therapist management, profiles, and availability'
    },
    'clients': {
        'name': 'Clients',
        'description': 'Client management, profiles, and preferences'
    },
    'sessions': {
        'name': 'Sessions',
        'description': 'Therapy session management, booking, and conduct'
    },
    'payments': {
        'name': 'Payments',
        'description': 'Payment processing and financial transactions'
    },
    'companies': {
        'name': 'Companies',
        'description': 'Corporate client management and employee programs'
    },
    'coupons': {
        'name': 'Coupons',
        'description': 'Coupon system for discounted sessions'
    },
    'communications': {
        'name': 'Communications',
        'description': 'Email, SMS, and notification management'
    },
    'grievances': {
        'name': 'Grievances',
        'description': 'Complaint and grievance management system'
    },
    'admin': {
        'name': 'Administration',
        'description': 'Administrative functions and system management'
    },
    'reports': {
        'name': 'Reports',
        'description': 'Analytics, reporting, and business intelligence'
    }
}

# Common API Response Schemas
COMMON_RESPONSES = {
    400: openapi.Response(
        description="Bad Request",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'error': openapi.Schema(type=openapi.TYPE_STRING, description='Error message'),
                'details': openapi.Schema(type=openapi.TYPE_OBJECT, description='Detailed error information'),
            }
        )
    ),
    401: openapi.Response(
        description="Unauthorized",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'detail': openapi.Schema(type=openapi.TYPE_STRING, description='Authentication credentials were not provided'),
            }
        )
    ),
    403: openapi.Response(
        description="Forbidden",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'detail': openapi.Schema(type=openapi.TYPE_STRING, description='You do not have permission to perform this action'),
            }
        )
    ),
    404: openapi.Response(
        description="Not Found",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'detail': openapi.Schema(type=openapi.TYPE_STRING, description='Not found'),
            }
        )
    ),
    429: openapi.Response(
        description="Too Many Requests",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'detail': openapi.Schema(type=openapi.TYPE_STRING, description='Request was throttled'),
            }
        )
    ),
    500: openapi.Response(
        description="Internal Server Error",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'error': openapi.Schema(type=openapi.TYPE_STRING, description='Internal server error occurred'),
            }
        )
    ),
}

# Custom Parameter Definitions
COMMON_PARAMETERS = {
    'page': openapi.Parameter(
        'page',
        openapi.IN_QUERY,
        description="Page number for pagination",
        type=openapi.TYPE_INTEGER,
        default=1
    ),
    'page_size': openapi.Parameter(
        'page_size',
        openapi.IN_QUERY,
        description="Number of results per page",
        type=openapi.TYPE_INTEGER,
        default=20
    ),
    'search': openapi.Parameter(
        'search',
        openapi.IN_QUERY,
        description="Search query",
        type=openapi.TYPE_STRING
    ),
    'ordering': openapi.Parameter(
        'ordering',
        openapi.IN_QUERY,
        description="Field to order results by (prefix with '-' for descending)",
        type=openapi.TYPE_STRING
    ),
    'date_from': openapi.Parameter(
        'date_from',
        openapi.IN_QUERY,
        description="Filter results from this date (YYYY-MM-DD)",
        type=openapi.TYPE_STRING,
        format=openapi.FORMAT_DATE
    ),
    'date_to': openapi.Parameter(
        'date_to',
        openapi.IN_QUERY,
        description="Filter results to this date (YYYY-MM-DD)",
        type=openapi.TYPE_STRING,
        format=openapi.FORMAT_DATE
    ),
}

# Security Schemes
SECURITY_SCHEMES = {
    'Token': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'description': 'Token-based authentication. Format: "Token your-token-here"'
    },
    'Bearer': {
        'type': 'http',
        'scheme': 'bearer',
        'bearerFormat': 'JWT',
        'description': 'JWT-based authentication. Format: "Bearer your-jwt-token-here"'
    }
}

# Custom Schema Definitions
CUSTOM_SCHEMAS = {
    'PaginatedResponse': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'count': openapi.Schema(type=openapi.TYPE_INTEGER, description='Total number of items'),
            'next': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_URI, description='Next page URL'),
            'previous': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_URI, description='Previous page URL'),
            'results': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_OBJECT)),
        }
    ),
    'ErrorResponse': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'error': openapi.Schema(type=openapi.TYPE_STRING, description='Error message'),
            'code': openapi.Schema(type=openapi.TYPE_STRING, description='Error code'),
            'details': openapi.Schema(type=openapi.TYPE_OBJECT, description='Additional error details'),
        }
    ),
    'SuccessResponse': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'message': openapi.Schema(type=openapi.TYPE_STRING, description='Success message'),
            'data': openapi.Schema(type=openapi.TYPE_OBJECT, description='Response data'),
        }
    ),
}

# Environment-specific settings
if settings.DEBUG:
    # In development, allow all hosts
    schema_view.permission_classes = [permissions.AllowAny]
else:
    # In production, restrict access
    schema_view.permission_classes = [permissions.IsAuthenticated]