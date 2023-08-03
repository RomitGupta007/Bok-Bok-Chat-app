var mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const { use } = require('../Routes/userRoutes');
const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true, unique: true},
    password:{type:String,required:true},
    pic:{type:String,default:"https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"},

    
},{ timestamps : true});

userSchema.methods.matchPassword = async function(enteredpass){
    return await bcrypt.compare(enteredpass,this.password);
}

userSchema.pre('save', async function (next){
    if(! this.isModified)
    {
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt) 
})

const User = mongoose.model("User",userSchema)
module.exports = User