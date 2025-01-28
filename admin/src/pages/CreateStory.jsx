import React, { useState } from "react";

const CreateStory = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: [],
  });

  const categories = ["News", "University", "Students", "Study in US", "Team", "Partner"];
  const tags = [
    "Career Planning",
    "College Application",
    "Internship",
    "Advice for Students",
    "Region or State",
    "Majors STEM",
    "Campus Life",
    "Culture Shock",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send formData to the backend API
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Content"
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        required
      ></textarea>
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        multiple
        value={formData.tags}
        onChange={(e) =>
          setFormData({
            ...formData,
            tags: Array.from(e.target.selectedOptions, (option) => option.value),
          })
        }
      >
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
      <button type="submit">Post Story</button>
    </form>
  );
};

export default CreateStory;
