var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var database = require('./database');

passport.use('local-login', new LocalStrategy({
	usernameField		: 'id',
	passwordField		: 'password',
	passReqToCallback	: true
}, function(req, id, password, done) {
	database.authUser(id, password, function(err, user, info) {
		if (err) return done(err);

		if (info) {
			if (info == id) {
				// 아이디와 일치하는 사용자 없음
				return done(null, false, req.flash('loginMessage', '계정이 존재하지 않습니다!'));
			} else if (info == password) {
				// 비밀번호가 맞지 않음
				return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다!'));
			}
		}

		return done(null, user);
	});
}));

passport.use('local-register', new LocalStrategy({
	usernameField		: 'id',
	passwordField		: 'password',
	passReqToCallback	: true
}, function(req, id, password, done) {
	var paramName = req.body.name || req.query.name;
	var paramEmail = req.body.email || req.query.email;

	var paramSchoolFirst = req.body.school || req.query.school;
	var paramSchoolLast = req.body.stype || req.query.stype;
	var paramGrade = req.body.grade || req.query.grade;

	process.nextTick(function() {
		database.addUser({
			"id"			: id,
			"password"		: password,
			"name"			: paramName,
			"email"			: paramEmail,
			"school_first"	: paramSchoolFirst,
			"school_last"	: paramSchoolLast,
			"grade"			: paramGrade
		}, function(err, user, info) {
			if (err) return done(err);

			var registerMessage = { };

			if (!id) {
				registerMessage.id = "아이디를 입력하세요!";
			}

			if (!password) {
				registerMessage.password = "비밀번호를 입력하세요!";
			}

			if (!paramName) {
				registerMessage.name = "이름을 입력하세요!";
			}

			if (!paramEmail) {
				registerMessage.email = "이메일을 입력하세요!";
			}

			if (info && info == id) {
				// 계정이 이미 있음
				registerMessage.id = "이미 사용중인 아이디입니다!";
			}

			if (Object.keys(registerMessage).length == 0) {
				return done(null, false, req.flash('registerMessage', registerMessage));
			}

			return done(null, user);
		});
	});
}));

passport.use('edit-profile', new LocalStrategy({
	usernameField		: 'id',
	passwordField		: 'password',
	passReqToCallback	: true
}, function(req, id, password, done) {
	var paramName = req.body.name || req.query.name;
	var paramEmail = req.body.email || req.query.email;

	var paramDark = req.body.dark || req.query.dark;
	
	info = { };

	info.id = id;
	info.password = password;
	
	if (paramName) {
		info.name = paramName;
	}
	
	if (paramEmail) {
		info.email = paramEmail;
	}

	info.dark = paramDark;

	process.nextTick(function() {
		database.editUser(info, function(err, user) {
			if (err) return done(err);
			
			var profileMessage = { };
			
			if (!user) {
				profileMessage.password = "비밀번호가 일치하지 않습니다!";
			}

			if (Object.keys(profileMessage).length != 0) {
				console.log('no done');
				return done(null, false, req.flash('profileMessage', profileMessage));
			}

			return done(null, user);
		});
	});
}));

passport.serializeUser(function(user, done) {
	// 사용자 인증 성공
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	// 사용자 요청 응답
	done(null, user);
});

module.exports = passport;