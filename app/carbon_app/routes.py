from flask import render_template, Blueprint, request, redirect, url_for, flash, jsonify
from app.models import Transport
from app import db
from datetime import timedelta, datetime
from flask_login import login_required, current_user
import flask
from sqlalchemy import cast, Date, func

carbon_app=Blueprint('carbon_app',__name__)

efco2={

        'Bus':{'Diesel':0.10231,'CNG':0.08,'Petrol':0.10231,'No Fossil Fuel':0},
        'Car':{'Petrol':0.18592,'Diesel':0.16453,'No Fossil Fuel':0, 'Electric':0},
        'Bus':{'Diesel':0.10231,'CNG':0.08,'Petrol':0.10231,'No Fossil Fuel':0, 'Electric':0},
        'Car':{'Petrol':0.18592,'Diesel':0.16453,'No Fossil Fuel':0,    'Electric':0},
        'Plane':{'Petrol':0.24298},
        'Ferry':{'Diesel':0.11131, 'CNG':0.1131, 'No Fossil Fuel':0},
        'Motorbike':{'Petrol':0.09816,'No Fossil Fuel':0},
        'Scooter':{'No Fossil Fuel':0},
        'Bicycle':{'No Fossil Fuel':0},
        'Walk':{'No Fossil Fuel':0}
    }

efch4={
        'Bus':{'Diesel':2e-5,'CNG':2.5e-3,'Petrol':2e-5,'No Fossil Fuel':0},
        'Bus':{'Diesel':2e-5,'CNG':2.5e-3,'Petrol':2e-5,'No Fossil Fuel':0, 'Electric':0},
        'Car':{'Petrol':3.1e-4,'Diesel':3e-6,'No Fossil Fuel':0, 'Electric':0},
        'Plane':{'Petrol':1.1e-4},
        'Ferry':{'Diesel':3e-5, 'CNG':3e-5,'No Fossil Fuel':0},
        'Motorbike':{'Petrol':2.1e-3,'No Fossil Fuel':0},
        'Scooter':{'No Fossil Fuel':0},
        'Bicycle':{'No Fossil Fuel':0},
        'Walk':{'No Fossil Fuel':0}
    }

transport_dict = {
    'bus': 'Bus',
    'car': 'Car',
    'plane': 'Plane',
    'ferry': 'Ferry',
    'motorcycle': 'Motorbike',
    'bicycle': 'Bicycle',
    'person-walking': 'Walk',
    'train': 'Train'
}

@carbon_app.route("/carbon_app")
def carbon_application():
    return render_template("carbon_app.html")

@carbon_app.route("/my_data/<arg>")
def my_data(arg):
    if int(arg) == 1:
        emissions_by_transport = db.session.query(db.func.sum(Transport.total), Transport.transport). \
            filter(Transport.date > (datetime.now() - timedelta(days=5))).filter_by(user_id=current_user.id). \
            group_by(Transport.transport).order_by(Transport.transport.asc()).all()
        emissions_by_transport_dict = {'labels': [], 'values': []}
        for i in emissions_by_transport:
            emissions_by_transport_dict['labels'].append(i[1])
            emissions_by_transport_dict['values'].append(i[0])
        return jsonify(emissions_by_transport_dict)
    elif int(arg) == 2:
        emissions_by_date = db.session.query(db.func.sum(Transport.total), Transport.date). \
            filter(Transport.date > (datetime.now() - timedelta(days=5))).filter_by(user_id=current_user.id). \
            group_by(Transport.date).order_by(Transport.date.asc()).all()
        print(emissions_by_date)
        over_time_emissions = {'labels': [], 'values': []}
        for total, date in emissions_by_date:
            over_time_emissions['labels'].append(date.strftime("%m-%d-%y"))
            over_time_emissions['values'].append(total)
        print(over_time_emissions)
        return jsonify(over_time_emissions)
    elif int(arg) == 3:
        kms_by_transport = db.session.query(db.func.sum(Transport.kms), Transport.transport). \
        filter(Transport.date > (datetime.now() - timedelta(days=5))).filter_by(user_id=current_user.id). \
        group_by(Transport.transport).order_by(Transport.transport.asc()).all()
        kms_by_transport_dict = {'labels': [], 'values': []}
        for i in kms_by_transport:
            kms_by_transport_dict['labels'].append(i[1])
            kms_by_transport_dict['values'].append(i[0])    
        return jsonify(kms_by_transport_dict)
    elif int(arg) == 4:
        print('here')
        kms_by_date = db.session.query(db.func.sum(Transport.kms), Transport.date). \
        filter(Transport.date > (datetime.now() - timedelta(days=5))).filter_by(user_id=current_user.id). \
        group_by(Transport.date).order_by(Transport.date.asc()).all()
        over_time_kms = {'labels': [], 'values': []}
        for total, date in kms_by_date:
            over_time_kms['labels'].append(date.strftime("%m-%d-%y"))
            over_time_kms['values'].append(total)
        return jsonify(over_time_kms)

    #return jsonify(emissions_by_transport_dict)
  
@carbon_app.route("/newEntry", methods=['GET', 'POST'])
@login_required
def newEntry():
    if request.method == 'POST':
        data = request.form
        transport = transport_dict[data['transport']]
        co2 = float(data['kms']) * efco2[transport][data['fuel']]
        ch4 = float(data['kms']) * efch4[transport][data['fuel']]
        emissions = Transport(data['kms'],transport, data['fuel'], co2, ch4, co2+ch4, current_user.id)
        db.session.add(emissions)
        db.session.commit()
        return jsonify({'success': "Data received successfully!"})

    return render_template("new_entry.html")