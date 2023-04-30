from flask import render_template, Blueprint, request, redirect, url_for, flash, jsonify
from app.models import Transport
from app import db
from datetime import timedelta, datetime
from flask_login import login_required, current_user
import flask
from sqlalchemy import cast, Date, func, distinct

carbon_app=Blueprint('carbon_app',__name__)

efco2={
        'Walk':{'No Fossil Fuel':0},
        'Bicycle':{'No Fossil Fuel':0},
        'Ferry':{'Diesel':0.019},
        'Train':{'Diesel':0.041,'Electric':0},
        'Car':{'Diesel':0.171, 'Gasoline':0.192, 'Hybrid':0.109, 'Electric':0.053},
        'Motorbike':{'Gasoline':0.103},
        'Bus':{'Diesel':0.105,'Electric':0},
        'Long distance flight':{'Jet Fuel':0.150},
        'Domestic flight':{'Jet Fuel':0.255},
        'Light rail and tram':{'Electric':0.035}
    }

efch4={
        'Walk':{'No Fossil Fuel':0},
        'Bicycle':{'No Fossil Fuel':0},
        'Ferry':{'Diesel':0},
        'Train':{'Diesel':0,'Electric':0},
        'Car':{'Diesel':0, 'Gasoline':0, 'Hybrid':0, 'Electric':0},
        'Motorbike':{'Gasoline':0,'No Fossil Fuel':0},
        'Bus':{'Diesel':0,'Electric':0},
        'Long distance flight':{'Jet Fuel':0},
        'Domestic flight':{'Jet Fuel':0},
        'Light rail and tram':{'Electric':0}
     }

transport_dict = {
    'bus': 'Bus',
    'car': 'Car',
    'plane': 'Long distance flight',
    'plane-up': 'Domestic flight',
    'ferry': 'Ferry',
    'motorcycle': 'Motorbike',
    'bicycle': 'Bicycle',
    'person-walking': 'Walk',
    'train': 'Train',
    'train-tram': 'Light rail and tram'
}

@carbon_app.route("/carbon_app")
@login_required
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
        emissions_by_date = db.session.query(db.func.sum(Transport.total), func.date(Transport.date)). \
            filter(Transport.date > (datetime.now() - timedelta(days=5))).filter_by(user_id=current_user.id). \
            group_by(func.date(Transport.date)).order_by(func.date(Transport.date).asc()).all()
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
        kms_by_date = db.session.query(db.func.sum(Transport.kms), func.date(Transport.date)). \
        filter(Transport.date > (datetime.now() - timedelta(days=5))).filter_by(user_id=current_user.id). \
        group_by(func.date(Transport.date)).order_by(func.date(Transport.date).asc()).all()
        over_time_kms = {'labels': [], 'values': []}
        for total, date in kms_by_date:
            over_time_kms['labels'].append(date.strftime("%m-%d-%y"))
            over_time_kms['values'].append(total)
        return jsonify(over_time_kms)
    elif int(arg) == 5:
        data = db.session.query(Transport.user_id, Transport.date, Transport.kms, Transport.transport, Transport.fuel, Transport.co2, Transport.ch4, Transport.total, Transport.id). \
        filter(Transport.user_id ==  current_user.id).order_by(Transport.date.desc()).limit(10)
        list_data = []
        for i in data:
            list_data.append((i[0], str(i[1]), i[2], i[3], i[4], i[5], i[6], i[7], i[8]))
        print(list_data)
        return jsonify(list_data) 


    #return jsonify(emissions_by_transport_dict)
  
@carbon_app.route("/newEntry", methods=['GET', 'POST'])
@login_required
def newEntry():
    if request.method == 'POST':
        try:
            data = request.form
            transport = transport_dict[data['transport']]
            co2 = float(data['kms']) * efco2[transport][data['fuel']]
            ch4 = float(data['kms']) * efch4[transport][data['fuel']]
            emissions = Transport(data['kms'],transport, data['fuel'], co2, ch4, co2+ch4, current_user.id)
            db.session.add(emissions)
            db.session.commit()
            return jsonify({'success': "Data received successfully!"})
        except Exception as e:
            return jsonify({'error': str(e)})
    return render_template("new_entry.html")

@carbon_app.route("/deleteEntry", methods=['GET', 'POST'])
@login_required
def deleteEntry():
    if request.method == "POST":
        #I want to delete an mysel entry
        try:
            data = request.form
            entry = Transport.query.filter_by(id=data['id']).first()
            db.session.delete(entry)
            db.session.commit()
            return jsonify({'success': "Entry deleted successfully!"})
        except Exception as e:
            return jsonify({'error': str(e)})
    