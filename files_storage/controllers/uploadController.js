const uploadImage = (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
  }

  res.status(200).json({
      message: 'Image uploaded successfully',
      url: req.file.path, // Cloudinary URL
      public_id: req.file.filename, // Public ID of the uploaded image
  });
};

export { uploadImage };
