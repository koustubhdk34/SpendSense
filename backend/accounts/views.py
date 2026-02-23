from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, OTPVerifySerializer
from .models import EmailOTP
from django.shortcuts import get_object_or_404
import random
from django.utils import timezone
from .tasks import send_otp_email_task

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = []

    def perform_create(self, serializer):
        user = serializer.save()
        # generate OTP
        code = f"{random.randint(100000, 999999)}"
        otp = EmailOTP.objects.create(user=user, code=code)
        # send email via Celery task
        send_otp_email_task.delay(user.email, code)

class VerifyOTPView(generics.GenericAPIView):
    serializer_class = OTPVerifySerializer
    permission_classes = []

    def post(self, request, *args, **kwargs):
        ser = self.get_serializer(data=request.data)
        ser.is_valid(raise_exception=True)
        email = ser.validated_data['email']
        code = ser.validated_data['code']
        user = get_object_or_404(User, email=email)
        otp = EmailOTP.objects.filter(user=user, code=code).order_by('-created_at').first()
        if not otp or not otp.is_valid():
            return Response({'detail': 'Invalid or expired code'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'verified'})
