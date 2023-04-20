from flask import render_template, Blueprint, redirect, flash, url_for, request, session
from app.users.forms import RegistrationForm, LoginForm
from app.models import User
from app import db, bcrypt
from flask_login import login_user, current_user, logout_user
import flask 

users=Blueprint('users',__name__)
@users.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        data = request.form
        print(f"Username: {data['email']}")
        print(f"Password: {data['password']}")

        if User.valid_login(data["email"], data["password"]) != None:    
            login_user(User.valid_login(data["email"], data["password"]))
            flash(f'Login successful! Welcome back, {current_user.username}')
            session['logged_in'] = True
            return flask.redirect("/")
        else:
            flash("Login failed. Please enter correct email and password.")
            return flask.redirect('/login')
    else:
        return flask.render_template('login.html')

@users.route("/register", methods=["POST", "GET"])
def register():
    if request.method == "POST":
        data = request.form
        new_user = User((data["f:name"] +" " + data["l:name"]), data['email'], data['password'])
        db.session.add(new_user)
        db.session.commit()
        login_user(User.valid_login(data["email"], data["password"]))
        flash(f'Your registration was successful! Welcome to our Carbon App, {current_user.username}')
        session['logged_in'] = True
        return flask.redirect("/")
    return flask.render_template('register.html')

@users.route("/logout",  methods=['POST', 'GET'])
def logout():
    logout_user()
    session.clear()
    flash("Logout successful.")
    return flask.redirect("/")
