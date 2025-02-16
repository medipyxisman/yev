const mongoose = require('mongoose');

const businessDevExpenseSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealthcareCompany',
    required: true
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyLocation'
  },
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LocationContact'
  },
  expenseType: {
    type: String,
    required: true,
    enum: ['Travel', 'Meals', 'Marketing', 'Events', 'Other']
  },
  amount: {
    type: Number,
    required: true
  },
  dateIncurred: {
    type: Date,
    required: true
  },
  paymentMethod: String,
  receiptPhotoUrl: String,
  receiptUploadDate: Date,
  expenseStatus: {
    type: String,
    enum: ['Draft', 'Submitted', 'Approved', 'Rejected'],
    default: 'Draft'
  },
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('BusinessDevExpense', businessDevExpenseSchema);