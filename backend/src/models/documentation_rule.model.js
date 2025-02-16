const mongoose = require('mongoose');

const documentationRuleSchema = new mongoose.Schema({
  ruleCategory: {
    type: String,
    required: true,
    enum: ['Clinical', 'Insurance', 'Regulatory']
  },
  ruleType: {
    type: String,
    required: true,
    enum: ['Required Field', 'Format', 'Validation']
  },
  fieldName: {
    type: String,
    required: true
  },
  validationExpression: String,
  errorMessage: String,
  suggestionMessage: String
}, {
  timestamps: true
});

module.exports = mongoose.model('DocumentationRule', documentationRuleSchema);