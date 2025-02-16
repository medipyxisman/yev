import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text } from '../ui/Text';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Stethoscope, FileText, MessageSquare, Calendar, Users, Bandage } from 'lucide-react-native';
import { MedicalInformation } from './tabs/MedicalInformation';

const tabs = [
  { id: 'medical', label: 'Medical Info', icon: Stethoscope },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'staff', label: 'Staff', icon: Users },
  { id: 'wounds', label: 'Wound Cases', icon: Bandage }
] as const;

type TabId = typeof tabs[number]['id'];

interface PatientTabsProps {
  patientId: string;
}

// Mock data - replace with API call
const mockPatient = {
  firstName: 'Sarah',
  lastName: 'Wilson',
  dateOfBirth: '1990-05-15',
  gender: 'Female',
  contactNumber: '(555) 123-4567',
  alternateNumber: '(555) 987-6543',
  email: 'sarah.wilson@example.com',
  address: {
    street: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701'
  },
  insurance: {
    primary: {
      provider: 'Blue Cross',
      groupId: 'BC123456',
      memberId: 'MEM789012'
    },
    secondary: {
      provider: 'Aetna',
      groupId: 'AE789012',
      memberId: 'MEM345678'
    }
  },
  emergencyContact: {
    name: 'John Wilson',
    relationship: 'Spouse',
    phoneNumber: '(555) 234-5678'
  }
};

export function PatientTabs({ patientId }: PatientTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('medical');

  const handleEdit = (section: string) => {
    console.log('Edit section:', section);
    // TODO: Implement edit modal
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'medical':
        return <MedicalInformation patient={mockPatient} onEdit={handleEdit} />;
      // Other tabs will be implemented later
      default:
        return <Text>Content for {activeTab} tab</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabList}
      >
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Pressable
              key={tab.id}
              style={[
                styles.tab,
                isActive && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Icon
                size={20}
                color={isActive ? colors.primary[600] : colors.gray[400]}
              />
              <Text
                variant="sm"
                weight={isActive ? 'medium' : 'normal'}
                color={isActive ? colors.primary[600] : colors.gray[500]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabList: {
    paddingHorizontal: spacing[4],
    gap: spacing[6]
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[4],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  activeTab: {
    borderBottomColor: colors.primary[600]
  },
  content: {
    flex: 1,
    padding: spacing[4]
  }
});