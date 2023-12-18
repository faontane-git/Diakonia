import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import axios from 'axios';

const TomarHuella = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync({ base64: true });
      console.log(photo);
      setCapturedImage(photo.base64);
    }
  };


  const detectEmotion = async () => {
    const subscriptionKey = 'bc29f00fe4d745df9f3649ac88f9af86';
    const endpoint = 'https://diakonia.cognitiveservices.azure.com/';

    try {
      const response = await axios.post(
        `${endpoint}/detect`,
        {
          url: `data:image/jpeg;base64,${capturedImage}`,
          returnFaceAttributes: 'emotion',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey,
          },
        }
      );

      // Procesar la respuesta para obtener la emoción detectada
      const emotion = response.data[0]?.faceAttributes?.emotion;
      console.log('Emoción detectada:', emotion);
    } catch (error) {
      console.error('Error al llamar a la API de Azure Cognitive Services Face:', error);
    }
  };

  let cameraRef;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.6, aspectRatio: 0.6 }}>
        <Camera
          style={{ flex: 1 }}
          ref={(ref) => {
            cameraRef = ref;
          }}
          onCameraReady={requestCameraPermission}
        />
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          flexDirection: 'row',
        }}
      >
        <TouchableOpacity
          style={{
            flex: 0.1,
            alignSelf: 'flex-end',
            alignItems: 'center',
          }}
          onPress={() => takePicture()}
        >
          <Text style={{ fontSize: 18,   color: 'black' }}>
            Capturar 
          </Text>
        </TouchableOpacity>

      </View>
      {
        capturedImage && (
          <TouchableOpacity onPress={() => detectEmotion()}>
            <Text>Detectar Emoción</Text>
          </TouchableOpacity>
        )
      }
      {
        capturedImage && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${capturedImage}` }}
            style={{ width: 100, height: 100 }}
          />
        )
      }
    </View >
  );
};

export default TomarHuella;
