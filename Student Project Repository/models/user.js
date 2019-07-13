var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});


//Authenticate Input TO DB

userSchema.statics.authenticate = function(email, password, callback) {

    User.findOne({ email: email })
        .exec(function(err, user) {
            if (err) {
                return callback(err);
            } else if (!user) {
                var err = new Error("User Not Found");
                err.status = 401;
                return callback(err);
            }

            bcrypt.compare(password, user.password, function(err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            });
        });
}

//Hashing a password before saving it
userSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            return callback(err);
        }
        user.password = hash;
        next();
    });
});

var User = mongoose.model('User', userSchema);
module.exports = User;