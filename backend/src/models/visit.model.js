const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  wound: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wound',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  measurements: {
    length: Number,
    width: Number,
    depth: Number,
    area: Number,
    undermining: {
      present: Boolean,
      location: String,
      depth: Number
    },
    tunneling: {
      present: Boolean,
      location: String,
      depth: Number
    }
  },
  assessment: {
    tissueType: {
      type: Map,
      of: Number // Percentage of each tissue type
    },
    exudate: {
      amount: {
        type: String,
        enum: ['none', 'light', 'moderate', 'heavy']
      },
      type: {
        type: String,
        enum: ['serous', 'sanguineous', 'serosanguineous', 'purulent']
      }
    },
    periwoundSkin: {
      macerated: Boolean,
      erythema: Boolean,
      indurated: Boolean,
      intact: Boolean
    },
    pain: {
      level: {
        type: Number,
        min: 0,
        max: 10
      },
      characteristics: String
    }
  },
  treatment: {
    cleansing: String,
    debridement: {
      performed: Boolean,
      method: String,
      notes: String
    },
    dressing: {
      primary: String,
      secondary: String,
      frequency: String
    },
    medications: [{
      name: String,
      dosage: String,
      route: String
    }]
  },
  images: [{
    url: String,
    type: {
      type: String,
      enum: ['overview', 'closeup', 'measurement']
    },
    uploadedAt: Date
  }],
  notes: String
}, {
  timestamps: true
});

// Indexes for faster queries
visitSchema.index({ wound: 1, date: -1 });
visitSchema.index({ provider: 1 });

module.exports = mongoose.model('Visit', visitSchema);