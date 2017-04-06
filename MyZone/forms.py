#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Allen Yang
from django import forms
from models import Article

class ArticlForm(forms.ModelForm):
    '''
    title = forms.CharField( max_length=255)
    title_img = forms.ImageField()
    category = forms.CharField()
    summary = forms.CharField()
    content = forms.TextField()'''
    class Meta:
        model = Article
        fields = [ 'title', 'title_img', 'category', 'summary', 'content']