const moment = require('moment')


function formatMessage(username, text){
    return{
        username,
        text,
        // time: moment().utc('h:mm A').format('LLL')
        time: moment().tz.link("Asia/Calcutta|Asia/Kolkata").format('h:mm A')
        

    }
}

module.exports = formatMessage;
