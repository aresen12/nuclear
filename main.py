import datetime
import json

from flask import Flask, request, render_template, redirect
from forms.login_form import LoginForm
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from data import db_session
from data.user import User
from data.reactor import Reactor
from forms.register_form import RegisterForm
from reactor import rs
from wiki import wiki
from events_io import socketio

application = Flask(__name__)
application.config['SECRET_KEY'] = 'certificate'
login_manager = LoginManager()
login_manager.init_app(application)


@login_manager.user_loader
def load_user(user_id):
    db_sess = db_session.create_session()
    rs = db_sess.get(User, user_id)
    db_sess.close()
    return rs


@application.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect("/")


db_session.global_init('db/master.db')
application.register_blueprint(rs)
application.register_blueprint(wiki)
socketio.init_app(application)


@application.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect("/")
    form = LoginForm()
    if form.validate_on_submit():
        db_sess = db_session.create_session()
        user = db_sess.query(User).filter(User.email == form.username.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember_me.data, duration=datetime.timedelta(hours=24 * 90))
            db_sess.close()
            return redirect("/")
        db_sess.close()
        return render_template('login.html',
                               message="Неправильный логин или пароль",
                               form=form)
    return render_template('login.html', title='Авторизация', form=form)


@application.route('/register', methods=['GET', 'POST'])
def reqister():
    form = RegisterForm()
    if form.validate_on_submit():
        if form.password.data != form.password_again.data:
            return render_template('register.html', title='Регистрация',
                                   form=form,
                                   message="Пароли не совпадают")
        db_sess = db_session.create_session()
        if db_sess.query(User).filter(User.email == form.email.data).first():
            db_sess.close()
            return render_template('register.html', title='Регистрация',
                                   form=form,
                                   message="Такой пользователь уже есть")
        user = User()
        user.name = form.name.data
        user.email = form.email.data
        user.set_password(form.password.data)
        db_sess.add(user)
        db_sess.commit()
        login_user(user, remember=True, duration=datetime.timedelta(hours=24 * 90))
        db_sess.close()
        return redirect('/')
    return render_template('register.html', title='Регистрация', form=form)


@application.route("/main", methods=["GET"])
@application.route("/", methods=["GET"])
def main():
    db_sess = db_session.create_session()
    users = db_sess.query(User).all()
    reactors = db_sess.query(Reactor).all()
    reactors.sort(key=lambda r: r.cnt_player, reverse=True)
    db_sess.close()
    users.sort(key=lambda user: user.points, reverse=True)
    my = []
    if current_user.is_authenticated:
        for i in range(len(reactors)):
            if reactors[i].main_player == current_user.id:
                my.append(reactors[i])
    return render_template("main.html", title='симулятор ядерного реактора', my_reactor=my, users=users, reactors=reactors)


@application.route("/add_new_reactor", methods=["GET", "POST"])
def add_new_reactor():
    if request.method == "GET":
        if current_user.is_authenticated:
            return render_template("new_reactor.html", title="симулятор ядерного реактора")
        else:
            return redirect("/")
    else:
        if current_user.is_authenticated:
            db_sess = db_session.create_session()
            reactor = Reactor()
            reactor.name = request.form["name"]
            if "private" in request.form:
                reactor.set_password(request.form["password"])
                reactor.private = True
            reactor.main_player = current_user.id
            file = open(f'db/{request.form["condition"]}.json', mode="r")
            reactor.data_json = file.read()
            file.close()
            reactor.mode = request.form["mode"]
            db_sess.add(reactor)
            db_sess.commit()
            db_sess.close()
            return redirect("/")
        else:
            return redirect("/login")


@application.route("/info/syz")
def info_syz():
    return render_template("syz_info.html", title="СУЗ РБМК-1000")


@application.route("/win_game", methods=["POST"])
def win():
    data = request.get_json()
    file = open("db/task.json", mode="r")
    k = file.read()
    file.close()
    x = json.loads(k)
    db_sess = db_session.create_session()
    user = db_sess.query(User).filter(User.id == current_user.id).first()
    if not (user is None):
        user.points += x[str(data["id_task"])]["points"]
    db_sess.commit()
    db_sess.close()
    return {"log": 200}


@application.route("/info/turnover")
def info_turnover():
    return render_template("turnover_info.html", title="Турбина РБМК")


@application.route("/delete/<room>", methods=["DELETE", "POST", "GET"])
def delete_room(room):
    db_sess = db_session.create_session()
    r = db_sess.query(Reactor).filter(Reactor.id == int(room)).first()
    if current_user.is_authenticated and r.main_player == current_user.id:
        db_sess.delete(r)
        db_sess.commit()
    db_sess.close()
    return redirect("/")


@application.route("/skala/<id_bsm>")
def skala(id_bsm):
    file = open("db/errors.json")
    errors = file.read()
    file.close()
    return render_template("skala.html", errors=errors, title="Скала", id_reactor=id_bsm)


@application.route("/save_game", methods=["POST"])
def save_to_db():
    data = request.get_json()
    db_sess = db_session.create_session()
    reactor = db_sess.query(Reactor).filter(Reactor.id == data["room"]).first()
    reactor.data_json = json.dumps(data)
    db_sess.commit()
    db_sess.close()
    return {"log": 200}


@application.route("/get_game/<id_room>")
def get_game(id_room):
    db_sess = db_session.create_session()
    reactor = db_sess.query(Reactor).filter(Reactor.id == int(id_room)).first()
    if current_user.is_authenticated and reactor.main_player == current_user.id:
        reactor.activiti = True
        db_sess.commit()
    data = reactor.data_json
    db_sess.close()
    return json.loads(data)


@application.route("/info/freeze")
def info_freeze():
    return render_template("freeze_info.html", title="Охлаждение реактора")


@application.route("/info")
def info():
    return render_template("info.html",  title="симулятор упралением ядерного реактора")


@application.route("/robots.txt")
def robots():
    file = open("db/robots.txt", mode="r")
    text = file.read()
    file.close()
    return text

@application.errorhandler(404)
def page_not_found(e):
    # Сначала рендерим шаблон, а потом явно возвращаем код состояния 404
    return render_template('404.html'), 404


if __name__ == "__main__":
    socketio.run(application, host='0.0.0.0', debug=True, allow_unsafe_werkzeug=True, port=8000)

