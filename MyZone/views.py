# -*- coding: utf-8 -*-
from django.shortcuts import render,HttpResponse,render_to_response
from django.contrib.auth.decorators import login_required
from MyZone import models,forms
from django.core.exceptions import ObjectDoesNotExist
import json

# Create your views here.


@login_required
def index(request):
    """

    :param request:
    :return:
    """
    ALL_DATA = {}

    # 先获取该请求用户的所有好友然后于根据好友查找好友说说与日志
    friends = request.user.userprofile.friends.select_related()
    ALL_DATA['Articles'] = models.Article.objects.filter(author__in=friends).order_by("-publish_date")
    ALL_DATA['Articles']
    # ALL_DATA['ThumbUps'] = models.ThumbUp.objects.all()
    return render(request, 'MyZone/Zone.html', ALL_DATA)


@login_required
def change_ThumbUps(request):
    """
    GET: 获取当前用户是否点赞且获取点赞数
    POST：修改当前用户点赞状态（必须提交文章或说说ID）
    :param request:
    :return:
    """

    if request.method == "POST":
        id = request.POST.get('tpid')
        user = request.user.userprofile.name
        obj = models.ThumbUp.objects.filter(article_id__exact=id, user__name=user)

        if obj:
            try:
                obj.delete()
                return HttpResponse("true")
            except Exception as e:
                return HttpResponse(e)
        else:
            art = models.Article.objects.get(id=id)
            name = models.UserProfile.objects.get(name=user)
            thumbup = models.ThumbUp(article=art,user=name)
            thumbup.save()
            return HttpResponse("false")


@login_required
def publish(request):
    """

    :param request:
    :return:
    """
    categoryid = models.Category.objects.all()
    if request.method == "POST":
        fm = forms.ArticlForm(request.POST or None, request.FILES)
        if fm.is_valid():
            art_data = fm.cleaned_data
            art_data['author_id'] = request.user.userprofile.id
            print art_data
            artobj = models.Article(**art_data)
            artobj.save()
        return render(request,'MyZone/publish.html',{'art':artobj})
    return render( request,'MyZone/publish.html',{'category':categoryid})


@login_required
def article(request,id):
    try:
        art_obj = models.Article.objects.get(id= id)
    except ObjectDoesNotExist as e:
        return render_to_response('Common/404.html', {'err': 'The article is not exist!!'})

    return render(request,'MyZone/article.html',{'article':art_obj})


