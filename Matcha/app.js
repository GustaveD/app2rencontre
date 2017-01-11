let express = require('express');
let app = express();
let http = require('http');
var server = http.createServer(app).listen(3000);
let bodyParser = require('body-parser');


let path = require('path');
let session = require('express-session');
let cookieParser = require('cookie-parser');

let index = require('./routes/index');
let connexion = require('./routes/connexion');
let inscription = require('./routes/inscription');
let dashboard = require('./routes/dashboard');
let profile = require('./routes/profile');

let Utilisateur = require('./models/utilisateur')


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use( express.static( "public" ) );


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



app.use(session({
	secret: process.env.SESSION_SECRET || 'secret',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}))

app.use((req, res, next)=>{
	console.log('ahahah');
  if (req.session && req.session.user){
  	console.log('regiSTRATOR')
    Utilisateur.queryByPseudo(req.session.user.pseudo, (result, err)=>{
      if (err){
        console.log(err)
      }else{
        if (result[0])
        {
          req.user = result[0];
          delete req.user.pwd;
          req.session.user = result[0];
          res.locals.user = result[0];

        } else{

        }
        next();
      }
    })
  } else{
    next();
  }
})



app.use('/', index);
app.use('/connexion', connexion);
app.use('/inscription', inscription);
app.use('/dashboard', dashboard);
app.use('/profile', profile);

module.exports = app;
