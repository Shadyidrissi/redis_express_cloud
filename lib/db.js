const mongoose = require('mongoose');

const db = ()=>{
    try{
        mongoose.connect(process.env.DB_URL);
        console.log('db running')
    }catch(err){
        console.log('ERROR : ' , err)
    }
}

module.exports = db