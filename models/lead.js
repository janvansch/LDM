var mongoose = require('mongoose');
var saveEvent = require('../middleware/emitter');

var LeadSchema = new mongoose.Schema({
  //reference: {
  //  type: String,
  //  required: true,
  //  unique: true,
  //},
  langPref: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: false,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    required: true,
    trim: true
  },
  initials: {
    type: String,
    required: false,
    trim: true
  },
  contactNum: {
    type: String,
    required: true
  },
  altNumber: {
    type: String,
    required: false
  },
  cellNumber: {
    type: String,
    required: false
  },
  eMail: {
    type: String,
    required: false,
    trim: true
  },
  agentApproval: {
    type: String,
    required: false
  },
  currentInsurer: {
    type: String,
    default: null
  },
  previousInsurer: {
    type: String,
    default: null,
    trim: true
  },
  lineOfBusiness: {
    type: String,
    default: null,
    trim: true
  },
  contactLocation: {
    postal: {
      type: String,
      required: true
    },
    suburb: {
      type: String,
      trim: true
    },
    streetNum: {
      type: String,
      default: null,
      trim: true
    },
    streetName: {
      type: String,
      default: null,
      trim: true
    },
    buildingName: {
      type:String,
      default: null,
      trim: true
    },
    floor: {
      type:String,
      default: null,
      trim: true
    },
    room: {
      type:String,
      default: null,
      trim: true
    }
  },
  postBox: {
    postalCode: {
      type: String
    },
    boxNumber: {
      type: String
    }
  },
  contactPref: {
    contactDay: {
      type: Array,
      required: false
    },
    time: {
      type: String,
      required: false,
      trim: true
    },
    timeBA: {
      type: String,
      required: false,
      trim: true
    }
  },
  // service: {
  //   type: Array,
  //   required: true
  // },
  // replace service above with this
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
  comments: {
    comment1: {
      type: String,
      default: null,
      trim: true
    },
    comment2: {
      type: String,
      default: null,
      trim: true
    },
    comment3: {
      type: String,
      default: null,
      trim: true
    },
    comment4: {
      type: String,
      default: null,
      trim: true
    }
  },
  allocatedPractice: {
   type: String,
    required: false  
  },
  assignedAdviser: {
    type: String,
    required: false  
   },
  status: {
    type: Array,
    required: true
  },
  who: {
    type: String,
    required: false
  }
},
{timestamps: true});

LeadSchema.post('save', function () {
  var lead = this;
  saveEvent.emit('newLead', lead);
});

var Lead = mongoose.model('Lead', LeadSchema);
module.exports = {Lead};
