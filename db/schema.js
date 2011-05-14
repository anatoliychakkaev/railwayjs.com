var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId

  , UserSchema        = new Schema
//, PostSchema        = new Schema
//, CommentSchema     = new Schema
  ;

UserSchema.add({
    email:           { type: String,   index: true },
    password:        { type: String    },
    activated:       { type: Boolean   }
});
mongoose.model("User", UserSchema);

/*
PostSchema.add({
    title:           { type: String    },
    content:         { type: String    },
    comments:        [ CommentSchema   ]
});
mongoose.model("Post", PostSchema);

CommentSchema.add({
    title:           { type: String    },
    post:            { type: ObjectId, index: true }
});
mongoose.model("Comment", CommentSchema);
*/

['User'/*, 'Post', 'Comment'*/].forEach(function (m) {
    module.exports[m] = mongoose.model(m);
});


/**
 * Page
 */
var PageSchema = new Schema;
PageSchema.add({
    title:   { type: String },
    content: { type: String },
    path:    { type: String },
    pos:     { type: String }
});
mongoose.model("Page", PageSchema);
module.exports["Page"] = mongoose.model("Page");


/**
 * Comment
 */
var CommentSchema = new Schema;
CommentSchema.add({
    path:   { type: String, index: true },
    author: { type: String },
    twid:   { type: Number },
    pic:    { type: String },
    text:   { type: String },
    date:   { type: Date   }
});
mongoose.model("Comment", CommentSchema);
module.exports["Comment"] = mongoose.model("Comment");
