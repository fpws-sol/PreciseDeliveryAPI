var express = require('express');
var DeliveryModel = require('../models/DeliveryModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');
var mongoose = require('mongoose');



/*router.get('/', auth.authorize, function (req, res, next) {
    DeliveryModel.find({
        "isactive": true,
        "isdeleted": false
    }).populate(["route","deliverydetails.doctors","deliverydetails.doctors.lab"]).exec(function (err, deliveries) {
        if (err) {
            return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
        }
        else {
            return res.send(messages.CustomExceptionHandler("success", deliveries, req.headers.responsetype));
        }
    });
});*/


router.get('/', auth.authorize, function (req, res, next) {
    /*DeliveryModel.find({
        "isactive": true,
        "isdeleted": false
    }).populate(["route","deliverydetails.doctors","deliverydetails.doctors.lab"]).exec(function (err, deliveries) {
        if (err) {
            return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
        }
        else {
            return res.send(messages.CustomExceptionHandler("success", deliveries, req.headers.responsetype));
        }
    });*/

    DeliveryModel.find()
  .lean()
  .populate(["route","deliverydetails.doctors"])
  .exec(function(err, docs) {

    var options = {
      path: "deliverydetails.doctors.lab",
      model: 'labs'
    };

    if (err)  return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
    DeliveryModel.populate(docs, options, function (err, projects) {
       return res.send(messages.CustomExceptionHandler("success", projects, req.headers.responsetype));
    });
  });
});




router.get('/:id', auth.authorize, function (req, res, next) {
    var _deliveryid = req.params.id;
    DeliveryModel.findOne({
        "_id": _deliveryid,
        "isactive": true,
        "isdeleted": false
    }).populate(["route","deliverydetails.doctors","deliverydetails.doctors","deliverydetails.doctors.lab"]).exec(function (err, delivery) {
        if (err) {
            return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
        }
        else {
            return res.send(messages.CustomExceptionHandler("success", delivery, req.headers.responsetype));
        }
    })
});



router.post('/', auth.authorize, function (req, res, next) {
    req.check('deliverydate', 'Delivery date should not be blank.').notEmpty();

    var deliverydate = req.body.deliverydate;
    var route = req.body.route;
    var deliverydetails = req.body.deliverydetails;


    var errors = req.validationErrors();
    if (errors) {

        return res.send(messages.CustomExceptionHandler("requiredparams", errors, req.headers.responsetype));
    } else {

        DeliveryModel.findOne({
            "deliverydate": deliverydate,
            "route":route,
            "isactive": true,
            "isdeleted": false
        }, function (err, deliveryExist) {
            if (err) {
                return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
            }
            else if (deliveryExist) {
                return res.send(messages.CustomExceptionHandler("duplicatecheck", "delivery date already exists for this selected route", req.headers.responsetype));
            }
            else {
                var _newDelivery = new DeliveryModel({
                    'deliverydate': deliverydate,
                    'deliverydetails': deliverydetails,
                     'route':route,

                });
                _newDelivery.save(function (error) {
                    if (error)
                        return res.send(messages.CustomExceptionHandler("systemerror", error.message, req.headers.responsetype));
                    else
                        return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted", req.headers.responsetype));
                });
            }
        });
    }

});


router.put('/', auth.authorize, function (req, res, next) {
    req.check('deliverydate', 'Delivery date should not be blank.').notEmpty();

    var _deliveryid = req.body.id;
    var deliverydate = req.body.deliverydate; 
    var route = req.body.route;    
    var deliverydetails = req.body.deliverydetails;
    var isdeleted = req.body.isdeleted;
    var isactive = req.body.isactive;
    var errors = req.validationErrors();
    if (errors) {
     
        return res.send(messages.CustomExceptionHandler("requiredparams", errors, req.headers.responsetype));

    } else {
        DeliveryModel.findOne({
            "deliverydate": deliverydate,
             "route": route,
            "isactive": true,
            "isdeleted": false,
            '_id': { $ne: _deliveryid }
        }, function (err, deliveryExist) {
            if (err) {
                return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
            }
            else if (deliveryExist) {
                return res.send(messages.CustomExceptionHandler("duplicatecheck", "delivery date already exists", req.headers.responsetype));
            }
            else {
                DeliveryModel.findOne({
                    '_id': _deliveryid
                }, function (error, finddoctor) {
                    if (error) {
                        return res.send(messages.CustomExceptionHandler("systemerror", error.message, req.headers.responsetype));
                    }
                    else if (finddoctor) {
                        DeliveryModel.update({
                            '_id': _deliveryid
                        }, {
                            $set: {
                                'deliverydate': deliverydate,
                                'deliverydetails': deliverydetails, 
                                 "route": route,                               
                                'isdeleted': isdeleted,
                                'isactive': isactive
                            }
                        }, function (errupdate, doctorupdate) {
                            if (errupdate)
                                return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message, req.headers.responsetype));
                            else
                                return res.send(messages.CustomExceptionHandler("success", "Successfully Updated", req.headers.responsetype));
                        });
                    }
                    else {
                        return res.send(messages.CustomExceptionHandler("authorization", "doctor could not found!", req.headers.responsetype));
                    }
                });
            }
        });
    }

});


router.delete('/:deliveryid', auth.authorize, function (req, res, next) {
    var _deliveryid = req.params.deliveryid;
    DeliveryModel.findOne({ '_id': _deliveryid }, function (err, deliveryExist) {
        if (err) {
            return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
        }
        else if (_deliveryid) {
            DeliveryModel.update({
                '_id': _deliveryid
            }, {
                $set: {
                    'isdeleted': true
                }
            }, function (errupdate, _deliveryupdate) {
                if (errupdate)
                    return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message, req.headers.responsetype));
                else
                    return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.", req.headers.responsetype));
            });
        }
        else {
            return res.send(messages.CustomExceptionHandler("authorization", "delivery could not found!", req.headers.responsetype));
        }
    });
});



module.exports = router;