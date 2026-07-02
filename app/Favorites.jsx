import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ArrowLeftIcon, Icon } from '@/components/ui/icon';

export default function FavoritesScreen() {
  const [favoriteStations, setFavoriteStations] = useState([]);
  const [favoriteCities, setFavoriteCities] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedStations = await AsyncStorage.getItem('favorite_stations');
        if (storedStations) {
          const parsed = JSON.parse(storedStations);
          setFavoriteStations(Object.values(parsed));
        }
        const storedCities = await AsyncStorage.getItem('favorite_cities');
        if (storedCities) {
          const parsed = JSON.parse(storedCities);
          setFavoriteCities(Object.values(parsed));
        }
      } catch (e) {
        console.error('Failed to load favorites', e);
      }
    };
    loadFavorites();
  }, []);

  const removeStation = async (id) => {
    try {
      const stored = await AsyncStorage.getItem('favorite_stations');
      if (stored) {
        const parsed = JSON.parse(stored);
        delete parsed[id];
        setFavoriteStations(Object.values(parsed));
        await AsyncStorage.setItem('favorite_stations', JSON.stringify(parsed));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeCity = async (id) => {
    try {
      const stored = await AsyncStorage.getItem('favorite_cities');
      if (stored) {
        const parsed = JSON.parse(stored);
        delete parsed[id];
        setFavoriteCities(Object.values(parsed));
        await AsyncStorage.setItem('favorite_cities', JSON.stringify(parsed));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF7C0' }}>
      <View style={{ flexDirection: 'row', padding: 12, backgroundColor: '#2196F3', alignItems: 'center' }}>
        <Pressable onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.navigate('/');
            }
          }} className="mt-10 mr-4">
          <Icon as={ArrowLeftIcon} className="font-bold"/>
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }} className="mt-10">Favorites</Text>
      </View>
      
      <View style={{ padding: 16, flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#1E3A8A' }}>Favorite Stations</Text>
        {favoriteStations.length === 0 ? (
          <Text style={{ color: 'gray', marginBottom: 16 }}>No favorite stations added.</Text>
        ) : (
          <FlatList
            data={favoriteStations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Pressable style={{ flex: 1 }} onPress={() => router.push(`/station/${item.id}`)}>
                  <Text style={styles.itemText}>{item.name}</Text>
                </Pressable>
                <Pressable onPress={() => removeStation(item.id)}>
                  <MaterialIcons name="favorite" size={24} color="red" />
                </Pressable>
              </View>
            )}
          />
        )}

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 8, color: '#1E3A8A' }}>Favorite Cities</Text>
        {favoriteCities.length === 0 ? (
          <Text style={{ color: 'gray', marginBottom: 16 }}>No favorite cities added.</Text>
        ) : (
          <FlatList
            data={favoriteCities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Pressable style={{ flex: 1 }} onPress={() => router.push(`/city/${item.id}`)}>
                  <Text style={styles.itemText}>{item.name}</Text>
                </Pressable>
                <Pressable onPress={() => removeCity(item.id)}>
                  <MaterialIcons name="favorite" size={24} color="red" />
                </Pressable>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  }
});
