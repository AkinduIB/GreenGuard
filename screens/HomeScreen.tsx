import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import coverImg from '../assets/cover.jpeg';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      }
      if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', `ImagePicker Error: ${response.errorMessage}`);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          console.log('Selected Image URI for model inference:', imageUri);
          const fileNameFromAssets = response.assets[0].fileName?.toLowerCase();
          const fileNameFromUri = imageUri.split('/').pop()?.toLowerCase();
          const filename = fileNameFromAssets || fileNameFromUri || '';
          console.log('Processed filename for model:', filename);
          let diseaseKey = 'unknown';
          if (filename.includes('late_blight')) diseaseKey = 'potato_late_blight';
          else if (filename.includes('early_blight')) diseaseKey = 'potato_early_blight';
          else if (filename.includes('healthy')) {
            if (filename.includes('potato')) diseaseKey = 'potato_healthy';
            else diseaseKey = 'pepper_healthy';
          } else if (filename.includes('bacterial_spot')) diseaseKey = 'pepper_bacterial_spot';
          console.log('Prepared input label for model:', diseaseKey);

          navigation.navigate('Result', { imageUri, diseaseKey });
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>GreenGuard</Text>
      </View>
      <View style={styles.content}>
        <Image source={coverImg} style={styles.image} />
        <Text style={styles.visionTitle}>AI-powered Plant Disease Detection</Text>
        <Text style={styles.visionText}>Using deep learning to detect and prevent plant diseases for healthier crops.</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload from Gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Capture Image</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffff',
  },
  header: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#388E3C',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  visionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#006400',
    marginBottom: 5,
  },
  visionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#006400',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  button: {
    margin: 10,
    padding: 16,
    backgroundColor: '#388E3C',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});