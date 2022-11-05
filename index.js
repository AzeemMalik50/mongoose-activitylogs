const ActivityLog = require('./activity-model');

function mongooseLogsPlugin(schema, options) {

    schema.add({
        modifiedBy: {}
    });

    // create action logs
    schema.post('save', function (doc, next) {
        const referenceDocument = Object.assign({}, this._doc);
        delete referenceDocument.modifiedBy;
        const ALog = new ActivityLog({
            collectionType: options.schemaName,
            referenceDocument: referenceDocument,
            action: options.createAction || 'created',
            loggedBy: this.modifiedBy,
            createdAt: Date.now()
        });
        ALog.save(() => {
            return next();
        });
    });

    // update action logs
    schema.post('update', function (doc, next) {
        const activity = {
            collectionType: options.schemaName,
            action: options.updateAction || 'updated',
            createdAt: Date.now()
        };
        if (this._update.$set && this._update.$set.modifiedBy) {
            const referenceDocument = Object.assign({}, this._update.$set);
            delete referenceDocument.modifiedBy;
            activity.referenceDocument = referenceDocument;
            activity.loggedBy = this._update.$set.modifiedBy;
        } else if (this._update.$pushALogl) {
            activity.referenceDocument = this._update.$pushALogl;
        }

        const ALog = new ActivityLog(activity);
        ALog.save(() => next());
    });

    schema.post('findOneAndUpdate', function (doc, next) {
        const referenceDocument = Object.assign({}, doc);
        delete referenceDocument.modifiedBy;
        const activity = {
            collectionType: options.schemaName,
            referenceDocument: referenceDocument,
            action: options.updateAction || 'updated',
            loggedBy: doc.modifiedBy,
            createdAt: Date.now()
        };
        const ALog = new ActivityLog(activity);
        ALog.save(() => next());
    });

    // create logs for delete action
    schema.post('findOneAndRemove', function (doc, next) {
        const activity = {
            collectionType: options.schemaName,
            referenceDocument: doc,
            action: options.deleteAction || 'deleted',
            loggedBy: this.modifiedBy,
            createdAt: Date.now()
        };
        const ALog = new ActivityLog(activity);
        ALog.save(() => next());
    });

    schema.post('remove', function (doc, next) {
        const activity = {
            collectionType: options.schemaName,
            referenceDocument: doc,
            action: options.deleteAction || 'deleted',
            loggedBy: this.modifiedBy,
            createdAt: Date.now()
        };
        const ALog = new ActivityLog(activity);
        ALog.save(() => next());
    });
}

module.exports = mongooseLogsPlugin;
