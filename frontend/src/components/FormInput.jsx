import React from 'react'
import styles from './FormInput.module.css'

function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
}) {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={name} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={styles.input}
      />
    </div>
  )
}

export default FormInput
