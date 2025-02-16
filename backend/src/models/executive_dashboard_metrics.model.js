const mongoose = require('mongoose');

const executiveDashboardMetricsSchema = new mongoose.Schema({
  metricDate: {
    type: Date,
    required: true
  },
  metricType: {
    type: String,
    required: true,
    enum: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'YTD']
  },
  referralsByBd: {
    type: Map,
    of: Number
  },
  activitiesByBd: {
    type: Map,
    of: {
      meetings: Number,
      calls: Number,
      emails: Number
    }
  },
  medicareTraditionalCount: Number,
  otherInsuranceCount: Number,
  totalGraftingVisits: Number,
  totalSqcmGrafted: Number,
  patientsGraftedCount: Number,
  patientsNotReadyCount: Number,
  patientsNotEligibleCount: Number,
  graftedEncountersByProvider: {
    type: Map,
    of: Number
  },
  providerUtilization: {
    type: Map,
    of: Number
  }
}, {
  timestamps: true
});

// Indexes for faster queries
executiveDashboardMetricsSchema.index({ metricDate: -1, metricType: 1 });

module.exports = mongoose.model('ExecutiveDashboardMetrics', executiveDashboardMetricsSchema);