'use client'

import { deleteReport } from '@/handlers/reportHandler'
import { useDialog } from '@/providers/dialogContextProvider'
import logger from '@/util/logger'
import { ConfirmDialog } from 'primereact/confirmdialog'
import React, { useEffect } from 'react'

interface DeleteReportModalProps {
  isVisible: boolean
  reportId: string
}

const DeleteReportModal: React.FC<DeleteReportModalProps> = (
  prop: DeleteReportModalProps
) => {
  const isVisible: boolean = prop ? prop.isVisible : false
  const { closeDeleteDialog } = useDialog()

  useEffect(() => {
    logger.debug('Rendering: Delete report modal')
  })

  if (!isVisible) return null

  const confirmDelete = async () => {
    await deleteReport(prop.reportId)
    closeDeleteDialog()
    window.location.reload()
  }

  const hideDialog = () => {
    logger.debug('Closing this dialog...')
    closeDeleteDialog()
  }

  return (
    <div>
      <ConfirmDialog
        message="Are you sure you want to delete this item?"
        header="Confirmation"
        visible={isVisible}
        onHide={hideDialog}
        style={{ width: '50vw' }}
        icon="pi pi-exclamation-triangle"
        accept={confirmDelete}
        reject={hideDialog}
      ></ConfirmDialog>
    </div>
  )
}

export default DeleteReportModal
