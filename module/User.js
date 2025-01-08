const mongoose=require("mongoose")
const {Schema}=require("mongoose")

const user = new Schema({
    name:String,
    password:String
})

const User = mongoose.model('test_user', user);
module.exports=User