/*
* R-AJAX Library (to submit form data easily)
* @version v1.0.0
* @author: Ruvin Roshan (c) 2019
* @web: https://ruvinroshan.com 
* @version of JQ required: jQuery v3.1.0 
* All rights reserved
* 
*/

var jq3_10_rajax = jQuery.noConflict();

var rajax = (function(){
var logDataVal = false;

var logData = function(val){
logDataVal = val;
//return val;
}

var App = {};
App.notify = function (type, message) {
if(logDataVal){
console.log(type + '! ' + message);
}

};
App.getErrorMessage = function (jqxhr, exception) {

if (jqxhr.status === 0) {
return 'Can not connect to server. Please check your network connection';
} else if (jqxhr.status == 404) {
return 'Requested page not found. Error - 404';
} else if (jqxhr.status == 401) {
return 'Not authorized!';
} else if (exception === 'parsererror') {
return 'Requested JSON parse failed.';
} else if (exception === 'timeout') {
return 'Request Time out error.';
} else if (exception === 'abort') {
return 'Request aborted.';
} else {
return 'Uncaught Error.n' + jqxhr.responseText;
}
};


var _rexecute = function(formname,moreData,log){
if(log){
logData(log);
}

if(moreData){
var moreDataURL = RR_buildURL(moreData);
}else{
var moreDataURL = RR_buildURL({});
}

//var token = 'test';
var formSub =  jq3_10_rajax(formname).submit(function (event) {
var $this = jq3_10_rajax(this);
event.preventDefault();
return $this;
});


var ajaxSub =   jq3_10_rajax.ajax({
type: formSub.attr('method'),
url: formSub.attr('action'),
data: formSub.serialize()+'&'+moreDataURL ,
async: false,
//headers: { "Authorization": 'Bearer ' + token },
beforeSend: function () {
formSub.prop('disabled', true);
formSub.find('.status').text('Sending...');
}        
});
ajaxSub.done(function(data, textStatus, jQxhr) {
// successful request; do something with the data
if (data.result === 'success') {
App.notify('success', 'Successfully subscribed!');
formSub.find('.status').removeClass('alert alert-success alert-danger').addClass('alert alert-success').text('Successfully subscribed!');
//do whatever you need to do after;
} else {
App.notify('error', data.message);
formSub.find('.status').removeClass('alert alert-success alert-danger').addClass('alert alert-danger').text(data.message);
}
});
ajaxSub.fail(function(jQxhr, textStatus, errorThrown) {
var message = App.getErrorMessage(jQxhr, errorThrown);
App.notify('error', message);
formSub.find('.status').removeClass('alert alert-success alert-danger').addClass('alert alert-danger').text(message);
});
ajaxSub.always(function(data, textStatus, jQxhr) {
formSub.prop('disabled', false);
});
return ajaxSub;
}
function RR_buildURL(obj) { 
var s = ""; 
for (var key in obj) { 
if (s != "") { 
s += "&"; 
} 
s += (key + "=" + encodeURIComponent(obj[key])); 
} 
return s;
} 
return{
post:_rexecute
}
})();
