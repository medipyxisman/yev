const mongoose = require('mongoose');

const roiTrackingSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealthcareCompany',
    required: true
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyLocation'
  },
  referringProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dateRangeStart: {
    type: Date,
    required: true
  },
  dateRangeEnd: {
    type: Date,
    required: true
  },
  totalSqcmApplied: {
    type: Number,
    default: 0
  },
  revenueMultiplier: {
    type: Number,
    required: true
  },
  totalRevenueEstimated: {
    type: Number,
    default: 0
  },
  totalBdExpenses: {
    type: Number,
    default: 0
  },
  netRoi: {
    type: Number,
    default: 0
  },
  notes: String
}, {
  timestamps: true
});

// Indexes for faster queries
roiTrackingSchema.index({ companyId: 1, dateRangeEnd: -1 });
roiTrackingSchema.index({ locationId: 1 });
roiTrackingSchema.index({ referringProviderId: 1 });

module.exports = mongoose.model('ROITracking', roiTrackingSchema);