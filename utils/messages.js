const moment = require('moment')


function formatMessage(username, text){
    return{
        username,
        text,
        time: moment().utc('h:mm A').format('LLL')
    }
}

module.exports = formatMessage;
