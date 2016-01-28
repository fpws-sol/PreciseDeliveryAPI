var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var UserRolesSchema = Schema({
	/*_id:Schema.Types.ObjectId,*/
   	rolename: { type : String, required : true },
   	description: { type : String },
	
	
},{ versionKey: false });

module.exports = mongoose.model('userroles', UserRolesSchema);