'use client'

import {
  CreateReportResponse,
  ReportDetailResponse
} from '@/api/IReportResponse'
import ReportsApi from '@/api/reportsApi'
import LastUpdateDate from '@/components/LastUpdateDate'
import { createNewReport, updateExistingReport } from '@/handlers/reportHandler'
import { useDialog } from '@/providers/dialogContextProvider'
import styles from '@/styles/Modal.module.css'
import logger from '@/util/logger'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Message } from 'primereact/message'
import React, { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'

interface ReportDetailModalProps {
  reportId: string
  isVisible: boolean
  isCreate: boolean
  onClose: () => void
}

const reportsService = new ReportsApi()
const maxFileSizeMb = 16 * 1000 * 1024

const ReportDetailModal: React.FC<ReportDetailModalProps> = (
  prop: ReportDetailModalProps
) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
    watch
  } = useForm({ mode: 'onChange' })

  const [creationSuccessful, setCreationSuccessful] = useState<boolean | null>(
    null
  )
  const [updateSuccessful, setUpdateSuccessful] = useState<boolean | null>(null)
  const [fetchSuccessful, setFetchSuccessful] = useState<boolean | null>(null)
  const [reportDetail, setReportDetail] = useState<ReportDetailResponse>()

  const { openSuccessDialog, openDeleteDialog } = useDialog()

  const isCreate: boolean = prop.isCreate
  const reportId: string = prop.reportId

  const selectedFile: File = watch('selectedFile')

  const shouldDisplayForm: boolean =
    isCreate || (fetchSuccessful ? fetchSuccessful : false)

  const fetchReportDetail = async (reportId: string) => {
    logger.debug('Fetching report detail from BE')
    try {
      const response: ReportDetailResponse =
        await reportsService.getReportDetail(reportId)

      if (!response) {
        logger.error('Missing report detail from BE')
        setFetchSuccessful(false)
        return
      }

      setFetchSuccessful(true)
      setReportDetail(response)
      logger.debug(`Got report detail from BE ${JSON.stringify(response)}`)
    } catch (error) {
      logger.error('Error fetching report detail:', error)
      setFetchSuccessful(false)
    }
  }

  useEffect(() => {
    logger.debug(`Report Detail Modal has type isCreate: ${prop.isCreate}`)
    if (!isCreate && reportId) fetchReportDetail(reportId)
  }, [isCreate, reportId, prop.isCreate])

  if (!prop || (!prop.isCreate && !prop.reportId)) return null

  const closeModalAndClearData = () => {
    logger.debug('Closing modal..')
    reset()
    setFetchSuccessful(null)
    setCreationSuccessful(null)
    setUpdateSuccessful(null)
    prop.onClose()
  }

  const onSaveClick = async (data: FieldValues): Promise<void> => {
    logger.debug(
      `Data from form ${JSON.stringify(data)} and modal type isCreate: ${prop.isCreate}`
    )

    if (isCreate) {
      const response: CreateReportResponse | null = await createNewReport(data)

      if (!response) {
        setCreationSuccessful(false)
        return
      }

      setCreationSuccessful(true)
    } else {
      const response: ReportDetailResponse | null = await updateExistingReport(
        data,
        reportId
      )

      if (!response) {
        setUpdateSuccessful(false)
        return
      }

      setUpdateSuccessful(true)
    }

    closeModalAndClearData()
    openSuccessDialog()
    return
  }

  const deleteReport = async (reportId: string) => {
    logger.debug('Opening deletion dialog..')
    openDeleteDialog(reportId)
    closeModalAndClearData()
    return
  }

  const handleFileChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    logger.debug('Handling file change..')

    const uploadedFile: File | null = e.target.files ? e.target.files[0] : null

    if (uploadedFile) {
      if (uploadedFile.size > maxFileSizeMb) {
        setError('document', {
          type: 'manual',
          message: 'File with maximum size of 16MB is allowed!'
        })
        return false
      }

      logger.debug(
        `Will store uploaded document reference in memory: ${uploadedFile.name}`
      )

      setValue('document', uploadedFile)
      setValue('selectedFile', uploadedFile)
    }
  }

  const handleFileClear = () => {
    logger.debug('Removing selected file..')

    setValue('selectedFile', null)
    setValue('document', null)

    if (reportDetail != null) {
      setReportDetail({
        reporterAge: reportDetail.reporterAge,
        reporterName: reportDetail.reporterName,
        headline: reportDetail.headline,
        lastUpdate: reportDetail.lastUpdate,
        files: []
      })
    }
  }

  const extractFileName = (): string | null => {
    if (selectedFile) {
      return selectedFile.name
    } else if (reportDetail) {
      return reportDetail.files ? reportDetail.files[0].name : null
    }

    return null
  }

  const missingSelectedFileOnCreation = (): boolean => {
    return isCreate && !selectedFile
  }

  const missingSelectedFileOnDetail = (): boolean => {
    return !isCreate && !selectedFile
  }

  const missingStoredFiles = (): boolean => {
    return !reportDetail || reportDetail.files.length == 0
  }

  const shouldRenderFiles = (): boolean => {
    return !(
      missingSelectedFileOnCreation() ||
      (missingSelectedFileOnDetail() && missingStoredFiles())
    )
  }

  const renderUploadedFiles = () => {
    logger.debug('Rendering uploaded files...')

    const fileName: string = extractFileName() || ''

    return (
      <div className="p-d-flex p-ai-center">
        {fileName && (
          <div className="fileDetails">
            <span className="p-mr-2">File name: {fileName}</span>
            <Button
              icon="pi pi-times"
              className="p-button p-button-danger p-button-sm"
              onClick={handleFileClear}
              type={'button'}
            />

            <Button
              icon="pi pi-download"
              type="button"
              visible={!selectedFile && fileName}
              className="download-button p-button-text p-button-rounded"
              onClick={() => window.open(generateDownloadUrl(), '_blank')}
              tooltip="Download"
            />
          </div>
        )}
      </div>
    )
  }

  const generateDownloadUrl = (): string => {
    if (!reportDetail || reportDetail.files.length === 0) {
      return ''
    }

    return new ReportsApi().getDownloadUrl(reportId, reportDetail.files[0]._id)
  }

  return (
    <div className={styles.dialogContainer}>
      <Dialog
        header="Your Report"
        visible={prop.isVisible}
        onHide={closeModalAndClearData}
        style={{ width: '50vw' }}
      >
        {!shouldDisplayForm ? (
          <Message
            severity="error"
            text={'Something went wrong, please try again later'}
          />
        ) : (
          <div className={'modalFormContainer'}>
            <form onSubmit={handleSubmit((data) => onSaveClick(data))}>
              <div className="p-fluid">
                <div className={styles.formFieldContainer}>
                  <label className={styles.label} htmlFor="headline">
                    What happened?
                  </label>
                  <InputText
                    id="headline"
                    {...register('headline', {
                      required: 'This field is required'
                    })}
                    className={errors.headline ? 'p-invalid' : ''}
                    defaultValue={reportDetail ? reportDetail.headline : ''}
                  />
                  {errors.headline && (
                    <Message
                      severity="error"
                      text={`${errors.headline.message}`}
                    />
                  )}
                </div>

                <div className={styles.formFieldContainer}>
                  <label className={styles.label} htmlFor="reporterName">
                    What is your name?
                  </label>
                  <InputText
                    id="reporterName"
                    {...register('reporterName', {
                      required: 'This field is required'
                    })}
                    className={errors.reporterName ? 'p-invalid' : ''}
                    defaultValue={reportDetail ? reportDetail.reporterName : ''}
                  />
                  {errors.reporterName && (
                    <Message
                      severity="error"
                      text={`${errors.reporterName.message}`}
                    />
                  )}
                </div>

                <div className={styles.formFieldContainer}>
                  <label className={styles.label} htmlFor="reporterAge">
                    How old are you?
                  </label>
                  <InputText
                    id="reporterAge"
                    keyfilter="int"
                    {...register('reporterAge', {
                      required: 'This field is required',
                      min: { value: 1, message: 'Age must be at least 1' },
                      max: { value: 120, message: 'Age must be 120 or less' }
                    })}
                    className={errors.reporterAge ? 'p-invalid' : ''}
                    defaultValue={reportDetail ? reportDetail.reporterAge : ''}
                  />
                  {errors.reporterAge && (
                    <Message
                      severity="error"
                      text={`${errors.reporterAge.message}`}
                    />
                  )}
                </div>

                <div className={styles.formFieldContainer}>
                  <label className={styles.label} htmlFor="documentUpload">
                    New Document
                  </label>
                  <input
                    id="documentUpload"
                    {...register('document')}
                    type="file"
                    onChange={handleFileChangeCustom}
                    style={{ display: 'none' }}
                  />
                  <Button
                    label={'Choose File'}
                    icon="pi pi-upload"
                    className="p-button-outlined p-mr-2"
                    type="button"
                    onClick={() =>
                      document.getElementById('documentUpload')?.click()
                    }
                  />
                  {errors.document && (
                    <Message
                      severity="error"
                      text={`${errors.document.message}`}
                    />
                  )}
                  {shouldRenderFiles() && renderUploadedFiles()}
                </div>

                {!isCreate && (
                  <LastUpdateDate lastUpdate={reportDetail?.lastUpdate} />
                )}

                {creationSuccessful != null && !creationSuccessful && (
                  <Message
                    severity="error"
                    text={
                      'Something went wrong while creating new report, please try again later'
                    }
                  />
                )}
                {updateSuccessful != null && !updateSuccessful && (
                  <Message
                    severity="error"
                    text={
                      'Something went wrong while updating your report, please try again later'
                    }
                  />
                )}
              </div>

              <div className={styles.saveButtonContainer}>
                <Button
                  id="saveButton"
                  label="Save"
                  icon="pi"
                  type="submit"
                  className={'p-button-rounded p-button-outlined'}
                />
              </div>
            </form>

            {!isCreate && (
              <div className={styles.deleteButtonContainer}>
                <Button
                  id="deleteButton"
                  label="Delete"
                  icon="pi pi-times"
                  onClick={() => deleteReport(reportId)}
                  className="p-button-danger"
                />
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  )
}
export default ReportDetailModal
