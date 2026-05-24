import datetime
from flask import Flask, request, render_template, redirect
from forms.login_form import LoginForm
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from data import db_session
from data.user import User
from data.reactor import Reactor
from forms.register_form import RegisterForm
from reactor import rs
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
# application.register_blueprint(api)
# application.register_blueprint(panel)
# application.register_blueprint(chats_server)
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


@application.route("/reset_password")
def reset_pass_def():
    return render_template("reset_password.html")


@application.route("/main", methods=["GET"])
@application.route("/", methods=["GET"])
def main():
    db_sess = db_session.create_session()
    users = db_sess.query(User).all()
    reactors = db_sess.query(Reactor).all()
    db_sess.close()
    return render_template("main.html", title='главная', users=users, reactors=reactors)


@application.route("/add_new_reactor", methods=["GET", "POST"])
def add_new_reactor():
    if request.method == "GET":
        return render_template("new_reactor.html")
    else:
        db_sess = db_session.create_session()
        reactor = Reactor()
        reactor.name = request.form["name"]
        reactor.list_users = request.form["users"]
        db_sess.add(reactor)
        db_sess.commit()
        db_sess.close()
        return redirect("/")


@application.route("/info/syz")
def info_syz():
    return render_template("syz_info.html")


@application.route("/info/turnover")
def info_turnover():
    return render_template("turnover_info.html")


@application.route("/info/freeze")
def info_freeze():
    return render_template("freeze_info.html")


@application.route("/info")
def info():
    return render_template("info.html")


if __name__ == "__main__":
    socketio.run(application, host='0.0.0.0', debug=True, allow_unsafe_werkzeug=True)

