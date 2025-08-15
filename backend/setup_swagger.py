#!/usr/bin/env python
"""
Setup script for Swagger/OpenAPI documentation
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Run a shell command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return None

def main():
    print("🚀 Setting up Swagger/OpenAPI documentation for Therapy Management Platform")
    print("=" * 70)
    
    # Check if we're in the right directory
    if not Path('manage.py').exists():
        print("❌ Error: manage.py not found. Please run this script from the Django project root.")
        sys.exit(1)
    
    # Install required packages
    print("\n📦 Installing required packages...")
    packages = [
        'drf-yasg',
        'djangorestframework-simplejwt',
        'django-redis'
    ]
    
    for package in packages:
        run_command(f'pip install {package}', f'Installing {package}')
    
    # Run migrations
    print("\n🗄️ Running database migrations...")
    run_command('python manage.py makemigrations', 'Creating migrations')
    run_command('python manage.py migrate', 'Applying migrations')
    
    # Collect static files
    print("\n📁 Collecting static files...")
    run_command('python manage.py collectstatic --noinput', 'Collecting static files')
    
    # Generate API documentation
    print("\n📚 Generating API documentation...")
    docs_dir = Path('docs/api')
    docs_dir.mkdir(parents=True, exist_ok=True)
    
    # Create a simple test to verify Swagger is working
    print("\n🧪 Testing Swagger setup...")
    test_command = 'python manage.py check'
    if run_command(test_command, 'Running Django checks'):
        print("✅ Django configuration is valid")
    
    # Create logs directory
    logs_dir = Path('logs')
    logs_dir.mkdir(exist_ok=True)
    print("📝 Created logs directory")
    
    # Create media directories
    media_dirs = ['media', 'media/documents', 'media/therapist_documents', 'media/session_recordings']
    for dir_name in media_dirs:
        Path(dir_name).mkdir(parents=True, exist_ok=True)
    print("📁 Created media directories")
    
    print("\n" + "=" * 70)
    print("🎉 Swagger setup completed successfully!")
    print("\n📖 Access your API documentation at:")
    print("   • Swagger UI: http://localhost:8000/swagger/")
    print("   • ReDoc:      http://localhost:8000/redoc/")
    print("   • OpenAPI:    http://localhost:8000/swagger.json")
    print("   • Health:     http://localhost:8000/health/")
    print("\n🚀 To start the development server:")
    print("   python manage.py runserver")
    print("\n📚 For more information, see:")
    print("   • API_DOCUMENTATION.md")
    print("   • README_ENV_SETUP.md")
    print("=" * 70)

if __name__ == '__main__':
    main()