const mongoose = require('mongoose');

const providerUtilizationSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  visitsCompleted: {
    type: Number,
    default: 0
  },
  utilizationPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for faster queries
providerUtilizationSchema.index({ providerId: 1, date: -1 });
providerUtilizationSchema.index({ date: -1 });

module.exports = mongoose.model('ProviderUtilization', providerUtilizationSchema);