import React, { useState, useEffect,useContext } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Image, TouchableOpacity, ActivityIndicator,Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db } from "../firebase_config";
import { getDoc, updateDoc, doc, getDocs, collection } from "firebase/firestore";
import { View, Text, TextInput, Button, FlatList, Modal,} from 'react-native';
import styles from './menu_style.js';
import ProtectedRoute from '../../components/ProtectedRoute';
import { AuthContext } from '../../contexts/AuthContext';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';


export default function Menu() {
  const { vendor_card_login } = useLocalSearchParams();
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  const [menu, setMenu] = useState([]);
  const [vendorDetails, setVendorDetails] = useState({
    name: '',
    contact: '',
    address: '',
    description: '',
    imageurl: '',
    imagePath: ''
  });
  const [loading, setLoading] = useState(true);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState({ id: '', name: '', price: 0, description: '' });

  useEffect(() => {
    const fetchVendorData = async () => {
      const snapshot = await getDocs(collection(db, 'vendors'));
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const vendor = data.find(v => v.id === vendor_card_login);

      if (vendor) {
        setVendorDetails({
          name: vendor.name,
          contact: vendor.contact,
          address: vendor.address,
          description: vendor.description,
          imageurl: vendor.imageurl || '',
          imagePath: vendor.imagePath || ''
        });
        setMenu(vendor.menu || []);
      }
      setLoading(false);
    };

    fetchVendorData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
  
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const imageName = `${vendor_card_login}_${Date.now()}`;
      const storage = getStorage();
      const imageRef = ref(storage, `vendorImages/${imageName}`);
  
      try {
        const prevPath = vendorDetails.imagePath;
  
        const response = await fetch(imageUri);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob);
  
        const downloadURL = await getDownloadURL(imageRef);
  
        const vendorRef = doc(db, "vendors", vendor_card_login);
        await updateDoc(vendorRef, {
          imageurl: downloadURL,
          imagePath: `vendorImages/${imageName}`,
        });
  
        setVendorDetails(prev => ({
          ...prev,
          imageurl: downloadURL,
          imagePath: `vendorImages/${imageName}`,
        }));
  
        if (prevPath) {
          const oldRef = ref(storage, prevPath);
          await deleteObject(oldRef);
          console.log("Old image deleted");
        }
  
        alert("Image changed");
  
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Failed to upload or update image.");
      }
    }
  };
  

  const handleUpdateProfile = async () => {
    if (!vendor_card_login || vendor_card_login === "-1") {
      alert("Invalid Vendor ID!");
      return;
    }

    try {
      const vendorRef = doc(db, "vendors", vendor_card_login);
      await updateDoc(vendorRef, {
        name: vendorDetails.name,
        contact: vendorDetails.contact,
        address: vendorDetails.address,
        description: vendorDetails.description,
        ...(vendorDetails.imageurl && { imageurl: vendorDetails.imageurl }),
        ...(vendorDetails.imagePath && { imagePath: vendorDetails.imagePath })
      });

      alert("Profile updated successfully!");
      setProfileModalVisible(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleSaveMenuItem = async () => {
    if (!currentItem.name || !currentItem.price) {
      alert("Please fill all fields");
      return;
    }

    try {
      const vendorRef = doc(db, "vendors", vendor_card_login);
      const vendorSnap = await getDoc(vendorRef);
      const vendorData = vendorSnap.data();
      const existingMenu = vendorData.menu || [];

      let updatedMenu;

      if (currentItem.id) {
        updatedMenu = existingMenu.map((item) =>
          item.id === currentItem.id ? { ...currentItem, price: parseFloat(currentItem.price) } : item
        );
      } else {
        const uniqueID = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newItem = {
          id: uniqueID,
          name: currentItem.name,
          price: parseFloat(currentItem.price),
          description: currentItem.description,
        };

        updatedMenu = [...existingMenu, newItem];
      }

      await updateDoc(vendorRef, { menu: updatedMenu });
      setMenu(updatedMenu);
      setMenuModalVisible(false);
      setCurrentItem({ id: '', name: '', price: '', description: '' });

      alert("Menu updated successfully!");
    } catch (error) {
      console.error("Error updating menu:", error);
      alert("Failed to update menu.");
    }
  };

  const handleDeleteMenuItem = async (id) => {
    try {
      const updatedMenu = menu.filter((item) => item.id !== id);
      await updateDoc(doc(db, "vendors", vendor_card_login), { menu: updatedMenu });
      setMenu(updatedMenu);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item.");
    }
  };

  const handleEditMenuItem = (item) => {
    setCurrentItem(item);
    setMenuModalVisible(true);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }
  const handleLogout = async() => {
    console.log("Logout clicked");
    alert("Logging out...")
    try {
      await logout();  
      console.log("Logout successful");
      router.replace('/');
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed.");
    }
  };
  
  
  

  return (
    <ProtectedRoute>
    <View style={styles.container_header}>
    
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: '#2196F3',
      
    }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' ,marginTop:15}}>Vendor Dashboard</Text>
      <TouchableOpacity onPress={handleLogout} style={{ padding: 6 ,marginTop:15}}>
      <Text style={{ color: 'red', fontSize: 16 }}>Log out</Text>
     </TouchableOpacity>

      </View>
    </View>

    

    <View style={styles.container}>
      <View style={[styles.vendorContainer, styles.shadow]}>
        {vendorDetails.imageurl ? (
          <Image source={{ uri: vendorDetails.imageurl }} style={styles.vendorImage} />
        ) : (
          <Text style={{ fontStyle: 'italic', padding: 10 }}>Image not available</Text>
        )}
        <View style={styles.vendorInfo}>
          <Text style={styles.vendorName}>{vendorDetails.name}</Text>
          <Text style={styles.vendorDescription}>{vendorDetails.description}</Text>
          <Text style={styles.vendorDetail}>🏠 {vendorDetails.address}</Text>
          <Text style={styles.vendorDetail}>📞 {vendorDetails.contact}</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setProfileModalVisible(true)}>
            <Text style={styles.addButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      
      <Modal visible={profileModalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Shop Details</Text>
            <TextInput style={styles.input} placeholder="Shop Name" value={vendorDetails.name} onChangeText={text => setVendorDetails({ ...vendorDetails, name: text })} />
            <TextInput style={styles.input} placeholder="Contact" keyboardType="phone-pad" value={vendorDetails.contact} onChangeText={text => setVendorDetails({ ...vendorDetails, contact: text })} />
            <TextInput style={styles.input} placeholder="Address" value={vendorDetails.address} onChangeText={text => setVendorDetails({ ...vendorDetails, address: text })} />
            <TextInput style={styles.input} placeholder="Description" value={vendorDetails.description} onChangeText={text => setVendorDetails({ ...vendorDetails, description: text })} />

           
            {vendorDetails.imageurl ? (
              <Image source={{ uri: vendorDetails.imageurl }} style={{ width: 100, height: 100, alignSelf: 'center', marginBottom: 10, borderRadius: 8 }} />
            ) : (
              <Text style={{ fontStyle: 'italic', marginBottom: 10, textAlign: 'center' }}>No image selected</Text>
            )}

            <TouchableOpacity style={styles.addButton} onPress={pickImage}>
              <Text style={styles.addButtonText}>Change Image</Text>
            </TouchableOpacity>
            {'\n'}
            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={handleUpdateProfile} />
              <TouchableOpacity style={[styles.addButton, { backgroundColor: 'grey' }]} onPress={() => setProfileModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={menuModalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{currentItem.id ? 'Edit Item' : 'Add Item'}</Text>
            <TextInput style={styles.input} placeholder="Name" value={currentItem.name} onChangeText={text => setCurrentItem({ ...currentItem, name: text })} />
            <TextInput style={styles.input} placeholder="Price" keyboardType="numeric" value={currentItem.price.toString()} onChangeText={text => setCurrentItem({ ...currentItem, price: text })} />
            <TextInput style={styles.input} placeholder="Description" value={currentItem.description} onChangeText={text => setCurrentItem({ ...currentItem, description: text })} />
            <TouchableOpacity style={styles.addButton} onPress={handleSaveMenuItem}>
              <Text style={styles.addButtonText}>Save</Text>
            </TouchableOpacity>{'\n'}
            <TouchableOpacity style={[styles.addButton, { backgroundColor: 'grey' }]} onPress={() => setMenuModalVisible(false)}>
              <Text style={styles.addButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {'\n'}
      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name.toUpperCase()}</Text>
            <Text>Price: ₹{item.price}</Text>
            <Text>{item.description}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEditMenuItem(item)}>
                <Text style={styles.buttonText}>✏️ Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteMenuItem(item.id)}>
                <Text style={styles.buttonText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setMenuModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Item</Text>
      </TouchableOpacity>
    </View>
    </ProtectedRoute>
  );
}
