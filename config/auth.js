var UsersModel = require('../models/UsersModel');
var moment = require('moment-timezone');
var messages = require('../messages.js');

exports.authorize = function(req, res, next) {
  if (req.headers.accesstoken) {
  	UsersModel.findOne({
		"access_token": req.headers.accesstoken,	
        "isactive": true,
        "isdeleted": false
    }).populate("userrole").exec(function(err, user) {
        if (err)
		{
			
			 res.send(messages.CustomExceptionHandler("unauthorised", "unauthorized",req.headers.responsetype));
		}
        else
		{
			if(user)
			{
			var diff=	moment.utc(moment(user.expiration,"DD/MM/YYYY HH:mm:ss").diff(moment.utc().format('YYYY-MM-DD HH:mm:ss'))).format("HH:mm:ss");
			var duration = moment.duration(diff);

			var sec=Math.floor(duration.asSeconds());
			if(sec>0)
			 next();
			else
			
			
			  res.send(messages.CustomExceptionHandler("unauthorised", "accesstoken expired",req.headers.responsetype));
			}
			 else
			 {
			 	
			 	res.send(messages.CustomExceptionHandler("unauthorised", "not a valid accesstoken",req.headers.responsetype));
			 
			}
		}
    });
   
  } else {
  	
  	res.send(messages.CustomExceptionHandler("unauthorised", "unauthorized",req.headers.responsetype));
    
  }
}