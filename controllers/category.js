var express = require('express');
var CategoryModel = require('../models/CategoryModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var util = require('util');
var expressValidator = require('express-validator');
var auth = require('../config/auth');



router.get('/',auth.authorize, function(req, res, next) {
    CategoryModel.find({
        "isactive": true,
        "isdeleted": false
    }, function(err, categories) {
        if (err)
		{
			return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
		}
        else
		{
			return res.send(messages.CustomExceptionHandler("success", categories,req.headers.responsetype));
		}
    });
});


router.get('/:id',auth.authorize, function(req, res, next) {
    var _categoryid = req.params.id;
    CategoryModel.findOne({
        "_id": _categoryid,
         "isactive": true,
        "isdeleted": false
    }, function(err, category) {
        if (err)
		{
			return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
		}
        else
		{
			return res.send(messages.CustomExceptionHandler("success", category,req.headers.responsetype));
		}
    })
});


router.post('/',auth.authorize, function(req, res, next) {	
	req.check('categoryname', 'categoryname should not be blank.').notEmpty();		
	
	var categoryname = req.body.categoryname;
	var description = req.body.description;
	var displayorder = req.body.displayorder;
	
	
	var errors = req.validationErrors();
	if (errors) {
	
            return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	}else{
	    
	    CategoryModel.findOne({
		"categoryname":categoryname,
		 "isactive": true,
         "isdeleted": false
		}, function (err, categoryExist) { 
		    if(err) 
		    {
			return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
		    }
		    else if(categoryExist)
		    {
			return res.send(messages.CustomExceptionHandler("duplicatecheck", "Category name already exists",req.headers.responsetype));
		    }
		    else
		    {
			var _newcategory = new CategoryModel({
			    'categoryname': categoryname,
			    'description':description,
			    'displayorder':displayorder
			});
			_newcategory.save(function(error){        
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
    req.check('categoryname', 'categoryname should not be blank.').notEmpty();	
    
    var _categoryid = req.body.id;
	var categoryname = req.body.categoryname;
	var description = req.body.description;
	var displayorder = req.body.displayorder;	
    var isdeleted = req.body.isdeleted; 
    var isactive = req.body.isactive;
    var errors = req.validationErrors();
    if (errors) {
	
        return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
	
    }else{
	CategoryModel.findOne({
		"categoryname":name,
		 "isactive": true,
         "isdeleted": false,
		'_id':{$ne:_categoryid}
	    }, function (err, categoryExist){
		if (err) 
		{
			return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype)); 
		}
		else if(categoryExist)
		{
			return res.send(messages.CustomExceptionHandler("duplicatecheck", "category already exists",req.headers.responsetype));
		}
		else
		{
		    CategoryModel.findOne({
			    '_id':_categoryid
			}, function (error, findcategory) {
			    if (error) 
			    {
				return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype)); 
			    }
			    else if(findcategory)
			    {
				CategoryModel.update({
				    '_id': _categoryid
				},{
				    $set: {		
					'categoryname': categoryname,
				    'description':description,
				    'displayorder':displayorder,
					'isdeleted':isdeleted,
					'isactive':isactive
				    }
				},function(errupdate, categoryupdate) {
				    if (errupdate)       
					return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype)); 
				    else
					return res.send(messages.CustomExceptionHandler("success", "Successfully Updated",req.headers.responsetype));
				});
			    }
			    else
			    {
					return res.send(messages.CustomExceptionHandler("authorization", "category could not found!",req.headers.responsetype));
			    }
		    });
		}
	});
    }
    
});


router.delete('/:categoryid',auth.authorize, function(req, res, next) {
    var _categoryid = req.params.categoryid;
	CategoryModel.findOne({'_id':_categoryid},function(err,categoryExist){
	    if (err) 
	    {
		    return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));  
	    }
	    else if(categoryExist)
	    {
		    CategoryModel.update({
				'_id': _categoryid
		    },{
			$set: {		
			  'isdeleted': true
			}
		    },function(errupdate, _categoryupdate) {
			    if (errupdate)       
				return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype)); 
			    else
				return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));
		    });
	    }
	    else
	    {
		    return res.send(messages.CustomExceptionHandler("authorization", "category could not found!",req.headers.responsetype));
	    }
	});
});



module.exports = router;