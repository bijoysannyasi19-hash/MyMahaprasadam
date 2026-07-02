import { Platform, View, Text, Keyboard, FlatList, SectionList, Pressable ,Image, RefreshControl, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { SearchIcon, CloseIcon, MenuIcon } from '@/components/ui/icon';
import { db } from "../app/firebase_config";
import { getDocs, collection } from "firebase/firestore";
import * as Location from 'expo-location';
import SidebarMenu from './Sidebar'

function HomeSearch() {
  const [query, setQuery] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const sectionListRef = useRef(null);

  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState({});

  const fetchStations = async () => {
    const snapshot = await getDocs(collection(db, 'stations'));
    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTotalData(data);
  };

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorite_stations');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
  };

  useEffect(() => {
    fetchStations();
    loadFavorites();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStations();
    setRefreshing(false);
  };

  const toggleFavorite = async (id, item) => {
    try {
      const newFavs = { ...favorites };
      if (newFavs[id]) {
        delete newFavs[id];
      } else {
        newFavs[id] = item;
      }
      setFavorites(newFavs);
      await AsyncStorage.setItem('favorite_stations', JSON.stringify(newFavs));
    } catch (e) {
      console.error('Failed to save favorite', e);
    }
  };

  const handleFindNearby = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    alert(`GPS Location found! Lat: ${location.coords.latitude.toFixed(2)}, Lon: ${location.coords.longitude.toFixed(2)}. (Integration with station coordinates pending)`);
  };

  const handleInputChange = (text) => {
    setQuery(text);
    setShowDropdown(true);
    const filtered = totalData.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilterData(filtered);
  };

  const clearQuery = () => {
    setQuery('');
    setFilterData([]);
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  const groupedStations = useMemo(() => {
    const grouped = totalData.reduce((acc, item) => {
      const letter = item.name[0].toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(item);
      return acc;
    }, {});
    return Object.keys(grouped)
      .sort()
      .map((letter) => ({
        title: letter,
        data: grouped[letter].sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [totalData]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF7C0' }} pointerEvents="box-none">
      
      <View className="flex flex-row items-center w-full px-4 py-2 " style={{ backgroundColor: '#2196F3' }}>
        <SidebarMenu >
          
        </SidebarMenu>
       
        <View style={{ flex: 1 }} className="relative mt-10">
          <Input>
            <InputField
              onChangeText={handleInputChange}
              value={query}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search Station to Order Prasadam"
              className="pl-10 pr-6 pt-0 pb-0"
              style={{
                backgroundColor: '#FFF7C0',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: 'gray',
               
              }}
            />
            <InputSlot className="absolute left-1" >
              {query.trim().length === 0 ? (
                <Pressable>
                  <InputIcon as={SearchIcon} />
                </Pressable>
              ) : (
                <Pressable onPress={clearQuery}>
                  <InputIcon as={CloseIcon} />
                </Pressable>
              )}
            </InputSlot>
          </Input>

          
          {showDropdown && query.trim().length > 0 && (
            <View
              style={{
                position: 'absolute',
                top: '100%',
                marginTop: 6,
                width: '100%',
                backgroundColor: 'white',
                borderColor: '#ccc',
                borderWidth: 1,
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                elevation: 3,
                zIndex: 1001,
              }}
            >
              <FlatList
                data={filterData}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="always"
                renderItem={({ item }) => (
                  <View className="flex-row items-center justify-between p-3 border-b border-gray-200">
                    <Pressable
                      style={{ flex: 1 }}
                      onPress={() => {
                        router.push(`/station/${item.id}`);
                        setQuery('');
                        setShowDropdown(false);
                        Keyboard.dismiss();
                      }}
                    >
                      <Text className="text-gray-800">{item.name}</Text>
                    </Pressable>
                    <Pressable onPress={() => toggleFavorite(item.id, item)} style={{ padding: 4 }}>
                      <MaterialIcons name={favorites[item.id] ? "favorite" : "favorite-border"} size={24} color={favorites[item.id] ? "red" : "gray"} />
                    </Pressable>
                  </View>
                )}
                ListEmptyComponent={
                  <Text className="p-4 text-gray-500">No matching station</Text>
                }
              />
            </View>
          )}
        </View>
      </View>

      
      {query.trim().length === 0 && (
        <>
          <TouchableOpacity 
            className="bg-green-500 mx-4 p-3 rounded-lg mt-4 mb-2 flex-row justify-center items-center"
            onPress={handleFindNearby}
          >
            <Text className="text-white font-bold text-center text-lg mr-2">📍 Find Nearby Stations</Text>
          </TouchableOpacity>
          <SectionList
            ref={sectionListRef}
            sections={groupedStations}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled={true}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-300">
                <Pressable
                  onPress={() => router.push(`/station/${item.id}`)}
                  style={{ flex: 1 }}
                >
                  <Text className="text-black text-base">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                </Pressable>
                <Pressable onPress={() => toggleFavorite(item.id, item)} style={{ padding: 4 }}>
                  <MaterialIcons name={favorites[item.id] ? "favorite" : "favorite-border"} size={24} color={favorites[item.id] ? "red" : "gray"} />
                </Pressable>
              </View>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View className="bg-blue-200 px-4 py-2 mt-2" style={{backgroundColor:'#64B5F6'}}>
                <Text className="font-bold text-lg text-black">{title}</Text>
              </View>
            )}
          />
        </>
      )}
          <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
            }}>
            <Pressable 
            style={{
              backgroundColor: '#2196F3',
              paddingVertical: 12,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopWidth: 1,
              borderColor: '#ccc',
            }}
            onPress={() => router.push('/cities')}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Search Prasadam in Cities</Text>
            </Pressable>
          </View>

       
    </View>
  );
}

export default HomeSearch;
