import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const UniversityinfoUpdateandArticle = () => {
  const { id, section } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [university, setUniversity] = useState(null);
  const [user] = useState(JSON.parse(localStorage.getItem('userInfo')));
  const [selectedSection, setSelectedSection] = useState(section || '');

  // Define article sections that can be updated
  const articleSections = [
    { id: 'undergraduatePrograms', name: 'Undergraduate Programs' },
    { id: 'graduatePrograms', name: 'Graduate Programs' },
    { id: 'scholarships', name: 'Scholarships' },
    { id: 'description', name: 'University Description' },
    { id: 'admissionRequirements', name: 'Admission Requirements' },
    { id: 'location', name: 'University Location' },
    { id: 'feeStructureUndergraduate', name: 'Undergraduate Fee Structure' },
    { id: 'feeStructureGraduate', name: 'Graduate Fee Structure' },
    { id: 'intake', name: 'Intake Information' }
  ];

  // Initialize form data
  const [formData, setFormData] = useState({
    content: '',
    photo: null
  });

  // Fetch university data
  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/university/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const universityData = response.data.university;
        setUniversity(universityData);
        
        // Check permission for university role
        if (user && user.role === 'university') {
          const userUniversityName = user.universityInfo?.universityName;
          if (!userUniversityName) {
            toast.error("University name not found in your profile");
            navigate('/');
            return;
          }
          
          // Case-insensitive comparison with trim to remove extra spaces
          if (userUniversityName.toLowerCase().trim() !== universityData.name.toLowerCase().trim()) {
            toast.error(`You only have permission to edit ${userUniversityName}. 
                         You cannot edit ${universityData.name}.`);
            navigate('/');
            return;
          }
        } else if (user && user.role !== 'F1SuccessHub Team') {
          // If user is neither university nor F1SuccessHub Team
          toast.error('You do not have permission to edit university articles');
          navigate('/');
          return;
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch university data.');
        setLoading(false);
        toast.error('Failed to fetch university data');
      }
    };

    if (id) {
      fetchUniversity();
    }
  }, [id, navigate, user]);

  // Update form data when section changes
  useEffect(() => {
    if (university && selectedSection) {
      // Map section ID to path in university object
      let articleData = null;
      
      switch (selectedSection) {
        case 'undergraduatePrograms':
          articleData = university.undergraduatePrograms?.article;
          break;
        case 'graduatePrograms':
          articleData = university.graduatePrograms?.article;
          break;
        case 'scholarships':
          articleData = university.scholarshipsArticle;
          break;
        case 'description':
          articleData = university.descriptionArticle;
          break;
        case 'admissionRequirements':
          articleData = university.admissionRequirementsArticle;
          break;
        case 'location':
          articleData = university.location?.article;
          break;
        case 'feeStructureUndergraduate':
          articleData = university.feeStructure?.undergraduate?.article;
          break;
        case 'feeStructureGraduate':
          articleData = university.feeStructure?.graduate?.article;
          break;
        case 'intake':
          articleData = university.intake?.article;
          break;
        default:
          break;
      }

      if (articleData) {
        setFormData({
          content: articleData.content || '',
          photo: null
        });
        
        // Set preview URL if photo exists
        if (articleData.photo?.url) {
          setPreviewUrl(articleData.photo.url);
        } else {
          setPreviewUrl(null);
        }
      } else {
        // Initialize with empty values if no article data exists
        setFormData({
          content: '',
          photo: null
        });
        setPreviewUrl(null);
      }
    }
  }, [university, selectedSection]);

  // Quill modules configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'size': ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['blockquote'],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image']
      ],
      handlers: {
        'image': function() {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = () => {
            const file = input.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                const range = this.quill.getSelection(true);
                
                // Insert a line break before the image
                this.quill.insertText(range.index, '\n');
                
                // Insert the image with margin styling
                this.quill.insertEmbed(
                  range.index + 1,
                  'image',
                  reader.result,
                  'user'
                );
                
                // Apply margin to the inserted image
                const imageFormat = {
                  'style': 'margin: 40px;'
                };
                this.quill.formatText(range.index + 1, 1, imageFormat);
                
                // Insert a line break after the image
                this.quill.insertText(range.index + 2, '\n');
              };
              reader.readAsDataURL(file);
            }
          };
        }
      }
    }
  }), []);

  // Update formats to include all necessary formats
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'script', 'super', 'sub',
    'indent',
    'size',
    'blockquote',
    'color', 'background',
    'font',
    'align',
    'clean',
    'link', 'image'
  ];

  // Input handlers
  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content: content
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSection) {
      toast.error('Please select a section to update');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const formDataToSend = new FormData();
      formDataToSend.append('content', formData.content);
      
      if (formData.photo) {
        formDataToSend.append('articlePhoto', formData.photo);
      }
      
      await axios.put(
        `${backendUrl}/api/university/${id}/article/${selectedSection}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setLoading(false);
      toast.success('Article updated successfully!');
      
      // Refetch university data to get updated content
      const response = await axios.get(`${backendUrl}/api/university/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUniversity(response.data.university);
      
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to update article');
      toast.error(err.response?.data?.message || 'Failed to update article');
    }
  };

  // Add custom styles for editor
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .ql-editor img {
        margin: 40px;
        max-width: calc(100% - 80px);
        height: auto;
        display: block;
      }
      
      .article-preview img {
        margin: 40px;
        max-width: calc(100% - 80px);
        height: auto;
        display: block;
      }
      
      .ql-editor a {
        color: #2A3342;
        text-decoration: underline;
        cursor: pointer;
        transition: color 0.3s ease;
      }

      .ql-editor a:hover {
        color: #F37021;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Preview component
  const ArticlePreview = () => {
    const sectionName = articleSections.find(s => s.id === selectedSection)?.name || 'Article';
    
    return (
      <div className="bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{sectionName}</h1>
            
            {/* University Info */}
            <div className="flex items-center mb-6">
              {university?.logoUrl && (
                <img 
                  src={university.logoUrl} 
                  alt={university.name}
                  className="w-12 h-12 object-contain mr-4"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">{university?.name}</h2>
                <p className="text-gray-600">{university?.location?.state}, {university?.location?.region}</p>
              </div>
            </div>
            
            {/* Last updated info */}
            <p className="text-sm text-gray-600 mb-6">
              Last updated by {user?.name || 'Admin'} on {new Date().toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
              })}
            </p>
          </div>

          {/* Featured Image */}
          {previewUrl && (
            <div className="mb-8">
              <img 
                src={previewUrl} 
                alt={sectionName}
                className="w-full max-h-[400px] object-cover rounded-lg"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: formData.content }} 
              className="article-content"
            />
          </div>
        </div>
      </div>
    );
  };

  if (loading && !university) {
    return <div className="flex justify-center items-center h-96">Loading university data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {university ? `Update ${university.name} Information` : 'University Article Editor'}
        </h2>
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            {showPreview ? 'Edit Article' : 'Preview Article'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Back
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className={showPreview ? 'hidden' : 'block'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Selector */}
          <div>
            <label className="block mb-2 font-medium">Select Section to Update</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full border rounded-lg p-3"
              required
            >
              <option value="">Select a section</option>
              {articleSections.map(section => (
                <option key={section.id} value={section.id}>{section.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Cover Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full border rounded-lg p-3"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Content</label>
            <div className="border rounded-lg overflow-hidden">
              <ReactQuill 
                ref={quillRef}
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                theme="snow"
                placeholder="Write your article content here..."
                className="quill-editor"
                style={{ 
                  minHeight: '400px'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedSection}
            className={`w-full py-3 px-4 rounded-lg text-white ${
              loading || !selectedSection ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Updating...' : 'Update Article'}
          </button>
        </form>
      </div>

      {showPreview && <ArticlePreview />}
    </div>
  );
};

export default UniversityinfoUpdateandArticle;