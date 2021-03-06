"""MyWebChat URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
import views

urlpatterns = [
    url(r'^Friends/All', views.index, name='zone'),
    url(r'^Mine/Saides',views.saides,name='saides_of_mine'),
    url(r'^Mine/articlelist',views.articleslist,name='articles_of_mine'),
    url(r'^changeThumbUps', views.change_ThumbUps, name="changeThumbUps"),
    url(r'^publish_msg',views.publish,name="publish"),
    url(r'^article/(\d*)/',views.article,name="article"),
    url(r'^Comment',views.Comment,name="newComment"),
]