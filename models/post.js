const mongoose = require('mongoose');
const moment = require('moment')

const date = moment().format("MMM Do YY");
const postSchema = mongoose.Schema({
	title:{
		type:String,
		required:true
	},
	author:{
		type:String,
		required:true
	},
	category:{
		type:String,
		required:true
	},
	content:{
		type:String,
		required:true
	},
	time:{
		type:String,
		default:date,
	},
	slug:{
		type:String,
		required:true
	}
});

const Post = new mongoose.model("Post", postSchema);
module.exports = Post;