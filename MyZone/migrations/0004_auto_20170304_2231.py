# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2017-03-04 14:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MyZone', '0003_auto_20170304_2230'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='content',
            field=models.TextField(null=True, verbose_name='\u5185\u5bb9'),
        ),
    ]
