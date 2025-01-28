import React, { useState, useEffect } from "react";
import axios from "axios";

const StoryList = () => {
  const [stories, setStories] = useState([]);
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    const fetchStories = async () => {
      const { data } = await axios.get(`/api/stories`, {
        params: { category, tags: tag },
      });
      setStories(data);
    };

    fetchStories();
  }, [category, tag]);

  return (
    <div>
      <h1>Stories</h1>
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">Filter by Category</option>
        <option value="News">News</option>
        <option value="University">University</option>
        <option value="Students">Students</option>
        <option value="Study in US">Study in US</option>
      </select>
      <input
        type="text"
        placeholder="Filter by Tag"
        onChange={(e) => setTag(e.target.value)}
      />
      {stories.map((story) => (
        <div key={story._id}>
          <h2>{story.title}</h2>
          <p>{story.content}</p>
          <p>Category: {story.category}</p>
          <p>Tags: {story.tags.join(", ")}</p>
          <p>Author: {story.author.name} ({story.author.role})</p>
        </div>
      ))}
    </div>
  );
};

export default StoryList;
