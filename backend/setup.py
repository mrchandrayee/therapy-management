#!/usr/bin/env python3
"""
Setup script for Therapy Management System
This script will:
1. Install dependencies
2. Run migrations
3. Setup roles and permissions
4. Create a super admin user
"""

import os
import sys
import subprocess
import django
from django.core.management import execute_from_command_line

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n{'='*50}")
    print(f"🔄 {description}")
    print(f"{'='*50}")
    
    try:
        if isinstance(command, list):
            result = subprocess.run(command, check=True, capture_output=True, text=True)
        else:
            result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        
        if result.stdout:
            print(result.stdout)
        print(f"✅ {description} completed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error in {description}:")
        print(f"Command: {command}")
        print(f"Error: {e}")
        if e.stdout:
            print(f"Output: {e.stdout}")
        if e.stderr:
            print(f"Error Output: {e.stderr}")
        return False

def main():
    print("🚀 Setting up Therapy Management System")
    print("=" * 50)
    
    # Set Django settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'therapy_management.settings')
    
    # Step 1: Install dependencies
    if not run_command([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], 
                      "Installing Python dependencies"):
        print("❌ Failed to install dependencies. Please check your Python environment.")
        return False
    
    # Step 2: Setup Django
    django.setup()
    
    # Step 3: Make migrations
    print("\n🔄 Creating database migrations...")
    try:
        execute_from_command_line(['manage.py', 'makemigrations'])
        print("✅ Migrations created successfully!")
    except Exception as e:
        print(f"❌ Error creating migrations: {e}")
        return False
    
    # Step 4: Run migrations
    print("\n🔄 Applying database migrations...")
    try:
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ Migrations applied successfully!")
    except Exception as e:
        print(f"❌ Error applying migrations: {e}")
        return False
    
    # Step 5: Setup roles and permissions
    print("\n🔄 Setting up roles and permissions...")
    try:
        execute_from_command_line(['manage.py', 'setup_roles'])
        print("✅ Roles and permissions setup completed!")
    except Exception as e:
        print(f"❌ Error setting up roles: {e}")
        return False
    
    # Step 6: Create super admin
    print("\n🔄 Creating super admin user...")
    try:
        execute_from_command_line(['manage.py', 'create_superadmin'])
        print("✅ Super admin user created!")
    except Exception as e:
        print(f"❌ Error creating super admin: {e}")
        return False
    
    # Step 7: Collect static files (for production)
    print("\n🔄 Collecting static files...")
    try:
        execute_from_command_line(['manage.py', 'collectstatic', '--noinput'])
        print("✅ Static files collected!")
    except Exception as e:
        print(f"⚠️ Warning: Could not collect static files: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Setup completed successfully!")
    print("=" * 50)
    print("\n📋 Next steps:")
    print("1. Update database settings in therapy_management/settings.py")
    print("2. Configure email settings for notifications")
    print("3. Set up Razorpay credentials for payments")
    print("4. Run the development server: python manage.py runserver")
    print("\n🔐 Default admin credentials:")
    print("Username: admin")
    print("Password: admin123")
    print("Email: admin@amitacare.com")
    print("\n⚠️  Please change the admin password after first login!")
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)