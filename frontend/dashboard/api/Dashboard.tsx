import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Activity, Users, FileText, TrendingUp, Heart } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';

// Define the navigation types
type RootStackParamList = {
  PatientDetails: { id: number };
  Patients: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Define component prop types
interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  change?: string;
  color?: string;
  onPress?: () => void;
}

interface ActivityItemProps {
  icon: React.ElementType;
  title: string;
  time: string;
  onPress: () => void;
}

interface AppointmentItemProps {
  name: string;
  details: string;
  onPress: () => void;
}

const Dashboard = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedOutlet, setSelectedOutlet] = React.useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = React.useState('month');
  const [isLoading, setIsLoading] = React.useState(false);

  const StatCard: React.FC<StatCardProps> = ({
    icon: Icon,
    title,
    value,
    change,
    color = '#3b82f6',
    onPress
  }) => (
    <TouchableOpacity
      style={[styles.statCard, onPress && styles.pressable]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.statContent}>
        <View>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
          {change && (
            <View style={styles.changeContainer}>
              <Text style={[
                styles.changeText,
                { color: change.startsWith('+') ? '#059669' : '#dc2626' }
              ]}>
                {change}
              </Text>
              <Text style={styles.changeCompare}> vs last month</Text>
            </View>
          )}
        </View>
        <View style={[styles.iconContainer, { backgroundColor: `${color}10` }]}>
          <Icon size={24} color={color} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const ActivityItem: React.FC<ActivityItemProps> = ({ icon: Icon, title, time, onPress }) => (
    <TouchableOpacity
      style={styles.activityItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.activityContent}>
        <View style={styles.activityIcon}>
          <Icon size={20} color="#3b82f6" />
        </View>
        <View>
          <Text style={styles.activityTitle}>{title}</Text>
          <Text style={styles.activityTime}>{time}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={onPress}
        style={styles.viewButton}
      >
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const AppointmentItem: React.FC<AppointmentItemProps> = ({ name, details, onPress }) => (
    <TouchableOpacity
      style={styles.appointmentItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.appointmentContent}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.appointmentName}>{name}</Text>
          <Text style={styles.appointmentDetails}>{details}</Text>
        </View>
      </View>
      <View style={styles.appointmentActions}>
        <TouchableOpacity
          onPress={() => {/* Handle accept */ }}
          style={styles.actionButton}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {/* Handle reschedule */ }}
          style={styles.actionButton}
        >
          <Text style={styles.rescheduleButtonText}>Reschedule</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleNavigateToPatients = () => {
    try {
      navigation.navigate('Patients');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleNavigateToPatientDetails = (id: number) => {
    try {
      navigation.navigate('PatientDetails', { id });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Heart size={32} color="#3b82f6" strokeWidth={2} />
          <View style={styles.welcomeText}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Here's what's happening with your practice today.</Text>
          </View>
        </View>

        <View style={styles.filters}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedOutlet}
              onValueChange={setSelectedOutlet}
              style={styles.picker}
            >
              <Picker.Item label="All Outlets" value="all" />
              <Picker.Item label="Main Clinic" value="main" />
              <Picker.Item label="Branch Office" value="branch" />
            </Picker>
          </View>

          <View style={styles.timeframeButtons}>
            {['Today', 'Week', 'Month'].map((period) => (
              <TouchableOpacity
                key={period.toLowerCase()}
                style={[
                  styles.timeframeButton,
                  selectedTimeframe === period.toLowerCase() && styles.timeframeButtonActive
                ]}
                onPress={() => setSelectedTimeframe(period.toLowerCase())}
              >
                <Text style={[
                  styles.timeframeButtonText,
                  selectedTimeframe === period.toLowerCase() && styles.timeframeButtonTextActive
                ]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon={Activity}
          title="Active Cases"
          value="124"
          change="+12.5%"
          color="#3b82f6"
          onPress={handleNavigateToPatients}
        />
        <StatCard
          icon={Users}
          title="Total Patients"
          value="1,429"
          change="+4.3%"
          color="#059669"
          onPress={handleNavigateToPatients}
        />
        <StatCard
          icon={FileText}
          title="Reports Generated"
          value="89"
          change="+22.4%"
          color="#7c3aed"
        />
        <StatCard
          icon={TrendingUp}
          title="Recovery Rate"
          value="94%"
          change="+2.1%"
          color="#f97316"
        />
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          {[1, 2, 3].map((i) => (
            <ActivityItem
              key={i}
              icon={Users}
              title="New patient registered"
              time="2 minutes ago"
              onPress={() => handleNavigateToPatientDetails(i)}
            />
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming Appointments</Text>
          {[1, 2, 3].map((i) => (
            <AppointmentItem
              key={i}
              name="Sarah Wilson"
              details="Dental Checkup • 2:00 PM"
              onPress={() => handleNavigateToPatientDetails(i)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 16,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    marginLeft: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  filters: {
    marginTop: 16,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  picker: {
    height: 40,
  },
  timeframeButtons: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  timeframeButtonActive: {
    backgroundColor: '#111827',
    borderRadius: 8,
  },
  timeframeButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  timeframeButtonTextActive: {
    color: 'white',
  },
  statsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: (Dimensions.get('window').width - 48) / 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  pressable: {
    elevation: 1,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  changeCompare: {
    fontSize: 14,
    color: '#6b7280',
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
  },
  gridContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  activityTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  viewButton: {
    padding: 8,
  },
  viewButtonText: {
    color: '#3b82f6',
    fontSize: 14,
  },
  appointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  appointmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 12,
  },
  appointmentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  appointmentDetails: {
    fontSize: 14,
    color: '#6b7280',
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  acceptButtonText: {
    color: '#3b82f6',
    fontSize: 14,
  },
  rescheduleButtonText: {
    color: '#6b7280',
    fontSize: 14,
  },
});

export default Dashboard;