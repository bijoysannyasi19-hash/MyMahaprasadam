import { View, Text, Keyboard, FlatList, SectionList, Pressable, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { SearchIcon, CloseIcon } from '@/components/ui/icon';
import { db } from './firebase_config';
import { getDocs, collection } from 'firebase/firestore';
import { ArrowLeftIcon,Icon } from '@/components/ui/icon';

function CitySearch() {
  const [query, setQuery] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const sectionListRef = useRef(null);

  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState({});

  const fetchCities = async () => {
    const snapshot = await getDocs(collection(db, 'cities'));
    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTotalData(data);
  };

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorite_cities');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
  };

  useEffect(() => {
    fetchCities();
    loadFavorites();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCities();
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
      await AsyncStorage.setItem('favorite_cities', JSON.stringify(newFavs));
    } catch (e) {
      console.error('Failed to save favorite', e);
    }
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

  const groupedCities = useMemo(() => {
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
    <>
    <View style={{ flex: 1, backgroundColor: '#FFF7C0' }}>
      <View style={{ flexDirection: 'row', padding: 12, backgroundColor: '#2196F3',marginBottom:8 }}>
      <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          elevation: 4,
        }}>
          <Pressable onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.navigate('/');
            }
          }} className="mt-10">
        <Icon as={ArrowLeftIcon} className="font-bold"/>
        </Pressable>
          
        </View>
        <View style={{ flex: 1}} className="mt-10">
          <Input>
            <InputField
              onChangeText={handleInputChange}
              value={query}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search City to Order Prasadam"
              className="pl-10 pr-6 pt-0 pb-0"
              style={{
                backgroundColor: '#FFF7C0',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: 'gray',
              }}
            />
            <InputSlot className="absolute left-3">
              {query.trim().length === 0 ? (
                <Pressable><InputIcon as={SearchIcon} /></Pressable>
              ) : (
                <Pressable onPress={clearQuery}><InputIcon as={CloseIcon} /></Pressable>
              )}
            </InputSlot>
          </Input>

          {showDropdown && query.trim().length > 0 && (
            <View style={{
              position: 'absolute',
              top: '100%',
              marginTop: 8,
              width: '100%',
              backgroundColor: 'white',
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 8,
              elevation: 3,
              zIndex: 1001,
            }}>
              <FlatList
                data={filterData}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="always"
                renderItem={({ item }) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
                    <Pressable
                      style={{ flex: 1 }}
                      onPress={() => {
                        router.push(`/city/${item.id}`);
                        setQuery('');
                        setShowDropdown(false);
                        Keyboard.dismiss();
                      }}
                    >
                      <Text>{item.name}</Text>
                    </Pressable>
                    <Pressable onPress={() => toggleFavorite(item.id, item)} style={{ padding: 4 }}>
                      <MaterialIcons name={favorites[item.id] ? "favorite" : "favorite-border"} size={24} color={favorites[item.id] ? "red" : "gray"} />
                    </Pressable>
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={{ padding: 12, color: 'gray' }}>No matching city</Text>
                }
              />
            </View>
          )}
        </View>
      </View>

      {query.trim().length === 0 && (
        <SectionList
          ref={sectionListRef}
          sections={groupedCities}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
              <Pressable
                onPress={() => router.push(`/city/${item.id}`)}
                style={{ flex: 1 }}
              >
                <Text>{item.name}</Text>
              </Pressable>
              <Pressable onPress={() => toggleFavorite(item.id, item)} style={{ padding: 4 }}>
                <MaterialIcons name={favorites[item.id] ? "favorite" : "favorite-border"} size={24} color={favorites[item.id] ? "red" : "gray"} />
              </Pressable>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{ backgroundColor: '#64B5F6', padding: 8 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{title}</Text>
            </View>
          )}
        />
      )}
    </View>
    </>
  );
}

export default CitySearch;
