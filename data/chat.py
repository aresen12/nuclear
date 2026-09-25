import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
from data import db_session
from flask_login import current_user
from data.user import User
# from data.my_chat import get_my_chat
# from data.admin import Admin
from data.my_orm.message import Message
from data.my_orm.engine import SessionDB


class Chat(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'chats'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    status = sqlalchemy.Column(sqlalchemy.Integer, nullable=True, default=1)
    # 1 - current 2 - deleted 3 - blocked 4 - bug
    pinned = sqlalchemy.Column(sqlalchemy.Boolean, default=False)
    pinned_messages = sqlalchemy.Column(sqlalchemy.String, default="")

    def __repr__(self):
        return f"{self.members} {self.name}"


def get_chats(cnt):
    db_sess = db_session.create_session()
    official_id = -1
    chats = db_sess.query(Chat).filter(Chat.status != 2).all()
    new = []
    # admins = [_[0] for _ in db_sess.query(User.id).filter(User.admin).all()]
    if cnt > len(chats):
        cnt = len(chats)
    for i in range(cnt):
        admin_flag = False
        my_sess = SessionDB(f"db/chats/chat{chats[i].id}.db", factory=True)
        mess2 = my_sess.query(Message()).all()
        if len(mess2) != 0:
            mess = mess2[-1]
            new.append({"id": chats[i].id, "name": chats[i].name, "pinned": int(chats[i].pinned),
                        "status": chats[i].status, "admin": admin_flag,
                        "last_message": {"text": mess["message"], "time": mess['time'],
                                         "name_sender": mess['name_sender'], "type": mess['type']
                                         }})
        else:
            new.append({"id": chats[i].id, "name": chats[i].name, "pinned": int(chats[i].pinned),
                        "status": chats[i].status, "admin": admin_flag,
                        "last_message": {"text": "", "time": "2023-01-01 00:00:00.0",
                                         "name_sender": "", "type": ''
                                         }})
    new.sort(key=lambda x: x["last_message"]["time"], reverse=True)
    new.sort(key=lambda x: x["pinned"], reverse=True)
    db_sess.close()
    return new, official_id


def get_chats_by(cnt, type_chat):
    db_sess = db_session.create_session()
    official_id = -1
    chats = db_sess.query(Chat).filter(Chat.status == type_chat).all()
    new = []
    # admins = [_[0] for _ in db_sess.query(User.id).filter(User.admin).all()]
    if cnt > len(chats):
        cnt = len(chats)
    for i in range(cnt):
        admin_flag = False
        my_sess = SessionDB(f"db/chats/chat{chats[i].id}.db", factory=True)
        mess2 = my_sess.query(Message()).all()
        if len(mess2) != 0:
            mess = mess2[-1]
            new.append({"id": chats[i].id, "name": chats[i].name, "pinned": int(chats[i].pinned),
                        "status": chats[i].status, "admin": admin_flag,
                        "last_message": {"text": mess["message"], "time": mess['time'],
                                         "name_sender": mess['name_sender'], "type": mess['type']
                                         }})
        else:
            new.append({"id": chats[i].id, "name": chats[i].name, "pinned": int(chats[i].pinned),
                        "status": chats[i].status, "admin": admin_flag,
                        "last_message": {"text": "", "time": "2023-01-01 00:00:00.0",
                                         "name_sender": "", "type": ''
                                         }})
    new.sort(key=lambda x: x["last_message"]["time"], reverse=True)
    new.sort(key=lambda x: x["pinned"], reverse=True)
    db_sess.close()
    return new, official_id
