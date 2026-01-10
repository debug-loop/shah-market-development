import { useEffect } from 'react';

export default function SEO({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} - Shah Marketplace` : 'Shah Marketplace';
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description || 'Digital services marketplace';
  }, [title, description]);

  return null;
}
