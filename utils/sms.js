// var xhr = new XMLHttpRequest();
// xhr.open("GET", "https://platform.clickatell.com/messages/http/send?apiKey=k4ruIRQRQCumkJWOjvgTeA==&to=27824631521&content=Testing, testing, 123", true);
// xhr.onreadystatechange = function(){
//     if (xhr.readyState == 4 && xhr.status == 200){
//         console.log('success')
//     }
// };
// xhr.send();

//=============================================
require('../config/config');
//=============================================
var sendSMS = (message) => {
var clickatell = require("clickatell-platform");

//clickatell.sendMessageRest("Hello testing message", ["27XXXXX-NUMBER"], "APIKEY-HERE");
//var message = "'" + message + "'";
var celNumb = process.env.SMS_API_NUM;
var key = process.env.SMS_API_LDM;
console.log(message, celNumb, key);
clickatell.sendMessageHttp(message, [celNumb], key);
//return docBody;
}

module.exports = {sendSMS};
