import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { colors } from '../../../components/theme/colors';
import { spacing } from '../../../components/theme/spacing';
import { Plus, Edit2, Trash2, DollarSign, FileText } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';

interface Claim {
  id: string;
  visitId: string;
  visitDate: string;
  claimNumber: string;
  status: 'pending' | 'submitted' | 'approved' | 'denied' | 'paid';
  submittedDate: string;
  insurance: {
    provider: string;
    policyNumber: string;
    authorizationNumber?: string;
  };
  services: {
    code: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
  }[];
  totalAmount: number;
  paidAmount?: number;
  paymentDate?: string;
  denialReason?: string;
  notes?: string;
  documents?: {
    type: string;
    url: string;
    uploadedAt: string;
  }[];
}

const claimStatuses = [
  'pending',
  'submitted',
  'approved',
  'denied',
  'paid'
] as const;

// Common CPT codes for wound care
const commonCPTCodes = [
  { code: '97597', description: 'Debridement (< 20 sq cm)' },
  { code: '97598', description: 'Debridement (> 20 sq cm)' },
  { code: '11042', description: 'Debridement, subcutaneous tissue' },
  { code: '11043', description: 'Debridement, muscle and/or fascia' },
  { code: '11044', description: 'Debridement, bone' },
  { code: '99214', description: 'Office/outpatient visit, established' }
];

// Mock data - replace with API call
const mockClaims: Claim[] = [
  {
    id: '1',
    visitId: 'v1',
    visitDate: '2024-03-15',
    claimNumber: 'CLM-2024-001',
    status: 'paid',
    submittedDate: '2024-03-16',
    insurance: {
      provider: 'Blue Cross',
      policyNumber: 'BC123456',
      authorizationNumber: 'AUTH001'
    },
    services: [
      {
        code: '97597',
        description: 'Debridement (< 20 sq cm)',
        quantity: 1,
        unitPrice: 150,
        totalAmount: 150
      },
      {
        code: '99214',
        description: 'Office/outpatient visit, established',
        quantity: 1,
        unitPrice: 100,
        totalAmount: 100
      }
    ],
    totalAmount: 250,
    paidAmount: 200,
    paymentDate: '2024-03-25',
    notes: 'Patient copay: $50'
  }
];

export default function BillingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [claims, setClaims] = useState<Claim[]>(mockClaims);
  const [showNewClaim, setShowNewClaim] = useState(false);
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    visitId: '',
    visitDate: '',
    insurance: {
      provider: '',
      policyNumber: '',
      authorizationNumber: ''
    },
    services: [{
      code: commonCPTCodes[0].code,
      description: commonCPTCodes[0].description,
      quantity: 1,
      unitPrice: 0,
      totalAmount: 0
    }],
    notes: ''
  });

  const calculateTotalAmount = (services: typeof formData.services) => {
    return services.reduce((total, service) => total + service.totalAmount, 0);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.visitDate || !formData.insurance.provider || !formData.insurance.policyNumber) {
        throw new Error('Please fill in all required fields');
      }

      // TODO: Replace with API call
      const newClaim: Claim = {
        id: Math.random().toString(),
        claimNumber: `CLM-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0],
        ...formData,
        totalAmount: calculateTotalAmount(formData.services)
      };

      setClaims(prev => [...prev, newClaim]);
      setShowNewClaim(false);
      setFormData({
        visitId: '',
        visitDate: '',
        insurance: {
          provider: '',
          policyNumber: '',
          authorizationNumber: ''
        },
        services: [{
          code: commonCPTCodes[0].code,
          description: commonCPTCodes[0].description,
          quantity: 1,
          unitPrice: 0,
          totalAmount: 0
        }],
        notes: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save claim');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingClaim) return;

    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with API call
      setClaims(prev =>
        prev.map(claim =>
          claim.id === editingClaim.id
            ? {
                ...claim,
                ...formData,
                totalAmount: calculateTotalAmount(formData.services)
              }
            : claim
        )
      );

      setEditingClaim(null);
      setFormData({
        visitId: '',
        visitDate: '',
        insurance: {
          provider: '',
          policyNumber: '',
          authorizationNumber: ''
        },
        services: [{
          code: commonCPTCodes[0].code,
          description: commonCPTCodes[0].description,
          quantity: 1,
          unitPrice: 0,
          totalAmount: 0
        }],
        notes: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update claim');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (claimId: string) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with API call
      setClaims(prev => prev.filter(claim => claim.id !== claimId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete claim');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceCodeChange = (index: number, code: string) => {
    const service = commonCPTCodes.find(cpt => cpt.code === code);
    if (service) {
      const newServices = [...formData.services];
      newServices[index] = {
        ...newServices[index],
        code: service.code,
        description: service.description
      };
      setFormData(prev => ({ ...prev, services: newServices }));
    }
  };

  const handleServiceChange = (index: number, field: keyof typeof formData.services[0], value: any) => {
    const newServices = [...formData.services];
    newServices[index] = {
      ...newServices[index],
      [field]: value,
      totalAmount: field === 'quantity' || field === 'unitPrice'
        ? Number(value) * (field === 'quantity' ? newServices[index].unitPrice : newServices[index].quantity)
        : newServices[index].totalAmount
    };
    setFormData(prev => ({ ...prev, services: newServices }));
  };

  const getStatusColor = (status: Claim['status']) => {
    switch (status) {
      case 'paid':
        return colors.success[500];
      case 'approved':
        return colors.success[500];
      case 'denied':
        return colors.error[500];
      case 'submitted':
        return colors.primary[500];
      default:
        return colors.gray[500];
    }
  };

  const ClaimForm = ({ onSubmit, onCancel }: { onSubmit: () => void; onCancel: () => void }) => (
    <Card variant="elevated" style={styles.form}>
      <View style={styles.formFields}>
        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Visit Date *
          </Text>
          <TextInput
            style={styles.input}
            value={formData.visitDate}
            onChangeText={(text) => setFormData(prev => ({ ...prev, visitDate: text }))}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Insurance Provider *
          </Text>
          <TextInput
            style={styles.input}
            value={formData.insurance.provider}
            onChangeText={(text) => setFormData(prev => ({
              ...prev,
              insurance: { ...prev.insurance, provider: text }
            }))}
            placeholder="Enter insurance provider"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Policy Number *
          </Text>
          <TextInput
            style={styles.input}
            value={formData.insurance.policyNumber}
            onChangeText={(text) => setFormData(prev => ({
              ...prev,
              insurance: { ...prev.insurance, policyNumber: text }
            }))}
            placeholder="Enter policy number"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Authorization Number
          </Text>
          <TextInput
            style={styles.input}
            value={formData.insurance.authorizationNumber}
            onChangeText={(text) => setFormData(prev => ({
              ...prev,
              insurance: { ...prev.insurance, authorizationNumber: text }
            }))}
            placeholder="Enter authorization number"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Services
          </Text>
          {formData.services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <View style={styles.serviceCode}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={service.code}
                    onValueChange={(value) => handleServiceCodeChange(index, value)}
                  >
                    {commonCPTCodes.map(cpt => (
                      <Picker.Item
                        key={cpt.code}
                        label={`${cpt.code} - ${cpt.description}`}
                        value={cpt.code}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.serviceDetails}>
                <TextInput
                  style={[styles.input, styles.numberInput]}
                  value={service.quantity.toString()}
                  onChangeText={(text) => handleServiceChange(index, 'quantity', Number(text))}
                  placeholder="Qty"
                  placeholderTextColor={colors.gray[400]}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, styles.numberInput]}
                  value={service.unitPrice.toString()}
                  onChangeText={(text) => handleServiceChange(index, 'unitPrice', Number(text))}
                  placeholder="Price"
                  placeholderTextColor={colors.gray[400]}
                  keyboardType="numeric"
                />
                <Text variant="sm" weight="medium" color={colors.gray[900]}>
                  ${service.totalAmount}
                </Text>
                {index === formData.services.length - 1 && (
                  <IconButton
                    icon={Plus}
                    size={20}
                    color={colors.primary[600]}
                    onPress={() => setFormData(prev => ({
                      ...prev,
                      services: [
                        ...prev.services,
                        {
                          code: commonCPTCodes[0].code,
                          description: commonCPTCodes[0].description,
                          quantity: 1,
                          unitPrice: 0,
                          totalAmount: 0
                        }
                      ]
                    }))}
                  />
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Notes
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            placeholder="Add any additional notes"
            placeholderTextColor={colors.gray[400]}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      <View style={styles.formActions}>
        <Button
          variant="outline"
          onPress={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Claim'}
        </Button>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Billing & Claims</Text>
        <Button
          variant="primary"
          leftIcon={Plus}
          onPress={() => setShowNewClaim(true)}
          disabled={loading}
        >
          New Claim
        </Button>
      </View>

      {error && (
        <Text color={colors.error[500]} style={styles.error}>
          {error}
        </Text>
      )}

      {showNewClaim && (
        <ClaimForm
          onSubmit={handleSave}
          onCancel={() => setShowNewClaim(false)}
        />
      )}

      <ScrollView style={styles.claimsList}>
        {claims.map(claim => (
          <Card key={claim.id} variant="elevated" style={styles.claimCard}>
            {editingClaim?.id === claim.id ? (
              <ClaimForm
                onSubmit={handleUpdate}
                onCancel={() => setEditingClaim(null)}
              />
            ) : (
              <>
                <View style={styles.claimHeader}>
                  <View>
                    <Text weight="medium">Claim #{claim.claimNumber}</Text>
                    <Text variant="sm" color={colors.gray[500]}>
                      Visit Date: {claim.visitDate}
                    </Text>
                  </View>
                  <View style={styles.claimActions}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(claim.status)}10` }
                    ]}>
                      <Text
                        variant="sm"
                        weight="medium"
                        color={getStatusColor(claim.status)}
                      >
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </Text>
                    </View>
                    <IconButton
                      icon={Edit2}
                      size={20}
                      color={colors.gray[500]}
                      onPress={() => {
                        setEditingClaim(claim);
                        setFormData({
                          visitId: claim.visitId,
                          visitDate: claim.visitDate,
                          insurance: claim.insurance,
                          services: claim.services,
                          notes: claim.notes || ''
                        });
                      }}
                    />
                    <IconButton
                      icon={Trash2}
                      size={20}
                      color={colors.error[500]}
                      onPress={() => handleDelete(claim.id)}
                    />
                  </View>
                </View>

                <View style={styles.claimDetails}>
                  <View style={styles.detailSection}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Insurance Information:
                    </Text>
                    <View style={styles.detailRow}>
                      <Text variant="sm">Provider:</Text>
                      <Text variant="sm">{claim.insurance.provider}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text variant="sm">Policy Number:</Text>
                      <Text variant="sm">{claim.insurance.policyNumber}</Text>
                    </View>
                    {claim.insurance.authorizationNumber && (
                      <View style={styles.detailRow}>
                        <Text variant="sm">Authorization Number:</Text>
                        <Text variant="sm">{claim.insurance.authorizationNumber}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.detailSection}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Services:
                    </Text>
                    {claim.services.map((service, index) => (
                      <View key={index} style={styles.serviceRow}>
                        <View style={styles.serviceInfo}>
                          <Text variant="sm">{service.code}</Text>
                          <Text variant="sm" color={colors.gray[500]}>
                            {service.description}
                          </Text>
                        </View>
                        <View style={styles.serviceAmounts}>
                          <Text variant="sm">
                            {service.quantity} × ${service.unitPrice}
                          </Text>
                          <Text variant="sm" weight="medium">
                            ${service.totalAmount}
                          </Text>
                        </View>
                      </View>
                    ))}
                    <View style={styles.totalAmount}>
                      <Text variant="sm" weight="medium">Total Amount:</Text>
                      <Text variant="sm" weight="medium">${claim.totalAmount}</Text>
                    </View>
                  </View>

                  {claim.paidAmount && (
                    <View style={styles.detailSection}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        Payment Information:
                      </Text>
                      <View style={styles.detailRow}>
                        <Text variant="sm">Paid Amount:</Text>
                        <Text variant="sm" color={colors.success[600]}>
                          ${claim.paidAmount}
                        </Text>
                      </View>
                      {claim.paymentDate && (
                        <View style={styles.detailRow}>
                          <Text variant="sm">Payment Date:</Text>
                          <Text variant="sm">{claim.paymentDate}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {claim.denialReason && (
                    <View style={styles.detailSection}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        Denial Reason:
                      </Text>
                      <Text variant="sm" color={colors.error[600]}>
                        {claim.denialReason}
                      </Text>
                    </View>
                  )}

                  {claim.notes && (
                    <View style={styles.detailSection}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        Notes:
                      </Text>
                      <Text variant="sm">{claim.notes}</Text>
                    </View>
                  )}

                  {claim.documents && claim.documents.length > 0 && (
                    <View style={styles.detailSection}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        Documents:
                      </Text>
                      {claim.documents.map((doc, index) => (
                        <View key={index} style={styles.document}>
                          <FileText size={16} color={colors.gray[400]} />
                          <Text variant="sm">{doc.type}</Text>
                          <Text variant="sm" color={colors.gray[500]}>
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </>
            )}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
    padding: spacing[4]
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6]
  },
  error: {
    marginBottom: spacing[4]
  },
  form: {
    marginBottom: spacing[4],
    gap: spacing[6]
  },
  formFields: {
    gap: spacing[4]
  },
  field: {
    gap: spacing[2]
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: spacing[3],
    fontSize: 14,
    color: colors.gray[900],
    backgroundColor: colors.gray[50]
  },
  numberInput: {
    width: 100
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    backgroundColor: colors.gray[50],
    overflow: 'hidden'
  },
  serviceItem: {
    gap: spacing[2],
    marginBottom: spacing[2]
  },
  serviceCode: {
    flex: 1
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[3]
  },
  claimsList: {
    flex: 1
  },
  claimCard: {
    marginBottom: spacing[4]
  },
  claimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4]
  },
  claimActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },
  statusBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 16
  },
  claimDetails: {
    gap: spacing[4]
  },
  detailSection: {
    gap: spacing[2]
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200]
  },
  serviceInfo: {
    flex: 1,
    gap: spacing[1]
  },
  serviceAmounts: {
    alignItems: 'flex-end',
    gap: spacing[1]
  },
  totalAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[2],
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: colors.gray[200]
  },
  document: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  }
});