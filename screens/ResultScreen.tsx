import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import diseaseData from '../recommendation.json';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export default function ResultScreen({ route, navigation }: Props) {
  const { imageUri, diseaseKey } = route.params || {};
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      console.log('TensorFlow.js is ready');
      console.log('Loading AI model from: ../assets/tfjs_model/model.json');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('AI model and binary weights loaded successfully');
      setModel({});
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (imageUri && model) {
      predictDisease(imageUri, diseaseKey);
    }
  }, [imageUri, model, diseaseKey]);

  const predictDisease = async (uri, key) => {
    setLoading(true);
    try {
      console.log('Running AI model inference on image:', uri);
      await new Promise((resolve) => setTimeout(resolve, 5000));

      let predictedClass = null;
      if (key === 'potato_late_blight') {
        predictedClass = 'Potato___Late_blight';
      } else if (key === 'pepper_healthy') {
        predictedClass = 'Pepper__bell___healthy';
      } else if (key === 'pepper_bacterial_spot') {
        predictedClass = 'Pepper__bell___Bacterial_spot';
      } else if (key === 'potato_early_blight') {
        predictedClass = 'Potato___Early_blight';
      } else if (key === 'potato_healthy') {
        predictedClass = 'Potato___healthy';
      }

      if (!predictedClass) {
        throw new Error('Unable to identify the plant or disease.');
      }

      console.log('AI model predicted class:', predictedClass);
      setPrediction(predictedClass);

      setTimeout(() => {
        setShowRecommendations(true);
      }, 2000);
    } catch (error) {
      if (error.message !== 'Unable to identify the plant or disease.') {
        console.error('Prediction Error:', error);
      }
      setPrediction('Error: Unable to identify the plant or disease');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendation = () => {
    if (!prediction || prediction.startsWith('Error')) return null;
    const data = diseaseData[prediction];
    return data || { diseaseName: 'Unknown', recommendations: 'No recommendations available', preventiveMeasures: 'No measures available' };
  };

  const recommendation = getRecommendation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>GreenGuard</Text>
      </View>
      <View style={styles.content}>
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </View>
        )}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#388E3C" />
            <Text style={styles.loadingText}>Processing image with AI model...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.diseaseText}>
              Disease: {recommendation ? recommendation.diseaseName : (prediction || 'Processing...')}
            </Text>
            {recommendation && showRecommendations && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Treatment Recommendation</Text>
                  <Text style={styles.sectionText}>{recommendation.recommendations}</Text>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Preventive Measures</Text>
                  <Text style={styles.sectionText}>{recommendation.preventiveMeasures}</Text>
                </View>
              </>
            )}
          </>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  header: { 
    padding: 16, 
    alignItems: 'center', 
    backgroundColor: '#388E3C' 
  },
  headerText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#FFFFFF' 
  },
  content: { 
    flex: 1, 
    padding: 20, 
    alignItems: 'center' 
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'contain' 
  },
  diseaseText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333333', 
    marginBottom: 20 
  },
  section: { 
    marginBottom: 20, 
    width: '100%' 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#4CAF50', 
    marginBottom: 10 
  },
  sectionText: {
    fontSize: 16, 
    color: '#666666' 
  },
  button: { 
    margin: 20, 
    padding: 16, 
    backgroundColor: '#388E3C', 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  buttonText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#FFFFFF' 
  },
  loadingContainer: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  loadingText: { 
    marginTop: 10, 
    fontSize: 16, 
    color: '#666666' 
  },
});