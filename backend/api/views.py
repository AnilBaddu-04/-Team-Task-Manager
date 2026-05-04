from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Project, Task
from .serializers import UserSerializer, ProjectSerializer, TaskSerializer, CustomTokenObtainPairSerializer
from django.utils import timezone
from django.db.models import Q

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class SignupView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        role = request.data.get('role', 'Member')

        if not username or not password:
            return Response({'message': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'message': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, role=role)
        return Response({'id': user.id, 'username': user.username, 'role': user.role}, status=status.HTTP_201_CREATED)

class ProjectListView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'Admin':
            projects = Project.objects.all()
        else:
            projects = request.user.projects.all()
        
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'Admin':
            return Response({'message': 'Require Admin role'}, status=status.HTTP_403_FORBIDDEN)
        
        name = request.data.get('name')
        description = request.data.get('description', '')
        member_ids = request.data.get('memberIds', [])

        project = Project.objects.create(name=name, description=description)
        if member_ids:
            users = User.objects.filter(id__in=member_ids)
            project.members.set(users)
        
        serializer = ProjectSerializer(project)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class TaskListView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'Admin':
            tasks = Task.objects.all()
        else:
            tasks = Task.objects.filter(assignee=request.user)
        
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'Admin':
            return Response({'message': 'Require Admin role'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskDetailView(views.APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return Response({'message': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role != 'Admin' and task.assignee != request.user:
            return Response({'message': 'Not authorized to update this task'}, status=status.HTTP_403_FORBIDDEN)

        task.status = request.data.get('status', task.status)
        task.save()
        serializer = TaskSerializer(task)
        return Response(serializer.data)

class UserListView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'Admin':
            return Response({'message': 'Require Admin role'}, status=status.HTTP_403_FORBIDDEN)
        
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class DashboardView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'Admin':
            tasks = Task.objects.all()
        else:
            tasks = Task.objects.filter(assignee=request.user)

        total = tasks.count()
        pending = tasks.filter(status='Pending').count()
        in_progress = tasks.filter(status='In Progress').count()
        completed = tasks.filter(status='Completed').count()
        
        now = timezone.now()
        overdue = tasks.filter(Q(due_date__lt=now) & ~Q(status='Completed')).count()

        return Response({
            'total': total,
            'pending': pending,
            'inProgress': in_progress,
            'completed': completed,
            'overdue': overdue
        })
