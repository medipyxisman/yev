import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Send, Paperclip } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  attachments?: { name: string; url: string }[];
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Dr. Smith',
    content: 'Patient showing good progress with wound healing.',
    timestamp: '2024-03-15 10:30 AM'
  },
  {
    id: '2',
    sender: 'Nurse Johnson',
    content: 'Changed dressing and applied new treatment as prescribed.',
    timestamp: '2024-03-15 02:15 PM',
    attachments: [{ name: 'wound-photo.jpg', url: '#' }]
  }
];

export function Chat() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
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
        console.log('Selected files:', result.assets);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#9ca3af"
        />
      </View>

      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {mockMessages.map((msg) => (
          <View key={msg.id} style={styles.messageCard}>
            <View style={styles.messageHeader}>
              <Text style={styles.senderText}>{msg.sender}</Text>
              <Text style={styles.timestampText}>{msg.timestamp}</Text>
            </View>
            <Text style={styles.messageContent}>{msg.content}</Text>
            {msg.attachments && msg.attachments.length > 0 && (
              <View style={styles.attachments}>
                {msg.attachments.map((attachment, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.attachment}
                    onPress={() => console.log('Open attachment:', attachment.url)}
                  >
                    <Paperclip size={16} color="#3b82f6" />
                    <Text style={styles.attachmentText}>{attachment.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
          />
        </View>
        <View style={styles.inputActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleFileUpload}
          >
            <Paperclip size={20} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 16,
  },
  messagesContent: {
    padding: 16,
    gap: 16,
  },
  messageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  senderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  timestampText: {
    fontSize: 12,
    color: '#6b7280',
  },
  messageContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  attachments: {
    marginTop: 8,
    gap: 4,
  },
  attachment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attachmentText: {
    fontSize: 12,
    color: '#3b82f6',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inputWrapper: {
    flex: 1,
    marginBottom: 8,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
});