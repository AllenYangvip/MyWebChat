# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2017-03-08 06:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MyZone', '0008_auto_20170307_1955'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='summary',
            field=models.CharField(default=1, max_length=255, verbose_name='\u603b\u7ed3'),
            preserve_default=False,
        ),
    ]
