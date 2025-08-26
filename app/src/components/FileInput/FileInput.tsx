import type { ChangeEvent } from "react";
import styles from "@components/FileInput/FileInput.module.scss";

interface FileInputProps {
  files: File[];
  setFiles: (files: File[]) => void;
  label?: string;
  error?: string;
}

export default function FileInput(props: FileInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      props.setFiles(Array.from(e.currentTarget.files));
    }
  };

  return (
    <div className={styles.inputContainer}>
      <h5 className={styles.inputLabel}>{props.label}</h5>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
      />
      {props.files.length > 0 && (
        <div>
          <p>Selected files:</p>
          <ul>
            {props.files.map((f, i) => (
              <li key={i}>{f.name}</li>
            ))}
          </ul>
        </div>
      )}
      {props.error && (
        <div className={styles.errorPopup}>
          <h6>{props.error}</h6>
        </div>
      )}

    </div>
  );
}
