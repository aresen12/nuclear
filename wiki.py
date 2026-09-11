from flask import (
    Blueprint, redirect, render_template, request, abort
)
from data import db_session
from data.user import User
from flask_login import current_user
from data.pages import Page
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
        return render_template("/wiki/new_page.html")
    else:
        db_sess = db_session.create_session()
        page = Page()
        page.name = request.form["name"]
        page.description = request.form["description"]
        page.id_writer = current_user.id
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


@wiki.route("/<name_page>")
def page_wiki(name_page):
    db_sess = db_session.create_session()
    page = db_sess.query(Page).filter(Page.name_english == name_page).first()
    db_sess.close()
    print(page.file_name)
    if page is None:
        return abort(404)
    return render_template(f"/wiki/data/{page.file_name}", title=page.name,
                           description=page.description)


@wiki.route("/delete_new_page")
def delete_new_page():
    pass