import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { router } from 'expo-router';
import { useEffect,useContext } from 'react';

export default function ProtectedRoute({ children }) {
  const { vendor, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading && !vendor) {
      router.replace('/');
    }
  }, [loading, vendor]);

  if (loading || !vendor) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
}
