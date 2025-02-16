const mongoose = require('mongoose');
const User = require('../models/user.model');
const Patient = require('../models/patient.model');
const WoundCase = require('../models/wound.model');
const Visit = require('../models/visit.model');
const BusinessDevExpense = require('../models/business_dev_expense.model');
const DocumentationRule = require('../models/documentation_rule.model');
const DocumentationTemplate = require('../models/documentation_template.model');
const DocumentationValidation = require('../models/documentation_validation.model');
const WoundMeasurementHistory = require('../models/wound_measurement_history.model');
const GraftRequirements = require('../models/graft_requirements.model');
const ExecutiveDashboardMetrics = require('../models/executive_dashboard_metrics.model');
const ProviderUtilization = require('../models/provider_utilization.model');
const ROITracking = require('../models/roi_tracking.model');

const models = [
  User,
  Patient,
  WoundCase,
  Visit,
  BusinessDevExpense,
  DocumentationRule,
  DocumentationTemplate,
  DocumentationValidation,
  WoundMeasurementHistory,
  GraftRequirements,
  ExecutiveDashboardMetrics,
  ProviderUtilization,
  ROITracking
];

async function initializeDatabase() {
  try {
    // Check each model's collection
    for (const Model of models) {
      const collectionName = Model.collection.name;
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionExists = collections.some(col => col.name === collectionName);

      if (!collectionExists) {
        console.log(`Creating collection: ${collectionName}`);
        await mongoose.connection.db.createCollection(collectionName);

        // Create indexes if defined in schema
        if (Model.schema.indexes().length > 0) {
          console.log(`Creating indexes for ${collectionName}`);
          await Model.createIndexes();
        }
      } else {
        console.log(`Collection ${collectionName} already exists`);
      }
    }

    console.log('Database initialization completed');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

module.exports = {
  initializeDatabase
};