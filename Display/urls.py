from django.urls import path
from .views import *
app_name = 'Display'

urlpatterns = [
    path('', Home, name='Home'),
    path('camera/', Camera, name='Camera'),
    path('Infomation/', Infomation, name='Infomation'),
]