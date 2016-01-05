var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var AttributeSchema = Schema({
    lab: { type: Schema.Types.ObjectId, ref: 'labs' },
    isregular: { type: Boolean }
}, { versionKey: false });

<<<<<<< HEAD
var DoctorSchema = Schema({ 
    name: { type : String, required : true },   
    streetaddress1 : { type: String },  
=======
var DoctorSchema = Schema({	
   	title: { type : String, required : true },	
	streetaddress1 : { type: String },	
>>>>>>> fe77df1badd02ea1411e6559b9cc6334750ba97b
    streetaddress2: {type: String},
    city:{type: String},
    state:{type: String},
    zip:{type: String},
    phonenumber: { type: String },
    categories: [{ type: Schema.Types.ObjectId, ref: 'categories' }],
    attributes:[AttributeSchema],
<<<<<<< HEAD
    isactive:{ type: Boolean, default: true },
    isdeleted:{ type: Boolean, default: false } 
    
=======
	isactive:{ type: Boolean, default: true },
	isdeleted:{ type: Boolean, default: false }	
	
>>>>>>> fe77df1badd02ea1411e6559b9cc6334750ba97b
},{ versionKey: false });



module.exports = mongoose.model('doctors', DoctorSchema);