from rest_framework import serializers
from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_serializer_method
from drf_yasg import openapi
from .models import (
    TherapistProfile, TherapyCategory, Competency, TherapistCompetency,
    TherapistDocument, TherapistAvailability, TherapistReview, SupervisorRelationship
)

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'username', 'date_joined']


class TherapyCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TherapyCategory
        fields = ['id', 'name', 'description', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class CompetencySerializer(serializers.ModelSerializer):
    category = TherapyCategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Competency
        fields = ['id', 'name', 'category', 'category_id', 'description', 'is_active']
        read_only_fields = ['id']


class TherapistCompetencySerializer(serializers.ModelSerializer):
    competency = CompetencySerializer(read_only=True)
    competency_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = TherapistCompetency
        fields = [
            'id', 'competency', 'competency_id', 'proficiency_level', 
            'years_of_experience', 'notes', 'added_at'
        ]
        read_only_fields = ['id', 'added_at']


class TherapistDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TherapistDocument
        fields = [
            'id', 'document_type', 'title', 'description', 'document_file',
            'issue_date', 'expiry_date', 'issuing_authority', 'is_verified',
            'verified_by', 'verified_at', 'uploaded_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'is_verified', 'verified_by', 'verified_at', 
            'uploaded_at', 'updated_at'
        ]

    def validate_document_file(self, value):
        """Validate document file size and type"""
        if value.size > 10 * 1024 * 1024:  # 10MB limit
            raise serializers.ValidationError("File size cannot exceed 10MB")
        
        allowed_types = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
        file_extension = value.name.split('.')[-1].lower()
        if file_extension not in allowed_types:
            raise serializers.ValidationError(
                f"File type '{file_extension}' not allowed. "
                f"Allowed types: {', '.join(allowed_types)}"
            )
        
        return value


class TherapistAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TherapistAvailability
        fields = [
            'id', 'day_of_week', 'start_time', 'end_time', 'is_available',
            'specific_date', 'is_holiday', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        """Validate availability slot"""
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        
        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError(
                "Start time must be before end time"
            )
        
        # Check for overlapping slots
        therapist = data.get('therapist') or self.instance.therapist
        day_of_week = data.get('day_of_week')
        specific_date = data.get('specific_date')
        
        overlapping_slots = TherapistAvailability.objects.filter(
            therapist=therapist,
            day_of_week=day_of_week,
            specific_date=specific_date,
            start_time__lt=end_time,
            end_time__gt=start_time
        )
        
        if self.instance:
            overlapping_slots = overlapping_slots.exclude(id=self.instance.id)
        
        if overlapping_slots.exists():
            raise serializers.ValidationError(
                "This time slot overlaps with an existing availability slot"
            )
        
        return data


class TherapistReviewSerializer(serializers.ModelSerializer):
    client_name = serializers.SerializerMethodField()

    class Meta:
        model = TherapistReview
        fields = [
            'id', 'rating', 'review_text', 'is_anonymous', 'client_name',
            'is_approved', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_approved', 'created_at', 'updated_at']

    def get_client_name(self, obj):
        if obj.is_anonymous:
            return "Anonymous"
        return obj.client.get_full_name()


class SupervisorRelationshipSerializer(serializers.ModelSerializer):
    supervisor_name = serializers.CharField(source='supervisor.user.get_full_name', read_only=True)
    supervisee_name = serializers.CharField(source='supervisee.user.get_full_name', read_only=True)

    class Meta:
        model = SupervisorRelationship
        fields = [
            'id', 'supervisor', 'supervisee', 'supervisor_name', 'supervisee_name',
            'start_date', 'end_date', 'is_active', 'notes', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class TherapistProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    specializations = TherapyCategorySerializer(many=True, read_only=True)
    specialization_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    competencies = TherapistCompetencySerializer(
        source='therapistcompetency_set',
        many=True,
        read_only=True
    )
    documents = TherapistDocumentSerializer(many=True, read_only=True)
    availability = TherapistAvailabilitySerializer(many=True, read_only=True)
    reviews = TherapistReviewSerializer(many=True, read_only=True)
    supervisor_relationships = SupervisorRelationshipSerializer(
        source='supervisees',
        many=True,
        read_only=True
    )
    
    # Computed fields
    specialization_names = serializers.SerializerMethodField()
    is_approved = serializers.SerializerMethodField()
    total_documents = serializers.SerializerMethodField()
    verified_documents = serializers.SerializerMethodField()
    
    class Meta:
        model = TherapistProfile
        fields = [
            'id', 'user', 'license_number', 'specializations', 'specialization_ids',
            'specialization_names', 'competencies', 'experience_level', 
            'years_of_experience', 'bio', 'consultation_fee', 'languages_spoken',
            'is_available', 'max_clients_per_day', 'session_duration_minutes',
            'approval_status', 'approved_by', 'approved_at', 'rejection_reason',
            'average_rating', 'total_reviews', 'total_sessions', 'documents',
            'availability', 'reviews', 'supervisor_relationships', 'is_approved',
            'total_documents', 'verified_documents', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'approved_by', 'approved_at', 'average_rating', 'total_reviews',
            'total_sessions', 'created_at', 'updated_at'
        ]

    def get_specialization_names(self, obj):
        return obj.get_specialization_names()

    def get_is_approved(self, obj):
        return obj.is_approved()

    def get_total_documents(self, obj):
        return obj.documents.count()

    def get_verified_documents(self, obj):
        return obj.documents.filter(is_verified=True).count()

    def validate_license_number(self, value):
        """Validate license number uniqueness"""
        if TherapistProfile.objects.filter(license_number=value).exclude(
            id=self.instance.id if self.instance else None
        ).exists():
            raise serializers.ValidationError(
                "A therapist with this license number already exists"
            )
        return value

    def validate_consultation_fee(self, value):
        """Validate consultation fee"""
        if value < 0:
            raise serializers.ValidationError("Consultation fee cannot be negative")
        if value > 50000:  # Max fee limit
            raise serializers.ValidationError("Consultation fee cannot exceed ₹50,000")
        return value

    def validate_max_clients_per_day(self, value):
        """Validate max clients per day"""
        if value < 1:
            raise serializers.ValidationError("Must allow at least 1 client per day")
        if value > 20:  # Reasonable upper limit
            raise serializers.ValidationError("Cannot exceed 20 clients per day")
        return value

    def update(self, instance, validated_data):
        """Handle specializations update"""
        specialization_ids = validated_data.pop('specialization_ids', None)
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update specializations if provided
        if specialization_ids is not None:
            specializations = TherapyCategory.objects.filter(
                id__in=specialization_ids,
                is_active=True
            )
            instance.specializations.set(specializations)
        
        return instance

    def create(self, validated_data):
        """Handle therapist profile creation"""
        specialization_ids = validated_data.pop('specialization_ids', [])
        
        # Create therapist profile
        therapist = TherapistProfile.objects.create(**validated_data)
        
        # Set specializations
        if specialization_ids:
            specializations = TherapyCategory.objects.filter(
                id__in=specialization_ids,
                is_active=True
            )
            therapist.specializations.set(specializations)
        
        return therapist


class TherapistCalendarSerializer(serializers.Serializer):
    """Serializer for therapist calendar view"""
    date = serializers.DateField()
    available_slots = serializers.ListField(
        child=serializers.DictField(),
        read_only=True
    )
    booked_sessions = serializers.ListField(
        child=serializers.DictField(),
        read_only=True
    )
    blocked_slots = serializers.ListField(
        child=serializers.DictField(),
        read_only=True
    )


class TherapistStatsSerializer(serializers.Serializer):
    """Serializer for therapist statistics"""
    total_sessions = serializers.IntegerField()
    completed_sessions = serializers.IntegerField()
    cancelled_sessions = serializers.IntegerField()
    no_show_sessions = serializers.IntegerField()
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    total_reviews = serializers.IntegerField()
    total_earnings = serializers.DecimalField(max_digits=10, decimal_places=2)
    clients_served = serializers.IntegerField()
    session_completion_rate = serializers.DecimalField(max_digits=5, decimal_places=2)