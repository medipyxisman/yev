import { screens, type ScreenName } from './screens';

export const routes: Record<ScreenName, string> = {
  // Main navigation
  dashboard: '/',
  patients: '/patients',
  schedule: '/schedule',
  inventory: '/inventory',
  reports: '/reports',
  settings: '/settings',

  // Patient screens
  patientDetails: '/patients/:id',
  medicalInfo: '/patients/:id/medical',
  documents: '/patients/:id/documents',
  chat: '/patients/:id/chat',
  calendar: '/patients/:id/calendar',
  staff: '/patients/:id/staff',
  woundCases: '/patients/:id/wounds',

  // Wound case screens
  woundCaseDetails: '/patients/:patientId/wounds/:caseId',
  visitHistory: '/patients/:patientId/wounds/:caseId/visits',
  visitDetails: '/patients/:patientId/wounds/:caseId/visits/:visitId',
  newWoundCase: '/patients/:patientId/wounds/new',

  // Business development
  bdDashboard: '/business-development',
  referralManagement: '/business-development/referrals',
  providerDatabase: '/business-development/providers',
  roiTracking: '/business-development/roi',

  // Executive
  executiveDashboard: '/executive',
  announcements: '/executive/announcements',
  analytics: '/executive/analytics'
};