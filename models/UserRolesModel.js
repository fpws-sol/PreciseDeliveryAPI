var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var UserRolesSchema = Schema({	
   	rolename: { type : String, required : true },
   	description: { type : String },
	
	
},{ versionKey: false });

module.exports = mongoose.model('userroles', UserRolesSchema);