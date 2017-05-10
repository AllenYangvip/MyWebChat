# coding=utf-8
from django.shortcuts import render, HttpResponseRedirect,HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from MyChat.templatetags.getImg import chat_url
import models
import Queue,json,time




# Create your views here.

GLOBAL_MSG_QUEUES ={

}

# 采用from django.contrib.auth.decorators import login_required 调用 Django中自带用户认证登录模块
@login_required
def index(request):
    return render(request, 'MyChat/Chat.html')


def acc_login(request):
    err_msg = ''
    if request.method == 'POST':
        username = request.POST.get('inputUser')
        password = request.POST.get('inputPassword')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect('/')
        else:
            err_msg = "UserName OR Password was Wrong!!!"
    return render(request, 'Common/login.htm', {"err": err_msg})


@login_required
def acc_logout(request):
    logout(request)
    return HttpResponseRedirect('/accounts/login')


# 接受消息函数
@login_required
def send_msg(request):
    # if request.POST.get()
    # 接受关于data的数据
    msg_data = request.POST.get('data')
    # 判断是否正确
    if msg_data:
        msg_data = json.loads(msg_data)
        msg_data['timestamp'] = time.time()
        if msg_data['type'] == 'single':
            if not GLOBAL_MSG_QUEUES.get(int(msg_data['to'])):
                GLOBAL_MSG_QUEUES[int(msg_data["to"])] = Queue.Queue()
            GLOBAL_MSG_QUEUES[int(msg_data["to"])].put(msg_data)

        else: # group
            group_obj = models.ChatGroup.objects.get(id=msg_data['to'])
            for member in group_obj.members.select_related():
                if not GLOBAL_MSG_QUEUES.get(member.id):   # 如果字典里不存在这个用户的queue
                    GLOBAL_MSG_QUEUES[member.id] = Queue.Queue()
                if member.id != request.user.userprofile.id:
                    GLOBAL_MSG_QUEUES[member.id].put(msg_data)
        print GLOBAL_MSG_QUEUES
    return HttpResponse('---发送后端成功---')


@login_required
def get_new_msgs(request):
    if request.user.userprofile.id not in GLOBAL_MSG_QUEUES:
        print("不存在[%s]" % request.user.userprofile.id, request.user)
        GLOBAL_MSG_QUEUES[request.user.userprofile.id] = Queue.Queue()
    msg_count = GLOBAL_MSG_QUEUES[request.user.userprofile.id].qsize()
    q_obj = GLOBAL_MSG_QUEUES[request.user.userprofile.id]
    msg_list = []
    print(msg_list)
    if msg_count > 0:
        for msg in xrange(msg_count):
            msg_list.append(q_obj.get())
        print("new msgs:",msg_list)
    else:  # 没消息,要挂起
        print("no new msg for ",request.user,request.user.userprofile.id)
        # print(GLOBAL_MSG_QUEUES)
        try:
            msg_list.append(q_obj.get(timeout=60))
        except Queue.Empty:
            print("\033[41;1mNo msg for [%s][%s] ,timeout\033[0m" %(request.user.userprofile.id,request.user))

    return HttpResponse(json.dumps(msg_list))



