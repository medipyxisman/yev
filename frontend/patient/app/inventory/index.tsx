import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import { colors } from '../../components/theme/colors';
import { spacing } from '../../components/theme/spacing';
import { Plus, Edit2, Trash2, Search, AlertTriangle, Package } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';

interface InventoryItem {
  id: string;
  name: string;
  category: 'dressing' | 'medication' | 'equipment' | 'graft' | 'other';
  sku: string;
  manufacturer: string;
  currentStock: number;
  minStockLevel: number;
  reorderPoint: number;
  unitPrice: number;
  expiryDate?: string;
  location: string;
  lotNumber?: string;
  notes?: string;
  lastRestocked?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
}

const categories = [
  'dressing',
  'medication',
  'equipment',
  'graft',
  'other'
] as const;

// Mock data - replace with API call
const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Hydrocolloid Dressing',
    category: 'dressing',
    sku: 'DRS-001',
    manufacturer: 'MediTech',
    currentStock: 50,
    minStockLevel: 20,
    reorderPoint: 30,
    unitPrice: 12.99,
    expiryDate: '2025-03-15',
    location: 'Storage Room A',
    lotNumber: 'LOT123',
    status: 'in_stock',
    lastRestocked: '2024-02-01'
  },
  {
    id: '2',
    name: 'Wound Gel',
    category: 'medication',
    sku: 'MED-002',
    manufacturer: 'PharmaCare',
    currentStock: 15,
    minStockLevel: 20,
    reorderPoint: 25,
    unitPrice: 24.99,
    expiryDate: '2024-12-31',
    location: 'Storage Room B',
    lotNumber: 'LOT456',
    status: 'low_stock',
    lastRestocked: '2024-01-15'
  }
];

export default function InventoryScreen() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [showNewItem, setShowNewItem] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    category: 'dressing' as InventoryItem['category'],
    sku: '',
    manufacturer: '',
    currentStock: 0,
    minStockLevel: 0,
    reorderPoint: 0,
    unitPrice: 0,
    expiryDate: '',
    location: '',
    lotNumber: '',
    notes: ''
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.name || !formData.sku || !formData.manufacturer) {
        throw new Error('Please fill in all required fields');
      }

      // Determine status based on stock levels
      let status: InventoryItem['status'] = 'in_stock';
      if (formData.currentStock === 0) {
        status = 'out_of_stock';
      } else if (formData.currentStock <= formData.minStockLevel) {
        status = 'low_stock';
      }

      // TODO: Replace with API call
      const newItem: InventoryItem = {
        id: Math.random().toString(),
        ...formData,
        status,
        lastRestocked: new Date().toISOString().split('T')[0]
      };

      setInventory(prev => [...prev, newItem]);
      setShowNewItem(false);
      setFormData({
        name: '',
        category: 'dressing',
        sku: '',
        manufacturer: '',
        currentStock: 0,
        minStockLevel: 0,
        reorderPoint: 0,
        unitPrice: 0,
        expiryDate: '',
        location: '',
        lotNumber: '',
        notes: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save inventory item');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with API call
      setInventory(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? {
                ...item,
                ...formData,
                status: formData.currentStock === 0
                  ? 'out_of_stock'
                  : formData.currentStock <= formData.minStockLevel
                  ? 'low_stock'
                  : 'in_stock'
              }
            : item
        )
      );

      setEditingItem(null);
      setFormData({
        name: '',
        category: 'dressing',
        sku: '',
        manufacturer: '',
        currentStock: 0,
        minStockLevel: 0,
        reorderPoint: 0,
        unitPrice: 0,
        expiryDate: '',
        location: '',
        lotNumber: '',
        notes: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update inventory item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with API call
      setInventory(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete inventory item');
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in_stock':
        return colors.success[500];
      case 'low_stock':
        return colors.warning[500];
      case 'out_of_stock':
        return colors.error[500];
      case 'discontinued':
        return colors.gray[500];
      default:
        return colors.gray[500];
    }
  };

  const InventoryItemForm = ({ onSubmit, onCancel }: { onSubmit: () => void; onCancel: () => void }) => (
    <Card variant="elevated" style={styles.form}>
      <View style={styles.formFields}>
        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Name *
          </Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="Enter item name"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Category
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
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

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            SKU *
          </Text>
          <TextInput
            style={styles.input}
            value={formData.sku}
            onChangeText={(text) => setFormData(prev => ({ ...prev, sku: text }))}
            placeholder="Enter SKU"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Manufacturer *
          </Text>
          <TextInput
            style={styles.input}
            value={formData.manufacturer}
            onChangeText={(text) => setFormData(prev => ({ ...prev, manufacturer: text }))}
            placeholder="Enter manufacturer"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Current Stock
          </Text>
          <TextInput
            style={styles.input}
            value={formData.currentStock.toString()}
            onChangeText={(text) => setFormData(prev => ({ ...prev, currentStock: Number(text) }))}
            placeholder="Enter current stock"
            placeholderTextColor={colors.gray[400]}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Minimum Stock Level
          </Text>
          <TextInput
            style={styles.input}
            value={formData.minStockLevel.toString()}
            onChangeText={(text) => setFormData(prev => ({ ...prev, minStockLevel: Number(text) }))}
            placeholder="Enter minimum stock level"
            placeholderTextColor={colors.gray[400]}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Reorder Point
          </Text>
          <TextInput
            style={styles.input}
            value={formData.reorderPoint.toString()}
            onChangeText={(text) => setFormData(prev => ({ ...prev, reorderPoint: Number(text) }))}
            placeholder="Enter reorder point"
            placeholderTextColor={colors.gray[400]}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Unit Price
          </Text>
          <TextInput
            style={styles.input}
            value={formData.unitPrice.toString()}
            onChangeText={(text) => setFormData(prev => ({ ...prev, unitPrice: Number(text) }))}
            placeholder="Enter unit price"
            placeholderTextColor={colors.gray[400]}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Expiry Date
          </Text>
          <TextInput
            style={styles.input}
            value={formData.expiryDate}
            onChangeText={(text) => setFormData(prev => ({ ...prev, expiryDate: text }))}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Location
          </Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
            placeholder="Enter storage location"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Lot Number
          </Text>
          <TextInput
            style={styles.input}
            value={formData.lotNumber}
            onChangeText={(text) => setFormData(prev => ({ ...prev, lotNumber: text }))}
            placeholder="Enter lot number"
            placeholderTextColor={colors.gray[400]}
          />
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
          {loading ? 'Saving...' : 'Save Item'}
        </Button>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Inventory Management</Text>
        <Button
          variant="primary"
          leftIcon={Plus}
          onPress={() => setShowNewItem(true)}
          disabled={loading}
        >
          Add Item
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
            placeholder="Search inventory..."
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

      {showNewItem && (
        <InventoryItemForm
          onSubmit={handleSave}
          onCancel={() => setShowNewItem(false)}
        />
      )}

      <ScrollView style={styles.itemsList}>
        {filteredInventory.map(item => (
          <Card key={item.id} variant="elevated" style={styles.itemCard}>
            {editingItem?.id === item.id ? (
              <InventoryItemForm
                onSubmit={handleUpdate}
                onCancel={() => setEditingItem(null)}
              />
            ) : (
              <>
                <View style={styles.itemHeader}>
                  <View>
                    <Text weight="medium">{item.name}</Text>
                    <Text variant="sm" color={colors.gray[500]}>
                      SKU: {item.sku}
                    </Text>
                  </View>
                  <View style={styles.itemActions}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(item.status)}10` }
                    ]}>
                      {item.status !== 'in_stock' && (
                        <AlertTriangle size={16} color={getStatusColor(item.status)} />
                      )}
                      <Text
                        variant="sm"
                        weight="medium"
                        color={getStatusColor(item.status)}
                      >
                        {item.status.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </Text>
                    </View>
                    <IconButton
                      icon={Edit2}
                      size={20}
                      color={colors.gray[500]}
                      onPress={() => {
                        setEditingItem(item);
                        setFormData({
                          name: item.name,
                          category: item.category,
                          sku: item.sku,
                          manufacturer: item.manufacturer,
                          currentStock: item.currentStock,
                          minStockLevel: item.minStockLevel,
                          reorderPoint: item.reorderPoint,
                          unitPrice: item.unitPrice,
                          expiryDate: item.expiryDate || '',
                          location: item.location,
                          lotNumber: item.lotNumber || '',
                          notes: item.notes || ''
                        });
                      }}
                    />
                    <IconButton
                      icon={Trash2}
                      size={20}
                      color={colors.error[500]}
                      onPress={() => handleDelete(item.id)}
                    />
                  </View>
                </View>

                <View style={styles.itemDetails}>
                  <View style={styles.detailSection}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Stock Information:
                    </Text>
                    <View style={styles.detailRow}>
                      <Text variant="sm">Current Stock:</Text>
                      <Text
                        variant="sm"
                        color={item.currentStock <= item.minStockLevel ? colors.error[500] : colors.gray[900]}
                      >
                        {item.currentStock} units
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text variant="sm">Minimum Level:</Text>
                      <Text variant="sm">{item.minStockLevel} units</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text variant="sm">Reorder Point:</Text>
                      <Text variant="sm">{item.reorderPoint} units</Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Product Details:
                    </Text>
                    <View style={styles.detailRow}>
                      <Text variant="sm">Category:</Text>
                      <Text variant="sm" style={{ textTransform: 'capitalize' }}>
                        {item.category}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text variant="sm">Manufacturer:</Text>
                      <Text variant="sm">{item.manufacturer}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text variant="sm">Unit Price:</Text>
                      <Text variant="sm">${item.unitPrice.toFixed(2)}</Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Storage Information:
                    </Text>
                    <View style={styles.detailRow}>
                      <Text variant="sm">Location:</Text>
                      <Text variant="sm">{item.location}</Text>
                    </View>
                    {item.lotNumber && (
                      <View style={styles.detailRow}>
                        <Text variant="sm">Lot Number:</Text>
                        <Text variant="sm">{item.lotNumber}</Text>
                      </View>
                    )}
                    {item.expiryDate && (
                      <View style={styles.detailRow}>
                        <Text variant="sm">Expiry Date:</Text>
                        <Text
                          variant="sm"
                          color={new Date(item.expiryDate) <= new Date() ? colors.error[500] : colors.gray[900]}
                        >
                          {item.expiryDate}
                        </Text>
                      </View>
                    )}
                  </View>

                  {item.lastRestocked && (
                    <View style={styles.detailSection}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        Last Restocked:
                      </Text>
                      <Text variant="sm">{item.lastRestocked}</Text>
                    </View>
                  )}

                  {item.notes && (
                    <View style={styles.detailSection}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        Notes:
                      </Text>
                      <Text variant="sm">{item.notes}</Text>
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
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[3]
  },
  itemsList: {
    flex: 1
  },
  itemCard: {
    marginBottom: spacing[4]
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4]
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 16
  },
  itemDetails: {
    gap: spacing[4]
  },
  detailSection: {
    gap: spacing[2]
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});