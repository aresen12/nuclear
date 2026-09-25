import os
from flask import (
    Blueprint, redirect, render_template, request,
)
from data import db_session
from data.user import User
from flask_login import current_user
from data.chat import Chat, get_chats, get_chats_by
from flask_socketio import emit
from data.my_orm.message import Message, new_mess
from data.my_orm.engine import SessionDB
import json

forum = Blueprint('forum', __name__, url_prefix='/forum')


@forum.route("/<cnt>")
@forum.route("/", methods=["GET", "POST"])
def m_st(cnt=10):
    if request.method == 'GET':
        auth_flag = False
        if current_user.is_authenticated:
            auth_flag = True
        chats = get_chats(cnt)
        return render_template("/forum/forum_main.html",
                               title='Форум', chats=chats[0], auth_flag=auth_flag,
                               description="Форум Симулятора ядерного реактора РБМК-1000"
                               )
    return redirect("/login")


@forum.route("/admin/<cnt>")
@forum.route("/admin", methods=["GET", "POST"])
def admin_panel(cnt=10):
    if request.method == 'GET' and current_user.is_authenticated and current_user.admin:
        chats = get_chats(cnt)
        return render_template("/forum/admin.html",
                               title='Форум', chats=chats[0], auth_flag=True,
                               description="Форум Симулятора ядерного реактора РБМК-1000"
                               )
    return redirect("/login")


@forum.route("/sort/<type_chat>/<cnt>")
@forum.route("/sort/<type_chat>", methods=["GET", "POST"])
def sort_by_type(type_chat, cnt=10):
    if request.method == 'GET':
        auth_flag = False
        if current_user.is_authenticated:
            auth_flag = True
        chats = get_chats_by(cnt, int(type_chat))
        return render_template("/forum/forum_main.html",
                               title='Форум', chats=chats[0], auth_flag=auth_flag,
                               description="Форум РБМК-1000"
                               )
    return redirect("/login")


@forum.route("/chat/<id_chat>", methods=["GET", "POST"])
def chat_tem(id_chat):
    if request.method == 'GET':
        auth_flag = False
        if current_user.is_authenticated:
            auth_flag = True
        db_sess = db_session.create_session()
        chat = db_sess.get(Chat, int(id_chat))
        file___ = open("static/img/emoji/meta_data.json", mode="r")
        metadata = json.load(file___)
        file___.close()
        db_sess.close()
        return render_template("/forum/forum_chat.html", meta_data=metadata,
                               title='Форум', chat=chat, auth_flag=auth_flag)
    return redirect("/login")


@forum.route("/get_json_mess", methods=["POST"])
def get_json_message():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.get(Chat, int(data["chat_id"][4:]))
    my_orm = SessionDB(f"db/chats/chat{data['chat_id'][4:]}.db", factory=True)
    messages = my_orm.query(Message()).all()
    pinned_messages = []
    if not (chat.pinned_messages is None):
        pinned_messages = chat.pinned_messages.split()
    js = {"messages": [], "files": [],
          "pinned_message": pinned_messages}
    messages.sort(key=lambda x: x["time"])
    for m in messages:
        js["messages"].append({"id": m["id"], "read": m["read"], "html_m": m["html_m"], "text": m["message"],
                               'time': m["time"], "file": m["img"], "id_sender": m["id_sender"],
                               "name_sender": m["name_sender"], "type": m["type"]})
    my_orm.close()
    return js


@forum.route("/add_new_dialog", methods=["GET", "POST"])
def add_mew_t():
    if request.method == "GET":
        return render_template("/forum/add_t.html")
    else:
        if current_user.is_authenticated:
            db_sess = db_session.create_session()
            chat = Chat()
            chat.name = request.form["name"]
            chat.status = int(request.form["mode"])
            db_sess.add(chat)
            db_sess.commit()
            db_sess.close()
            return redirect("/forum")
        return redirect("/login")


@forum.route("/delete/chat/<chat_id>")
def delete_by_id(chat_id):
    if current_user.is_authenticated and current_user.admin:
        db_sess = db_session.create_session()
        chat = db_sess.get(Chat, int(chat_id))
        db_sess.delete(chat)
        db_sess.commit()
        db_sess.close()
        return redirect("/forum")
    return redirect("/login")


@forum.route("/delete", methods=["DELETE"])
def delete_mess():
    data = request.get_json()
    db_sess = db_session.create_session()
    if not current_user.is_authenticated:
        db_sess.close()
        return {"log": "not in chat"}
    db_sess.close()
    db_sess = SessionDB(f'db/chats/chat{data["chat_id"][4:]}.db')
    mes = db_sess.query(Message()).filter(f'message.id = {data["id"]}').first()
    mes: Message
    if mes is None:
        db_sess.close()
        return {"log": "bad id", "delete_id": data["id"]}
    print(mes.type.value, mes.message.value)
    if mes.type.value == 1:
        emit('delete_message', {"message_id": mes.id.value}, to=data["chat_id"],
             namespace=f"/")
    else:
        emit('delete_emoji', {"message_id_on_emoji": mes.html_m.value,
                              "id_emoji": mes.message.value, "id_sender": mes.id_sender.value,
                              "id_message_emoji": mes.id.value},
             to=str(data["chat_id"]),  namespace="/")
    list_emoji = db_sess.query(Message()).filter("message.type = 2").filter(f"message.html_m = {data['id']}").all()
    for _ in list_emoji:
        mess = Message()
        mess.id.value = _[0]
        db_sess.delete(mess)
    # if mes.img.value != "" and not (mes.img.value is None):
    #     db_sess_2 = db_session.create_session()
    #     file = db_sess_2.query(File).filter(File.id == mes.img.value).first()
    #     if file.list_messages is None or file.list_messages.strip() == str(mes.img.value):
    #         db_sess_2.delete(file)
    #         try:
    #             os.remove("static/img/" + file.path)
    #         except FileNotFoundError:
    #             pass
    #     else:
    #         l_ = file.list_messages.split()
    #         del l_[l_.index(str(mes.img.value))]
    #         file.list_messages = " ".join(l_)
    #     db_sess_2.commit()
    #     db_sess_2.close()
    db_sess.delete(mes)
    db_sess.commit()
    db_sess.close()
    return {"log": "True"}


@forum.route("/pinned", methods=["POST"])
def pinned():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"][4:]).first()
    if chat.status != 3 and (current_user.is_authenticated and not current_user.admin):
        db_sess.close()
        return {"log": "not in chat"}
    tm = chat.pinned_messages.split()
    tm.insert(0, str(data['mess_id']))
    chat.pinned_messages = " ".join(tm)
    emit("pinned_message", {"id_mess": data["mess_id"]}, to=data["chat_id"], namespace="/")
    db_sess.commit()
    db_sess.close()
    return {"log": True}


@forum.route("/un_pinned", methods=["POST"])
def an_pinned():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"][4:]).first()
    if chat.status != 3 and (current_user.is_authenticated and not current_user.admin):
        db_sess.close()
        return {"log": "not in chat"}
    p = chat.pinned_messages.split()
    del p[p.index(str(data["mess_id"]))]
    chat.pinned_messages = " ".join(p)
    db_sess.commit()
    db_sess.close()
    emit("un_pinned_message", {"id_mess": data["mess_id"]}, to=data["chat_id"], namespace="/")
    return {"log": True}


@forum.route("/edit_message", methods=["POST"])
def edit_mess():
    data = request.get_json()
    db_sess = SessionDB(f"db/chats/chat{data['chat_id'][4:]}.db")
    mess = db_sess.query(Message()).filter(f"message.id = {data['id']}").first()
    if mess.id_sender.value == current_user.id:
        mess.message.value = data["new_text"]
        mess.read.value = 0
        db_sess.update(mess)
        db_sess.commit()
    emit("edit_message", {"id_mess": data["id"], "new_text": data["new_text"]}, to=data["chat_id"], namespace="/")
    db_sess.close()
    return {"log": True}
