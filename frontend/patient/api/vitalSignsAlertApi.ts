import { VitalSigns } from './vitalSignsApi';

export interface VitalSignsRange {
  bloodPressure: {
    systolic: { min: number; max: number };
    diastolic: { min: number; max: number };
  };
  heartRate: { min: number; max: number };
  respiratoryRate: { min: number; max: number };
  temperature: { min: number; max: number };
  oxygenSaturation: { min: number; max: number };
}

export interface Alert {
  id: string;
  patientId: string;
  vitalSignId: string;
  type: keyof VitalSignsRange | 'bloodPressure.systolic' | 'bloodPressure.diastolic';
  severity: 'low' | 'high' | 'critical';
  value: number;
  threshold: number;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

// Default ranges for vital signs
const defaultRanges: VitalSignsRange = {
  bloodPressure: {
    systolic: { min: 90, max: 140 },
    diastolic: { min: 60, max: 90 }
  },
  heartRate: { min: 60, max: 100 },
  respiratoryRate: { min: 12, max: 20 },
  temperature: { min: 36.1, max: 37.2 },
  oxygenSaturation: { min: 95, max: 100 }
};

const vitalSignsAlertApi = {
  checkVitalSigns: (vitals: VitalSigns, ranges: VitalSignsRange = defaultRanges): Alert[] => {
    const alerts: Alert[] = [];
    const timestamp = new Date().toISOString();

    // Check blood pressure
    if (vitals.bloodPressure.systolic < ranges.bloodPressure.systolic.min) {
      alerts.push({
        id: Math.random().toString(),
        patientId: vitals.patientId,
        vitalSignId: vitals.id,
        type: 'bloodPressure.systolic',
        severity: 'low',
        value: vitals.bloodPressure.systolic,
        threshold: ranges.bloodPressure.systolic.min,
        timestamp,
        acknowledged: false
      });
    } else if (vitals.bloodPressure.systolic > ranges.bloodPressure.systolic.max) {
      alerts.push({
        id: Math.random().toString(),
        patientId: vitals.patientId,
        vitalSignId: vitals.id,
        type: 'bloodPressure.systolic',
        severity: vitals.bloodPressure.systolic > ranges.bloodPressure.systolic.max + 20 ? 'critical' : 'high',
        value: vitals.bloodPressure.systolic,
        threshold: ranges.bloodPressure.systolic.max,
        timestamp,
        acknowledged: false
      });
    }

    if (vitals.bloodPressure.diastolic < ranges.bloodPressure.diastolic.min) {
      alerts.push({
        id: Math.random().toString(),
        patientId: vitals.patientId,
        vitalSignId: vitals.id,
        type: 'bloodPressure.diastolic',
        severity: 'low',
        value: vitals.bloodPressure.diastolic,
        threshold: ranges.bloodPressure.diastolic.min,
        timestamp,
        acknowledged: false
      });
    } else if (vitals.bloodPressure.diastolic > ranges.bloodPressure.diastolic.max) {
      alerts.push({
        id: Math.random().toString(),
        patientId: vitals.patientId,
        vitalSignId: vitals.id,
        type: 'bloodPressure.diastolic',
        severity: vitals.bloodPressure.diastolic > ranges.bloodPressure.diastolic.max + 15 ? 'critical' : 'high',
        value: vitals.bloodPressure.diastolic,
        threshold: ranges.bloodPressure.diastolic.max,
        timestamp,
        acknowledged: false
      });
    }

    // Check heart rate
    if (vitals.heartRate < ranges.heartRate.min) {
      alerts.push({
        id: Math.random().toString(),
        patientId: vitals.patientId,
        vitalSignId: vitals.id,
        type: 'heartRate',
        severity: 'low',
        value: vitals.heartRate,
        threshold: ranges.heartRate.min,
        timestamp,
        acknowledged: false
      });
    } else if (vitals.heartRate > ranges.heartRate.max) {
      alerts.push({
        id: Math.random().toString(),
        patientId: vitals.patientId,
        vitalSignId: vitals.id,
        type: 'heartRate',
        severity: vitals.heartRate > ranges.heartRate.max + 20 ? 'critical' : 'high',
        value: vitals.heartRate,
        threshold: ranges.heartRate.max,
        timestamp,
        acknowledged: false
      });
    }

    // Check respiratory rate
    if (vitals.respiratoryRate < ranges.respiratoryRate.min) {
      alerts.push({
        id: Math.random().toString(),
        patientId: vitals.patientId,
        vitalSignId: vitals.id,
        type: 'respiratoryRate',
        severity: 'low',
        value: vitals.respiratoryRate,
        threshold: ranges.respiratoryRate.min,
        timestamp,
        acknowledged: false
      });
    } else if (vitals.respiratoryRate > ranges.respiratoryRate.max) {
      alerts.push({
        id: Math.random().toString(),
        patientId: vitals.patientId,
        vitalSignId: vitals.id,
        type: 'respiratoryRate',
        severity: vitals.respiratoryRate > ranges.respiratoryRate.max + 8 ? 'critical' : 'high',
        value: vitals.respiratoryRate,
        threshold: ranges.respiratoryRate.max,
        timestamp,
        acknowledged: false
      });
    }

    // Check temperature
    if (vitals.temperature < ranges.temperature.min) {
      alerts.push({
        id: Math.random().toString(),
        patientId: vitals.patientId,
        vitalSignId: vitals.id,
        type: 'temperature',
        severity: 'low',
        value: vitals.temperature,
        threshold: ranges.temperature.min,
        timestamp,
        acknowledged: false
      });
    } else if (vitals.temperature > ranges.temperature.max) {
      alerts.push({
        id: Math.random().toString(),
        patientId: vitals.patientId,
        vitalSignId: vitals.id,
        type: 'temperature',
        severity: vitals.temperature > ranges.temperature.max + 1 ? 'critical' : 'high',
        value: vitals.temperature,
        threshold: ranges.temperature.max,
        timestamp,
        acknowledged: false
      });
    }

    // Check oxygen saturation
    if (vitals.oxygenSaturation < ranges.oxygenSaturation.min) {
      alerts.push({
        id: Math.random().toString(),
        patientId: vitals.patientId,
        vitalSignId: vitals.id,
        type: 'oxygenSaturation',
        severity: vitals.oxygenSaturation < ranges.oxygenSaturation.min - 5 ? 'critical' : 'low',
        value: vitals.oxygenSaturation,
        threshold: ranges.oxygenSaturation.min,
        timestamp,
        acknowledged: false
      });
    }

    return alerts;
  },

  getAlerts: async (patientId: string): Promise<Alert[]> => {
    try {
      // TODO: Replace with actual API call when backend is ready
      return [];
    } catch (error) {
      throw new Error('Failed to fetch alerts');
    }
  },

  acknowledgeAlert: async (alertId: string, userId: string): Promise<void> => {
    try {
      // TODO: Replace with actual API call when backend is ready
    } catch (error) {
      throw new Error('Failed to acknowledge alert');
    }
  }
};

export default vitalSignsAlertApi;