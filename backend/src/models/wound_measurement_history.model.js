const mongoose = require('mongoose');

const woundMeasurementHistorySchema = new mongoose.Schema({
  woundVisitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visit',
    required: true
  },
  measurementType: {
    type: String,
    required: true,
    enum: ['Length', 'Width', 'Depth']
  },
  valueCm: {
    type: Number,
    required: true
  },
  referenceMarkerUsed: {
    type: Boolean,
    default: false
  },
  referenceMarkerType: {
    type: String,
    enum: ['Paper ruler', 'Disposable ruler']
  },
  referenceScaleCm: Number,
  measurementMethod: {
    type: String,
    required: true,
    enum: ['Manual', 'AI-Assisted', 'Reference Marker']
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  manuallyVerified: {
    type: Boolean,
    default: false
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 1
  },
  measuredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  measuredAt: {
    type: Date,
    required: true
  },
  verifiedAt: Date,
  notes: String
}, {
  timestamps: true
});

// Indexes for faster queries
woundMeasurementHistorySchema.index({ woundVisitId: 1, measurementType: 1 });
woundMeasurementHistorySchema.index({ measuredBy: 1 });
woundMeasurementHistorySchema.index({ measuredAt: -1 });

module.exports = mongoose.model('WoundMeasurementHistory', woundMeasurementHistorySchema);