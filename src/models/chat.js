const moongoose = require('mongoose');

const messageSchema = new moongoose.Schema({
    senderId : {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text : {
        type: String,
        required: true
    },
    
},
{ timestamps: true });

const chatSchema = new moongoose.Schema({

    participents : [{
        type: moongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    messages : [messageSchema]

});

const Chat = moongoose.model('Chat', chatSchema);

module.exports = Chat;