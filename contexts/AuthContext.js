import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../app/firebase_config';
import { collection, query, where, getDocs } from 'firebase/firestore';


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (vendorData) => {
    setVendor(vendorData);
  };

  const logout = async () => {
    await signOut(auth);
    setVendor(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(collection(db, "vendors"), where("email", "==", user.email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const vendorDoc = querySnapshot.docs[0];
            setVendor({ id: vendorDoc.id, ...vendorDoc.data() });
          } else {
            setVendor({ id: user.uid, email: user.email });
          }
        } catch (e) {
          console.error("Failed to load vendor from firestore", e);
        }
      } else {
        setVendor(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  

  return (
    <AuthContext.Provider value={{ vendor, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );


};

// export const useAuth = () => useContext(AuthContext);
export {AuthContext}
