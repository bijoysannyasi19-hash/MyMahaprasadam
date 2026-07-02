import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

function VendorCard({ vendor }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/vendor/${vendor.id}`)}
      className="bg-white rounded-xl shadow-md"
      style={{
        marginHorizontal: 12,
        marginVertical: 8,
        padding: 12,
      }}
    >
      <View className="flex-row">
        <Image
          source={{ uri: vendor.imageurl || vendor.img }}
          className="w-20 h-20 rounded-lg"
        />

        
        <View className="flex-1 ml-4 justify-center">
          <Text className="text-lg font-bold text-gray-800">
            {vendor.name}
          </Text>

          {vendor.description ? (
            <Text className="text-sm text-gray-600 italic mt-1">
              {vendor.description}
            </Text>
          ) : null}

          <Text className="text-xs text-gray-500 mt-2">
            📞 {vendor.contact}
          </Text>
          <Text className="text-xs text-gray-500">
            📍 {vendor.address}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default VendorCard;
