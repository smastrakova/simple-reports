'use client'

import logger from '@/util/logger'
import { Button } from 'primereact/button'
import React from 'react'
import styles from '../styles/Header.module.css'

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Simple Reports App</h1>
      <Button
        id="createButton"
        label="New Report"
        icon="pi pi-plus"
        disabled={false}
        type="button"
        onClick={() => {
          logger.debug('TBD')
        }}
        className={'createButton p-button-rounded p-button-outlined'}
      />
    </header>
  )
}
