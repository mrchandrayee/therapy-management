# Admin Static Files

This directory contains static files for the Django admin interface.

## Logo Files

Place your logo files in this directory:

- `therapy_logo.png` - Main logo for the admin header (recommended size: 40px height)
- `therapy_login_logo.png` - Logo for the login page (recommended size: 200px width)
- `therapy_login_logo_dark.png` - Logo for dark theme login page
- `favicon.ico` - Favicon for the admin interface (32x32 px)

## File Requirements

### Logo Files
- Format: PNG with transparent background preferred
- Main logo: Max height 40px, width auto
- Login logo: Max width 200px, height auto
- Use high-resolution images for crisp display on retina screens

### Favicon
- Format: ICO file
- Size: 32x32 pixels
- Should be recognizable at small sizes

## Current Setup

The admin interface is configured to use these logo files. If the files are not present, the interface will fall back to default styling.

To add your logos:
1. Create or obtain your logo files
2. Rename them according to the specifications above
3. Place them in this directory
4. Run `python manage.py collectstatic` to update static files
5. Restart your Django server

## Custom Styling

Additional custom CSS is available in:
- `css/custom_admin.css` - Custom styles for the admin interface

Additional custom JavaScript is available in:
- `js/custom_admin.js` - Custom functionality for the admin interface