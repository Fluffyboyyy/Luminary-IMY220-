============================================
GITHUB
============================================

GitHub Repository:
https://github.com/Fluffyboyyy/Luminary-IMY220-

============================================
DOCKER COMMANDS 
============================================

BUILD IMAGES:
cd frontend && docker build -t luminary-frontend .
cd ../backend && docker build -t luminary-backend .

RUN CONTAINERS:
docker run -d -p 5000:5000 --name luminary-backend luminary-backend
docker run -d -p 5173:5173 --name luminary-frontend luminary-frontend

============================================
ACCESS THE APPLICATION
============================================

Frontend: http://localhost:5173
Backend API: http://localhost:5000

============================================
TEST ACCOUNTS
============================================

Email: alice@example.com
Password: password123

Email: bob@example.com
Password: password123