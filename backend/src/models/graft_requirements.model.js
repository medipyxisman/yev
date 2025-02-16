const mongoose = require('mongoose');

const graftRequirementsSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  estSqcm: {
    type: Number,
    required: true
  },
  graftBrand: {
    type: String,
    required: true
  },
  graftType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Ordered', 'Received', 'Used', 'Cancelled'],
    default: 'Pending'
  },
  actualSqcmUsed: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('GraftRequirements', graftRequirementsSchema);