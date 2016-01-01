var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var CategorySchema = Schema({	
   	categoryname: { type : String, required : true },
	description : { type: String },
	displayorder : { type: Number },
	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false }	
	
},{ versionKey: false });



module.exports = mongoose.model('categories', CategorySchema);