var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var activityLog = new Schema({

    collectionType: {
        type: 'String',
        required: true
    },
    refereceId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    action: {
        type: 'String',
        required: true
    },

    message: {
        type: 'String'
    },
    loggedBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: 'Date'
    }
});


var ActivityLog = mongoose.model('activityLog', activityLog);




function mongooseLogsPlugin(schema, options) {


    schema.add({
        modifiedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    });

    schema.post('save', function(doc, next) {

        var AL = new ActivityLog({
            collectionType: options.schemaName,
            refereceId: this._id,
            action: options.createAction || 'created',
            loggedBy: this.modifiedBy,
            createdAt: Date.now()
        });
        AL.save(function(err, alog) {
            return next();
        });
    });

    schema.post('update', function(doc, next) {

        var activity = {
            collectionType: options.schemaName,
            refereceId: this._update.$set._id,
            action: options.updateAction || 'updated',
            loggedBy: this._update.$set.modifiedBy,
            createdAt: Date.now()
        };

        var AL = new ActivityLog(activity);
        AL.save(function(err, alog) {
            return next();
        });

    });


    schema.post('findOneAndUpdate', function(doc, next) {

        var activity = {
            collectionType: options.schemaName,
            refereceId: this._update.$set._id,
            action: options.updateAction || 'updated',
            loggedBy: this._update.$set.modifiedBy,
            createdAt: Date.now()
        };

        var AL = new ActivityLog(activity);
        AL.save(function(err, alog) {
            return next();
        });

    });


    schema.post('findOneAndRemove', function(doc, next) {
        var activity = {
            collectionType: options.schemaName,
            refereceId: thi._id,
            action: options.deleteAction || 'deleted',
            loggedBy: this.modifiedBy,
            createdAt: Date.now()
        };

        var AL = new ActivityLog(activity);
        AL.save(function(err, alog) {
            return next();
        });
    });


    schema.post('remove', function(doc, next) {
        var activity = {
            collectionType: options.schemaName,
            refereceId: thi._id,
            action: options.deleteAction || 'deleted',
            loggedBy: this.modifiedBy,
            createdAt: Date.now()
        };

        var AL = new ActivityLog(activity);
        AL.save(function(err, alog) {
            return next();
        });
    });
}

module.exports = mongooseLogsPlugin;