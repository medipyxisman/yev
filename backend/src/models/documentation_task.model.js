const mongoose = require('mongoose');

const documentationTaskSchema = new mongoose.Schema({
  validationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentationValidation',
    required: true
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskType: {
    type: String,
    required: true,
    enum: ['Missing Info', 'Format Error', 'Validation Error']
  },
  taskStatus: {
    type: String,
    required: true,
    enum: ['Open', 'In Progress', 'Complete'],
    default: 'Open'
  },
  fieldName: String,
  currentValue: String,
  requiredValue: String,
  dueDate: Date,
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('DocumentationTask', documentationTaskSchema);