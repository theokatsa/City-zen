import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

import useNewReportController from './NewReportController';

export default function NewReportScreen() {
  const {
    image, setImage,
    address,
    category, setCategory,
    comment, setComment,
    loading,
    submitReport,
  } = useNewReportController();

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} value={address} editable={false} />

      <Button title="Take Photo" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select category..." value="" />
        <Picker.Item label="Sidewalk" value="sidewalk" />
        <Picker.Item label="Lighting" value="lighting" />
        <Picker.Item label="Garbage" value="garbage" />
        {/* Add more categories here */}
      </Picker>

      <Text style={styles.label}>Comment (optional)</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <Button title="Submit Report" onPress={submitReport} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 4,
    borderRadius: 6,
  },
  picker: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
});
