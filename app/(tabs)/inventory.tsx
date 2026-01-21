import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample inventory items - will be replaced with real data later
  const inventoryItems = [
    { id: 1, name: 'Vodka', brand: 'Grey Goose', quantity: 5 },
    { id: 2, name: 'Whiskey', brand: 'Jack Daniels', quantity: 3 },
    { id: 3, name: 'Tequila', brand: 'Patron', quantity: 7 },
    { id: 4, name: 'Rum', brand: 'Bacardi', quantity: 4 },
    { id: 5, name: 'Gin', brand: 'Tanqueray', quantity: 6 },
    { id: 6, name: 'Brandy', brand: 'Hennessy', quantity: 2 },
    { id: 7, name: 'Bourbon', brand: "Maker's Mark", quantity: 8 },
    { id: 8, name: 'Scotch', brand: 'Glenfiddich', quantity: 3 },
  ];

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search inventory..."
          placeholderTextColor="#666"
        />
      </View>

      {/* Scrolling Grid - 2/3 width */}
      <View style={styles.gridWrapper}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.gridContainer}
        >
          {inventoryItems.map((item) => (
            <View key={item.id} style={styles.gridItemWrapper}>
              <Pressable
                style={({ pressed }) => [
                  styles.gridItem,
                  pressed && styles.gridItemPressed
                ]}
              >
                <View style={styles.iconPlaceholder}>
                  <Text style={styles.iconText}>{item.name.charAt(0)}</Text>
                </View>
              </Pressable>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 20,
    alignItems: 'center',
  },
  searchContainer: {
    width: '66.67%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  gridWrapper: {
    width: '66.67%',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 5,
  },
  gridItemWrapper: {
    width: 80,
    alignItems: 'center',
    marginBottom: 25,
  },
  gridItem: {
    width: 80,
    height: 80,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridItemPressed: {
    backgroundColor: '#2a2a2a',
    transform: [{ scale: 0.95 }],
  },
  iconPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#1E90FF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  itemName: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});
