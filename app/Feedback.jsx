import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase_config';
import { ArrowLeftIcon, Icon } from '@/components/ui/icon';

export default function FeedbackScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitFeedback = async () => {
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        name,
        email,
        message,
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Thank you for your feedback!');
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF7C0' }}>
      <View style={{ flexDirection: 'row', padding: 12, backgroundColor: '#2196F3', alignItems: 'center' }}>
        <Pressable onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.navigate('/');
            }
          }} className="mt-10 mr-4">
          <Icon as={ArrowLeftIcon} className="font-bold"/>
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }} className="mt-10">Feedback</Text>
      </View>
      
      <View style={{ padding: 20, flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#1E3A8A' }}>
          We would love to hear from you!
        </Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write your feedback here..."
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
          textAlignVertical="top"
        />

        <Pressable 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={submitFeedback}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit Feedback'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#90CAF9',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
