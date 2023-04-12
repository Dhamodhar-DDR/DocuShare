const {Schema, model} = require("mongoose")

const Document = new Schema({
    _id : String,
    data: Object,
    uid: String,
    name : {
        type: String,
        required: true,
    },
    access : [{
        type: String
    }],
})
module.exports = model("Document", Document)