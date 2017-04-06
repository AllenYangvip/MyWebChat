# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2017-02-18 15:59
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('MyZone', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='title_img',
            field=models.ImageField(blank=True, null=True, upload_to='uploads', verbose_name='\u6587\u7ae0\u56fe\u7247'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='parent_comment',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='parent_comm', to='MyZone.Comment', verbose_name='\u4e0a\u7ea7\u8bc4\u8bba'),
        ),
    ]