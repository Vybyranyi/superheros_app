import styles from '@components/Input/Input.module.scss';
import remove_cross from '@assets/images/remove_cross.svg';
import React from 'react';

export interface IInputProps {
    label: string;
    placeholder: string;
    error?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export default function Input(props: IInputProps) {
    return (
        <div className={styles.inputContainer}>
            <h5 className={styles.inputLabel}>{props.label}</h5>
            <div className={styles.inputWrapper}>
                <input
                    className={`${styles.input} ${props.error ? styles.error : ""}`}
                    type='text'
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={props.onChange}
                />
                <div className={styles.inputIcon}>
                    {props.value && (
                        <img
                            src={remove_cross}
                            onClick={() => props.onChange?.({ target: { value: "" } } as any)}
                            alt="Clear input"
                        />
                    )}
                </div>
            </div>
            {props.error && (
                <div className={styles.errorPopup}>
                    <h6>{props.error}</h6>
                </div>
            )}
        </div>
    );
}
