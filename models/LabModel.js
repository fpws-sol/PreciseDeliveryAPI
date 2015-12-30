var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var LabSchema = Schema({	
   	title: { type : String, required : true },
	name : { type: String },
	streetaddress1 : { type: String },	
    streetaddress2: {type: String},
    city:{type: String},
    state:{type: String},
    zip:{type: String},
    phonenumber:{type: String},
    deliveryprice:{type: Number},
    includedpackages:{type: Number},
    additionalpackageprice:{type: Number},
    weeklyservicefee:{type: Number},
	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false }	
	
},{ versionKey: false });



module.exports = mongoose.model('labs', LabSchema);