from django.urls import path
from .views import (UserRegistrationView,UserLoginView,
UserProfileView,UserChangePasswordView,
ResetPasswordEmailView,UserPasswordResetView)
from .views import UserRegistrationView, UserLoginView, InviteUserView 

urlpatterns = [
    path('register/', UserRegistrationView.as_view()),
    path('login/',UserLoginView.as_view()),
    path('profile/',UserProfileView.as_view()),
    path('change_password/',UserChangePasswordView.as_view()),
    path('password_reset_send/',ResetPasswordEmailView.as_view()),
    path('reset_password/<uid>/<token>/',UserPasswordResetView.as_view()),
     path('invite_user/', InviteUserView.as_view(), name='invite_user'),



]
