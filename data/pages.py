import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin


class Page(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'pages'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    name_english = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    description = sqlalchemy.Column(sqlalchemy.String,  nullable=False)
    file_name = sqlalchemy.Column(sqlalchemy.String, nullable=True, )
    cnt_read = sqlalchemy.Column(sqlalchemy.Integer, nullable=True, default=0)
    id_writer = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)

