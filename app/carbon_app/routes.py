from flask import render_template, Blueprint, request, redirect, url_for, flash
from app.models import Transport
from app import db
from datetime import timedelta, datetime
from flask_login import login_required, current_user
from app.carbon_app.forms import BusForm, CarForm, PlaneForm, FerryForm, MotorbikeForm, BicycleForm, WalkForm
import flask

carbon_app=Blueprint('carbon_app',__name__)

efco2={
        'Bus':{'Diesel':0.10231,'CNG':0.08,'Petrol':0.10231,'No Fossil Fuel':0},
        'Car':{'Petrol':0.18592,'Diesel':0.16453,'No Fossil Fuel':0},
        'Plane':{'Petrol':0.24298},
        'Ferry':{'Diesel':0.11131, 'CNG':0.1131, 'No Fossil Fuel':0},
        'Motorbike':{'Petrol':0.09816,'No Fossil Fuel':0},
        'Scooter':{'No Fossil Fuel':0},
        'Bicycle':{'No Fossil Fuel':0},
        'Walk':{'No Fossil Fuel':0}
    }

efch4={
        'Bus':{'Diesel':2e-5,'CNG':2.5e-3,'Petrol':2e-5,'No Fossil Fuel':0},
        'Car':{'Petrol':3.1e-4,'Diesel':3e-6,'No Fossil Fuel':0},
        'Plane':{'Petrol':1.1e-4},
        'Ferry':{'Diesel':3e-5, 'CNG':3e-5,'No Fossil Fuel':0},
        'Motorbike':{'Petrol':2.1e-3,'No Fossil Fuel':0},
        'Scooter':{'No Fossil Fuel':0},
        'Bicycle':{'No Fossil Fuel':0},
        'Walk':{'No Fossil Fuel':0}
    }

@carbon_app.route("/carbon_app")
def carbon_application():
    return render_template("carbon_app.html")

@carbon_app.route("/my_data")
def my_data():
    return render_template("my_data.html")
  
@carbon_app.route("/new_entry", methods=['GET', 'POST'])
def new_entry():
    if request.method == 'POST':
        data = request.form['data']

    return render_template("new_entry.html")