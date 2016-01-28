var mongoose = require('mongoose');
var config = require("../config/db");
var Schema=mongoose.Schema;
var moment = require('moment-timezone');

var DeliveryDetailsSchema = Schema({
    doctors: { type: Schema.Types.ObjectId, ref: 'doctors' },
    packagedeliver: { type: String, required : true},
    packagepickup: { type: String, required : true},
    daytime: { type: String, required : true},/////AM=0 PM=1  
    displayorder: { type: String, required : true},  
}, { versionKey: false });


var DeliverySchema = Schema({		    
   	deliverydate: { type : String, required : true },
   	route: { type: Schema.Types.ObjectId, ref: 'categories' },	
    deliverydetails:[DeliveryDetailsSchema],
    isactive:{ type: Boolean, default: true },
    isdeleted:{ type: Boolean, default: false } 
},{ versionKey: false });



module.exports = mongoose.model('deliveries', DeliverySchema);