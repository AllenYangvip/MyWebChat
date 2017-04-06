from django.contrib import admin
from models import *
# Register your models here.


class ArticleAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'author', 'publish_date')
    search_fields = ('title',)


class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'article', 'user', 'comment','parent_comment')
    search_fields = ('comment',)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'admin', )
    search_fields = ('name',)

class ThumbUpAdmin(admin.ModelAdmin):
    list_display = ('id', 'article', 'user',)
    search_fields = ('article',)


# Get these register in Admin
admin.site.register(Article, ArticleAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(ThumbUp, ThumbUpAdmin)