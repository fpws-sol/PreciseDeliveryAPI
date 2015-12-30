var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var UsersSchema = Schema({	
   	email: { type : String, required : true },  
   	userrole : [{type: Schema.Types.ObjectId, ref: 'userroles'}],
	username : { type: String, required : false },
	password : { type: String, required : true },	
    access_token: {type: String},
    expiration:{type: String},
    lastloggedin:{type: String},
    lastloggedinip:{type: String},
	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false }
	
	
},{ versionKey: false });



module.exports = mongoose.model('users', UsersSchema);