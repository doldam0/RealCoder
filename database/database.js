var mongoose = require('mongoose');
var crypto = require('crypto');

var Database;
var UserSchema;
var UserModel;

// DB setup
var database = {
    isConnected: function() {
		return Database; 
	},
    connectDB: function() {
        var databaseUrl = 'mongodb://localhost:27017/local';
        
        mongoose.Promise = global.Promise;
        mongoose.connect(databaseUrl);
        Database = mongoose.connection;

        Database.on('error', console.error.bind(console, "mongoose connection error."));
        Database.on('open', function() {
            console.log('database connected.');
		});
		
		UserSchema = require('./user_schema').createSchema(mongoose);

        UserModel = mongoose.model('users', UserSchema);
        console.log("define user model");

        Database.on('disconnected', function() {
            console.log("Database server has been disconnected. Please wait 5 sec.");
            setInterval(this.connectDB, 5000);
        });
    },
	findUser: function(id, callback) {
		UserModel.findById(id, function(err, results) {
            if (err) {
                callback(err);
                return;
            };

            if (results.length > 0) {
                callback(null, results);
            } else {
                callback(null, null);
            }
		});
	},
    authUser: function(id, password, callback) {
        this.findUser(id, function(err, results) {
            if (err) {
                callback(err);
                return;
            }

            if (results) {
				// 아이디 일치하는 사용자 찾음
				
				var user = results[0];
				var authenticated = user.authenticate(password);

				if (authenticated) {
					// 비밀번호 일치
					callback(null, results);
				} else {
					// 비밀번호 불일치
					callback(null, null, password);
				}
            } else {
                // 아이디 일치하는 사용자 없음
                callback(null, null, id);
            }
        });
    },
    addUser: function(info, callback) {
        this.findUser(info.id, function(err, results) {
            if (err) {
                callback(err);
                return;
            }

            if (results) {
                callback(null, null, info.id);
                return;
            }

            var user = new UserModel(info);
            user.save(function(err) {
                if (err) {
                    callback(err);
                    return;
                }
    
                callback(null, user);
            });
        });
    },
    editUser: function(info, callback) {
        this.authUser(info.id, info.password, function(err, user, result) {
            if (err) {
                callback(err, null);
                return;
            }

            if (result == info.password) {
                callback(null, null);
                return;
            }

            UserModel.where({ id: info.id }).update(info, function(err) {
                if (err) {
                    callback(err, null);
                }

                callback(null, user);
            })
        });
    }
}

module.exports = database;