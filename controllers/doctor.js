var express = require('express');
var DoctorModel = require('../models/DoctorModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');



router.get('/', auth.authorize, function (req, res, next) {
    DoctorModel.find({
        "isactive": true,
        "isdeleted": false
    }).populate(["categories","attributes.lab"]).exec(function (err, doctors) {
        if (err) {
            return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
        }
        else {
            return res.send(messages.CustomExceptionHandler("success", doctors, req.headers.responsetype));
        }
    });
});


router.get('/:id', auth.authorize, function (req, res, next) {
    var _doctorid = req.params.id;
    DoctorModel.findOne({
        "_id": _doctorid,
        "isactive": true,
        "isdeleted": false
    }).populate(["categories","attributes.lab"]).exec(function (err, doctor) {
        if (err) {
            return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
        }
        else {
            return res.send(messages.CustomExceptionHandler("success", doctor, req.headers.responsetype));
        }
    })
});


router.post('/', auth.authorize, function (req, res, next) {
    req.check('name', 'doctor name should not be blank.').notEmpty();

    var title = req.body.name;
    var streetaddress1 = req.body.streetaddress1;
    var streetaddress2 = req.body.streetaddress2;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    var phonenumber = req.body.phonenumber;
    var categories = req.body.categories;
    var attributes = req.body.attributes;


    var errors = req.validationErrors();
    if (errors) {

        return res.send(messages.CustomExceptionHandler("requiredparams", errors, req.headers.responsetype));
    } else {

        DoctorModel.findOne({
            "name": title,
            "isactive": true,
            "isdeleted": false
        }, function (err, doctorExist) {
            if (err) {
                return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
            }
            else if (doctorExist) {
                return res.send(messages.CustomExceptionHandler("duplicatecheck", "doctor name already exists", req.headers.responsetype));
            }
            else {
                var _newdoctor = new DoctorModel({
                    'name': name,
                    'streetaddress1': streetaddress1,
                    'streetaddress2': streetaddress2,
                    'city': city,
                    'state': state,
                    'zip': zip,
                    'phonenumber': phonenumber,
                    'categories': categories,
                    'attributes': attributes

                });
                _newdoctor.save(function (error) {
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
    req.check('name', 'name should not be blank.').notEmpty();

    var _doctorid = req.body.id;
    var name = req.body.name;
    var streetaddress1 = req.body.streetaddress1;
    var streetaddress2 = req.body.streetaddress2;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    var phonenumber = req.body.phonenumber;
    var categories = req.body.categories;
    var attributes = req.body.attributes;
    var isdeleted = req.body.isdeleted;
    var isactive = req.body.isactive;
    var errors = req.validationErrors();
    if (errors) {

        return res.send(messages.CustomExceptionHandler("requiredparams", errors, req.headers.responsetype));

    } else {
        DoctorModel.findOne({
            "title": name,
            "isactive": true,
            "isdeleted": false,
            '_id': { $ne: _doctorid }
        }, function (err, doctorExist) {
            if (err) {
                return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
            }
            else if (doctorExist) {
                return res.send(messages.CustomExceptionHandler("duplicatecheck", "doctor already exists", req.headers.responsetype));
            }
            else {
                DoctorModel.findOne({
                    '_id': _doctorid
                }, function (error, finddoctor) {
                    if (error) {
                        return res.send(messages.CustomExceptionHandler("systemerror", error.message, req.headers.responsetype));
                    }
                    else if (finddoctor) {
                        DoctorModel.update({
                            '_id': _doctorid
                        }, {
                            $set: {
                                'title': name,
                                'streetaddress1': streetaddress1,
                                'streetaddress2': streetaddress2,
                                'city': city,
                                'state': state,
                                'zip': zip,
                                'phonenumber': phonenumber,
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


router.delete('/:doctorid', auth.authorize, function (req, res, next) {
    var _doctorid = req.params.doctorid;
    DoctorModel.findOne({ '_id': _doctorid }, function (err, doctorExist) {
        if (err) {
            return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
        }
        else if (doctorExist) {
            DoctorModel.update({
                '_id': _doctorid
            }, {
                $set: {
                    'isdeleted': true
                }
            }, function (errupdate, _doctorupdate) {
                if (errupdate)
                    return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message, req.headers.responsetype));
                else
                    return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.", req.headers.responsetype));
            });
        }
        else {
            return res.send(messages.CustomExceptionHandler("authorization", "doctor could not found!", req.headers.responsetype));
        }
    });
});
router.get('/getdoctorbylabid/:id', auth.authorize, function (req, res, next) {
    var _labid = req.params.id;
    DoctorModel.find({
        "attributes.lab": _labid,
        "isactive": true,
        "isdeleted": false
    }).populate(["categories","attributes.lab"]).exec(function (err, doctors) {
        if (err) {
            return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
        }
        else {
            return res.send(messages.CustomExceptionHandler("success", doctors, req.headers.responsetype));
        }
    })
});


module.exports = router;