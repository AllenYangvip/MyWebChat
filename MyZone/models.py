# -*- coding:utf-8 -*-
from __future__ import unicode_literals

from django.db import models
# 调用 Chat 中的 UserProfile App 共享
from django.contrib.auth.models import User
from MyChat.models import UserProfile

# Create your models here.


# 发表文章、说说
class Article(models.Model):
    title = models.CharField(verbose_name=u'标题', max_length=255)
    title_img = models.ImageField(verbose_name='文章图片', blank=True, null=True, upload_to="uploads")
    category = models.ForeignKey("Category", verbose_name=u'版块类型')
    summary = models.CharField(verbose_name=u'总结', max_length=255, blank=True, null=True,)
    content = models.TextField(verbose_name='内容', blank=True,)
    author = models.ForeignKey(UserProfile, verbose_name=u'作者',)
    publish_date = models.DateTimeField(auto_now=True, verbose_name=u'创建时间')

    def __unicode__(self):
        return self.title

    class Meta:
        verbose_name = u'文章说说'
        verbose_name_plural = u'文章说说'


# 评论表
class Comment(models.Model):
    article = models.ForeignKey("Article", verbose_name=u'文章')
    user = models.ForeignKey(UserProfile, verbose_name=u'用户')
    parent_comment = models.ForeignKey('self', related_name='parent_comm', blank=True, null=True, verbose_name='上级评论')
    comment = models.TextField(max_length=1000, verbose_name=u'评论')
    date = models.DateTimeField(auto_now=True, verbose_name=u'时间')

    def __unicode__(self):
        return "%s user:%s" %(self.comment, self.user)

    class Meta:
        verbose_name = u'评论'
        verbose_name_plural = u'评论'


# 版块表
class Category(models.Model):
    name = models.CharField(max_length=64, verbose_name=u'版块名字', unique=True)
    admin = models.OneToOneField(UserProfile, verbose_name=u'管理用户')

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = u'版块类型'
        verbose_name_plural = u'版块类型'


# 点赞表
class ThumbUp(models.Model):
    article = models.ForeignKey("Article", verbose_name=u'文章')
    user = models.ForeignKey(UserProfile, verbose_name=u'用户')
    date = models.DateTimeField(auto_now=True, verbose_name=u'时间')

    def __unicode__(self):
        return "%s" %self.user

    class Meta:
        verbose_name = u'点赞'
        verbose_name_plural = u'点赞'