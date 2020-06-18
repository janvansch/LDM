//import mongoose from 'mongoose';
var mongoose = require('mongoose');
var saveEvent = require('../middleware/emitter');

var LeadSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: false,
    unique: true,
  },
  langPref: {
    type: String,
    required: true,
    trim: true
  },
  entity: {
    entType: {
      type: String,
      required: true,
      trim: true
    },
    entRefNum: {
      type: String,
      required: false,
      trim: true
    },
  },
  entityName: {
    type: String,
    required: false,
    //default: null,
    trim: true
  },
  lineOfBusiness: {
    type: String,
    //default: null,
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
  contactNum: {
    type: String,
    trim: true,
    required: true
  },
  altNumber: {
    type: String,
    trim: true,
    required: false
  },
  cellNumber: {
    type: String,
    trim: true,
    required: false
  },
  eMail: {
    type: String,
    required: false,
    trim: true
  },
  currentInsurer: {
    type: String,
    //default: null
  },
  previousInsured: {
    // returning customer
    type: String,
    //default: null,
    trim: true
  },
  contactLocation: {
    postal: {
      type: String,
      trim: true,
      required: true
    },
    suburb: {
      type: String,
      trim: true,
      required: true
    },
    streetNum: {
      type: String,
      //default: null,
      trim: true
    },
    streetName: {
      type: String,
      //default: null,
      trim: true
    },
    buildingName: {
      type:String,
      //default: null,
      trim: true
    },
    floor: {
      type:String,
      //default: null,
      trim: true
    },
    room: {
      type:String,
      //default: null,
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
      //default: null,
      trim: true
    },
    comment2: {
      type: String,
      //default: null,
      trim: true
    },
    comment3: {
      type: String,
      //default: null,
      trim: true
    },
    comment4: [{
      date: {
        type: Date,
        default: Date.now
      },
      body: {
        type: String,
        //default: null,
        trim: true
      }
    }]
  },
  // Routing information
  servicerType: {
    type: String,
    enum: ['agent', 'adviser'],
    required: true
  },
  trfApproval: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  allocatedPractice: {
    type: String,
    //default: null
  },
  assignedAdviser: {
    type: String,
    //default: null
  },
  // Progress information
  accepted: {
    type: String,
    default: null
  },
  rejectReason: {
    type: String
  },
  contactDate: {
    type: Date
  },
  viable: {
    type: String
  },
  notViableReason: {
    type: String
  },
  quoteDate: {
    type: Date
  },
  quoteNum: {
    type: String
  },
  quoteState: {
    type: String
  },
  quoteStateDate: {
    type: Date
  },
  quoteDeclineReason: {
    type: String
  },
  pendDate: {
    type: Date
  },
  policyIssueDate: {
    type: Date
  },
  policyNumber: {
    type: String
  },
  policyPremium: {
    type: Number
  },
  policyPremiumFrequency: {
    type: String,
    enum: ['annually', 'monthly'],
  },

  // Processing state information
  statusHistory: [{
    status: {
      type: String,
      enum: ['open', 'allocated', 'assigned', 'closed'],
      default: "open"
    },
    statusDate: {
      type: Date,
      default: Date.now
    }
  }],
  stateHistory: [{
    state: {
      type: String,
      enum: ['none', 'rejected', 'taken', 'no contact', 'contacted', 'viable', 'not viable', 'quoted', 'accepted', 'declined', 'expired', 'issued'],
      default: "unassigned"
    },
    stateDate: {
      type: Date,
      default: Date.now
    }
  }],
  who: {
    type: String,
    required: false
  }
},
{timestamps: true});

// ================================================
//  Before saving
// ================================================
LeadSchema.pre('save', function (next) {
  if (!this.reference) {
    var date = new Date();
    //var yr = date.getFullYear();
    //var mh = date.getMonth() + 1;
    var sd = date.getSeconds();
    var md = date.getMilliseconds();
    var rdm = Math.floor(Math.random() * (100 - 0 + 1) ) + 0;
    //var pmh = mh.toString().padStart(2, '0');
    var psd = sd.toString().padStart(2, '0');
    var pmd = md.toString().padStart(3, '0');
    var pr = rdm.toString().padStart(3, '0');
    //this.reference = yr.toString() + pmh.toString() + "-" + psd + pmd + pr;
    this.reference = psd + "-" + pmd + "-" + pr;
    this.statusHistory.push({
        status : "open",
        statusDate : Date.now,
    });
    this.stateHistory.push({
        state : "none",
        stateDate : Date.now
    });
    next();
  }
  else {
    next();
  }
});

// ===============================================
//  After saving
// ===============================================
LeadSchema.post('save', function () {
  var lead = this;
  saveEvent.emit('newLead', lead);
});

// =============================
//  Export Module
// =============================

var Lead = mongoose.model('Lead', LeadSchema);
module.exports = {Lead};

