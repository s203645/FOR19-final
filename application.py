import flask 
from flask import request, flash, render_template 
import random
from db import User, Users

application = flask.Flask(__name__)

application.secret_key = "80e49e4bea0c03d64cc40d37f11535b85e93880b43c8c053"
DEV_PORT = 5000
PRO_PORT = 80

DEV_HOST = "localhost"
PRO_HOST = "0.0.0.0"

#mode = "production"
mode = "development"

users = [ ]

@application.route("/", methods=['POST', 'GET'])
def home():
    names = ['Christian', 'Richard', 'Sara', 'Per Ole', 'Jon']
    name = names[round(random.randint(0,4))]
    return flask.render_template('home.html', name=name)

@application.route("/methodology")
def methodology():
    return flask.render_template("methodology.html")

@application.route("/carbon_app", methods=['POST', 'GET'])
def carbon_application():
    return flask.render_template("carbon_app.html")

@application.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        data = request.form
        print(f"Username: {data['email']}")
        print(f"Username: {data['password']}")

        if users.valid_login(data["email"], data["password"]):    
            flash(f'Your login was successful! Welcome to our Carbon App, {users.get_full_name(data["email"])}!')
            return flask.redirect("/")
        else:
            flash("Login failed. Please enter correct email and password.")
            return flask.redirect('login')
    return flask.render_template('login.html')

@application.route("/register", methods=["POST", "GET"])
def register():
    if request.method == "POST":
        data = request.form
        print(f"First Name: {data['f:name']}")
        print(f"Last Name: {data['l:name']}")
        print(f"Email: {data['email']}")
        print(f"Password: {data['password']}")
        new_user = User(data["f:name"], data["l:name"], data['email'], data['password'])
        users.add(new_user)

    return flask.render_template('register.html')

@application.route("/my_data")
def my_data():
    return flask.render_template("my_data.html")

@application.errorhandler(404)
def error(e):
    return flask.render_template('404.html') 

if __name__ == "__main__":
    users = Users()
    if mode == "production":
        application.run(port=PRO_HOST, host=DEV_HOST)
    else:
        application.run(port=DEV_PORT, host=DEV_HOST, debug=True)