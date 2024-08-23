import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import CameraView from './src/components/CameraView';

function App(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <CameraView />
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
