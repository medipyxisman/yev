import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Send, Paperclip } from 'lucide-react-native';
import { Text } from '../../ui/Text';
import { Card } from '../../ui/Card';
import { IconButton } from '../../ui/IconButton';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import * as DocumentPicker from 'expo-document-picker';

// Mock data - replace with API call
const mockMessages = [
  {
    id: '1',
    sender: 'Dr. Smith',
    content: 'Patient showing good progress with wound healing.',
    timestamp: '2024-03-15 10:30 AM',
    attachments: []
  },
  {
    id: '2',
    sender: 'Nurse Johnson',
    content: 'Changed dressing and applied new treatment as prescribed.',
    timestamp: '2024-03-15 02:15 PM',
    attachments: [{ name: 'wound-photo.jpg', url: '#' }]
  }
];

interface ChatProps {
  patientId: string;
}

export function Chat({ patientId }: ChatProps) {
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    // TODO: Send message to server
    console.log('Sending message:', message);
    setMessage('');
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        multiple: true,
      });

      if (result.assets) {
        // TODO: Handle file upload to server
        console.log('Selected files:', result.assets);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor={colors.gray[400]}
        />
      </Card>

      <Card variant="elevated" style={styles.messagesContainer}>
        <ScrollView contentContainerStyle={styles.messageList}>
          {mockMessages.map(msg => (
            <View key={msg.id} style={styles.messageCard}>
              <View style={styles.messageHeader}>
                <Text weight="medium" color={colors.gray[900]}>{msg.sender}</Text>
                <Text variant="sm" color={colors.gray[500]}>{msg.timestamp}</Text>
              </View>
              <Text style={styles.messageContent}>{msg.content}</Text>
              {msg.attachments.length > 0 && (
                <View style={styles.attachments}>
                  {msg.attachments.map((attachment, index) => (
                    <View key={index} style={styles.attachment}>
                      <Paperclip size={16} color={colors.primary[600]} />
                      <Text 
                        variant="sm"
                        color={colors.primary[600]}
                        style={styles.attachmentName}
                      >
                        {attachment.name}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </Card>

      <Card style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            placeholderTextColor={colors.gray[400]}
            multiline
          />
        </View>
        <View style={styles.inputActions}>
          <IconButton
            icon={Paperclip}
            size={20}
            color={colors.gray[500]}
            onPress={handleFileUpload}
            style={styles.attachButton}
          />
          <IconButton
            icon={Send}
            size={20}
            color={message.trim() ? colors.primary[600] : colors.gray[300]}
            onPress={handleSend}
            style={styles.sendButton}
          />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing[4]
  },
  searchContainer: {
    padding: spacing[2]
  },
  searchInput: {
    fontSize: 14,
    color: colors.gray[900],
    padding: spacing[2]
  },
  messagesContainer: {
    flex: 1
  },
  messageList: {
    padding: spacing[4],
    gap: spacing[4]
  },
  messageCard: {
    gap: spacing[2]
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  messageContent: {
    color: colors.gray[700],
    lineHeight: 20
  },
  attachments: {
    marginTop: spacing[2],
    gap: spacing[2]
  },
  attachment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },
  attachmentName: {
    textDecorationLine: 'underline'
  },
  inputContainer: {
    padding: spacing[4],
    gap: spacing[3]
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    backgroundColor: colors.gray[50]
  },
  messageInput: {
    fontSize: 14,
    color: colors.gray[900],
    padding: spacing[3],
    minHeight: 80,
    textAlignVertical: 'top'
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[2]
  },
  attachButton: {
    backgroundColor: colors.gray[100]
  },
  sendButton: {
    backgroundColor: colors.gray[100]
  }
});