#!/usr/bin/env python
"""
Setup script for Django Jazzmin Admin Interface
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

def create_sample_logo():
    """Create a simple SVG logo as placeholder"""
    logo_svg = '''<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="60" fill="#2c5aa0" rx="8"/>
  <text x="100" y="35" font-family="Arial, sans-serif" font-size="18" font-weight="bold" 
        text-anchor="middle" fill="white">AmitaCare</text>
  <circle cx="30" cy="30" r="15" fill="none" stroke="white" stroke-width="2"/>
  <path d="M25 30 L30 35 L35 25" stroke="white" stroke-width="2" fill="none"/>
</svg>'''
    
    logo_path = Path('static/admin/img/therapy_logo.svg')
    logo_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(logo_path, 'w') as f:
        f.write(logo_svg)
    
    print("📝 Created sample logo file")

def main():
    print("🎨 Setting up Django Jazzmin Admin Interface")
    print("=" * 60)
    
    # Check if we're in the right directory
    if not Path('manage.py').exists():
        print("❌ Error: manage.py not found. Please run this script from the Django project root.")
        sys.exit(1)
    
    # Install Jazzmin
    print("\n📦 Installing Django Jazzmin...")
    if run_command('pip install django-jazzmin', 'Installing django-jazzmin'):
        print("✅ Django Jazzmin installed successfully")
    
    # Create static directories
    print("\n📁 Creating static file directories...")
    static_dirs = [
        'static/admin/css',
        'static/admin/js', 
        'static/admin/img',
        'media/therapist_documents',
        'media/client_reports',
        'media/session_recordings'
    ]
    
    for dir_path in static_dirs:
        Path(dir_path).mkdir(parents=True, exist_ok=True)
        print(f"📂 Created {dir_path}")
    
    # Create sample logo
    create_sample_logo()
    
    # Run Django commands
    print("\n🔧 Running Django setup commands...")
    
    commands = [
        ('python manage.py check', 'Checking Django configuration'),
        ('python manage.py makemigrations', 'Creating database migrations'),
        ('python manage.py migrate', 'Applying database migrations'),
        ('python manage.py collectstatic --noinput', 'Collecting static files')
    ]
    
    for command, description in commands:
        run_command(command, description)
    
    # Create superuser prompt
    print("\n👤 Admin User Setup")
    print("To create an admin user, run:")
    print("   python manage.py createsuperuser")
    print()
    
    # Display success message
    print("=" * 60)
    print("🎉 Jazzmin setup completed successfully!")
    print("\n🌟 Features enabled:")
    print("   • Modern, responsive admin interface")
    print("   • Custom branding and theming")
    print("   • Enhanced navigation and search")
    print("   • Improved form layouts and widgets")
    print("   • Real-time status indicators")
    print("   • Custom dashboard with statistics")
    print("\n🚀 To start the development server:")
    print("   python manage.py runserver")
    print("\n🔗 Access your admin interface at:")
    print("   http://localhost:8000/admin/")
    print("\n📚 Additional resources:")
    print("   • Jazzmin Documentation: https://django-jazzmin.readthedocs.io/")
    print("   • Custom CSS: static/admin/css/custom_admin.css")
    print("   • Custom JS: static/admin/js/custom_admin.js")
    print("   • Logo files: static/admin/img/")
    print("\n💡 Tips:")
    print("   • Replace the sample logo with your own branding")
    print("   • Customize colors and themes in settings.py")
    print("   • Add custom menu items and links")
    print("   • Use the UI builder for theme customization")
    print("=" * 60)

if __name__ == '__main__':
    main()