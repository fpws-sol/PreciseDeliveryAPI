var express = require('express');
var xml = require('xml');
var UsersModel = require('../models/UsersModel');
var auth = require('../config/auth');
var router = express.Router();
var moment = require('moment-timezone');
var passport = require('passport');
var moment = require('moment-timezone');
var messages = require('../messages.js');


function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

router.get('/me',auth.authorize,function(req, res) {
        UsersModel.find({	
        "isactive": true,
        "isdeleted": false
    }).populate("userrole").exec(function(err, users) {
        if (err)
		{
			 return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
		}
        else
		{
			 return res.send(messages.CustomExceptionHandler("success", users,req.headers.responsetype));
		}
    });
	}
);




router.post('/login',function(req, res, next) {
//console.log(req.headers.responsetype);
req.check('email', 'email should not be blank.').notEmpty();
req.check('password', 'password should not be blank.').notEmpty();
var errors = req.validationErrors();
//console.log(new Buffer("MTIzNDU2", 'base64').toString('ascii'));
 if (errors) {

	return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));    
    }

    else{

	var encodedPassword=new Buffer(req.body.password, 'base64').toString('ascii');
	//console.log(encodedPassword);
   UsersModel.findOne({
   		"email":req.body.email,
   		"password":req.body.password,
        "isactive": true,
        "isdeleted": false
      }, function(err, user) {
         if (err)
            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         else
         {
         	if(user)
         	{
				 
         		var accesstoken=guid();
         		var expiredon=moment().add('minutes', 30).utc().format('YYYY-MM-DD HH:mm:ss');
	         	UsersModel.update({
					'_id': user._id
				    },{
					$set: {		
					   'access_token':accesstoken,
					   'expiration':expiredon,
	    			   'lastloggedin':moment.utc().format('YYYY-MM-DD HH:mm:ss'),
					}
				    },function(errupdate, userupdate) {
					if (errupdate)       
						return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
						else
						{
								
							return res.send(messages.CustomExceptionHandler("success", {"accesstoken":accesstoken,"expiredon":expiredon,"userdetails":user},req.headers.responsetype));
						}
				    });
			}
			else
			{
				
				return res.send(messages.CustomExceptionHandler("usernotfound", "Username/Password not valid!",req.headers.responsetype));
			}

            
        }
   }); 
   } 
});



router.post('/logout',auth.authorize, function(req, res, next) {
req.check('userid', 'email should not be blank.').notEmpty();


   UsersModel.findOne({
   		"_id":req.body.userid
      }, function(err, user) {
         if (err)
            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
         else
         {
         	if(user)
         	{
				 
         		
	         	UsersModel.update({
					'_id': user._id
				    },{
					$set: {		
					   'access_token':""
	    			  
					}
				    },function(errupdate, userupdate) {
					if (errupdate)       
						return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
						else
						{

							return res.send(messages.CustomExceptionHandler("success", "Successfully logged out",req.headers.responsetype));
						}
				    });
			}
			else
			{
				
				return res.send(messages.CustomExceptionHandler("usernotfound", "Username/Password not valid!",req.headers.responsetype));
			}

            
        }
   });  
});




router.get(
        '/auth/facebook',
        passport.authenticate('facebook', { session: false, scope: [] })
    );

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { session: false}),
   function(req, res) {    
     res.redirect("/api/user/profile?access_token=" + req.user.access_token);
});

router.get(
    '/profile',
    passport.authenticate('bearer', { session: false }),
    function(req, res) {
        res.send(req.user);
    }
);

router.get(
    '/access_token',
    passport.authenticate('facebook', { session: false }),
    function(req, res) {
        res.send(req.user.access_token);
    }
);



router.get('/',auth.authorize, function(req, res, next) {
    UsersModel.find({
	
        "isactive": true,
        "isdeleted": false
    }).populate("userrole").exec(function(err, users) {
        if (err)
		{
			return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype)); 
		}
        else
		{
			return res.send(messages.CustomExceptionHandler("success", users,req.headers.responsetype))
		}
    });
});


router.get('/:id', auth.authorize,function(req, res, next) {
    var _userid = req.params.id;
    UsersModel.findOne({
        "_id": _userid
    }, function(err, user) {
        if (err)
		{
			return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype)); 
		}
        else
		{
			return res.send(messages.CustomExceptionHandler("success", user,req.headers.responsetype))
		}
    })
});


router.post('/',auth.authorize, function(req, res, next) {	
	var name = req.body.name;
	var userroleid = req.body.userrole;
	var mailid = req.body.email;
	var password = req.body.password;
	var addedby = req.body.user;
	var modifiedby = req.body.user;
	UsersModel.findOne({
	    "name":name,
	     "isactive": true,
        "isdeleted": false
    }, function (err, userExist) { 
       if(err) 
       {
        return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype)); 
       }
       else if(userExist)
       {
		   return res.send(messages.CustomExceptionHandler("duplicatecheck", "User already exists",req.headers.responsetype));
	   }
	   else
	   {
         var _newuser = new UsersModel({
	    'name': name,
	    'userrole' : userroleid,
	    'mailid' : mailid,
	    'password' : password,
	    'access_token':'',
	    'expiration':'',
	    'lastloggedin':moment.utc().format('YYYY-MM-DD HH:mm:ss'),
	    'addedby':addedby,
	    'modifiedby':modifiedby
         });
         _newuser.save(function(error){        
           if (error)        
             return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
                else
           return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted",req.headers.responsetype));       });
	   }
	});
});


router.put('/',auth.authorize, function(req, res, next) {
    var _userid = req.body.userid;
    var name = req.body.name;
    var userroleid = req.body.userrole;
    var mailid = req.body.email;
    var password = req.body.password;
    var modifiedby = req.body.user; 
    var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');   
    var isdeleted = req.body.isdeleted; 
    var isactive = req.body.isactive; 
    UsersModel.findOne({
        "name":name,
         "isactive": true,
        "isdeleted": false,
        '_id':{$ne:_userid}
    }, function (err, userExist){
        if (err) 
        {
		       return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype)); 
        }
        else if(userExist)
        {
		   return res.send(messages.CustomExceptionHandler("duplicatecheck", "User already exists",req.headers.responsetype));
        }
        else
        {
           UsersModel.findOne({
            '_id':_userid
           }, function (error, finduser) {
			if (error) 
			{
			     return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));  
			}
			else if(finduser)
			{
				UsersModel.update({
				'_id': _userid
			    },{
				$set: {		
				    'name': name,
				    'userrole' : userroleid,
				    'mailid' : mailid,
				    'password' : password,
				    'modifiedby':modifiedby,
				    'modifieddate':modifieddate,
				    'isdeleted':isdeleted,
				    'isactive':isactive
				}
			    },function(errupdate, userupdate) {
				if (errupdate)       
					return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
					    else
					return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));	    });
			}
			else
			{
				       return res.send(messages.CustomExceptionHandler("authorization", "Supply could not found!",req.headers.responsetype));
			}
		   });
		}
	});
});


router.delete('/:userid',auth.authorize, function(req, res, next) {
    var _userid = req.params.userid;
	UsersModel.findOne({'_id':_userid},function(err,userExist){
	    if (err) 
	    {
          return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));	    }
	    else if(userExist)
	    {
		    UsersModel.update({
				'_id': _userid
		    },{
			$set: {		
			  'isdeleted': true
			}
		    },function(errupdate, _userupdate) {
			    if (errupdate)       
				 return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
			else
			    return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));    });
	    }
	    else
	    {
					return res.send(messages.CustomExceptionHandler("authorization", "User could not found!",req.headers.responsetype));

	    }
	});
});



module.exports = router;