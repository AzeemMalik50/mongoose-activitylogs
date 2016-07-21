var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var activityLog = new Schema({

    collectionType: {
        type: 'String',
    },
    referenceDocument: {
        
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


 module.exports= mongoose.model('activityLog', activityLog);
