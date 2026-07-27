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
    main_player = sqlalchemy.Column(sqlalchemy.Integer,  nullable=False)
    cnt_player = sqlalchemy.Column(sqlalchemy.Integer, nullable=True, default=0)
    data_json = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    activiti = sqlalchemy.Column(sqlalchemy.Boolean, nullable=True)
    private = sqlalchemy.Column(sqlalchemy.Boolean, nullable=True)
    password = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    mode = sqlalchemy.Column(sqlalchemy.Integer,  nullable=False)

    def set_password(self, password):
        salt = "5gz"
        data_base_password = password + salt
        hashed = hashlib.md5(data_base_password.encode())
        self.password = hashed.hexdigest()

    def check_password(self, password):
        salt = "5gz"
        data_base_password = password + salt
        hashed = hashlib.md5(data_base_password.encode())
        return self.password == hashed.hexdigest()
