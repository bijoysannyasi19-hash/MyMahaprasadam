import { Image, Pressable, View, Text, TouchableOpacity, ScrollView, Linking, Alert,Platform } from 'react-native';
import { useLocalSearchParams,Stack ,router} from 'expo-router';
import { useState, useEffect } from 'react';
import styles from "./vendorstyle.js";
import {
  Actionsheet, ActionsheetBackdrop, ActionsheetContent,
  ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper,
  ActionsheetItem, ActionsheetItemText,
} from '@/components/ui/actionsheet';
import { db } from '../firebase_config';
import { getDocs, collection } from 'firebase/firestore';
import { ArrowLeftIcon,Icon } from '@/components/ui/icon';



export default function VendorDescription() {
  const { vendor_id } = useLocalSearchParams();
  const [totalCost, setMycost] = useState(0);
  const [count, setCount] = useState({});
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  const [loadVendors,setLoadvendor]=useState(true)

  const handleClose = () => setShowActionsheet(false);

  useEffect(() => {
    const fetchVendorData = async () => {
      const snapshot = await getDocs(collection(db, 'vendors'));
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setVendorData(data);
      setLoadvendor(false)
    };
    fetchVendorData();
  }, []);

  const index = vendorData.findIndex((vendor) => vendor.id === vendor_id);
  if(loadVendors){
    return (
      <View>
          <Text>Loading...</Text>
      </View>
  );
  }
  if(index==-1){
    return (
      <View >
          <Text style={{}}>Vendor Not Found</Text>
      </View>
    )
  }

  const vendor = vendorData[index];

  function toCount(itemName, itemPrice) {
    setCount((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || 0) + 1,
    }));
    setMycost((t) => t + itemPrice);
  }

  function decrementCount(itemName, itemPrice) {
    setCount((prev) => {
      const updated = { ...prev };
      if (updated[itemName] > 0) {
        updated[itemName] -= 1;
        if (updated[itemName] === 0) delete updated[itemName];
      }
      return updated;
    });
    setMycost((t) => t - itemPrice);
  }

  const handleOrder = () => {
    const rawPhone = vendor.contact.replace(/[^\d]/g, '');
    const phoneNumber = `91${rawPhone.slice(-10)}`;
    const orderDetails = Object.entries(count)
      .map(([item, qty]) => `${item}: ${qty}`)
      .join('\n');
    const plainMessage = `Hare Krishna 🙏\nI would like to place an order:\n${orderDetails}\nTotal Cost: ₹${totalCost}`;
    const encodedMessage = encodeURIComponent(plainMessage);
  
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    const smsUrl = `sms:${phoneNumber}?body=${encodedMessage}`; // fallback SMS
  const callUrl = `tel:${phoneNumber}`; // direct call

 

    // Show initial alert first
    Alert.alert(
      'After Placing Order',
      'Please Call Vendor to Confirm Your Order',
      [
        {
          text: 'Proceed with WhatsApp',
          onPress: async () => {
            try {
                await Linking.openURL(whatsappUrl);
            } catch (err) {
              Alert.alert(
                'WhatsApp not available',
                'Try calling or sending an SMS.',
                [
                  { text: 'Call Vendor', onPress: () => Linking.openURL(`tel:${vendor.contact}`) },
                  { text: 'Send SMS', onPress: () => Linking.openURL(`sms:${vendor.contact}`) },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };
  


  return (
    <>
    <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4
      }}>
        <Pressable onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.navigate('/');
          }
        }}>
      <Icon as={ArrowLeftIcon} className="font-bold mt-10"/>
      </Pressable>
        <Text style={{
          flex: 1,
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 'bold',
          color: 'black',
          marginRight: 32, 
    
        }} className=" mt-10">
          {vendor?.name || 'Vendor'}
        </Text>
      </View>

    <View style={{ flex: 1 ,backgroundColor: '#FFF7C0'}}>
      <ScrollView contentContainerStyle={{ paddingBottom: 10, backgroundColor: '#FFF7C0' }}>
        <View style={styles.container}>
          <View style={styles.contentWrapper}>
            {vendor.imageurl ? (
              <Image source={{ uri: vendor.imageurl }} style={styles.vendorImage} />
            ) : (
              <Text>No image available</Text>
            )}
            {/* <Text style={styles.vendorName}>{vendor.name.toUpperCase()}</Text> */}

            {vendor.menu.map((item) => (
              <View key={item.name} style={styles.menuCard}>
                <Text style={styles.menuTitle}>{item.name.toUpperCase()}</Text>
                <Text style={styles.menuDetails}>{item.description} | Price: ₹{item.price}</Text>

                <View style={styles.buttonRow}>
                  {count[item.name] > 0 && (
                    <TouchableOpacity
                      onPress={() => decrementCount(item.name, item.price)}
                    >
                      <View style={styles.circleButton}><Text style={styles.buttonText}>-</Text></View>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      if (!count[item.name]) {
                        toCount(item.name, item.price);
                      }
                    }}
                  >
                    <View style={styles.addButton}>
                      <Text style={{ fontWeight: 'bold', color: '#fff' }}>
                        {count[item.name] > 0 ? count[item.name] : 'ADD ITEM'}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {count[item.name] > 0 && (
                    <TouchableOpacity
                      onPress={() => toCount(item.name, item.price)}
                    >
                      <View style={styles.circleButton}><Text style={styles.buttonText}>+</Text></View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {Object.values(count).some((q) => q > 0) && (
        <>
          <Pressable style={styles.bottomButtonContainer} onPress={() => setShowActionsheet(true)}>
            <Text style={styles.bottomButtonText}>See Your Items</Text>
          </Pressable>

          <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
            <ActionsheetBackdrop />
            <ActionsheetContent>
              <ActionsheetDragIndicatorWrapper>
                <ActionsheetDragIndicator />
              </ActionsheetDragIndicatorWrapper>

              {vendor.menu.map(
                (item) =>
                  count[item.name] > 0 && (
                    <ActionsheetItem key={item.name}>
                      <ActionsheetItemText>
                        Item: {item.name} | Qty: {count[item.name]}
                      </ActionsheetItemText>
                    </ActionsheetItem>
                  )
              )}

              <ActionsheetItem>
                <ActionsheetItemText>Total Cost: ₹{totalCost}</ActionsheetItemText>
              </ActionsheetItem>

              <ActionsheetItem onPress={handleOrder}>
                <ActionsheetItemText>Order Now</ActionsheetItemText>
              </ActionsheetItem>




              <ActionsheetItem onPress={handleClose}>
                <ActionsheetItemText>Cancel</ActionsheetItemText>
              </ActionsheetItem>
            </ActionsheetContent>
          </Actionsheet>
        </>
      )}
    </View>
    </>
  );
}
