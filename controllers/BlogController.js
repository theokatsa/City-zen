export const getBlogPosts = async () => {
  try {
    // Replace this URL with your backend endpoint when ready
    const response = await fetch("http://localhost:3000/api/blog");
    if (!response.ok) throw new Error("Failed to fetch blog posts");
    return await response.json();
  } catch (error) {
    console.error("Blog fetch error:", error);
    return [];
  }
};
