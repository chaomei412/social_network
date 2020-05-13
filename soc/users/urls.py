"""social_network URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from users import views

urlpatterns = [
    path('', views.index),
	path('emojis/', views.emojis),
    path('main/', views.main),
	path("fmain/",views.fmain),
	path('login/',views.index),
	path('flogin/',views.login_check),
	path('brodcast/',views.brodcast),
	path('fbrodcast/',views.index),
	path('logout/',views.logout),

	path('signup/',views.index),
	path('fsignup/',views.fsignup),
	path('signup/is_username_avail',views.is_username_avail),
	path('signup/is_email_avail',views.is_email_avail),
	path('signup_submit/',views.signup),
    
	path('find_friend',views.find_friend),
    path('search_friend',views.search_friend),	
	path('friends',views.my_friends),	
	path('add_friend',views.add_friend),
	path('cancle_frindship',views.cancle_frindship),
	path('accept_frindship',views.accept_frindship),
    path('profile',views.index),
	path('fprofile',views.profile),
	path('account',views.account),
	path('faccount',views.account),
	path("lets_chat",views.index)
]

'''

urlpatterns = [
    path('', views.index),
    path('main/', views.main),
	path('login/',views.login_check),
	path('brodcast/',views.brodcast),
	path('logout/',views.logout),
	path('signup/',views.signup),
	path('signup/is_username_avail',views.is_username_avail),
	path('signup/is_email_avail',views.is_email_avail),
    path('find_friend',views.find_friend),
    path('search_friend',views.search_friend),	
	path('friends',views.my_friends),	
	path('add_friend',views.add_friend),
	path('cancle_frindship',views.cancle_frindship),
	path('accept_frindship',views.accept_frindship),
    path('profile',views.profile),
        path('account',views.account),


'''












