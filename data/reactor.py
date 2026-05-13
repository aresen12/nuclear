import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
import hashlib


class Reactor(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'reactors'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    list_users = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    data_json = sqlalchemy.Column(sqlalchemy.String, nullable=True)

    # def set_password(self, password):
    #     salt = "5gz"
    #     data_base_password = password + salt
    #     hashed = hashlib.md5(data_base_password.encode())
    #     self.password = hashed.hexdigest()
    #
    # def check_password(self, password):
    #     salt = "5gz"
    #     data_base_password = password + salt
    #     hashed = hashlib.md5(data_base_password.encode())
    #     return self.password == hashed.hexdigest()

    # def __repr__(self):
    #     return self.name, self.email
