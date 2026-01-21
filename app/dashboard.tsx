import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Dashboard() {
  const router = useRouter();
  
  const circles = [
    { id: 1, label: 'Transactions', yOffset: 60, route: '/(tabs)/transactions' },
    { id: 2, label: 'Inventory', yOffset: 0, route: '/(tabs)/inventory' },
    { id: 3, label: 'Recipes', yOffset: 0, route: '/(tabs)/recipes' },
    { id: 4, label: 'Insights', yOffset: 60, route: '/(tabs)/analytics' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.circlesContainer}>
        {circles.map((circle) => (
          <View
            key={circle.id}
            style={[styles.circleWrapper, { top: circle.yOffset }]}
          >
            <Pressable
              style={({ pressed }) => [
                styles.circle,
                pressed && styles.circlePressed
              ]}
              onPress={() => circle.route && router.push(circle.route)}
            >
              <Text style={styles.label}>{circle.label}</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  circlesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 1200,
    height: 300,
  },
  circleWrapper: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#1E90FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePressed: {
    transform: [{ scale: 1.05 }],
  },
  label: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
