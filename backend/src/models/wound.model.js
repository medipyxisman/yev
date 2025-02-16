const mongoose = require('mongoose');

const woundSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'pressure_ulcer',
      'diabetic_ulcer',
      'venous_ulcer',
      'arterial_ulcer',
      'surgical_wound',
      'traumatic_wound',
      'other'
    ]
  },
  status: {
    type: String,
    enum: ['active', 'healed', 'worsening', 'stable'],
    default: 'active'
  },
  identifiedDate: {
    type: Date,
    required: true
  },
  healedDate: Date,
  initialMeasurements: {
    length: Number,
    width: Number,
    depth: Number,
    area: Number
  },
  etiology: String,
  notes: String,
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for faster queries
woundSchema.index({ patient: 1, status: 1 });
woundSchema.index({ identifiedDate: -1 });
woundSchema.index({ active: 1 });

module.exports = mongoose.model('Wound', woundSchema);