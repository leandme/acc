"use client";

import styles from '../../styles/RippleLoader.module.css'
export default function RippleLoader() {
  return (
    <div
      className={styles.loader}
      aria-label="Loading"
      role="status"
    />
  );
}
