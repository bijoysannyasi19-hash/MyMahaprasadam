import { View, Text, FlatList,Pressable} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import VendorCard from '../../components/VendorCard';
import { Icon } from '@/components/ui/icon';
import { CloseIcon } from '@/components/ui/icon';
import { ArrowLeftIcon } from '@/components/ui/icon';
import { db } from '../firebase_config';
import { getDocs, collection } from "firebase/firestore";
import {useEffect, useState} from 'react'
import { Button, } from "@/components/ui/button"

function StationDetails() {
    const  {id} = useLocalSearchParams() 
    const [stationData, setStationData] = useState([]); 
    const [vendorData, setVendorData] = useState([]); 
    const [loadingStations, setLoadingStations] = useState(true);
    const [loadingVendors, setLoadingVendors] = useState(true);


    useEffect(() => {
        const fetchStations = async () => {
          const snapshot = await getDocs(collection(db, 'stations'));
          const data = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setStationData(data);
          setLoadingStations(false);
        };
    
        fetchStations();
      }, []);


    useEffect(() => {
        const fetchVendorData = async () => {
          const snapshot = await getDocs(collection(db, 'vendors'));
          const data = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            
          } )).filter((vendor) => vendor.isApproved);
          setVendorData(data);
          setLoadingVendors(false)
        };
    
        fetchVendorData();
      }, []);


      const station = stationData.find((item) => item.id === id); 
      if (loadingStations || loadingVendors) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }    
        if (!station) {
            return (
                <View >
                    <Text>Station not found</Text>
                </View>
            );
        }
    
        
        const vendors = vendorData.filter((vendor) =>
        station.vendors_list.includes(vendor.id)
    );

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
                 {station.name }
               </Text>
             </View>

        <FlatList  
                    data={vendors}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <VendorCard vendor={item} />}
                    style={{backgroundColor: '#FFF7C0',}}
                />
                
        </>
        
    );
}



export default StationDetails;
