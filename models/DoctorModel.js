var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');


var DoctorSchema = Schema({ 
    title: { type : String, required : true },   
    streetaddress1 : { type: String },  
    streetaddress2: {type: String},
    city:{type: String},
    state:{type: String},
    zip:{type: String},
    phonenumber: { type: String },
    categories: [{ type: Schema.Types.ObjectId, ref: 'categories' }],
    lab: { type: Schema.Types.ObjectId, ref: 'labs' },
    isregular: { type: Boolean },
    isactive:{ type: Boolean, default: true },
    isdeleted:{ type: Boolean, default: false } 
    
},{ versionKey: false });



module.exports = mongoose.model('doctors', DoctorSchema);