import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin


class Message(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'message'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    text = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    html = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    file_name = sqlalchemy.Column(sqlalchemy.String, nullable=True, )
    id_t = sqlalchemy.Column(sqlalchemy.String, nullable=True, )
    id_sender = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)
    name_sender = sqlalchemy.Column(sqlalchemy.Integer, nullable=True, default=0)

