#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author:Allen Yang
from django.utils.safestring import mark_safe
# 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15


class Pager(object):
    """

    """

    def __init__(self, current_page, itmes=10):
        try:
            self.items = itmes
            self.current_page = int(current_page)
        except Exception as e:
            self.current_page = 1

    @property
    def start(self):
        """
        :return: 根据所制定的每页多少个记录与请求的页码换算开始位置
        """
        return (self.current_page-1) * self.items

    @property
    def end(self):
        """
        :return:根据所制定的每页多少个记录与请求的页码换算结束位置
        """
        return self.current_page * self.items

    def page_str(self,all_items,base_url):
        """
        :param all_items:所有的item
        :param base_url:基础路径URL
        :return: 返回一个完整的分页html
        """
        all_page, div = divmod(all_items, self.items)

        if div > 0:     # 如果div(即余数)大于0则说明有多出的itme则应该多分出一页
            all_page += 1

        pager_list = []

        if all_page <= int(self.items + 1):
            start = 1
            end = all_page
        else:
            if self.current_page <= int(self.items/2 + 1):
                start = 1
                end = int(self.items + 1) + 1
            else:
                start = self.current_page - 5
                end = self.current_page + 6
                if self.current_page + 6 > all_page:
                    start = all_page - 10
                    end = all_page + 1

        # 把页面动态起来传入起始和结束
        for i in range(start, end):

            # 判断是否为当前页
            if i == self.current_page:
                temp = '<a style="color:red;font-size:26px;padding: 5px" href="%s/%d">%d</a>' % (base_url,i,i)
            else:
                temp = '<a  style="padding: 5px" href="%s/%d">%d</a>' % (base_url,i,i)

            # 把标签拼接然后返回给前端
            pager_list.append(temp)

        # 上一页
        if self.current_page > 1:
            pre_page = '<a  href="%s/%d">上一页</a>' % (base_url, self.current_page - 1)
        else:
            # javascript:void(0) 什么都不干
            pre_page = '<a  href="javascript:void(0);">上一页</a>'
        # 下一页
        if self.current_page >= all_page:
            next_page = '<a  href="javascript:void(0);">下一页</a>'
        else:
            next_page = '<a href="%s/%d">下一页</a>' % (base_url, self.current_page + 1)

        pager_list.insert(0, pre_page)
        pager_list.append(next_page)

        return mark_safe("".join(pager_list))