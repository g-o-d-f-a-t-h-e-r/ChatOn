const moment = require('moment')


function formatMessage(username, text){
    return{
        username,
        text,
        // time: moment().utc('h:mm A').format('LLL')
        time: moment().utcOffset("+05:30").format('h:mm A')
        
    }
}

module.exports = formatMessage;
