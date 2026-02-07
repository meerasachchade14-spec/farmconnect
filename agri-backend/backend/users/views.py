from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .mongo import users_collection

class RegisterView(APIView):
    def post(self, request):
        data = request.data

        name = data.get("name")
        email = data.get("email")
        phone = data.get("phone")
        role = data.get("role")
        password = data.get("password")

        if not all([name, email, phone, role, password]):
            return Response(
                {"error": "All fields required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if users_collection.find_one({"email": email}):
            return Response(
                {"error": "Email already registered"},
                status=status.HTTP_400_BAD_REQUEST
            )

        users_collection.insert_one({
            "name": name.strip(),
            "email": email.strip().lower(),
            "phone": phone.strip(),
            "role": role,
            "password": password
        })

        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = users_collection.find_one({
            "email": email,
            "password": password
        })

        if not user:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({
            "message": "Login success",
            "role": user["role"]
        })
