//import mongoose from 'mongoose';
var mongoose = require('mongoose');
var saveEvent = require('../middleware/emitter');

var LeadSchema = new mongoose.Schema({
  reference: {type: String, required: false, unique: true},
  langPref: {type: String, required: true, trim: true},
  entity: {
    entType: {type: String, required: true, trim: true},
    entRefNum: {type: String, required: false, trim: true},
  },
  entityName: {type: String, required: false, trim: true},
  lineOfBusiness: {
    type: String,
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
    type: String
  },
  previousInsured: { // returning customer
    type: String,
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
      trim: true
    },
    streetName: {
      type: String,
      trim: true
    },
    buildingName: {
      type: String,
      trim: true
    },
    floor: {
      type: String,
      trim: true
    },
    room: {
      type:String,
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
      trim: true
    },
    comment2: {
      type: String,
      trim: true
    },
    comment3: {
      type: String,
      trim: true
    },
    comment4: [{
      date: {
        type: Date,
        default: Date.now
      },
      body: {
        type: String,
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
    trim: true,
    default: 'none'
  },
  assignedAdviser: {
    type: String,
    trim: true,
    default: 'none'
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
  noContact: {
    type: Boolean,
    default: false
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
      default: "none"
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
        statusDate : Date.now
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
  if (lead.servicerType !== "agent") {
    saveEvent.emit('newLead', lead);
  }
  else {
    console.log("---> Agent, no allocation required");
  }

});

// =============================
//  Export Module
// =============================

var Lead = mongoose.model('Lead', LeadSchema);
module.exports = {Lead};

