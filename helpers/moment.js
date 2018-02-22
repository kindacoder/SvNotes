const moment = require('moment');
formatDate = function(date, format) {
    return moment(date).format(format);
}
module.exports = formatDate;