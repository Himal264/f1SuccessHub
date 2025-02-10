import Application from '../models/applynowModel.js';
import cloudinary from '../config/cloudinary.js';

export const submitApplication = async (req, res) => {
  try {
    const applicationData = JSON.parse(req.body.application);
    
    // Handle file uploads if files exist
    if (req.files && req.files.length > 0) {
      const uploadedFiles = [];
      
      // Upload each file to Cloudinary
      for (const file of req.files) {
        try {
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'applications/documents',
            resource_type: 'auto' // Automatically detect file type
          });

          uploadedFiles.push({
            name: file.originalname,
            url: result.secure_url,
            type: file.mimetype
          });

        } catch (uploadError) {
          console.error('Error uploading file to Cloudinary:', uploadError);
          throw new Error('File upload failed');
        }
      }
      
      // Update the application data with the uploaded file information
      applicationData.documents = {
        hasDocuments: true,
        files: uploadedFiles
      };
    }

    // Create new application
    const application = new Application(applicationData);
    await application.save();

    res.status(201).json({
      success: true,
      id: application._id,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};

export const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving application',
      error: error.message
    });
  }
};