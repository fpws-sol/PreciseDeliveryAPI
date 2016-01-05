var express = require('express');
var DriverModel = require('../models/DriverModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');



router.get('/', auth.authorize, function (req, res, next) {
    DriverModel.find({
        "isactive": true,
        "isdeleted": false
    }).populate(["categories"]).exec(function (err, drivers) {
        if (err) {
            return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
        }
        else {
            return res.send(messages.CustomExceptionHandler("success", drivers, req.headers.responsetype));
        }
    });
});


router.get('/:id', auth.authorize, function (req, res, next) {
    var _driverid = req.params.id;
    DriverModel.findOne({
        "_id": _driverid,
        "isactive": true,
        "isdeleted": false
    }).populate(["categories"]).exec(function (err, driver) {
        if (err) {
            return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
        }
        else {
            return res.send(messages.CustomExceptionHandler("success", driver, req.headers.responsetype));
        }
    })
});


router.post('/', auth.authorize, function (req, res, next) {
    req.check('title', 'driver title should not be blank.').notEmpty();

    var title = req.body.title;  
    var categories = req.body.categories;
    var routedriver = req.body.routedriver;
    var routedrivercellno = req.body.routedrivercellno;
    var routenotes = req.body.routenotes;
   


    var errors = req.validationErrors();
    if (errors) {

        return res.send(messages.CustomExceptionHandler("requiredparams", errors, req.headers.responsetype));
    } else {

        DriverModel.findOne({
            "title": title,
            "isactive": true,
            "isdeleted": false
        }, function (err, driverExist) {
            if (err) {
                return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
            }
            else if (driverExist) {
                return res.send(messages.CustomExceptionHandler("duplicatecheck", "driver title already exists", req.headers.responsetype));
            }
            else {
                var _newdriver = new DriverModel({
                    'title': title,
                    'categories': categories,
                    'routedriver': routedriver,
                    'routedrivercellno': routedrivercellno,
                    'routenotes': routenotes

                });
                _newdriver.save(function (error) {
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
    req.check('title', 'title should not be blank.').notEmpty();

    var _driverid = req.body.id;
    var title = req.body.title;
    var categories = req.body.categories;
    var routedriver = req.body.routedriver;
    var routedrivercellno = req.body.routedrivercellno;
    var routenotes = req.body.routenotes;
    var isdeleted = req.body.isdeleted;
    var isactive = req.body.isactive;
    var errors = req.validationErrors();
    if (errors) {

        return res.send(messages.CustomExceptionHandler("requiredparams", errors, req.headers.responsetype));

    } else {
        DriverModel.findOne({
            "title": title,
            "isactive": true,
            "isdeleted": false,
            '_id': { $ne: _driverid }
        }, function (err, driverExist) {
            if (err) {
                return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
            }
            else if (driverExist) {
                return res.send(messages.CustomExceptionHandler("duplicatecheck", "driver already exists", req.headers.responsetype));
            }
            else {
                DriverModel.findOne({
                    '_id': _driverid
                }, function (error, finddriver) {
                    if (error) {
                        return res.send(messages.CustomExceptionHandler("systemerror", error.message, req.headers.responsetype));
                    }
                    else if (finddriver) {
                        DriverModel.update({
                            '_id': _driverid
                        }, {
                            $set: {
                                'title': title,
                                'categories': categories,
                                'routedriver': routedriver,
                                'routedrivercellno': routedrivercellno,
                                'routenotes': routenotes,                             
                                'isdeleted': isdeleted,
                                'isactive': isactive
                            }
                        }, function (errupdate, driverupdate) {
                            if (errupdate)
                                return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message, req.headers.responsetype));
                            else
                                return res.send(messages.CustomExceptionHandler("success", "Successfully Updated", req.headers.responsetype));
                        });
                    }
                    else {
                        return res.send(messages.CustomExceptionHandler("authorization", "driver could not found!", req.headers.responsetype));
                    }
                });
            }
        });
    }

});


router.delete('/:driverid', auth.authorize, function (req, res, next) {
    var _driverid = req.params.driverid;
    DriverModel.findOne({ '_id': _driverid }, function (err, driverExist) {
        if (err) {
            return res.send(messages.CustomExceptionHandler("systemerror", err.message, req.headers.responsetype));
        }
        else if (driverExist) {
            DriverModel.update({
                '_id': _driverid
            }, {
                $set: {
                    'isdeleted': true
                }
            }, function (errupdate, _driverupdate) {
                if (errupdate)
                    return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message, req.headers.responsetype));
                else
                    return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.", req.headers.responsetype));
            });
        }
        else {
            return res.send(messages.CustomExceptionHandler("authorization", "driver could not found!", req.headers.responsetype));
        }
    });
});



module.exports = router;