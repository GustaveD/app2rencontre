var express = require('express');
var router = express.Router();
let bodyParser = require('body-parser');
let async = require('async');
let Utilisateur = require('../models/utilisateur.js');
let geolib = require('geolib');


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
	res.render('dashboard', {user: user[0]});
	})
});

router.post('/dash', (req, res, next)=>{

	console.log('DASHH:', 'sexe: ', req.body.sexe, '-', 'Pref: ', req.body.pref,
		'geo: ', req.body.geo, 'tag: ', req.body.tag.split(','));

	var userTags = req.body.tag.split(',');

	for (var i = 0; i < req.body.tag.length; i++) {
		console.log('tag::: ',req.body.tag[i]);
	}



	Utilisateur.queryAllUsersByPref(req.body.sexe, req.body.pref, (users, err)=>{
		if (err) res.status(200).send('');
		else{
			var dist;

			console.log('Avant,', users);
			for (i = 0; i<users.length; i++){
				console.log('usergeO: ', JSON.parse(req.body.geo), 'autre geo:', users[i].geo)
				dist = geolib.getDistance(JSON.parse(req.body.geo), users[i].geo);
				users[i].dist = geolib.convertUnit('km', dist, 0);
			}
			users.sort(function(a, b){
				return a.dist - b.dist;
			})
			console.log('Apres:' ,users)
			
			for (i = 0; i < users.length; i++){
				var sameTag = 0;
				for (j = 0; j < users[i].tags.length; j++){
					console.log(users[i].tags[j])
					if(userTags.indexOf(users[i].tags[j])){
						sameTag++;
						users[j].sameTag = sameTag;
					}
				}
			}
			users.sort(function(a, b){
				return a.sameTag - b.sameTag;
			})
			console.log('APres TAG:', users)



			res.status(200).send(JSON.stringify(users));
		}
	})

})

module.exports = router;