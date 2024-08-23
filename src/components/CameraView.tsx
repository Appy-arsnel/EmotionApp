import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import React, { useRef } from 'react';

import {
  Frame,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {
  Face,
  Camera,
  FaceDetectionOptions
} from 'react-native-vision-camera-face-detector';

const PermissionsPage = () => {
  const { requestPermission } = useCameraPermission();

  React.useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return (
    <SafeAreaView>
      <Text>Permissions are required.</Text>
    </SafeAreaView>
  );
};

const NoCameraDeviceError = () => {
  return (
    <View>
      <Text>No camera device found.</Text>
    </View>
  );
};

function CameraView() {
  const device = useCameraDevice("front");
  const { hasPermission } = useCameraPermission();
  const cameraRef: any = useRef(null);
  const [photo, setPhoto] = React.useState<string | null>(null);
  const [faces, setFaces] = React.useState<Face[]>([]);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.8, flashMode: "on" };
      const capturedPhoto = await cameraRef.current.takePhoto(options);
      setPhoto(capturedPhoto.path);
    }
  };

  if (!hasPermission) return <PermissionsPage />;
  if (device == null) return <NoCameraDeviceError />;

  // Define your face detection options
  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    performanceMode: 'accurate', // or 'fast'
    landmarkMode: 'none', // or 'none'
    classificationMode: 'all', // to detect emotions such as smiling
    
    trackingEnabled: true, // whether to track faces between frames
  }).current;

  // Callback function to handle face and emotion detection
  const faceDetectionCallback = (faces: Face[], frame: Frame) => {
    setFaces(faces); // Update state with detected faces and emotions
  };

  return (
    photo ? (
      <>
        <Image
          style={{ flex: 1 }}
          source={{
            uri: `file://${photo}`,
          }}
        />
        <TouchableOpacity
          onPress={() => setPhoto(null)}
          style={{
            borderColor: "black",
            borderWidth: 2,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Text>Back</Text>
        </TouchableOpacity>
      </>
    ) : (
      <View style={StyleSheet.absoluteFill}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
          ref={cameraRef}
          faceDetectionOptions={faceDetectionOptions}
          faceDetectionCallback={faceDetectionCallback}
        />
        {faces.map((face, index) => (
          <View key={index}>
            <View
              style={{
                position: 'absolute',
                borderColor: 'red',
                borderWidth: 2,
                left: face.bounds.x,
                top: face.bounds.y,
                width: face.bounds.width,
                height: face.bounds.height,
              }}
            />
            {face.smilingProbability !== undefined && (
              <Text
                style={{
                  position: 'absolute',
                  top: face.bounds.y - 20,
                  left: face.bounds.x,
                  color: 'white',
                  backgroundColor: 'black',
                  padding: 5,
                  borderRadius: 5,
                }}
              >
                {face.smilingProbability > 0.5 ? 'Smiling' : 'Not Smiling'}
              </Text>
            )}
          </View>
        ))}
        <TouchableOpacity
          onPress={takePhoto}
          style={{
            position: "absolute",
            bottom: 10,
            alignSelf: "center",
            backgroundColor: "white",
            height: 50,
            width: 50,
            borderRadius: 25,
            borderColor: "black",
            borderWidth: 2,
            justifyContent: "center",
          }}
        />
      </View>
    )
  );
}

export default CameraView;

const styles = StyleSheet.create({});
