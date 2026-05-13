import os
from flask import (
    Blueprint, redirect, render_template, request,
)
from data import db_session
from data.user import User
from flask_login import current_user
from flask_socketio import emit
import json
rs = Blueprint('simylator', __name__, url_prefix='/b')
s = [
        [0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 2, 3, 2, 1, 1, 0],
        [1, 1, 5, 1, 5, 1, 5, 1, 1],
        [1, 2, 1, 3, 4, 3, 1, 2, 1],
        [1, 3, 5, 4, 1, 4, 5, 3, 1],
        [1, 2, 1, 3, 4, 3, 1, 2, 1],
        [1, 1, 5, 1, 5, 1, 5, 1, 1],
        [0, 1, 1, 2, 3, 2, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 0, 0]]


@rs.route("/<id_re>")
def bsm(id_re):
    return render_template("BSM.html", s=s, id_reactor=int(id_re), copy=False)


@rs.route("/user/<id_re>")
def bsm_user(id_re):
    return render_template("BSM.html", s=s, id_reactor=int(id_re), copy=True)
