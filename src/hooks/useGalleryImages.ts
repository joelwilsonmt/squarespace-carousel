import { useState, useEffect } from 'react';

const GALLERY_URL = 'https://www.erin4montana.com/endorsements-image-gallery';


export function useGalleryImages() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(GALLERY_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch gallery page');
        }
        const html = await response.text();

        const regex = /data-src="([^"]+)"/g;
        const matches = [];
        let match;
        while ((match = regex.exec(html)) !== null) {
          const url = match[1];
          if (url && url.includes('/content/v1/')) {
            matches.push(`${url}?format=1500w`);
          }
        }

        if (matches.length === 0) {
          const srcRegex = /src="([^"]+images\.squarespace-cdn\.com\/content\/v1\/[^"]+)"/g;
          while ((match = srcRegex.exec(html)) !== null) {
            matches.push(`${match[1]}?format=1500w`);
          }
        }

        const uniqueImages = Array.from(new Set(matches));
        const galleryImages = uniqueImages.filter(url => 
          !url.toLowerCase().includes('favicon') && 
          !url.toLowerCase().includes('logo') &&
          !url.toLowerCase().includes('rounded')
        );

        if (galleryImages.length === 0) {
          setImages([]);
        } else {
          setImages(galleryImages);
        }
        setLoading(false);
      } catch (err) {
        console.warn('CORS or fetch error, using empty gallery:', err);
        setImages([]);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return { images, loading, error };
}
