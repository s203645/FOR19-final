from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
import os
import flask
from app.models import User, db

application = Flask(__name__)

### Code GitHub
application.config['SECRET_KEY'] = "80e49e4bea0c03d64cc40d37f11535b85e93880b43c8c053"

#DBVAR = 'postgresql://postgres:FOR19postgres@awseb-e-9vb4b2xpis-stack-awsebrdsdatabase-12gbvbbuwa1e.cjzkzwbxwvyy.us-east-1.rds.amazonaws.com:5432/ebdb'
#application.config['SQLALCHEMY_DATABASE_URI'] = DBVAR 
#application.config['SQLALCHEMY_BINDS'] ={'transport': DBVAR}

application.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@127.0.0.1/for19' 

application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
application.config['SQLALCHEMY_POOL_SIZE'] = 50
application.config['SQLALCHEMY_MAX_OVERFLOW'] = 50
application.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False # No debug intercepts
### Code computer
# application.config['SECRET_KEY'] = '3oueqkfdfas8ruewqndr8ewrewrouewrere44554'
# DBVAR = 'sqlite:///user.db'
# application.config['SQLALCHEMY_DATABASE_URI'] = DBVAR
# application.config['SQLALCHEMY_BINDS'] ={'transport': 'sqlite:///transport.db'}


bcrypt = Bcrypt(application)
login_manager= LoginManager(application)
login_manager.login_view = 'users.login'
login_manager.login_message_category = 'info'

with application.app_context():
    db.init_app(application)
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.query.filter(User.id == user_id).first()

from app.home.routes import home
from app.methodology.routes import methodology
from app.carbon_app.routes import carbon_app
from app.users.routes import users

application.register_blueprint(home)
application.register_blueprint(methodology)
application.register_blueprint(carbon_app)
application.register_blueprint(users)

@application.errorhandler(404)
def error(e):
    return flask.render_template('404.html') 

    
