const mongoose = require('mongoose');

const documentationTemplateSchema = new mongoose.Schema({
  templateName: {
    type: String,
    required: true
  },
  templateType: {
    type: String,
    required: true,
    enum: ['Wound Assessment', 'Treatment Plan', 'Progress Note']
  },
  requiredFields: [{
    fieldName: String,
    fieldType: String,
    validationRules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DocumentationRule' }]
  }],
  defaultValues: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  formattingRules: {
    type: Map,
    of: String
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DocumentationTemplate', documentationTemplateSchema);