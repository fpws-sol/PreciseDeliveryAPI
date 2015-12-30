var js2xmlparser = require("js2xmlparser");
var CustomExceptionHandler = function (type,msg,responsetype) {
    
    if(responsetype=="json")
{
    if(type=="success")
        return ({"ResponseDetails":{"ResponseCode":"Success","ResponseStatus":10},"ResponseMessage":msg});
    
    if(type=="requiredparams")
        return ({"ResponseDetails":{"ResponseCode":"Required Params","ResponseStatus":11},"ResponseMessage":msg});
    
    if(type=="duplicatecheck")
        return ({"ResponseDetails":{"ResponseCode":"Duplicate Checking","ResponseStatus":13},"ResponseMessage":msg});
    
    if(type=="authorization")
        return ({"ResponseDetails":{"ResponseCode":"Authorization","ResponseStatus":17},"ResponseMessage":msg});
    
    if(type=="systemerror")
        return ({"ResponseDetails":{"ResponseCode":"System erorr","ResponseStatus":23},"ResponseMessage":msg});

     if(type=="usernotfound")
        return ({"ResponseDetails":{"ResponseCode":"User Not Found","ResponseStatus":24},"ResponseMessage":msg});

    if(type=="unauthorised")
        return ({"ResponseDetails":{"ResponseCode":"Unauthorized","ResponseStatus":401},"ResponseMessage":msg});

    
}

else if(responsetype=="xml")
{
    var jsonString=JSON.stringify(msg);
    var message= JSON.parse(jsonString);
    if(type=="success")	
        return js2xmlparser("result",({"ResponseDetails":{"ResponseCode":"Success","ResponseStatus":10},"ResponseMessage":message}));
	
    if(type=="requiredparams")
        return js2xmlparser("result",({"ResponseDetails":{"ResponseCode":"Required Params","ResponseStatus":11},"ResponseMessage":message}));
    
    if(type=="duplicatecheck")
        return js2xmlparser("result",({"ResponseDetails":{"ResponseCode":"Duplicate Checking","ResponseStatus":13},"ResponseMessage":message}));
    
    if(type=="authorization")
        return js2xmlparser("result",({"ResponseDetails":{"ResponseCode":"Authorization","ResponseStatus":17},"ResponseMessage":message}));
    
    if(type=="systemerror")
        return js2xmlparser("result",({"ResponseDetails":{"ResponseCode":"System erorr","ResponseStatus":23},"ResponseMessage":message}));

     if(type=="usernotfound")
        return js2xmlparser("result",({"ResponseDetails":{"ResponseCode":"User Not Found","ResponseStatus":24},"ResponseMessage":message}));

    if(type=="unauthorised")
        return js2xmlparser("result",({"ResponseDetails":{"ResponseCode":"Unauthorized","ResponseStatus":401},"ResponseMessage":message}));
}
else
{
	return ({"ResponseDetails":{"ResponseCode":"Invalid","ResponseStatus":500},"ResponseMessage":'Invalid Response Type.'});
}
    
  }  
    module.exports ={
    CustomExceptionHandler:CustomExceptionHandler


}



