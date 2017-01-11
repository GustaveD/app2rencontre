var express = require('express');
var router = express.Router();
let bodyParser = require('body-parser');
let async = require('async');
var Utilisateur = require('../models/utilisateur.js');
var sanitizeHtml = require('sanitize-html');
var bcrypt = require('bcryptjs');
var multer = require('multer')


router.use(bodyParser.urlencoded({ extended: false }));

function requireLogin (req, res, next) {
	if (!req.user) {
		console.log('NOOOPE')
		res.redirect('/');
	} else {
		next();
	}
};

router.get('/', requireLogin, function(req, res, next) {
	Utilisateur.queryByPseudo(req.session.user.pseudo, (user, err)=>{
	res.render('profile', {user: user[0]});
	})
  
});

router.post('/email', function(req, res){
	Utilisateur.changeEmail(req.session.user.pseudo, sanitizeHtml(req.body.email), (result, err)=>{
		if (err) res.status(200).send('');
		else res.status(200).send('Le mail a bien été modifé');
	})
})
router.post('/pwd', function(req, res){
	Utilisateur.changePwd(req.session.user.pseudo, req.body.pwd, (result, err)=>{
		if (err) res.status(200).send('une erreur de serveur est intervenue');
		else res.status(200).send('Le pwd a bien été modifé');
	})
})
router.post('/nom', function(req, res){
	Utilisateur.changeNom(req.body.nom, req.body.prenom, req.session.user.pseudo, (result, err)=>{
		if (err) res.status(200).send('');
		else res.status(200).send('Le nom a bien été modifé');
	})
})
router.post('/gender', function(req, res){
	Utilisateur.changeGender(req.body.sexe, req.body.pref, req.session.user.pseudo, (result, err)=>{
		if (err) res.status(200).send('');
		else res.status(200).send('Comme tu veux');
	})
})
router.post('/tag', function(req, res){
	var hashtag = require('find-hashtags');
	var tag = JSON.parse(req.body.tag);
	var tag2 =hashtag(req.body.tag2)


	for (var i =0 ; i < tag.length; i++)
		tag2.push(tag[i])


	console.log('reqbodytag', tag2)
	Utilisateur.changeTagAndBio(tag2, req.body.bio, req.session.user.pseudo, (result, err)=>{
		if (err) res.status(200).send('');
		else res.status(200).send('La bio a été modifié');
	})
})

router.post('/geo', function(req, res){
	var NodeGeocoder = require('node-geocoder');
		var options = {
  			provider: 'google',
  			httpAdapter: 'https', 
  			apiKey: 'AIzaSyD147j2Z24YygItMAkU4OrYnnnsICOGtlU',
  			formatter: null
		};
		var geocoder = NodeGeocoder(options);
		console.log('lat et long:', req.body.lat, req.body.lon);

		geocoder.reverse({'lat': req.body.lat, 'lon': req.body.lon}, (err, resu)=>{
			if (err){
				console.log(err)
				res.status(200).send('town not found');
			}
			else{
				console.log(resu[0].city, resu[0].country)
				Utilisateur.changeGeo(req.body.lat, req.body.lon, req.session.user.pseudo, (result, err)=>{
					if (err){
						console.log(err)
						res.status(200).send('erreur de serveur est intervenue');
					}
					else if (resu[0].city) res.status(200).send(resu[0].city)
					else res.status(200).send(resu[0].country)
				})
			}
		})

})

router.post('/img', (req, res)=>{
	var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/img');
  },
  filename: function (req, file, callback) {

  	console.log('file', file);
  	if (file.mimetype == 'image/jpeg'){
	
		var	path =  file.fieldname + '-' + Date.now() + '.jpg';
		Utilisateur.uploadImg(req.session.user.pseudo, path, (res, err)=>{

				if (err)
					callback(err);
				else callback('ok')
				
			})
			callback(null, path);
		}
	else callback('JUSTE JPG')


  	console.log('JE SUIS LA AU MNOINS', file)
    callback(null, 'coucouc');
  }
});
	var upload = multer({ storage : storage}).single('userImg');

	console.log('tupasse?')

	upload(req,res,function(err) {
        if(err) {
            return res.status(200).send("Error uploading file.");
        }
        console.log('coucou final')
        res.status(200).send("File is uploaded");
    });
})


router.post('/delImg', (req, res)=>{

	Utilisateur.deleteImg(req.session.user.pseudo, req.body.path, (err, result)=>{
		if (err) res.status(200).send("Erreur Interne")
		else res.status(200).send("Bien supprimée")
	})

})

router.post('/changeProfilePic', (req, res)=>{

	Utilisateur.changeProfilePic(req.session.user.pseudo, req.body.path, req.body.i, (err, result)=>{
		if (err) res.status(200).send("Erreur Interne")
		else res.status(200).send("Bien supprimée")
	})

})




module.exports = router;