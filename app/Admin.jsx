import { useState } from 'react';
import { Pressable, Text, View, Modal, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator
} from '@/components/ui/menu';
import { MenuIcon } from '@/components/ui/icon';
import { Button, ButtonText } from '@/components/ui/button';
import { db } from './firebase_config'; // Firestore instance

function CustomMenu() {
  const [isModalVisible, setModalVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const auth = getAuth();
  const firestore = getFirestore();

  const handleAdminLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(firestore, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === 'admin') {
        setModalVisible(false);
        router.push('/Approval'); 
      } 
      else {
        console.log("kuch gadwad hai")
        alert('Access Denied', 'You are not an admin.');
      }
    } catch (error) {
      alert('Access Denied', 'You are not an admin.');
      
    }
  };

  return (
    <View>
  

      {/* Admin Login Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-[80%]">
            <Text className="text-lg font-bold mb-4">Admin Login</Text>

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              className="border p-2 mb-2 rounded"
              keyboardType="email-address"
            />

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              className="border p-2 mb-4 rounded"
              secureTextEntry
            />

            <Button onPress={handleAdminLogin} className="bg-blue-500 p-2 rounded">
              <ButtonText className="text-white">Login</ButtonText>
            </Button>

            <Button onPress={() =>router.back('/HomeSearch') } className="bg-gray-500 p-2 rounded mt-2">
              <ButtonText className="text-white">Cancel</ButtonText>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default CustomMenu;
