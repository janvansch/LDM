const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  status: {
    type: String,
    trim: true
  },
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  surname: {
    type: String,
    trim: true,
    required: true
  },
  phone: {
    type: String,
    trim: true,
    required: false
  },
	cell: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  roleCode: {
    type: String,
    trim: true,
    required: true
  },
  practiceCode: {
    type: String,
    trim: true,
    required: false
  },
  adviserCode: {
    type: String,
    trim: true,
    required: false
  },
  services: [{
    line: {
      type: String,
      required: false
    },
    types: {
      type: Array,
      required: false
    }
  }],
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
}, {timestamps: true});

// UserSchema.methods.toJSON = function () {
//   var user = this;
//   var userObject = user.toObject();
//   return _.pick(userObject, ['_id', 'email', 'roleCode', 'practiseCode', 'skill']);
// };

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  //return _.pick(userObject, ['_id', 'email', 'roleCode', 'practiceCode', 'skill']);
  // Maybe password should be excluded here,
  // then it will not be mistakenly returned to the client
  return userObject;
};

UserSchema.methods.generateAuthToken = function () {
  // console.log("---> Start Generating Auth Token: ");
  var user = this;
  // console.log("---> This User: ", user);
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
  // console.log("---> This Token: ", token);
  user.tokens.push({access, token});
  // console.log("---> This User's Tokens: ", user.tokens);
  return user.save().then(() => {
    // console.log("---> Auth Token Generated : ", token);
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;
  //
  // Consider limiting what data is returned -
  // maybe only '_id', 'roleCode', 'practiceCode', 'email'
  // then the _pick is not required in login function's Send
  // see toJSON method above
  //
  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User}
