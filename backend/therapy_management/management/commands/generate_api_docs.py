"""
Management command to generate API documentation
"""

from django.core.management.base import BaseCommand
from django.conf import settings
from django.urls import reverse
import json
import yaml
import requests
from pathlib import Path


class Command(BaseCommand):
    help = 'Generate API documentation files'

    def add_arguments(self, parser):
        parser.add_argument(
            '--format',
            type=str,
            choices=['json', 'yaml', 'both'],
            default='both',
            help='Output format for the API schema'
        )
        parser.add_argument(
            '--output-dir',
            type=str,
            default='docs/api',
            help='Output directory for generated files'
        )
        parser.add_argument(
            '--host',
            type=str,
            default='http://localhost:8000',
            help='Host URL for the API'
        )

    def handle(self, *args, **options):
        output_dir = Path(options['output_dir'])
        output_dir.mkdir(parents=True, exist_ok=True)
        
        host = options['host']
        format_choice = options['format']
        
        self.stdout.write(
            self.style.SUCCESS(f'Generating API documentation in {output_dir}...')
        )
        
        try:
            # Generate OpenAPI schema
            if format_choice in ['json', 'both']:
                self.generate_json_schema(host, output_dir)
            
            if format_choice in ['yaml', 'both']:
                self.generate_yaml_schema(host, output_dir)
            
            # Generate additional documentation files
            self.generate_postman_collection(host, output_dir)
            self.generate_readme(output_dir)
            
            self.stdout.write(
                self.style.SUCCESS('API documentation generated successfully!')
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error generating documentation: {str(e)}')
            )

    def generate_json_schema(self, host, output_dir):
        """Generate JSON OpenAPI schema"""
        try:
            response = requests.get(f'{host}/swagger.json')
            response.raise_for_status()
            
            schema = response.json()
            
            with open(output_dir / 'openapi.json', 'w') as f:
                json.dump(schema, f, indent=2)
            
            self.stdout.write('Generated openapi.json')
            
        except requests.RequestException as e:
            self.stdout.write(
                self.style.WARNING(f'Could not fetch JSON schema: {str(e)}')
            )

    def generate_yaml_schema(self, host, output_dir):
        """Generate YAML OpenAPI schema"""
        try:
            response = requests.get(f'{host}/swagger.yaml')
            response.raise_for_status()
            
            with open(output_dir / 'openapi.yaml', 'w') as f:
                f.write(response.text)
            
            self.stdout.write('Generated openapi.yaml')
            
        except requests.RequestException as e:
            self.stdout.write(
                self.style.WARNING(f'Could not fetch YAML schema: {str(e)}')
            )

    def generate_postman_collection(self, host, output_dir):
        """Generate Postman collection"""
        collection = {
            "info": {
                "name": "Therapy Management Platform API",
                "description": "API collection for the Therapy Management Platform",
                "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
            },
            "auth": {
                "type": "bearer",
                "bearer": [
                    {
                        "key": "token",
                        "value": "{{auth_token}}",
                        "type": "string"
                    }
                ]
            },
            "variable": [
                {
                    "key": "base_url",
                    "value": host,
                    "type": "string"
                },
                {
                    "key": "auth_token",
                    "value": "your-token-here",
                    "type": "string"
                }
            ],
            "item": [
                {
                    "name": "Authentication",
                    "item": [
                        {
                            "name": "Login",
                            "request": {
                                "method": "POST",
                                "header": [
                                    {
                                        "key": "Content-Type",
                                        "value": "application/json"
                                    }
                                ],
                                "body": {
                                    "mode": "raw",
                                    "raw": json.dumps({
                                        "username": "your-username",
                                        "password": "your-password"
                                    })
                                },
                                "url": {
                                    "raw": "{{base_url}}/api/auth/login/",
                                    "host": ["{{base_url}}"],
                                    "path": ["api", "auth", "login", ""]
                                }
                            }
                        }
                    ]
                },
                {
                    "name": "Therapists",
                    "item": [
                        {
                            "name": "Get Dashboard",
                            "request": {
                                "method": "GET",
                                "header": [
                                    {
                                        "key": "Authorization",
                                        "value": "Token {{auth_token}}"
                                    }
                                ],
                                "url": {
                                    "raw": "{{base_url}}/api/therapists/dashboard/",
                                    "host": ["{{base_url}}"],
                                    "path": ["api", "therapists", "dashboard", ""]
                                }
                            }
                        },
                        {
                            "name": "Get Profile",
                            "request": {
                                "method": "GET",
                                "header": [
                                    {
                                        "key": "Authorization",
                                        "value": "Token {{auth_token}}"
                                    }
                                ],
                                "url": {
                                    "raw": "{{base_url}}/api/therapists/profile/",
                                    "host": ["{{base_url}}"],
                                    "path": ["api", "therapists", "profile", ""]
                                }
                            }
                        }
                    ]
                },
                {
                    "name": "Sessions",
                    "item": [
                        {
                            "name": "List Sessions",
                            "request": {
                                "method": "GET",
                                "header": [
                                    {
                                        "key": "Authorization",
                                        "value": "Token {{auth_token}}"
                                    }
                                ],
                                "url": {
                                    "raw": "{{base_url}}/api/sessions/therapist/",
                                    "host": ["{{base_url}}"],
                                    "path": ["api", "sessions", "therapist", ""]
                                }
                            }
                        },
                        {
                            "name": "Join Session",
                            "request": {
                                "method": "POST",
                                "header": [
                                    {
                                        "key": "Authorization",
                                        "value": "Token {{auth_token}}"
                                    }
                                ],
                                "url": {
                                    "raw": "{{base_url}}/api/sessions/{{session_id}}/join/",
                                    "host": ["{{base_url}}"],
                                    "path": ["api", "sessions", "{{session_id}}", "join", ""]
                                }
                            }
                        }
                    ]
                }
            ]
        }
        
        with open(output_dir / 'postman_collection.json', 'w') as f:
            json.dump(collection, f, indent=2)
        
        self.stdout.write('Generated postman_collection.json')

    def generate_readme(self, output_dir):
        """Generate README for the docs directory"""
        readme_content = """# API Documentation

This directory contains generated API documentation for the Therapy Management Platform.

## Files

- `openapi.json` - OpenAPI 3.0 specification in JSON format
- `openapi.yaml` - OpenAPI 3.0 specification in YAML format
- `postman_collection.json` - Postman collection for API testing
- `README.md` - This file

## Usage

### Swagger UI
Visit `http://localhost:8000/swagger/` for interactive API documentation.

### ReDoc
Visit `http://localhost:8000/redoc/` for alternative documentation view.

### Postman
Import `postman_collection.json` into Postman for API testing.

## Regenerating Documentation

To regenerate this documentation, run:

```bash
python manage.py generate_api_docs
```

## Authentication

Most endpoints require authentication. Use one of the following methods:

### Token Authentication
```
Authorization: Token your-token-here
```

### JWT Authentication
```
Authorization: Bearer your-jwt-token-here
```

## Support

For API support, contact: api-support@amitacare.com
"""
        
        with open(output_dir / 'README.md', 'w') as f:
            f.write(readme_content)
        
        self.stdout.write('Generated README.md')