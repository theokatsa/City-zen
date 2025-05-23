import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import api from '../api/api';

export default function ReportScreen() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get('/reports')
      .then(res => setReports(res.data))
      .catch(err => console.error('Error fetching reports:', err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.report}>
            <Text style={styles.reportTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 10 },
  report: { marginBottom: 10, padding: 10, backgroundColor: '#eee', borderRadius: 5 },
  reportTitle: { fontWeight: 'bold' }
});
