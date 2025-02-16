import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from '../(patienttabs)/Calendar';
import { Chat } from '../(patienttabs)/Chat';
import { Documents } from '../(patienttabs)/Documents';
import { Patient, PatientStatus } from '../../constants/Patient';
import { Staff } from '../(patienttabs)/Staff';
import { MedicalInformation } from '../(patienttabs)/MedicalInformation';
import { WoundCases } from '../(patienttabs)/WoundCases';
import { Header } from '../../components/ui/Header';
import { PatientSummary } from '../../components/ui/PatientSummary';
import { MetricsDashboard } from '../../components/ui/MetricsDashboard';
import { TabNavigation, TabId } from '../../components/ui/TabNavigation';

// Mock data for demonstration
const mockPatient: Patient = {
    id: "P12345",
    firstName: "John",
    lastName: "Doe",
    status: "active",
    dateOfBirth: "1980-01-01",
    gender: "Male",
    contactNumber: "(555) 123-4567",
    email: "john.doe@example.com",
    address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345"
    },
    insurance: {
        primary: {
            provider: "Blue Cross",
            groupId: "GRP123",
            memberId: "MEM456"
        }
    },
    emergencyContact: {
        name: "Jane Doe",
        relationship: "Spouse",
        phoneNumber: "(555) 987-6543"
    },
    metrics: {
        daysSinceLastVisit: 3,
        woundStatus: "improving",
        patientSatisfaction: 4.8
    },
    assignedStaff: {
        provider: "Dr. Smith",
        bdRep: "Bob Johnson",
        referringPhysician: "Dr. Brown"
    }
};

function App() {
    const { width } = useWindowDimensions();
    const [activeTab, setActiveTab] = useState<TabId>('medical');

    const handleStatusChange = (status: PatientStatus) => {
        console.log('Status changed to:', status);
    };

    const handleCallClick = () => {
        console.log('Initiating call...');
    };

    const handleDirectionsClick = () => {
        console.log('Opening directions...');
    };

    const handleEditMedical = (section: string) => {
        console.log('Editing section:', section);
    };

    const handleStaffUpdate = (field: keyof Patient['assignedStaff'], value: string) => {
        console.log('Updating staff:', field, value);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'medical':
                return <MedicalInformation patient={mockPatient} onEdit={handleEditMedical} />;
            case 'documents':
                return <Documents />;
            case 'chat':
                return <Chat />;
            case 'calendar':
                return <Calendar />;
            case 'staff':
                return <Staff patient={mockPatient} onUpdate={handleStaffUpdate} />;
            case 'wounds':
                return <WoundCases patientId={mockPatient.id} />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Header />

                <ScrollView style={styles.scrollView}>
                    <View style={[styles.content, width >= 1280 && styles.contentWide]}>
                        <PatientSummary
                            patient={mockPatient}
                            onStatusChange={handleStatusChange}
                            onCallClick={handleCallClick}
                            onDirectionsClick={handleDirectionsClick}
                        />

                        <MetricsDashboard metrics={mockPatient.metrics} />

                        <View style={styles.tabSection}>
                            <TabNavigation
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                            />

                            <View style={styles.tabContent}>
                                {renderTabContent()}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    contentWide: {
        maxWidth: 1280,
        alignSelf: 'center',
        width: '100%',
    },
    tabSection: {
        marginTop: 24,
    },
    tabContent: {
        marginTop: 16,
    },
});

export default App;