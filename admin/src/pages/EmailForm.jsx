import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const EmailForm = () => {
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { subject, body, file } = formData;
    const formPayload = new FormData();
    formPayload.append("subject", subject);
    formPayload.append("body", body);
    if (file) formPayload.append("file", file);

    try {
      const response = await axios.post(`${backendUrl}/email/send}`, formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Email sent successfully!");
        setFormData({ subject: "", body: "", file: null });
      } else {
        toast.error("Failed to send email");
      }
    } catch (error) {
      toast.error("Error sending email");
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full items-start gap-3">
      <div className="w-full">
        <p className="mb-2">Subject</p>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Enter email subject"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Body</p>
        <textarea
          name="body"
          value={formData.body}
          onChange={handleChange}
          className="w-full max-w-[500px] px-3 py-2 min-h-[100px]"
          placeholder="Enter email body"
          required
        />
        <p className="mt-1 text-sm text-gray-500">{formData.body.length}/1000 characters</p>
      </div>

      <div className="w-full">
        <p className="mb-2">Attachment</p>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full max-w-[500px] px-3 py-2"
        />
      </div>

      <button type="submit" className="w-28 py-2 mt-4 bg-black text-white">
        Send Email
      </button>
    </form>
  );
};

export default EmailForm;
