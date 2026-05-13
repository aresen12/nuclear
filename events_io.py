from flask_login import current_user
from flask_socketio import emit, SocketIO, join_room, leave_room, rooms
from data import db_session
from data.user import User
socketio = SocketIO(cors_allowed_origins="*")


@socketio.on('connect')
def handle_connect():
    if current_user.is_authenticated:
        join_room(f'u{current_user.id}')

@socketio.on('join')
def on_join(data):
    room = data['room']

    join_room(room)
        # emit('join_event', {"id_user": current_user.id, "users": users}, to=room)


@socketio.on('leave')
def on_leave(data):
    room = data['room']
    leave_room(room)
    if current_user.is_authenticated:
        emit('leave_event', {"id_user": current_user.id}, to=room)


@socketio.on("chosen_delete")
def chosen_delete(data):
    emit("chosen_delete", data, to=data['room'])


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


@socketio.on("method_send")
def method_send(data):
    emit("method_send", data, to=data['room'])