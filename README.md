# mongoose-activitylogs

Plugin for Mongoose which create activitylogs collection and craete automatically  mongo documents for activity logs.
Automate log creation by utilizing plugins for common libraries such as Mongoose (CRUD logging via model plugin).



## Installation


    npm install mongoose-activitylogs


## Usage

```javascript
var mongooseLogs = require('mongoose-activitylogs');
      AppSchema = new mongoose.Schema({
         app_id:
         type: String
       });
       AppSchema.plugin(mongooseLog, {
       schemaName: "app",
       createAction: "created",
       updateAction: "updated",
       deleteAction: "deleted" 
    });
     mongoose.model('App', app);
```

Your payload should have modifiedBy property which contains the refrence id of current user.

     payload.modifiedBy = req.user;
     
     
     
And here's some code example! :+1:

```javascript
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseLogs = require('mongoose-activitylogs');

var BlogPost = new Schema({
    author    : ObjectId,
    title     : String,
    body      : String,
    date      : Date
});

var user = new Schema({
    firstName: String,
    lastName: String,
    password: String,
    email: String  
});

BlogPost.plugin(mongooseLogs, {
       schemaName: "blogpost",
       createAction: "posted",
       updateAction: "updated",
       deleteAction: "removed" 
    }
/*  Your Payload */
 req.body={
    author    : ObjectId,
    title     : "Post Title",
    body      : "Post Body",
    date      :  new Date
    } 
    
app.post('/post', function (req, res) {

/* 
req.user = {
firstName:"jhon",
lastName: "Doe",
password:"UserPassword",
email:"UserEmail" 
}
*/
 var poayload = req.body;
 
 /*
 modifiedBy should be user Object that refer to the current authenticated user 
 who is performing this action. 
 */
 
 payload.modifiedBy = req.user;// or req.session.user;
 var post = new BlogPost(payload);
 post.save();
 
 /* After save a document will be inserted automatically in your activitylogs collection
 your activitylog document would be like :

 {
    "_id" : ObjectId,
    "collectionType" : "blogpost",
    "refereceDocument" : {// object 
                           author    : ObjectId,
                           title     : "Post Title",
                           body      : "Post Body",
                           date      :  new Date
                         };
    "action" : "Posted",
    "loggedBy" : {//object
                           firstName:"jhon",
                           lastName: "Doe",
                           password:"UserPassword",
                           email:"UserEmail" 
                        },,
    "createdAt" : ISODate,
    "__v" : 0
}   
 */
  res.send('POST request to create a post');
});
```

     
     
     
     

# License


The MIT License (MIT)

Copyright (c) 2016 azeemamanat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
