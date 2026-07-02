import { AuthContext } from '../contexts/AuthContext';
import { useContext, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

import HomeSearch from '../components/HomeSearch';

export default function HomeScreen() {
  const { vendor, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading) {
      if (vendor && vendor.id) {
        router.replace(`/vndor_cardlog/${vendor.id}`);
      } else {
        console.log("Vendor not found or missing ID", vendor);
      }
      
    }
  }, [vendor, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <HomeSearch />; 
}
