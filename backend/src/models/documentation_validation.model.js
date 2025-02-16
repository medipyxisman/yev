const mongoose = require('mongoose');

const documentationValidationSchema = new mongoose.Schema({
  encounterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClinicalEncounter',
    required: true
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentationTemplate',
    required: true
  },
  submissionTimestamp: {
    type: Date,
    default: Date.now
  },
  validationStatus: {
    type: String,
    enum: ['Pending', 'Complete', 'Has Errors'],
    default: 'Pending'
  },
  validationResults: [{
    fieldName: String,
    isValid: Boolean,
    errorMessage: String,
    suggestedFix: String
  }],
  aiSuggestions: [{
    fieldName: String,
    suggestion: String,
    confidence: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('DocumentationValidation', documentationValidationSchema);