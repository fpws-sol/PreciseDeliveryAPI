var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');


var DriverSchema = Schema({ 
    title: { type : String, required : true },   
    categories: [{ type: Schema.Types.ObjectId, ref: 'categories' }],
    routedriver: {type: String},
    routedrivercellno:{type: String},
    routenotes:{type: String},   
    isactive:{ type: Boolean, default: true },
    isdeleted:{ type: Boolean, default: false }    
},{ versionKey: false });



module.exports = mongoose.model('drivers', DriverSchema);