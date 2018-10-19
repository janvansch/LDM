const mongoose = require('mongoose');
const validator = require('validator');
//const jwt = require('jsonwebtoken');
//const _ = require('lodash');
//const bcrypt = require('bcryptjs');

var PracticeSchema = new mongoose.Schema({
  pracCode: {
    type: String,
    required: true,
    unique: true,
  },
  pracName: {
    type: String,
    required: false
  },
  pracPhone: {
    type: String,
    required: true
  },
  pracEmail: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  pracLeadCount: {
    type: Number,
    required: true
  },
  principle: {
    firstName: {
      type: String,
      //required: true
    },
    surname: {
      type: String,
      //required: true
    },
    phone: {
      type: String,
      //required: true
    },
  	cell: {
      type: String,
      //required: true
    },
    email: {
      type: String,
      required: false,
      trim: true,
      minlength: 1,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
      }
    }
  },
  backOffice: {
    contact: {
      firstName: {
        type: String,
        //required: true
      },
      surname: {
        type: String,
        //required: true
      }
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
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
      }
    }
  },
  area: {
    type: Array,
    required: true
  },
  who: {
    type: String,
    required: false
  }
}, {timestamps: true});

// PracticeSchema.methods.toJSON = function () {
//   var user = this;
//   var practiceObject = user.toObject();
//   return _.pick(practiceObject, ['practice', 'principle', 'backOffice', 'area', 'email', 'createdWhen', 'createdBy']);
// };

var Practice = mongoose.model('Practice', PracticeSchema);

module.exports = {Practice}
