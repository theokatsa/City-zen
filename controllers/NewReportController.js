import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

export default function useNewReportController() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      const [addr] = await Location.reverseGeocodeAsync(loc.coords);
      setAddress(`${addr.street}, ${addr.city}`);
    })();
  }, []);

  const submitReport = async () => {
    if (!image || !location || !category) {
      alert('Please complete all fields');
      return;
    }

    setLoading(true);

    try {
      // Example payload
      const report = {
        imageUri: image,
        location,
        address,
        category,
        comment,
        date: new Date().toISOString(),
      };

      console.log('Submitting report:', report);
      // send to API here...
    } catch (error) {
      console.error('Report submission failed', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    address,
    image,
    setImage,
    category,
    setCategory,
    comment,
    setComment,
    loading,
    submitReport,
  };
}
