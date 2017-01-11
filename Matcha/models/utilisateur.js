class Utilisateur {

		static		insertUser(newUser, callback){

		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			let error;
			if (err) {
				throw err
			}
			else {
				db.collection("users").insert(newUser, null, (err, res)=> {
					if (err) callback(err);
					else {
						callback('OK');
					}
				});
				db.close();
			}
		})
	}

	static		queryByPseudo(username, callback) {

		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			let error;
			if (err) {
				throw err
			}
			else {
				db.collection('users').find({pseudo: username}).toArray(function (err, result) {
					if (err) {
						callback(err);
					}
					callback(result);
				});
				db.close();
			}
		})
	}

	static		queryByMail(mail, callback) {

		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			let error;
			if (err) {
				throw err
			}
			else {
				db.collection('users').find({email: mail}).toArray(function (err, result) {
					if (err) callback(err);
					else callback(result);
				});
				db.close();
			}
		})
	}

	static		queryAllUsersByPref(sexe, pref, callback){
		let	mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			let error;
			if (err) {
				throw err
			}
			else {

				if (pref === sexe){
					db.collection('users').find({sexe: sexe, pref: sexe}).toArray(function (err, result) {
					if (err) callback(err);
					else callback(result);
				});
				db.close();
				} else if ((pref === 'f' && sexe === 'h') ||
							(pref === 'h' && pref === 'f')) {
					db.collection('users').find({ $or: [{sexe: pref , pref: sexe}, {sexe: pref, pref:'x'}]}).toArray(function (err, users) {
					if (err) callback(err);
					else callback(users);
					});
				db.close();
				} else{
					if (sexe === 'h') var autre = 'f';
					else if (sexe === 'f') var autre ='h';
					db.collection('users').find({ $or: [{sexe: sexe , pref: sexe}, {sexe: sexe, pref:'x'}, {sexe: autre, pref: sexe}]}).toArray(function (err, result) {
					if (err) callback(err);
					else callback(result);
				});
				db.close();

				}

				
			}
		})
	}



	static		changePwd(pseudo, pass, callback){
		let mongo = require('mongodb').MongoClient;
		var bcrypt = require('bcryptjs');

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			if (err) callback (err);
			else{
				if (pass)
					 var newpass = pass;
				else	
					var newpass = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".shuffle();

				db.collection('users').updateOne({pseudo: pseudo}, {$set: {pwd: bcrypt.hashSync(newpass)}}, (err, result)=>{
					if (err) callback (err);
					else callback(newpass);
				})
				db.close();
			}
		})

	}

	static		changeEmail(pseudo, email, callback){
		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			if (err) callback (err);
			else{
				console.log('changeEmail: ', email, '-  pseudo: ', pseudo);
					db.collection('users').updateOne({pseudo: pseudo}, {$set: {email: email}}, (err, result)=>{
					if (err) callback (err);
					else callback(email);
				})
				db.close();
			}
		})

	}

	static		changeNom(nom, prenom, pseudo, callback){
		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			if (err) callback (err);
			else{
					db.collection('users').updateOne({pseudo: pseudo}, {$set: {nom: nom, prenom: prenom}}, (err, result)=>{
					if (err) callback (err);
					else callback();
				})
				db.close();
			}
		})

	}

	static		changeGender(sexe, pref, pseudo, callback){
		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			if (err) callback (err);
			else{
					db.collection('users').updateOne({pseudo: pseudo}, {$set: {sexe: sexe, pref: pref}}, (err, result)=>{
					if (err) callback (err);
					else callback();
				})
				db.close();
			}
		})

	}

	static		changeTagAndBio(tag, bio, pseudo, callback){
		let mongo = require('mongodb').MongoClient;

		console.log('tag dans usre:', tag)
		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			if (err) callback (err);
			else{
					db.collection('users').updateOne({pseudo: pseudo}, {$set: {tag: tag, bio: bio}}, (err, result)=>{
					if (err) callback (err);
					else callback();
				})
				db.close();
			}
		})
	}

	static		changeGeo(lat, lon, pseudo, callback){
		let mongo = require('mongodb').MongoClient;


		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			if (err) callback (err);
			else{
					db.collection('users').updateOne({pseudo: pseudo}, {$set: {geo: {lat: lat, lon: lon}}}, (err, result)=>{
					if (err) callback (err);
					else callback();
				})
				db.close();
			}
		})

	}

	static		uploadImg(pseudo, imgpath, callback){
		let mongo = require('mongodb').MongoClient;


		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			if (err) callback (err);
			else{
					var path = '/img/' + imgpath;
					db.collection('users').updateOne({pseudo: pseudo}, {$push: {"img": path}}, (err, result)=>{
					if (err) callback (err);
					else callback();
				})
				db.close();
			}
		})
	}

	static		deleteImg(pseudo, imgpath, callback){

		let mongo = require('mongodb').MongoClient;


		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			if (err) callback (err);
			else{
				console.log('imgpath: ', imgpath, 'pseudo :', pseudo)
					db.collection("users").updateOne({pseudo: pseudo}, {$pull: {"img": imgpath}}, (err, res)=> {
					if (err) callback (err);
					else callback();
				})
				db.close();
			}
		})

	}
	static		changeProfilePic(pseudo, imgpath, i, callback){

		let mongo = require('mongodb').MongoClient;


		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			if (err) callback (err);
					db.collection("users").find({"pseudo": pseudo})
  				.forEach(function (doc) {
  					var swap;
  					swap = doc.img[0];
    				doc.img[0] = imgpath;
    				doc.img[i] = swap;
   		 		db.collection("users").save(doc);
  			});
  			callback();
		})
	}
	static		deleteImg(pseudo, imgpath, callback){

		let mongo = require('mongodb').MongoClient;


		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			if (err) callback (err);
			else{
					db.collection("users").updateOne({pseudo: pseudo}, {$pull: {"img": imgpath}}, (err, res)=> {
					if (err) callback (err);
					else callback();
				})
				db.close();
			}
		})

	}


}

module.exports= Utilisateur;