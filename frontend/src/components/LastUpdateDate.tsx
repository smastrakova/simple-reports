import styles from '@/styles/Modal.module.css'
import { formatTimestampDate } from '@/util/timeFormatter'
import { InputText } from 'primereact/inputtext'
import React from 'react'

const LastUpdateDate: React.FC<{ lastUpdate?: Date }> = ({ lastUpdate }) => {
  return (
    <div className={styles.formFieldContainer}>
      <label
        className={`${styles.label} ${styles.nonEditableLabel}`}
        htmlFor="lastUpdate"
      >
        Last edited on
      </label>
      <InputText
        id="lastUpdate"
        className={styles.nonEditableField}
        value={lastUpdate ? formatTimestampDate(lastUpdate) : ''}
        disabled
      />
    </div>
  )
}

export default LastUpdateDate
