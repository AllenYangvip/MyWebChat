#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Alen Yang

from django import template
from django.utils.safestring import mark_safe
from MyZone import models

register = template.Library()


@register.filter(name='get_name')
def get_name(ThumbUp_name):
    """
    The function is join the names for the table of ThumbUp
    "{{ item.thumbup_set.select_related.all | get_name}}"
    :param ThumbUp_name: The name is  all the of the article's ThumbUp
    :return: String of all the names
    """
    names = []
    for item in ThumbUp_name:
        names.append(item.user.name)
    return "     ".join(names)


@register.filter(name='bulid_comment_tree')
def bulid_comment_tree(itemid):
    """
    分析用户发表的日志或说说从与之相关联的表中查找出
    相关评论并阶梯形显示
    :param itemid: 通过itemid来判断是哪个日志或说说
    :var comment_dic:存放转换后的字典
    :var html：存入最终结果返回的html
    :var commentlists：<QueryList> 存放一通过传过来的id查找到的相关评论并通过其自身ID排序结果
    :var margin_left：HTML CSS Style ，每迭代一级缩进15px
    :return:HTML
    """

    comment_dic = {}    # 存放转换后的字典
    html = ""  # 存入最终结果返回的html
    commentlists = models.Comment.objects.filter(article_id__exact=itemid).order_by("id")

    # 遍历commentlists 将其转换成字典形式
    for i in commentlists:
        if i.parent_comment is None:
            comment_dic[i] = {}
        else:
            tree_search(comment_dic,i)

    # 生成Html
    html = "<div >"
    margin_left = 0
    for k, v in comment_dic.items():
        html += "<div coment-id ='%s'> " %k.id+"<a><span>"+k.user.name+" : "+"</span>"+k.comment + "</a></div> "
        html += generate_comment_html(v, margin_left + 10)
    html += "</div>"
    return mark_safe(html)


def tree_search(com_dit,com_obj):
    """
    通过递归调用来将QueryList转换成字典
    :param com_dit:传过过来的字典
    :param com_obj: 传过来的
    :return:
    """
    for k, v in com_dit.items():
        if k == com_obj.parent_comment:
            com_dit[k][com_obj] = {}
            return
        else:
            tree_search(com_dit[k], com_obj)


def generate_comment_html(sub_comment_dic,margin_left_val):
    # 先创建一个html默认为空
    htm = ""
    for k, v_dic in sub_comment_dic.items():  # 循环穿过来的字典
        htm += "<div style='margin-left:%spx'  class='comment-node'coment-id ='%s'>" % (margin_left_val,k.id) +"<span>|--<a>"+k.user.name+" : "+"</span>"+ k.comment + "</a></div>"

        if v_dic:
            htm += generate_comment_html(v_dic, margin_left_val +margin_left_val +3 )
    return htm





