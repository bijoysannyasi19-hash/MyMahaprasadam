import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (vendorData) => {
    await AsyncStorage.setItem('vendor', JSON.stringify(vendorData));
    setVendor(vendorData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('vendor');
    setVendor(null);
  };

  useEffect(() => {
    const loadVendor = async () => {
      const stored = await AsyncStorage.getItem('vendor');
      if (stored) {
        const parsed = JSON.parse(stored);
        setVendor(parsed);
      }
      setLoading(false);
    };
    loadVendor();
  }, []);
  

  return (
    <AuthContext.Provider value={{ vendor, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );


};

// export const useAuth = () => useContext(AuthContext);
export {AuthContext}
