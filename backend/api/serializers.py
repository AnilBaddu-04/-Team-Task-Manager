from rest_framework import serializers
from .models import User, Project, Task
from . import models
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role']

class ProjectSerializer(serializers.ModelSerializer):
    # For nested representation
    Users = UserSerializer(source='members', many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'Users']

class TaskSerializer(serializers.ModelSerializer):
    Assignee = UserSerializer(source='assignee', read_only=True)
    Project = ProjectSerializer(source='project', read_only=True)
    
    # We want camelCase output since frontend expects it
    dueDate = serializers.DateTimeField(source='due_date', required=False, allow_null=True)
    projectId = serializers.PrimaryKeyRelatedField(queryset=models.Project.objects.all(), source='project', write_only=True)
    assigneeId = serializers.PrimaryKeyRelatedField(queryset=models.User.objects.all(), source='assignee', write_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'dueDate', 'Project', 'Assignee', 'projectId', 'assigneeId']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Add custom claims
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'role': self.user.role
        }
        # The frontend expects access token as simply 'token'
        data['token'] = data.pop('access')
        return data
