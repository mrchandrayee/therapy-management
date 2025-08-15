# Geotagging and Location Services
import requests
from django.conf import settings
from django.db.models import Q
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import json

from accounts.models import User
from clients.models import ClientProfile
from therapists.models import TherapistProfile
from companies.models import Company


class GeotaggingManager:
    """
    Manage geotagging and location-based services
    """
    
    def __init__(self):
        self.geolocator = Nominatim(user_agent="amitacare_therapy_platform")
    
    def geocode_address(self, address, pincode=None):
        """
        Convert address to latitude and longitude
        """
        try:
            # Combine address with pincode for better accuracy
            full_address = f"{address}, {pincode}" if pincode else address
            
            location = self.geolocator.geocode(full_address)
            if location:
                return {
                    'latitude': location.latitude,
                    'longitude': location.longitude,
                    'formatted_address': location.address
                }
            return None
        except Exception as e:
            print(f"Geocoding error: {e}")
            return None
    
    def reverse_geocode(self, latitude, longitude):
        """
        Convert latitude and longitude to address
        """
        try:
            location = self.geolocator.reverse(f"{latitude}, {longitude}")
            if location:
                return {
                    'address': location.address,
                    'raw': location.raw
                }
            return None
        except Exception as e:
            print(f"Reverse geocoding error: {e}")
            return None
    
    def update_user_location(self, user_id):
        """
        Update user's latitude and longitude based on address and pincode
        """
        try:
            user = User.objects.get(id=user_id)
            if user.address and user.pincode:
                location_data = self.geocode_address(user.address, user.pincode)
                if location_data:
                    user.latitude = location_data['latitude']
                    user.longitude = location_data['longitude']
                    user.save()
                    return True
            return False
        except User.DoesNotExist:
            return False
    
    def update_company_location(self, company_id):
        """
        Update company's latitude and longitude based on address and pincode
        """
        try:
            company = Company.objects.get(id=company_id)
            if company.address and company.pincode:
                location_data = self.geocode_address(company.address, company.pincode)
                if location_data:
                    company.latitude = location_data['latitude']
                    company.longitude = location_data['longitude']
                    company.save()
                    return True
            return False
        except Company.DoesNotExist:
            return False
    
    def find_nearby_therapists(self, latitude, longitude, radius_km=50):
        """
        Find therapists within specified radius
        """
        therapists = TherapistProfile.objects.filter(
            user__latitude__isnull=False,
            user__longitude__isnull=False,
            is_available=True,
            approval_status='approved'
        ).select_related('user')
        
        nearby_therapists = []
        user_location = (latitude, longitude)
        
        for therapist in therapists:
            therapist_location = (therapist.user.latitude, therapist.user.longitude)
            distance = geodesic(user_location, therapist_location).kilometers
            
            if distance <= radius_km:
                nearby_therapists.append({
                    'therapist': therapist,
                    'distance_km': round(distance, 2),
                    'location': {
                        'latitude': float(therapist.user.latitude),
                        'longitude': float(therapist.user.longitude)
                    }
                })
        
        # Sort by distance
        nearby_therapists.sort(key=lambda x: x['distance_km'])
        return nearby_therapists
    
    def find_nearby_clients(self, latitude, longitude, radius_km=50):
        """
        Find clients within specified radius (for admin purposes)
        """
        clients = ClientProfile.objects.filter(
            user__latitude__isnull=False,
            user__longitude__isnull=False,
            is_active=True
        ).select_related('user')
        
        nearby_clients = []
        center_location = (latitude, longitude)
        
        for client in clients:
            client_location = (client.user.latitude, client.user.longitude)
            distance = geodesic(center_location, client_location).kilometers
            
            if distance <= radius_km:
                nearby_clients.append({
                    'client': client,
                    'distance_km': round(distance, 2),
                    'location': {
                        'latitude': float(client.user.latitude),
                        'longitude': float(client.user.longitude)
                    }
                })
        
        # Sort by distance
        nearby_clients.sort(key=lambda x: x['distance_km'])
        return nearby_clients
    
    def get_location_statistics(self):
        """
        Get location-based statistics for admin dashboard
        """
        # Count users by location availability
        users_with_location = User.objects.filter(
            latitude__isnull=False,
            longitude__isnull=False
        ).count()
        
        total_users = User.objects.count()
        
        # Count clients by location
        clients_with_location = ClientProfile.objects.filter(
            user__latitude__isnull=False,
            user__longitude__isnull=False
        ).count()
        
        total_clients = ClientProfile.objects.count()
        
        # Count therapists by location
        therapists_with_location = TherapistProfile.objects.filter(
            user__latitude__isnull=False,
            user__longitude__isnull=False
        ).count()
        
        total_therapists = TherapistProfile.objects.count()
        
        # Count companies by location
        companies_with_location = Company.objects.filter(
            latitude__isnull=False,
            longitude__isnull=False
        ).count()
        
        total_companies = Company.objects.count()
        
        return {
            'users': {
                'with_location': users_with_location,
                'total': total_users,
                'percentage': (users_with_location / total_users * 100) if total_users > 0 else 0
            },
            'clients': {
                'with_location': clients_with_location,
                'total': total_clients,
                'percentage': (clients_with_location / total_clients * 100) if total_clients > 0 else 0
            },
            'therapists': {
                'with_location': therapists_with_location,
                'total': total_therapists,
                'percentage': (therapists_with_location / total_therapists * 100) if total_therapists > 0 else 0
            },
            'companies': {
                'with_location': companies_with_location,
                'total': total_companies,
                'percentage': (companies_with_location / total_companies * 100) if total_companies > 0 else 0
            }
        }
    
    def get_map_data_for_admin(self):
        """
        Get map data for admin dashboard visualization
        """
        # Get all clients with location
        clients = ClientProfile.objects.filter(
            user__latitude__isnull=False,
            user__longitude__isnull=False,
            is_active=True
        ).select_related('user', 'company')
        
        client_markers = []
        for client in clients:
            marker = {
                'type': 'client',
                'id': client.id,
                'name': client.user.get_full_name(),
                'latitude': float(client.user.latitude),
                'longitude': float(client.user.longitude),
                'pincode': client.user.pincode,
                'company': client.company.name if client.company else 'Direct Client',
                'total_sessions': client.total_sessions,
            }
            client_markers.append(marker)
        
        # Get all therapists with location
        therapists = TherapistProfile.objects.filter(
            user__latitude__isnull=False,
            user__longitude__isnull=False,
            approval_status='approved'
        ).select_related('user')
        
        therapist_markers = []
        for therapist in therapists:
            marker = {
                'type': 'therapist',
                'id': therapist.id,
                'name': therapist.user.get_full_name(),
                'latitude': float(therapist.user.latitude),
                'longitude': float(therapist.user.longitude),
                'pincode': therapist.user.pincode,
                'specializations': therapist.get_specialization_names(),
                'total_sessions': therapist.total_sessions,
                'is_available': therapist.is_available,
            }
            therapist_markers.append(marker)
        
        # Get all companies with location
        companies = Company.objects.filter(
            latitude__isnull=False,
            longitude__isnull=False,
            is_active=True
        )
        
        company_markers = []
        for company in companies:
            marker = {
                'type': 'company',
                'id': company.id,
                'name': company.name,
                'latitude': float(company.latitude),
                'longitude': float(company.longitude),
                'pincode': company.pincode,
                'employee_count': company.employees.count(),
                'agreement_status': company.agreement_status,
            }
            company_markers.append(marker)
        
        return {
            'clients': client_markers,
            'therapists': therapist_markers,
            'companies': company_markers,
        }
    
    def get_pincode_statistics(self):
        """
        Get statistics grouped by pincode
        """
        # Client distribution by pincode
        client_pincodes = ClientProfile.objects.filter(
            user__pincode__isnull=False,
            is_active=True
        ).values('user__pincode').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Therapist distribution by pincode
        therapist_pincodes = TherapistProfile.objects.filter(
            user__pincode__isnull=False,
            approval_status='approved'
        ).values('user__pincode').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Company distribution by pincode
        company_pincodes = Company.objects.filter(
            pincode__isnull=False,
            is_active=True
        ).values('pincode').annotate(
            count=Count('id')
        ).order_by('-count')
        
        return {
            'clients_by_pincode': list(client_pincodes),
            'therapists_by_pincode': list(therapist_pincodes),
            'companies_by_pincode': list(company_pincodes),
        }
    
    def bulk_update_locations(self):
        """
        Bulk update locations for all users, therapists, and companies
        """
        updated_count = 0
        
        # Update users without location data
        users_without_location = User.objects.filter(
            Q(latitude__isnull=True) | Q(longitude__isnull=True),
            address__isnull=False,
            pincode__isnull=False
        )
        
        for user in users_without_location:
            if self.update_user_location(user.id):
                updated_count += 1
        
        # Update companies without location data
        companies_without_location = Company.objects.filter(
            Q(latitude__isnull=True) | Q(longitude__isnull=True),
            address__isnull=False,
            pincode__isnull=False
        )
        
        for company in companies_without_location:
            if self.update_company_location(company.id):
                updated_count += 1
        
        return updated_count