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
  agentApproval: {
    type: String,
    required: true
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
      required: true
    },
    suburb: {
      type: String,
      trim: true
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
  allocatedPractice: {
    type: String,
    //default: null  
  },
  assignedAdviser: {
    type: String,
    //default: null  
  },
  statusHistory: [{
    status: {
      // open, allocated, assigned, closed
      // open, allocated, assigned, contacted, docs, quote, issue, closed
      type: String,
      default: "open"
    },
    statusDate: {
      type: Date,
      default: Date.now
    }
  }],
  // stateHistory: [{
  //   state: {
  //     // pending, contacted, docs, quote, issue
  //     type: String,
  //     default: "pending" 
  //   },
  //   stateDate: {
  //     type: Date,
  //     default: Date.now
  //   }
  // }],
  outcome: {
    // lost, rejected, accepted
    type: String,
    //default: null
  },
  policyNumber: {
    type: String,
    //default: null  
   },
  who: {
    type: String,
    required: false
  }
},
{timestamps: true});

LeadSchema.pre('save', function (next) {
  if (!this.reference) {
    // this.reference = generateReference();
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
    next();
  } 
  else {
    next();
  }
});

LeadSchema.post('save', function () {
  var lead = this;
  saveEvent.emit('newLead', lead);
});

var Lead = mongoose.model('Lead', LeadSchema);
module.exports = {Lead};
