const express = require('express');
const bcrypt = require('bcryptjs');
const Register = require('../models/registers.js');
require('dotenv').config()
const Post = require('../models/post.js');
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');

router.use(cookieParser());
router.use(bodyParser.urlencoded({extended:false}));

router.get('/', async (req, res) => {
	res.status(200).render('index');
});	

router.post('/', async (req, res) => {
	const {name, email, pass, cpass} = req.body;
	const register = new Register({
		name:name,
		email:email,
		pass:pass,
		cpass:cpass
	});
	const token = await register.generateAuthToken();
	const result = await register.save();

	res.cookie("jwt", token, {
		httpOnly:true
	});
	res.send("Done, You have been registered");
});

router.get('/login', async (req, res) => {
	res.status(200).render('login');
});	

router.post('/login', async (req, res) => {
	const {username, password} = req.body;
	const isExisting = await Register.findOne({name:username});
	const isMatch = await bcrypt.compare(password, isExisting.pass);
	const token = await isExisting.generateAuthToken();
	res.cookie("jwt", token, {
		httpOnly:true
	});
	if(isMatch){
		res.send("Login successful");
	}else{
		res.send("Invalid credentials");
	}
});	

router.get('/create', (req, res) => {
	res.status(200).render('create');
});

router.get('/secret',auth,(req, res) => {
	console.log(`The cookie is ${req.cookies.jwt}`)
	res.send("Shh... This is a top secret page !");
});

router.post('/create', async (req, res) => {
	const {name, title, category, content, slug} = req.body;
	const post = new Post({
		title:title,
		author:name,
		category:category,
		content:content,
		slug:slug
	});
	const result = await post.save();
	res.json(result);
});

router.get('/posts', async (req, res) => {
	const posts = await Post.find({});
	const context = {'posts':posts};
	res.render("posts.hbs", context);
});

router.get('/posts/:slug', async (req, res) => {
	const posts = await Post.findOne({slug:req.params.slug});
	const context = {'posts':posts};
	res.render("postOne.hbs", context);
});

router.delete('/posts/:slug', async (req, res) => {
	const post = await Post.deleteOne({slug:req.params.slug});
	res.json(post);
});

module.exports = router;