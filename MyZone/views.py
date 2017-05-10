# -*- coding: utf-8 -*-
from django.shortcuts import render,HttpResponse,render_to_response,HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from MyZone import models,forms
from django.core.exceptions import ObjectDoesNotExist
import json
from pager import Pager

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
    return render(request, 'MyZone/Zone.html', ALL_DATA)


@login_required
def Comment(request):
    data = {}
    if request.method == 'POST':
        recv_data = json.loads(request.POST.get('data'))

        #parent_comment = request.POST.get("parent_comment", None)
        if recv_data["parent_comment_user"] != '' and recv_data["parent_comment_id"] != '':
            parent_comment_user = recv_data["parent_comment_user"]
            parent_comment_id = recv_data["parent_comment_id"]
        else:
            parent_comment_user = None
            parent_comment_id = None
        data["article"] =models.Article.objects.get(id=int(recv_data["article_id"]))
        data["comment"] = recv_data["comment"]
        data["user"] = request.user.userprofile
        if parent_comment_user is not None and parent_comment_id is not None:
            #parent_comment_user_id = models.UserProfile.objects.get(name=parent_comment_user).id
            user = models.UserProfile.objects.get(name=parent_comment_user)
            #parent_id = models.Comment.objects.get(id= parent_comment_id)
            commentobj = models.Comment.objects.get(user=user,id=parent_comment_id)
            print commentobj
            if commentobj:
                data['parent_comment'] = commentobj
            newobj = models.Comment(article=data['article'],comment=data["comment"],user=data["user"],
                                    parent_comment=data['parent_comment'])
        else:
            newobj = models.Comment(article=data['article'], comment=data["comment"], user=data["user"])
        newobj.save()
        return HttpResponse("true")




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
    """

    :param request:
    :param id:
    :return:
    """
    try:
        art_obj = models.Article.objects.get(id= id)
    except ObjectDoesNotExist as e:
        return render_to_response('Common/404.html', {'err': 'The article is not exist!!'})

    return render(request,'MyZone/article.html',{'article':art_obj})


@login_required
def saides(request):
    """
    :param request:
    :return:
    """
    ALL_DATA = {}
    try:
        ALL_DATA['Articles'] = models.Article.objects.filter(author=request.user.userprofile.id,category__name=u"说说").order_by("-publish_date")
    except Exception as e:
        return render_to_response('Common/404.html', {'err': e})
    return render(request, 'MyZone/Zone.html', ALL_DATA)


@login_required
def articles(request):
    """

    :param request:
    :return:
    """
    ALL_DATA = {}
    try:
        ALL_DATA['Articles'] = models.Article.objects.filter(author=request.user.userprofile.id, category__name=u"日志").order_by("-publish_date")
    except Exception as e:
        return render_to_response('Common/404.html', {'err': e})
    return render(request, 'MyZone/Zone.html', ALL_DATA)







