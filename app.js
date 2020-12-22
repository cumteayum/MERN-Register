const express = require('express');
const hbs = require('hbs');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')

app.use(express.static('public'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended:false}));

// Mongoose schema
mongoose.connect("mongodb://localhost:27017/Register", { useNewUrlParser: true , useUnifiedTopology:true})
.then(() => console.log('Connection successful'))
.catch(() => console.log('Connection not done'))

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
	}
});

registerSchema.pre("save", async function (next) {
    if(this.isModified("pass")){
    	this.pass = await bcrypt.hash(this.pass, 7);
    }
	next();
})

const Register = new mongoose.model("Register", registerSchema);

app.get('/', async (req, res) => {
	res.status(200).render('index');
});	

app.post('/', async (req, res) => {
	const {name, email, pass, cpass} = req.body;
	const register = new Register({
		name:name,
		email:email,
		pass:pass,
		cpass:cpass
	});
	const result = await register.save();
	console.log(result);
	res.send("Done " + name);
});	


app.listen(5000, () => console.log('http://localhost:3000/'));