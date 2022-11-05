const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const activityLog = new Schema({
    collectionType: {
        type: 'String',
    },
    referenceDocument: {
        type: Schema.Types.Mixed
    },
    action: {
        type: 'String',
    },

    message: {
        type: 'String'
    },
    loggedBy: {

    },
    createdAt: {
        type: 'Date'
    }
});

module.exports = mongoose.model('activityLog', activityLog);
