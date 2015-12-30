var express = require('express');
var LabModel = require('../models/LabModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');



router.get('/',auth.authorize, function(req, res, next) {
    LabModel.find({
        "isactive": true,
        "isdeleted": false
    }, function(err, labs) {
        if (err)
		{
			return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
		}
        else
		{
			return res.send(messages.CustomExceptionHandler("success", labs,req.headers.responsetype));
		}
    });
});


router.get('/:id',auth.authorize, function(req, res, next) {
    var _labid = req.params.id;
    LabModel.findOne({
        "_id": _labid,
         "isactive": true,
        "isdeleted": false
    }, function(err, lab) {
        if (err)
		{
			return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
		}
        else
		{
			return res.send(messages.CustomExceptionHandler("success", lab,req.headers.responsetype));
		}
    })
});


router.post('/',auth.authorize, function(req, res, next) {	
	req.check('title', 'Title should not be blank.').notEmpty();	
	req.check('deliveryprice', 'delivery price should be number.').isInt();
	req.check('includedpackages', 'included packages should be number.').isInt();
	req.check('weeklyservicefee', 'weekly service fee should be number.').isInt();
	req.check('additionalpackageprice', 'additional package price should be number.').isInt();
	
	var title = req.body.title;
	var name = req.body.name;
	var streetaddress1 = req.body.streetaddress1;
	var streetaddress2 = req.body.streetaddress2;
	var city = req.body.city;
	var state = req.body.state;
	var zip = req.body.zip;
	var phonenumber = req.body.phonenumber;
	var deliveryprice = req.body.deliveryprice;
	var additionalpackageprice = req.body.additionalpackageprice;
	var includedpackages = req.body.includedpackages;
	var weeklyservicefee = req.body.weeklyservicefee;
	
	var errors = req.validationErrors();
	if (errors) {
	
            return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	}else{
	    
	    LabModel.findOne({
		"title":title,
		 "isactive": true,
         "isdeleted": false
		}, function (err, labExist) { 
		    if(err) 
		    {
			return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
		    }
		    else if(labExist)
		    {
			return res.send(messages.CustomExceptionHandler("duplicatecheck", "Lab Title already exists",req.headers.responsetype));
		    }
		    else
		    {
			var _newLab = new LabModel({
			    'title': title,
			    'name':name,
			    'streetaddress1':streetaddress1,
			    'streetaddress2': streetaddress2,
			    'city':city,
			    'state':state,
			    'zip': zip,
			    'phonenumber':phonenumber,
			    'deliveryprice':deliveryprice,
			    'additionalpackageprice':additionalpackageprice,
			    'includedpackages': includedpackages,
			    'weeklyservicefee':weeklyservicefee
			});
			_newLab.save(function(error){        
			    if (error)        
				return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
			    else
				return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted",req.headers.responsetype));
			});
		    }
	    });
	}
	
});


router.put('/',auth.authorize, function(req, res, next) {
    req.check('title', 'Title should not be blank.').notEmpty();	
    req.check('deliveryprice', 'delivery price should be number.').isInt();
	req.check('includedpackages', 'included packages should be number.').isInt();
	req.check('weeklyservicefee', 'weekly service fee should be number.').isInt();
	req.check('additionalpackageprice', 'additional package price should be number.').isInt();
    var _labid = req.body.id;
	var title = req.body.title;
	var name = req.body.name;
	var streetaddress1 = req.body.streetaddress1;
	var streetaddress2 = req.body.streetaddress2;
	var city = req.body.city;
	var state = req.body.state;
	var zip = req.body.zip;
	var phonenumber = req.body.phonenumber;
	var deliveryprice = req.body.deliveryprice;
	var includedpackages = req.body.includedpackages;
	var additionalpackageprice = req.body.additionalpackageprice;
	var weeklyservicefee = req.body.weeklyservicefee;
    var isdeleted = req.body.isdeleted; 
    var isactive = req.body.isactive;
    var errors = req.validationErrors();
    if (errors) {
	
        return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
    }else{
	LabModel.findOne({
		"title":name,
		 "isactive": true,
         "isdeleted": false,
		'_id':{$ne:_labid}
	    }, function (err, labExist){
		if (err) 
		{
			return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype)); 
		}
		else if(labExist)
		{
			return res.send(messages.CustomExceptionHandler("duplicatecheck", "Lab already exists",req.headers.responsetype));
		}
		else
		{
		    LabModel.findOne({
			    '_id':_labid
			}, function (error, findLab) {
			    if (error) 
			    {
				return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype)); 
			    }
			    else if(findLab)
			    {
				LabModel.update({
				    '_id': _labid
				},{
				    $set: {		
					'title': title,
				    'name':name,
				    'streetaddress1':streetaddress1,
				    'streetaddress2': streetaddress2,
				    'city':city,
				    'state':state,
				    'zip': zip,
				    'phonenumber':phonenumber,
				    'deliveryprice':deliveryprice,
				    'includedpackages': includedpackages,
				    'additionalpackageprice': additionalpackageprice,
				    'weeklyservicefee':weeklyservicefee,
					'isdeleted':isdeleted,
					'isactive':isactive
				    }
				},function(errupdate, Labupdate) {
				    if (errupdate)       
					return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype)); 
				    else
					return res.send(messages.CustomExceptionHandler("success", "Successfully Updated",req.headers.responsetype));
				});
			    }
			    else
			    {
					return res.send(messages.CustomExceptionHandler("authorization", "Lab could not found!",req.headers.responsetype));
			    }
		    });
		}
	});
    }
    
});


router.delete('/:labid',auth.authorize, function(req, res, next) {
    var _labid = req.params.labid;
	LabModel.findOne({'_id':_labid},function(err,labExist){
	    if (err) 
	    {
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));  
	    }
	    else if(labExist)
	    {
		    LabModel.update({
				'_id': _labid
		    },{
			$set: {		
			  'isdeleted': true
			}
		    },function(errupdate, _labupdate) {
			    if (errupdate)       
				return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype)); 
			    else
				return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		    });
	    }
	    else
	    {
		    return res.send(messages.CustomExceptionHandler("authorization", "Lab could not found!",req.headers.responsetype));
	    }
	});
});



module.exports = router;