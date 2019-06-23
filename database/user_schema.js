var crypto = require('crypto');

var Schema = { };

Schema.createSchema = function(mongoose) {
	var UserSchema = mongoose.Schema({
		id			: { type: String, required: true, unique: true },
		hashed_pw	: { type: String, required: true },
		salt		: { type: String, required: true },
		name		: { type: String, required: true, index: 'hashed' },
		email		: { type: String, required: true },
		school_first: { type: String, 'default': '없음' },
		school_last	: { type: String, 'default': '없음' },
		grade		: Number,
		created_at  : { type: Date, index: { unique: false }, 'default': Date.now },
		updated_at  : { type: Date, index: { unique: false }, 'default': Date.now },
		rank		: { type: String, index: 'hashed', 'default': '초보' },
		group_id	: Number,
		solved_id	: { type: Array, 'default': [] },
		attemped_id : { type: Array, 'default': [] },
		my_lec_id   : { type: Array, 'default': [] },
		dark_mode   : { type: Boolean, 'default': false }
	}, {
		toObject: {
			virtuals: true
		},
		toJSON: {
			virtuals: true 
		}
	});

	// rank_color를 virtual로 정의
	UserSchema
		.virtual('rank_color')
		.get(function() { 
			switch (this.rank) {
				case "초보":
					return "blue";
				
				case "중수":
					return "teal";

				case "고수":
					return "green";

				case "고인물":
					return "yellow";
				
				case "썩은물":
					return "orange";

				case "챌린저":
					return "red";

				case "관리자":
					return "pink";

				default:
					return "grey";
			}
		})
	;
	
	// school을 virtual로 정의
	UserSchema
		.virtual('school')
		.get(function() { return this.school_first + this.school_last; })
	;

	// password를 virtual로 정의
	UserSchema
		.virtual('password')
		.set(function(password) {
			this._password = password;
			this.salt = this.makeSalt();
			this.hashed_pw = this.encryptPassword(password);
		})
		.get(function() { return this._password; })
	;

	// 암호화 메서드 정의
	UserSchema.method('encryptPassword', function(plain, salt) {
		if (salt) {
			return crypto.createHmac('sha1', salt).update(plain).digest('hex');
		} else {
			return crypto.createHmac('sha1', this.salt).update(plain).digest('hex');
		}
	});

	// salt값 생성 메서드 정의
	UserSchema.method('makeSalt', function() { return Math.round((new Date()).valueOf() * Math.random()) + ''; });

	// 암호화 값 비교 메서드 정의
	UserSchema.method('authenticate', function(plain, salt, hashed) {
		if (salt) {
			return this.encryptPassword(plain, salt) == hashed;
		} else {
			return this.encryptPassword(plain) == this.hashed_pw;
		}
    });
    
    UserSchema.static('findById', function(id, callback) {
        return this.find({ "id": id }, callback);
	});
	
	UserSchema.static('findAll', function(id, callback) {
		return this.find({ }, callback);
	});

	// 필드 값 검사
	UserSchema.path('id').validate(function(id) { return id.length; }, "id 값이 없습니다.");
    UserSchema.path('name').validate(function(name) { return name.length; }, "name 값이 없습니다.");
    
    return UserSchema;
}

module.exports = Schema;
