from flask import request
from flask_login import current_user
from flask_socketio import emit, SocketIO, join_room, leave_room, rooms
from data import db_session
from data.reactor import Reactor
socketio = SocketIO(cors_allowed_origins="*")


@socketio.on('connect')
def handle_connect():
    if current_user.is_authenticated:
        join_room(f'u{current_user.id}')
    client_sid = request.sid  # Получаем SID клиента
    print(client_sid, "sid")
    # Можно отправить SID обратно клиенту
    emit('server_sid_response', {'sid': client_sid})


@socketio.on("connect_rc")
def send_connect(data):
    emit("connect_rc_user", {"code": 200}, room=data["sid"])


@socketio.on('join')
def on_join(data):
    room = data['room']
    join_room(room)
    db_sess = db_session.create_session()
    r = db_sess.query(Reactor).filter(Reactor.id == room).first()
    if not (r is None):
        r.cnt_player += 1
        db_sess.commit()
    if current_user.is_authenticated:
        emit('join_event', {"name": current_user.name}, to=room)
        if not (r is None) and r.main_player == current_user.id:
            emit("join_main_player", to=room)
    db_sess.close()


# @socketio.on("join_main_player")
# def join_main_player():


@socketio.on('leave')
def on_leave(data):
    room = data['room']
    leave_room(room)
    db_sess = db_session.create_session()
    r = db_sess.query(Reactor).filter(Reactor.id == room).first()
    print("leave", r.cnt_player)
    if r.cnt_player - 1 > 0:
        r.cnt_player -= 1
    else:
        r.cnt_player = 0
        r.activiti = False
    print("leave2", r.cnt_player)
    db_sess.commit()
    db_sess.close()
    if current_user.is_authenticated:
        emit('leave_event', {"name": current_user.name}, to=room)


@socketio.on("chosen_delete")
def chosen_delete(data):
    emit("chosen_delete", data, to=data['room'])


@socketio.on("pause_reactor")
def pause_reactor(data):
    db_sess = db_session.create_session()
    reactor = db_sess.query(Reactor).filter(Reactor.id == data["room"]).first()
    if current_user.is_authenticated and reactor.main_player == current_user.id:
        reactor.activiti = False
        db_sess.commit()
    db_sess.close()
    emit("pause_reactor", to=data["room"])


@socketio.on("set_w_ar")
def set_w_ar(data):
    emit("set_w_ar", data, to=data['room'])


@socketio.on("set_unset_down_direction")
def set_unset_down_direction(data):
    emit("set_unset_down_direction", data, to=data['room'])


@socketio.on("chosen_current")
def chosen_current(data):
    emit("chosen_current", data, to=data['room'])


@socketio.on("update")
def update(data):
    emit("update", data, to=data['room'])


@socketio.on("set_unset_up_direction")
def set_unset_up_direction(data):
    emit("set_unset_up_direction", data, to=data['room'])


@socketio.on("connect_other_room")
def connect_other_room(data):
    data["id_device"] = request.sid
    emit("connect_other_room", data, to=data['room'])

@socketio.on("method_"
             "send")
def method_send(data):
    emit("method_send", data, to=data['room'])