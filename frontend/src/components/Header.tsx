'use client'

import { useDialog } from '@/providers/dialogContextProvider'
import { Button } from 'primereact/button'
import React from 'react'
import styles from '../styles/Header.module.css'

export const Header: React.FC = () => {
  const { openCreateDialog } = useDialog()

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Simple Reports App</h1>
      <Button
        id="createButton"
        label="New Report"
        icon="pi pi-plus"
        disabled={false}
        type="button"
        onClick={openCreateDialog}
        className={'createButton p-button-rounded p-button-outlined'}
      />
    </header>
  )
}
