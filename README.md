# mongoose-activitylogs

Plugin for Mongoose which create activitylogs collection and craete automatically  mongo documents for activity logs.
Automate log creation by utilizing plugins for common libraries such as Mongoose (CRUD logging via model plugin).



## Installation

    npm install mongoose-activitylogs


## Usage

     var mongooseLogs = require('mongoose-activitylogs');
      AppSchema = new mongoose.Schema({
         app_id:
         type: String
       });
       AppSchema.plugin(mongooseLog, {
       schemaName: "app",
       createAction: "Created",
       updateAction: "modified/Updated",
        deleteAction: "Deleted/Removed"
    });
     mongoose.model('App', app);

Your payload should have modifiedBy property which contains the refrence id of current user.

     payload.modifiedBy = req.user._id;
