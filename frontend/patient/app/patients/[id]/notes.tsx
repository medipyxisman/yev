import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { colors } from '../../../components/theme/colors';
import { spacing } from '../../../components/theme/spacing';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import noteApi, { Note } from '../../../api/noteApi';

const categories = ['clinical', 'administrative', 'follow-up', 'other'] as const;

export default function NotesScreen() {
  const { id } = useLocalSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNewNote, setShowNewNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const [newNote, setNewNote] = useState({
    content: '',
    category: 'clinical' as typeof categories[number],
    tags: [] as string[]
  });

  useEffect(() => {
    fetchNotes();
  }, [id]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await noteApi.getNotes(id as string);
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!newNote.content.trim()) {
        throw new Error('Note content is required');
      }

      await noteApi.createNote({
        patientId: id as string,
        authorId: 'current-user-id', // TODO: Get from auth context
        authorName: 'Current User', // TODO: Get from auth context
        content: newNote.content,
        category: newNote.category,
        tags: newNote.tags
      });

      setNewNote({
        content: '',
        category: 'clinical',
        tags: []
      });
      setShowNewNote(false);
      await fetchNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote) return;

    try {
      setLoading(true);
      setError(null);

      if (!editingNote.content.trim()) {
        throw new Error('Note content is required');
      }

      await noteApi.updateNote(editingNote.id, editingNote);
      setEditingNote(null);
      await fetchNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      setLoading(true);
      setError(null);
      await noteApi.deleteNote(noteId);
      await fetchNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Notes</Text>
        <Button
          variant="primary"
          leftIcon={Plus}
          onPress={() => setShowNewNote(true)}
          disabled={loading}
        >
          Add Note
        </Button>
      </View>

      {error && (
        <Text color={colors.error[500]} style={styles.error}>
          {error}
        </Text>
      )}

      <View style={styles.filters}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search notes..."
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.categoryFilter}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={setSelectedCategory}
            style={styles.picker}
          >
            <Picker.Item label="All Categories" value="all" />
            {categories.map(category => (
              <Picker.Item
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                value={category}
              />
            ))}
          </Picker>
        </View>
      </View>

      {showNewNote && (
        <Card variant="elevated" style={styles.noteForm}>
          <View style={styles.noteFormHeader}>
            <Text variant="lg" weight="semibold">New Note</Text>
            <View style={styles.categorySelect}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Category:
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={newNote.category}
                  onValueChange={(value) => setNewNote(prev => ({ ...prev, category: value }))}
                  style={styles.picker}
                >
                  {categories.map(category => (
                    <Picker.Item
                      key={category}
                      label={category.charAt(0).toUpperCase() + category.slice(1)}
                      value={category}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <TextInput
            style={[styles.input, styles.textArea]}
            value={newNote.content}
            onChangeText={(text) => setNewNote(prev => ({ ...prev, content: text }))}
            placeholder="Enter note content..."
            placeholderTextColor={colors.gray[400]}
            multiline
            numberOfLines={4}
          />

          <View style={styles.formActions}>
            <Button
              variant="outline"
              onPress={() => setShowNewNote(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onPress={handleCreateNote}
              disabled={loading || !newNote.content.trim()}
            >
              Save Note
            </Button>
          </View>
        </Card>
      )}

      <ScrollView style={styles.notesList}>
        {loading && notes.length === 0 ? (
          <Text style={styles.emptyText}>Loading notes...</Text>
        ) : filteredNotes.length === 0 ? (
          <Text style={styles.emptyText}>
            {searchQuery || selectedCategory !== 'all'
              ? 'No notes match your search criteria'
              : 'No notes added yet'}
          </Text>
        ) : (
          filteredNotes.map(note => (
            <Card key={note.id} variant="elevated" style={styles.noteCard}>
              {editingNote?.id === note.id ? (
                <View>
                  <View style={styles.noteFormHeader}>
                    <Text variant="lg" weight="semibold">Edit Note</Text>
                    <View style={styles.categorySelect}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        Category:
                      </Text>
                      <View style={styles.pickerContainer}>
                        <Picker
                          selectedValue={editingNote.category}
                          onValueChange={(value) => setEditingNote(prev => ({ ...prev, category: value }))}
                          style={styles.picker}
                        >
                          {categories.map(category => (
                            <Picker.Item
                              key={category}
                              label={category.charAt(0).toUpperCase() + category.slice(1)}
                              value={category}
                            />
                          ))}
                        </Picker>
                      </View>
                    </View>
                  </View>

                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={editingNote.content}
                    onChangeText={(text) => setEditingNote(prev => ({ ...prev, content: text }))}
                    multiline
                    numberOfLines={4}
                  />

                  <View style={styles.formActions}>
                    <Button
                      variant="outline"
                      onPress={() => setEditingNote(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onPress={handleUpdateNote}
                      disabled={loading || !editingNote.content.trim()}
                    >
                      Save Changes
                    </Button>
                  </View>
                </View>
              ) : (
                <>
                  <View style={styles.noteHeader}>
                    <View>
                      <Text variant="sm" weight="medium">
                        {note.authorName}
                      </Text>
                      <Text variant="sm" color={colors.gray[500]}>
                        {new Date(note.createdAt).toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.noteActions}>
                      <View style={styles.categoryBadge}>
                        <Text variant="sm" color={colors.primary[600]}>
                          {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
                        </Text>
                      </View>
                      <IconButton
                        icon={Edit2}
                        size={20}
                        color={colors.gray[500]}
                        onPress={() => setEditingNote(note)}
                      />
                      <IconButton
                        icon={Trash2}
                        size={20}
                        color={colors.error[500]}
                        onPress={() => handleDeleteNote(note.id)}
                      />
                    </View>
                  </View>
                  <Text style={styles.noteContent}>{note.content}</Text>
                </>
              )}
            </Card>
          ))
        )}
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
  filters: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[4]
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: spacing[3]
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing[2],
    marginLeft: spacing[2],
    fontSize: 14,
    color: colors.gray[900]
  },
  categoryFilter: {
    width: 200,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    backgroundColor: colors.gray[50],
    overflow: 'hidden'
  },
  picker: {
    height: 40
  },
  noteForm: {
    marginBottom: spacing[4],
    gap: spacing[4]
  },
  noteFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  categorySelect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },
  pickerContainer: {
    width: 150,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    backgroundColor: colors.gray[50],
    overflow: 'hidden'
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
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top'
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[3]
  },
  notesList: {
    flex: 1
  },
  noteCard: {
    marginBottom: spacing[4]
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[3]
  },
  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },
  categoryBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 16
  },
  noteContent: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[500],
    padding: spacing[4]
  }
});