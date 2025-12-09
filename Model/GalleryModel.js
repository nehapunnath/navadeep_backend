// Model/GalleryModel.js
const { rtdb, bucket } = require('../Config/firebaseAdmin');

class GalleryModel {
  static carouselRef = rtdb.ref('carousel');
  static galleryRef = rtdb.ref('gallery');

  // ===================== CAROUSEL (Max 3) =====================
  static async getAllCarousel() {
    const snapshot = await this.carouselRef.once('value');
    const data = snapshot.val();
    if (!data) return [];
    return Object.keys(data).map(key => ({ id: key, ...data[key] }));
  }

  static async getCarouselById(id) {
    const snapshot = await this.carouselRef.child(id).once('value');
    const data = snapshot.val();
    if (!data) return null;
    return { id, ...data };
  }

  static async createCarousel(item) {
    const newRef = this.carouselRef.push();
    await newRef.set(item);
    return { id: newRef.key, ...item };
  }

  static async updateCarousel(id, item) {
    await this.carouselRef.child(id).update(item);
    return { id, ...item };
  }

  static async deleteCarousel(id) {
    const snapshot = await this.carouselRef.child(id).once('value');
    const item = snapshot.val();

    if (item?.image) {
      try {
        const fileName = decodeURIComponent(item.image.split('/o/')[1]?.split('?')[0]);
        if (fileName) await bucket.file(fileName).delete();
      } catch (err) {
        console.warn('Failed to delete carousel image:', item.image);
      }
    }

    await this.carouselRef.child(id).remove();
  }

  // ===================== GALLERY (Max 8) =====================
  static async getAllGallery() {
    const snapshot = await this.galleryRef.once('value');
    const data = snapshot.val();
    if (!data) return [];
    return Object.keys(data).map(key => ({ id: key, ...data[key] }));
  }

  static async getGalleryById(id) {
    const snapshot = await this.galleryRef.child(id).once('value');
    const data = snapshot.val();
    if (!data) return null;
    return { id, ...data };
  }

  static async createGallery(item) {
    const newRef = this.galleryRef.push();
    await newRef.set(item);
    return { id: newRef.key, ...item };
  }

  static async updateGallery(id, item) {
    await this.galleryRef.child(id).update(item);
    return { id, ...item };
  }

  static async deleteGallery(id) {
    const snapshot = await this.galleryRef.child(id).once('value');
    const item = snapshot.val();

    if (item?.image) {
      try {
        const fileName = decodeURIComponent(item.image.split('/o/')[1]?.split('?')[0]);
        if (fileName) await bucket.file(fileName).delete();
      } catch (err) {
        console.warn('Failed to delete gallery image:', item.image);
      }
    }

    await this.galleryRef.child(id).remove();
  }
}

module.exports = GalleryModel;