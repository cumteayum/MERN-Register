const jwt = require("jsonwebtoken");
const Register = require('../models/registers');

const auth = async function(req, res, next){
	try{
		const token = req.cookies.jwt;
		const verify = jwt.verify(token, process.env.KEY);
		const user = await Register.findOne({_id:verify._id});
		next();
	}catch(err){	
		res.status(400).send(err)
	}
} 
module.exports = auth;