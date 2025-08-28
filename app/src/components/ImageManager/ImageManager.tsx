import { useState, useEffect } from 'react';
import styles from '@components/ImageManager/ImageManager.module.scss';
import remove_cross from '@assets/images/remove_cross.svg';

const API_URL = import.meta.env.VITE_API_URL;

interface IImageManagerProps {
  existingImages: string[];
  newFiles: File[];
  setNewFiles: (files: File[]) => void;
  imagesToRemove: string[];
  setImagesToRemove: (images: string[]) => void;
  label?: string;
  error?: string;
}

export default function ImageManager(props: IImageManagerProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = props.newFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [props.newFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      const newFiles = Array.from(event.currentTarget.files);
      props.setNewFiles([...props.newFiles, ...newFiles]);
    }
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    if (!props.imagesToRemove.includes(imageUrl)) {
      props.setImagesToRemove([...props.imagesToRemove, imageUrl]);
    }
  };

  const handleRemoveNewFile = (index: number) => {
    const newFiles = [...props.newFiles];
    newFiles.splice(index, 1);
    props.setNewFiles(newFiles);
  };

  const visibleExistingImages = props.existingImages.filter(
    img => !props.imagesToRemove.includes(img)
  );

  return (
    <div className={styles.container}>
      <h5>{props.label}</h5>
      
      {visibleExistingImages.length > 0 && (
        <div>
          <p>Curent images:</p>
          <div className={styles.imageList}>
            {visibleExistingImages.map((image, index) => (
              <div key={index} className={styles.imageItem}>
                <img src={`${API_URL}${image}`} alt={`Image ${index + 1}`} />
                <button className={styles.removeButton} onClick={() => handleRemoveExistingImage(image)}>
                  <img src={remove_cross} alt="Close" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {props.newFiles.length > 0 && (
        <div>
          <p>New images:</p>
          <div className={styles.imageList}>
            {props.newFiles.map((file, index) => (
              <div key={index} className={styles.imageItem}>
                <img src={previewUrls[index]} alt={file.name} />
                <button className={styles.removeButton} onClick={() => handleRemoveNewFile(index)}>
                  <img src={remove_cross} alt="Close" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className={styles.fileInput}
        data-testid="file-input"
      />

      {props.error && (
        <div className={styles.error}>
          <h6>{props.error}</h6>
        </div>
      )}
    </div>
  );
}