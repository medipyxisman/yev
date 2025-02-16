// Screen registry for the application
export const screens = {
  // Main navigation
  dashboard: 'Dashboard',
  patients: 'Patients',
  schedule: 'Schedule',
  inventory: 'Inventory',
  reports: 'Reports',
  settings: 'Settings',

  // Patient screens
  patientDetails: 'PatientDetails',
  medicalInfo: 'MedicalInfo',
  documents: 'Documents',
  chat: 'Chat',
  calendar: 'Calendar',
  staff: 'Staff',
  woundCases: 'WoundCases',

  // Wound case screens
  woundCaseDetails: 'WoundCaseDetails',
  visitHistory: 'VisitHistory',
  visitDetails: 'VisitDetails',
  newWoundCase: 'NewWoundCase',

  // Business development
  bdDashboard: 'BDDashboard',
  referralManagement: 'ReferralManagement',
  providerDatabase: 'ProviderDatabase',
  roiTracking: 'ROITracking',

  // Executive
  executiveDashboard: 'ExecutiveDashboard',
  announcements: 'Announcements',
  analytics: 'Analytics'
} as const;

export type ScreenName = keyof typeof screens;