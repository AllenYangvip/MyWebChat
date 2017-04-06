#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Alen Yang
from django import template


register = template.Library()


@register.filter
def chat_url(img):
    return '/static/'+img.name.split("/")[-1]