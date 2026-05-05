TEAM TASK MANAGER - FULL STACK APPLICATION
==========================================

Build a web app where users can create projects, assign tasks, and track progress with role-based access (Admin/Member).

🚀 KEY FEATURES
----------------
- Authentication (Signup/Login) using JWT
- Project & Team Management (Admin only)
- Task creation, assignment & status tracking
- Interactive Dashboard (Stats, Overdue alerts)
- Role-based Access Control (Admin vs Member)
- Modern, Dark-Mode UI with Vanilla CSS

⚙️ TECH STACK
--------------
- Frontend: React (Vite), React Router, Axios
- Backend: Django, Django REST Framework
- Database: SQLite
- Auth: Simple JWT

📁 PROJECT STRUCTURE
---------------------
/backend    - Django REST API source code
/frontend   - React Vite source code
.gitignore  - Git exclusion rules

🛠️ SETUP INSTRUCTIONS
---------------------

1. BACKEND SETUP
   - Navigate to the backend directory: cd backend
   - Create a virtual environment: python -m venv venv
   - Activate the environment: 
     - Windows: .\venv\Scripts\activate
     - Mac/Linux: source venv/bin/activate
   - Install dependencies: pip install django djangorestframework django-cors-headers djangorestframework-simplejwt
   - Run migrations: python manage.py migrate
   - Start the server: python manage.py runserver 3001

2. FRONTEND SETUP
   - Navigate to the frontend directory: cd frontend
   - Install dependencies: npm install
   - Start the development server: npm run dev
   - Access the app at: http://localhost:5173

🔑 DEFAULT CREDENTIALS
-----------------------
After setting up, you can sign up as a new user or use:
- Username: admin
- Password: admin_password

Developed for Full-Stack Team Task Manager Assessment.
