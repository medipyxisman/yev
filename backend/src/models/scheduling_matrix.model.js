const mongoose = require('mongoose');

const schedulingMatrixSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  patientAddress: {
    type: String,
    required: true
  },
  providerAddress: {
    type: String,
    required: true
  },
  patientLatitude: {
    type: Number,
    required: true
  },
  patientLongitude: {
    type: Number,
    required: true
  },
  providerLatitude: {
    type: Number,
    required: true
  },
  providerLongitude: {
    type: Number,
    required: true
  },
  distanceKm: {
    type: Number,
    required: true
  },
  providerUtilization: {
    type: Number,
    required: true
  },
  suggestedDay: {
    type: Date,
    required: true
  },
  suggestedTime: {
    type: String,
    required: true
  },
  appointmentDuration: {
    type: Number,
    default: 30
  },
  bufferTime: {
    type: Number,
    default: 15
  },
  suggestedRoute: String,
  trafficData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  routeOptimizationData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  etaSentToPatient: {
    type: Boolean,
    default: false
  },
  etaTimestamp: Date,
  isOverridden: {
    type: Boolean,
    default: false
  },
  overrideReason: String,
  providerFeedback: String
}, {
  timestamps: true
});

// Index for geospatial queries
schedulingMatrixSchema.index({
  patientLocation: '2dsphere',
  providerLocation: '2dsphere'
});

module.exports = mongoose.model('SchedulingMatrix', schedulingMatrixSchema);