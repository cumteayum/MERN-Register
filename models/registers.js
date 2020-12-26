const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config()
const jwt = require('jsonwebtoken');

// Mongoose schema
mongoose.connect("mongodb://localhost:27017/Register", { useNewUrlParser: true , useUnifiedTopology:true})
.then(() => console.log('Connection successful'))
.catch(() => console.log('Connection not registered'))

const registerSchema = mongoose.Schema({
        name:{
                type:String,
                required:true
        },
        email:{
                type:String,
                required:true
        },
        pass:{
                type:String,
                required:true
        },
        cpass:{
                type:String,
                required:false
        },
        tokens:[{
                token:{
                        type:String,
                        required:true
                }
        }]
});

registerSchema.pre("save", async function (next) {
    if(this.isModified("pass")){
        this.pass = await bcrypt.hash(this.pass, 7);
    }
    next();
});

registerSchema.methods.generateAuthToken = async function(){
        try {
            const token = jwt.sign({_id:this._id.toString()}, process.env.KEY);
            this.tokens = this.tokens.concat({token:token});
            await this.save();
            return token;
        } catch (error) {
                console.log(error);
        }
}

const Register = new mongoose.model("Register", registerSchema);


module.exports = Register;