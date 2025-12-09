// Controller/GalleryController.js
const GalleryModel = require('../Model/GalleryModel');

const MAX_CAROUSEL = 3;
const MAX_GALLERY = 8;

// ===================== CAROUSEL =====================
const getCarousel = async (req, res) => {
  try {
    const items = await GalleryModel.getAllCarousel();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch carousel' });
  }
};

const addCarousel = async (req, res) => {
  try {
    const current = await GalleryModel.getAllCarousel();
    if (current.length >= MAX_CAROUSEL) {
      return res.status(400).json({
        error: `Maximum ${MAX_CAROUSEL} carousel slides allowed. Please delete one to add new.`
      });
    }

    const { title = '', subtitle = '', highlight = '', badge = '', color = 'blue' } = req.body;
    const image = req.file?.firebaseUrl || '';

    console.log('Adding carousel:', { title, subtitle, highlight, badge, color, image });
    console.log('Uploaded file:', req.file);

    const item = {
      title,
      subtitle,
      highlight,
      badge,
      color,
      image
    };

    const saved = await GalleryModel.createCarousel(item);
    res.status(201).json(saved);
  } catch (error) {
    console.error('Add carousel error:', error);
    res.status(500).json({ error: 'Failed to add carousel slide' });
  }
};

const updateCarousel = async (req, res) => {
  try {
    const { title = '', subtitle = '', highlight = '', badge = '', color = 'blue' } = req.body;
    const image = req.file?.firebaseUrl;
    const { id } = req.params;

    console.log('Updating carousel:', { id, title, subtitle, highlight, badge, color, hasNewImage: !!image });

    // Get existing item to preserve image if not updating
    const existingItem = await GalleryModel.getCarouselById(id);
    
    const data = { 
      title, 
      subtitle, 
      highlight, 
      badge, 
      color,
      // Keep existing image if no new image is provided
      image: image || existingItem?.image || ''
    };

    console.log('Carousel update data:', data);

    const updated = await GalleryModel.updateCarousel(id, data);
    res.json(updated);
  } catch (error) {
    console.error('Update carousel error:', error);
    res.status(500).json({ error: 'Failed to update carousel slide' });
  }
};

const deleteCarousel = async (req, res) => {
  try {
    await GalleryModel.deleteCarousel(req.params.id);
    res.json({ message: 'Carousel slide deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete carousel slide' });
  }
};

// ===================== GALLERY =====================
const getGallery = async (req, res) => {
  try {
    const items = await GalleryModel.getAllGallery();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
};

// Controller/GalleryController.js - Updated gallery functions
const addGallery = async (req, res) => {
  try {
    const current = await GalleryModel.getAllGallery();
    if (current.length >= MAX_GALLERY) {
      return res.status(400).json({
        error: `Maximum ${MAX_GALLERY} gallery images allowed. Please delete one to add new.`
      });
    }

    const image = req.file?.firebaseUrl || '';

    console.log('=== ADD GALLERY DEBUG ===');
    console.log('Uploaded file:', req.file);
    console.log('Firebase URL:', req.file?.firebaseUrl);
    console.log('Image value:', image);
    console.log('==========================');

    const item = { image };
    const saved = await GalleryModel.createGallery(item);
    res.status(201).json(saved);
  } catch (error) {
    console.error('Add gallery error:', error);
    res.status(500).json({ error: 'Failed to add gallery image' });
  }
};

const updateGallery = async (req, res) => {
  try {
    const image = req.file?.firebaseUrl;
    const { id } = req.params;

    console.log('=== UPDATE GALLERY DEBUG ===');
    console.log('Uploaded file:', req.file);
    console.log('Firebase URL:', req.file?.firebaseUrl);
    console.log('Image value:', image);
    console.log('=============================');

    // Get existing item to preserve image if not updating
    const existingItem = await GalleryModel.getGalleryById(id);
    
    const data = { 
      // Keep existing image if no new image is provided
      image: image || existingItem?.image || ''
    };

    console.log('Final update data:', data);

    const updated = await GalleryModel.updateGallery(id, data);
    res.json(updated);
  } catch (error) {
    console.error('Update gallery error:', error);
    res.status(500).json({ error: 'Failed to update gallery image' });
  }
};

const deleteGallery = async (req, res) => {
  try {
    await GalleryModel.deleteGallery(req.params.id);
    res.json({ message: 'Gallery image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete gallery image' });
  }
};

module.exports = {
  getCarousel,
  addCarousel,
  updateCarousel,
  deleteCarousel,
  getGallery,
  addGallery,
  updateGallery,
  deleteGallery
};