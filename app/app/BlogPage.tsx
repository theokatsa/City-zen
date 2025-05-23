import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, StyleSheet } from "react-native";
import { getBlogPosts } from "C:/Users/theok_iykl84u/cityzen/backend/controllers/BlogController.js";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBlogPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error loading blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      {posts.map((post, index) => (
        <View key={index} style={styles.card}>
          {post.image && <Image source={{ uri: post.image }} style={styles.image} />}
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.content}>{post.content}</Text>
          <Text style={styles.date}>{new Date(post.date).toLocaleDateString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  image: { width: "100%", height: 180, borderRadius: 8, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 6 },
  content: { fontSize: 16, color: "#333", marginBottom: 8 },
  date: { fontSize: 12, color: "#888" },
});
