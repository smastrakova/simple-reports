'use client'

import DeleteReportModal from '@/components/modals/DeleteReportModal'
import ReportDetailModal from '@/components/modals/ReportDetailModal'
import SuccessReportModal from '@/components/modals/SuccessReportModal'
import logger from '@/util/logger'
import React, { createContext, useContext, useState } from 'react'

interface DialogContextType {
  openUpdateDialog: (reportId: string) => void
  openCreateDialog: () => void
  closeReportDialog: () => void
  openDeleteDialog: (reportId: string) => void
  closeDeleteDialog: () => void
  openSuccessDialog: () => void
  closeSuccessDialog: () => void
}

const DialogContext: React.Context<DialogContextType | undefined> =
  createContext<DialogContextType | undefined>(undefined)

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [reportModalProps, setReportModalProps] = useState<{
    isVisible: boolean
    isCreate: boolean
    reportId: string
  } | null>(null)

  const [deleteModalProps, setDeleteModalProps] = useState<{
    isVisible: boolean
    reportId: string
  } | null>(null)

  const [successModalProps, setSuccessModalProps] = useState<{
    isVisible: boolean
  } | null>(null)

  const openUpdateDialog = (reportId: string) => {
    setReportModalProps({
      isVisible: true,
      isCreate: false,
      reportId
    })
  }
  const openCreateDialog = () => {
    setReportModalProps({
      isVisible: true,
      isCreate: true,
      reportId: ''
    })
  }

  const closeReportDialog = () => {
    logger.debug('Removing props from modal')
    setReportModalProps(null)
  }

  const openDeleteDialog = (reportId: string) => {
    logger.debug('Setting delete dialog visible')
    setDeleteModalProps({ isVisible: true, reportId })
  }
  const closeDeleteDialog = () => {
    logger.debug('Setting delete dialog not visible')
    setDeleteModalProps(null)
  }

  const openSuccessDialog = () => {
    logger.debug('Setting success dialog visible')
    setSuccessModalProps({ isVisible: true })
  }
  const closeSuccessDialog = () => {
    logger.debug('Setting success dialog not visible')
    setSuccessModalProps(null)
  }

  return (
    <DialogContext.Provider
      value={{
        openCreateDialog,
        openUpdateDialog,
        closeReportDialog,
        openDeleteDialog,
        closeDeleteDialog,
        openSuccessDialog,
        closeSuccessDialog
      }}
    >
      {children}
      {reportModalProps && (
        <ReportDetailModal
          isVisible={reportModalProps.isVisible}
          isCreate={reportModalProps.isCreate}
          reportId={reportModalProps.reportId}
          onClose={closeReportDialog}
        />
      )}
      {deleteModalProps && (
        <DeleteReportModal
          isVisible={deleteModalProps.isVisible}
          reportId={deleteModalProps.reportId}
        ></DeleteReportModal>
      )}
      {successModalProps && (
        <SuccessReportModal
          isVisible={successModalProps.isVisible}
        ></SuccessReportModal>
      )}
    </DialogContext.Provider>
  )
}

export const useDialog = (): DialogContextType => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider')
  }
  return context
}
