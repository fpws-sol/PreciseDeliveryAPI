var express = require('express');
var UserRolesModel = require('../models/UserRolesModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');


router.get('/', function(req, res, next) {
    UserRolesModel.find({
        "isactive": true,
        "isdeleted": false
    }, function(err, userroles) {
        if (err)
		{
			return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
		}
        else
		{
			return res.send(messages.CustomExceptionHandler("success", userroles,req.headers.responsetype));
		}
    });
});


router.get('/:id', function(req, res, next) {
    var _userroleid = req.params.id;
    UserRolesModel.findOne({
        "_id": _userroleid
    }, function(err, userrole) {
        if (err)
		{
			return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
		}
        else
		{
			return res.send(messages.CustomExceptionHandler("success", userrole,req.headers.responsetype));
		}
    })
});


router.post('/', function(req, res, next) {	
	req.check('name', 'Name should not be blank.').notEmpty();
	req.check('userid', 'User should not be blank.').notEmpty();
	var name = req.body.name;
	var addedby = req.body.userid;
	var modifiedby = req.body.userid;
	var errors = req.validationErrors();
	if (errors) {
	
            return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	}else{
	    
	    UserRolesModel.findOne({
		"name":name,
		 "isactive": true,
         "isdeleted": false
		}, function (err, userroleExist) { 
		    if(err) 
		    {
			return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
		    }
		    else if(userroleExist)
		    {
			return res.send(messages.CustomExceptionHandler("duplicatecheck", "User-role already exists",req.headers.responsetype));
		    }
		    else
		    {
			var _newuserrole = new UserRolesModel({
			    'name': name,
			    'addedby':addedby,
			    'modifiedby':modifiedby
			});
			_newuserrole.save(function(error){        
			    if (error)        
				return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
			    else
				return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted",req.headers.responsetype));
			});
		    }
	    });
	}
	
});


router.put('/', function(req, res, next) {
    req.check('userroleid', 'Role id should not be blank.').notEmpty();
    req.check('name', 'Name should not be blank.').notEmpty();
    req.check('userid', 'User should not be blank.').notEmpty();
    req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
    req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
    var _userroleid = req.body.userroleid;
    var name = req.body.name;
    var modifiedby = req.body.userid; 
    var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
    var isdeleted = req.body.isdeleted; 
    var isactive = req.body.isactive;
    var errors = req.validationErrors();
    if (errors) {
	
        return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
    }else{
	UserRolesModel.findOne({
		"name":name,
		 "isactive": true,
         "isdeleted": false,
		'_id':{$ne:_userroleid}
	    }, function (err, userroleExist){
		if (err) 
		{
			return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype)); 
		}
		else if(userroleExist)
		{
			return res.send(messages.CustomExceptionHandler("duplicatecheck", "User-role already exists",req.headers.responsetype));
		}
		else
		{
		    UserRolesModel.findOne({
			    '_id':_userroleid
			}, function (error, finduserrole) {
			    if (error) 
			    {
				return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype)); 
			    }
			    else if(finduserrole)
			    {
				UserRolesModel.update({
				    '_id': _userroleid
				},{
				    $set: {		
					'name': name,
					'modifiedby':modifiedby,
					'modifieddate':modifieddate,
					'isdeleted':isdeleted,
					'isactive':isactive
				    }
				},function(errupdate, userroleupdate) {
				    if (errupdate)       
					return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype)); 
				    else
					return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted",req.headers.responsetype));
				});
			    }
			    else
			    {
				return res.send(messages.CustomExceptionHandler("authorization", "User-role could not found!",req.headers.responsetype));
			    }
		    });
		}
	});
    }
    
});


router.delete('/:userroleid', function(req, res, next) {
    var _userroleid = req.params.userroleid;
	UserRolesModel.findOne({'_id':_userroleid},function(err,userroleExist){
	    if (err) 
	    {
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));  
	    }
	    else if(userroleExist)
	    {
		    UserRolesModel.update({
				'_id': _userroleid
		    },{
			$set: {		
			  'isdeleted': true
			}
		    },function(errupdate, _userroleupdate) {
			    if (errupdate)       
				return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype)); 
			    else
				return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		    });
	    }
	    else
	    {
		    return res.send(messages.CustomExceptionHandler("authorization", "User-role could not found!",req.headers.responsetype));
	    }
	});
});



module.exports = router;