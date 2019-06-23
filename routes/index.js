var express = require('express');
var router = express.Router();

var database = require('../database/database');
var passport = require('../database/passport');

var alert = require('../alert');

function getUser(req) {
	if (!req.user) return req.user;

	if (Array.isArray(req.user)) {
		return req.user[0];
	} else {
		return req.user;
	}
}

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { 
		title	: 'RealCoder',
		user	: getUser(req)
	});
});

/* Login */
router.get('/login', function(req, res, next) {
	res.render('login', {
		title	: '로그인',
		message	: req.flash('loginMessage'),
		user	: getUser(req)
	})
})

router.post('/login', passport.authenticate('local-login', {
	successRedirect	: '/',
	failureRedirect	: '/login',
	failureFlash	: true
}));

/* GET code page. */
router.get('/code', function(req, res, next) {
	var problem_number = req.query.problem;
	res.render('code', { 
		title	: '코드 제출하기', 
		problem	: problem_number,
		user	: getUser(req)
	 });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
	res.render('register', { 
		title	: 'RealCoder', 
		message	: req.flash('registerMessage')[0] || { },
		user	: getUser(req)
	});
});

router.post('/register', passport.authenticate('local-register', {
	successRedirect	: '/',
	failureRedirect	: '/register',
	failureFlash	: true
}));

router.get('/profile', function(req, res, next) {
	if (!req.isAuthenticated()) {
		// 인증 안됨
		res.redirect('/');
		return;
	}

	// 인증 완료
	res.render('profile', { 
		title	: '내 설정',
		message	: req.flash('profileMessage')[0] || { },
		user	: getUser(req)
	});
});

router.post('/profile', passport.authenticate('edit-profile', {
	successRedirect	: '/',
	failureRedirect	: '/profile',
	failureFlash	: true
}));

router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/');
})

module.exports = router;
