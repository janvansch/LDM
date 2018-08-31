const mongoose = require('mongoose');
const validator = require('validator');
//const jwt = require('jsonwebtoken');
//const _ = require('lodash');
//const bcrypt = require('bcryptjs');

var PracticeSchema = new mongoose.Schema({
  practise: {
    Name: {
      type: String,
      required: false
    },
    Code: {
      type: String,
      required: true
    },
    phone: {
      type: String,
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
    }
  },
  principle: {
    firstName: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
  	cell: {
      type: String,
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
    }
  },
  backOffice: {
    firstName: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    },
    phone: {
    type: String,
    required: false
    },
  	cell: {
      type: String,
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
    }
  },
  Area: {
    type: array,
    required: true
  }
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email', 'roleCode', 'practiseCode', 'skill']);
};

var Practice = mongoose.model('Practice', PractiseSchema);

module.exports = {Practice}
