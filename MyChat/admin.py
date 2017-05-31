#! -*- coding: utf-8 -*-
from django.contrib import admin
# Register your models here.
from MyChat import models


# 用户表在 Admin 中的显示
class UserProfileAdmin(admin.ModelAdmin):
    # 显示项
    list_display = ('id', 'name', 'head_img',)
    # 搜索项
    search_fields = ['name', ]


# 用户组表在 Admin 中的显示
class ChatGroupAdmin(admin.ModelAdmin):
    # 显示项
    list_display = ('id', 'name', )
    # 搜索项
    search_fields = ['name', ]

# 将两表注册到 Admin 中
admin.site.register(models.UserProfile, UserProfileAdmin)
admin.site.register(models.ChatGroup, ChatGroupAdmin)
