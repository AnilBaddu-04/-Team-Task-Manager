from django.urls import path
from .views import LoginView, SignupView, ProjectListView, TaskListView, TaskDetailView, UserListView, DashboardView

urlpatterns = [
    path('auth/login', LoginView.as_view(), name='login'),
    path('auth/signup', SignupView.as_view(), name='signup'),
    path('projects', ProjectListView.as_view(), name='projects'),
    path('tasks', TaskListView.as_view(), name='tasks'),
    path('tasks/<int:pk>', TaskDetailView.as_view(), name='task-detail'),
    path('users', UserListView.as_view(), name='users'),
    path('dashboard', DashboardView.as_view(), name='dashboard'),
]
