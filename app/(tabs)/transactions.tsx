import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Transactions() {
  const transactionColumns = ['Quantity', 'Item', 'Brand', 'Category', 'Date', 'Price'];
  const receiptColumns = ['Date', 'Store', 'Total Price'];
  
  // Filter states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchName, setSearchName] = useState(true);
  const [searchBrand, setSearchBrand] = useState(true);
  const [category, setCategory] = useState('All');
  const [store, setStore] = useState('All');
  const [minDate, setMinDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);
  const [showMinDatePicker, setShowMinDatePicker] = useState(false);
  const [showMaxDatePicker, setShowMaxDatePicker] = useState(false);
  const [dateFilterInside, setDateFilterInside] = useState(true);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [priceFilterInside, setPriceFilterInside] = useState(true);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'transactions' | 'receipts'>('transactions');
  
  // Sort states: null = off, 'asc' = ascending, 'desc' = descending
  const [sortStates, setSortStates] = useState<Record<string, null | 'asc' | 'desc'>>({
    Item: null,
    Brand: null,
    Category: null,
    Date: null,
    Price: null,
  });
  
  const handleSort = (column: string) => {
    if (column === 'Quantity') return; // Don't sort Quantity
    
    setSortStates(prev => {
      const currentState = prev[column];
      let nextState: null | 'asc' | 'desc';
      
      if (currentState === null) {
        nextState = 'asc';
      } else if (currentState === 'asc') {
        nextState = 'desc';
      } else {
        nextState = null;
      }
      
      return { ...prev, [column]: nextState };
    });
  };
  
  const getSortIcon = (column: string) => {
    if (column === 'Quantity') return null;
    const state = sortStates[column];
    if (state === 'asc') return '▲';
    if (state === 'desc') return '▼';
    return '⇅';
  };
  
  const categories = ['All', 'Liquor', 'Base', 'Tool', 'Ingredient'];
  const stores = ['All', 'Store 1', 'Store 2', 'Store 3'];
  
  // Sample data - will be replaced with real data later
  const transactionData = [
    { quantity: '2', item: 'Vodka', brand: 'Grey Goose', category: 'Spirits', date: '01/13/26', price: '$45.99' },
    { quantity: '1', item: 'Whiskey', brand: 'Jack Daniels', category: 'Spirits', date: '01/12/26', price: '$32.50' },
    { quantity: '3', item: 'Tequila', brand: 'Patron', category: 'Spirits', date: '01/11/26', price: '$89.99' },
  ];
  
  const receiptData = [
    { date: '01/13/26', store: 'Store 1', totalPrice: '$245.99' },
    { date: '01/12/26', store: 'Store 2', totalPrice: '$132.50' },
    { date: '01/10/26', store: 'Store 3', totalPrice: '$89.99' },
  ];
  
  const columns = activeTab === 'transactions' ? transactionColumns : receiptColumns;
  const sampleData = activeTab === 'transactions' ? transactionData : receiptData;

  return (
    <View style={styles.container}>
      <View style={styles.tableContainer}>
        <Text style={styles.title}>Transactions</Text>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'transactions' && styles.tabActive]}
            onPress={() => setActiveTab('transactions')}
          >
            <Text style={[styles.tabText, activeTab === 'transactions' && styles.tabTextActive]}>
              Transactions
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'receipts' && styles.tabActive]}
            onPress={() => setActiveTab('receipts')}
          >
            <Text style={[styles.tabText, activeTab === 'receipts' && styles.tabTextActive]}>
              Receipts
            </Text>
          </Pressable>
        </View>
        
        {/* Filters Section */}
        <View style={styles.filtersContainer}>
          {activeTab === 'transactions' ? (
            <>
              {/* Keyword Search */}
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Search:</Text>
                <TextInput
                  style={styles.textInput}
                  value={searchKeyword}
                  onChangeText={setSearchKeyword}
                  placeholder="Search..."
                  placeholderTextColor="#666"
                />
                <Pressable 
                  style={styles.checkbox}
                  onPress={() => setSearchName(!searchName)}
                >
                  <View style={[styles.checkboxInner, searchName && styles.checkboxChecked]} />
                  <Text style={styles.checkboxLabel}>Name</Text>
                </Pressable>
                <Pressable 
                  style={styles.checkbox}
                  onPress={() => setSearchBrand(!searchBrand)}
                >
                  <View style={[styles.checkboxInner, searchBrand && styles.checkboxChecked]} />
                  <Text style={styles.checkboxLabel}>Brand</Text>
                </Pressable>
              </View>

              {/* Category Dropdown */}
              <View style={[styles.filterRow, styles.categoryRow]}>
                <Text style={styles.filterLabel}>Category:</Text>
                <View style={styles.dropdownContainer}>
                  <Pressable 
                    style={styles.dropdown}
                    onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  >
                    <Text style={styles.dropdownText}>{category}</Text>
                  </Pressable>
                  {showCategoryDropdown && (
                    <View style={styles.dropdownMenu}>
                      {categories.map((cat, index) => (
                        <Pressable
                          key={cat}
                          style={[styles.dropdownItem, index === categories.length - 1 && styles.dropdownItemLast]}
                          onPress={() => {
                            setCategory(cat);
                            setShowCategoryDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{cat}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Store Dropdown for Receipts */}
              <View style={[styles.filterRow, styles.categoryRow]}>
                <Text style={styles.filterLabel}>Store:</Text>
                <View style={styles.dropdownContainer}>
                  <Pressable 
                    style={styles.dropdown}
                    onPress={() => setShowStoreDropdown(!showStoreDropdown)}
                  >
                    <Text style={styles.dropdownText}>{store}</Text>
                  </Pressable>
                  {showStoreDropdown && (
                    <View style={styles.dropdownMenu}>
                      {stores.map((s, index) => (
                        <Pressable
                          key={s}
                          style={[styles.dropdownItem, index === stores.length - 1 && styles.dropdownItemLast]}
                          onPress={() => {
                            setStore(s);
                            setShowStoreDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{s}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </>
          )}

          {/* Date Filter */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Date:</Text>
            {Platform.OS === 'web' ? (
              <>
                <input
                  type="date"
                  value={minDate ? minDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setMinDate(new Date(e.target.value));
                    } else {
                      setMinDate(null);
                    }
                  }}
                  style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    borderRadius: 5,
                    padding: 8,
                    minWidth: 120,
                    marginRight: 10,
                    border: 'none',
                    fontSize: 14,
                  }}
                />
                <Text style={styles.filterLabel}>to</Text>
                <input
                  type="date"
                  value={maxDate ? maxDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setMaxDate(new Date(e.target.value));
                    } else {
                      setMaxDate(null);
                    }
                  }}
                  style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    borderRadius: 5,
                    padding: 8,
                    minWidth: 120,
                    marginRight: 10,
                    border: 'none',
                    fontSize: 14,
                  }}
                />
              </>
            ) : (
              <>
                <Pressable 
                  style={styles.dateButton}
                  onPress={() => setShowMinDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {minDate ? minDate.toLocaleDateString() : 'Min Date'}
                  </Text>
                </Pressable>
                {showMinDatePicker && (
                  <DateTimePicker
                    value={minDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowMinDatePicker(Platform.OS === 'ios');
                      if (selectedDate) setMinDate(selectedDate);
                    }}
                  />
                )}
                <Text style={styles.filterLabel}>to</Text>
                <Pressable 
                  style={styles.dateButton}
                  onPress={() => setShowMaxDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {maxDate ? maxDate.toLocaleDateString() : 'Max Date'}
                  </Text>
                </Pressable>
                {showMaxDatePicker && (
                  <DateTimePicker
                    value={maxDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowMaxDatePicker(Platform.OS === 'ios');
                      if (selectedDate) setMaxDate(selectedDate);
                    }}
                  />
                )}
              </>
            )}
            <Pressable 
              style={styles.toggleButton}
              onPress={() => setDateFilterInside(!dateFilterInside)}
            >
              <Text style={styles.toggleButtonText}>
                {dateFilterInside ? 'Between' : 'Outside'}
              </Text>
            </Pressable>
          </View>

          {/* Price Filter */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>{activeTab === 'transactions' ? 'Price:' : 'Total Price:'}</Text>
            <TextInput
              style={styles.priceInput}
              value={minPrice}
              onChangeText={setMinPrice}
              placeholder="Min"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
            <Text style={styles.filterLabel}>to</Text>
            <TextInput
              style={styles.priceInput}
              value={maxPrice}
              onChangeText={setMaxPrice}
              placeholder="Max"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
            <Pressable 
              style={styles.toggleButton}
              onPress={() => setPriceFilterInside(!priceFilterInside)}
            >
              <Text style={styles.toggleButtonText}>
                {priceFilterInside ? 'Between' : 'Outside'}
              </Text>
            </Pressable>
          </View>

          {/* Search Button */}
          <View style={styles.searchButtonContainer}>
            <Pressable 
              style={styles.searchButton}
              onPress={() => {
                // Filter logic will go here
                console.log('Search pressed');
              }}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </Pressable>
          </View>
        </View>
        
        {/* Header Row */}
        <View style={styles.headerRow}>
          {columns.map((column, index) => (
            <Pressable 
              key={index} 
              style={styles.headerCell}
              onPress={() => handleSort(column)}
              disabled={column === 'Quantity'}
            >
              <View style={styles.headerContent}>
                <Text style={styles.headerText}>{column}</Text>
                {column !== 'Quantity' && (
                  <Text style={styles.sortIcon}>{getSortIcon(column)}</Text>
                )}
              </View>
            </Pressable>
          ))}
        </View>

        {/* Data Rows */}
        <ScrollView style={styles.scrollView}>
          {activeTab === 'transactions' ? (
            transactionData.map((row, rowIndex) => (
              <Pressable 
                key={rowIndex} 
                style={({ pressed }) => [
                  styles.dataRow,
                  pressed && styles.dataRowPressed
                ]}
                onPress={() => {
                  setSelectedItem(row);
                  setShowModal(true);
                }}
              >
                <View style={styles.dataCell}>
                  <Text style={styles.dataText}>{row.quantity}</Text>
                </View>
                <View style={styles.dataCell}>
                  <Text style={styles.dataText}>{row.item}</Text>
                </View>
                <View style={styles.dataCell}>
                  <Text style={styles.dataText}>{row.brand}</Text>
                </View>
                <View style={styles.dataCell}>
                  <Text style={styles.dataText}>{row.category}</Text>
                </View>
                <View style={styles.dataCell}>
                  <Text style={styles.dataText}>{row.date}</Text>
                </View>
                <View style={styles.dataCell}>
                  <Text style={styles.dataText}>{row.price}</Text>
                </View>
              </Pressable>
            ))
          ) : (
            receiptData.map((row, rowIndex) => (
              <Pressable 
                key={rowIndex} 
                style={({ pressed }) => [
                  styles.dataRow,
                  pressed && styles.dataRowPressed
                ]}
                onPress={() => {
                  setSelectedItem(row);
                  setShowModal(true);
                }}
              >
                <View style={styles.dataCell}>
                  <Text style={styles.dataText}>{row.date}</Text>
                </View>
                <View style={styles.dataCell}>
                  <Text style={styles.dataText}>{row.store}</Text>
                </View>
                <View style={styles.dataCell}>
                  <Text style={styles.dataText}>{row.totalPrice}</Text>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      </View>

      {/* Details Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Details for {selectedItem?.item || 'Item'}
            </Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  tableContainer: {
    width: '90%',
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#1E90FF',
  },
  tabText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#1E90FF',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#1E90FF',
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  headerText: {
    color: '#1E90FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sortIcon: {
    color: '#1E90FF',
    fontSize: 14,
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 15,
    cursor: 'pointer',
  },
  dataRowPressed: {
    backgroundColor: '#2a2a2a',
  },
  dataCell: {
    flex: 1,
    alignItems: 'center',
  },
  dataText: {
    color: '#fff',
    fontSize: 14,
  },
  filtersContainer: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    position: 'relative',
  },
  categoryRow: {
    zIndex: 10000,
    elevation: 10000,
  },
  filterLabel: {
    color: '#fff',
    fontSize: 14,
    marginRight: 10,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 5,
    padding: 8,
    flex: 1,
    minWidth: 150,
    marginRight: 10,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#1E90FF',
    borderRadius: 3,
    marginRight: 5,
  },
  checkboxChecked: {
    backgroundColor: '#1E90FF',
  },
  checkboxLabel: {
    color: '#fff',
    fontSize: 14,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 10000,
    elevation: 10000,
  },
  dropdown: {
    backgroundColor: '#333',
    borderRadius: 5,
    padding: 8,
    minWidth: 120,
    marginRight: 10,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 14,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#333',
    borderRadius: 5,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    zIndex: 99999,
    elevation: 99999,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 14,
  },
  dateButton: {
    backgroundColor: '#333',
    borderRadius: 5,
    padding: 8,
    minWidth: 120,
    marginRight: 10,
    justifyContent: 'center',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  priceInput: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 5,
    padding: 8,
    minWidth: 80,
    marginRight: 10,
  },
  toggleButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    padding: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchButtonContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  searchButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 30,
    minWidth: 400,
    maxWidth: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
