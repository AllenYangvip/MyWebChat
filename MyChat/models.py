#! -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User


# Create your models here.

# 用户表
class UserProfile(models.Model):
    user = models.OneToOneField(User)
    # 名字
    name = models.CharField(verbose_name=u'名字', max_length=32)
    # 签名
    #signature = models.CharField(verbose_name=u'签名', max_length=255, blank=True, null=True)
    # 头像
    head_img = models.ImageField(verbose_name=u'头像', blank=True, null=True, upload_to="uploads")
    # 朋友
    friends = models.ManyToManyField('self', verbose_name=u'朋友', related_name='my_friends', blank=True)
    '''
    def __str__(self):
        return self.name
    '''

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = u'用户'
        verbose_name_plural = u'用户'


# 群组表
class ChatGroup(models.Model):
    # 群组名称
    name = models.CharField(verbose_name=u'群组名称', max_length=64)
    # 描述
    # brief = models.CharField(verbose_name=u'描述', max_length=255, blank=True, null=True)
    # 群主
    owner = models.ForeignKey("UserProfile", verbose_name=u'群主')
    # 群头像
    group_img = models.ImageField(verbose_name=u'群头像', blank=True, null=True, upload_to="uploads")
    # 群管理员
    #admins = models.ManyToManyField("UserProfile", verbose_name=u'群管理员', blank=True, related_name='group_admins')
    # 群成员
    members = models.ManyToManyField("UserProfile", verbose_name=u'群成员', blank=True, related_name='group_members')
    # 最大成员
    #max_members = models.IntegerField(default=200, verbose_name=u'最大成员',)
    '''
    def __str__(self):
        return self.name

    '''
    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = u'群组'
        verbose_name_plural = u'群组'