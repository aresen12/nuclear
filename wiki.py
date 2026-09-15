from flask import (
    Blueprint, redirect, render_template, request, abort
)
from data import db_session
from data.user import User
from flask_login import current_user
from data.pages import Page
from data.Bad_info import BadInfo
import json

wiki = Blueprint('wiki', __name__, url_prefix='/wiki')


@wiki.route("/")
def main_wiki():
    db_sess = db_session.create_session()
    pages = db_sess.query(Page).all()
    db_sess.close()
    return render_template("/wiki/main.html", title="Энциклопедия РБМК",
                           description="Энциклопедия РБМК справочник по реакторам РБМК", pages=pages)


@wiki.route("/add_new_page", methods=["POST", "GET"])
def add_new_page():
    if request.method == "GET":
        if current_user.is_authenticated and current_user.admin:
            db_sess = db_session.create_session()
            bad_info = db_sess.query(BadInfo).all()
            db_sess.close()
            return render_template("/wiki/new_page.html", bad_info=bad_info)
        return redirect("/login")
    else:
        if current_user.is_authenticated and current_user.admin:
            db_sess = db_session.create_session()
            page = Page()
            page.name = request.form["name"]
            page.description = request.form["description"]
            page.id_writer = current_user.id
            page.type_page = request.form["type_page"]
            page.name_english = request.form["english"]
            f = request.files["file"]
            page.file_name = f'{request.form["english"]}.html'
            file = open(f"templates/wiki/data/{page.file_name}", mode="wb")
            file.write(f.read())
            file.close()
            db_sess.add(page)
            db_sess.commit()
            db_sess.close()
            return redirect("/wiki")
        return redirect("/login")


@wiki.route("/<name_page>")
def page_wiki(name_page):
    db_sess = db_session.create_session()
    page = db_sess.query(Page).filter(Page.name_english == name_page).first()
    if page is None:
        return abort(404)
    page.cnt_read += 1
    name = page.name
    description = page.description
    db_sess.commit()
    db_sess.close()
    return render_template(f"/wiki/data/{name_page}.html", title=name,
                           description=description)


@wiki.route("/edit/<name_page>", methods=["POST"])
def edit_post_page_wiki(name_page):
    db_sess = db_session.create_session()
    page = db_sess.query(Page).filter(Page.name_english == name_page).first()
    if page is None or not (current_user.is_authenticated and current_user.admin):
        db_sess.close()
        return abort(404)
    page.name = request.form["name"]
    page.description = request.form['description']
    db_sess.commit()
    db_sess.close()
    return redirect("/wiki")


@wiki.route("/edit_html/<name_page>", methods=["POST"])
def edit_html_post_page_wiki(name_page):
    db_sess = db_session.create_session()
    page = db_sess.query(Page).filter(Page.name_english == name_page).first()
    if page is None or not (current_user.is_authenticated and current_user.admin):
        db_sess.close()
        return abort(404)
    file = open(f"templates/wiki/data/{page.file_name}", mode="w")
    file.write(request.form["new_html"])
    file.close()
    page.name_english = request.form["name_english"]
    db_sess.commit()
    db_sess.close()
    return redirect("/wiki")


@wiki.route("/errors")
def error_page():
    db_sess = db_session.create_session()
    pages = db_sess.query(Page).all()
    db_sess.close()
    return render_template("/wiki/error_rbmk.html", title="Энциклопедия РБМК",
                           description="Аварии на АЭС с реакторами РБМК", pages=pages)


@wiki.route("/delete_page")
def delete_new_page():
    pass


@wiki.route("/edit/<name_page>")
def edit_page_wiki(name_page):
    db_sess = db_session.create_session()
    page = db_sess.query(Page).filter(Page.name_english == name_page).first()
    db_sess.close()
    if page is None or not (current_user.is_authenticated and current_user.admin):
        return abort(404)
    file = open(f"templates/wiki/data/{page.file_name}", mode="r")
    html_text = file.read()
    file.close()
    return render_template(f"/wiki/edit_page.html", page=page,  title="Редактирование страницы",
                           description="Редактирование страницы", html_text=html_text)


@wiki.route("/bad_info", methods=["GET"])
def bad_info_get():
    return render_template("/wiki/bad_info.html", title="Энциклопедия РБМК",
                           description="")


@wiki.route("/bad_info", methods=["POST"])
def bad_info_post():
    db_sess = db_session.create_session()
    bi = BadInfo()
    bi.url_page = request.form["url_page"]
    bi.about = request.form["about"]
    db_sess.add(bi)
    db_sess.commit()
    db_sess.close()
    return redirect("/wiki")


@wiki.route("/search", methods=["POST"])
def search_def():
    db_sess = db_session.create_session()
    pages = db_sess.query(Page).all()
    db_sess.close()
    p = []
    for page in pages:
        if request.form["search_text"] in page.name or request.form["search_text"] in page.description:
            p.append(page)
    return render_template("/wiki/searche.html", pages=p)


@wiki.route("/send_img", methods=["POST"])
def send_img():
    if current_user.is_authenticated and current_user.admin:
        f = request.files["img"]
        file = open(f"static/img/wiki/{f.filename}", mode="wb")
        file.write(f.read())
        file.close()
        return redirect("/wiki")
    return redirect("/login")
