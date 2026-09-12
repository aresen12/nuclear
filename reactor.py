from flask import (
    Blueprint, redirect, render_template, request,
)
from data import db_session
from data.user import User
from data.reactor import Reactor
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
    db_sess = db_session.create_session()

    try:
        r = int(id_re)
        room = db_sess.query(Reactor).filter(Reactor.id == r).first()
        type_game = room.mode
    except ValueError:
        r = id_re
        type_game = 0
    db_sess.close()
    return render_template("BSM.html", s=s, id_reactor=r, copy=False, type_game=type_game,
                           title="Блочный щит управления", description="Блочный щит управления РБМК-1000")


@rs.route("/user/<id_re>")
def bsm_user(id_re):
    return render_template("BSM.html", s=s, id_reactor=int(id_re), copy=True,
                           title="Блочный щит управления", description="Блочный щит управления РБМК-1000")


@rs.route("/get_data_start/<condition>")
def get_data_task(condition):
    try:
        file = open(f'db/{condition}.json', mode="r")
        data_json = file.read()
        file.close()
        return json.loads(data_json)
    except FileNotFoundError:
        return {"log": "error"}
