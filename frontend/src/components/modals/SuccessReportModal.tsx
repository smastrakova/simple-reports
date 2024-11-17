'use client'

import { useDialog } from '@/providers/dialogContextProvider'
import logger from '@/util/logger'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'

interface SuccessModalProps {
  isVisible: boolean
}

const SuccessReportModal: React.FC<SuccessModalProps> = (
  prop: SuccessModalProps
) => {
  const isVisible: boolean = prop ? prop.isVisible : false
  const { closeSuccessDialog } = useDialog()

  useEffect(() => {
    logger.debug('Rendering: Success report modal')
  })

  if (!isVisible) return null

  const closeModal = () => {
    logger.debug('Closing this dialog...')
    window.location.reload()
    closeSuccessDialog()
  }

  return (
    <div>
      <Dialog
        header="Thank you!"
        visible={isVisible}
        onHide={closeModal}
        style={{ width: '50vw' }}
      >
        <p>Your report has been successfully saved!</p>
      </Dialog>
    </div>
  )
}

export default SuccessReportModal
