'use client'

import { ReportsResponse } from '@/api/IReportResponse'
import ReportsApi from '@/api/reportsApi'
import { initialState, tableReducer } from '@/hooks/tableReducer'
import { useDialog } from '@/providers/dialogContextProvider'
import logger from '@/util/logger'
import { formatTimestamp } from '@/util/timeFormatter'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable, DataTableRowClickEvent } from 'primereact/datatable'
import React, { useCallback, useEffect, useReducer } from 'react'
import styles from '../styles/PaginatedTable.module.css'

const pageLimit: number = 5
const reportsService = new ReportsApi()

const PaginatedEntriesTable: React.FC = () => {
  const [state, dispatch] = useReducer(tableReducer, initialState)
  const { openUpdateDialog } = useDialog()

  const fetchEntries = useCallback(async (page: number, pageSize: number) => {
    dispatch({ type: 'FETCH_ALL_REQUEST' })

    logger.debug('Fetching data from BE')
    try {
      const response: ReportsResponse = await reportsService.getReports(
        page,
        pageSize
      )

      dispatch({
        type: 'FETCH_ALL_SUCCESS',
        payload: {
          reports: response.reports,
          total: response.total
        }
      })
    } catch (error) {
      logger.error('Error fetching data:', error)
      dispatch({ type: 'FETCH_ALL_FAILURE' })
    }
  }, [])

  useEffect(() => {
    fetchEntries(state.currentPage, pageLimit)
  }, [fetchEntries, state.currentPage])

  const onRowClick = (event: DataTableRowClickEvent) => {
    if (!event.data) {
      logger.error('Missing selected report')
      return
    }

    logger.debug(`Selected report with id ${event.data._id}`)
    openUpdateDialog(event.data._id)
  }

  const handleNextPage = () => {
    if (state.currentPage * state.entriesPerPage < state.totalEntries) {
      dispatch({ type: 'SET_PAGE', payload: state.currentPage + 1 })
    }
  }

  const handlePrevPage = () => {
    if (state.currentPage > 1) {
      dispatch({ type: 'SET_PAGE', payload: state.currentPage - 1 })
    }
  }

  return (
    <div
      className={`card table-container ${styles.tableContainer} ${styles.pagination}`}
    >
      <DataTable
        value={state.entries}
        loading={state.loading}
        rows={state.entriesPerPage}
        onRowClick={(e: DataTableRowClickEvent) => onRowClick(e)}
        selectionMode="single"
        emptyMessage="There are currently no reports. Let's start by adding some!"
      >
        <Column field="headline" header="Title" />
        <Column field="reporterName" header="Report name" />
        <Column body={formatTimestamp} header="Last update" />
      </DataTable>
      <div className={`card ${styles.tableContainer} ${styles.pagination}`}>
        <Button
          id="prevButton"
          label="Previous"
          onClick={handlePrevPage}
          disabled={state.currentPage === 1}
          className={'p-button-rounded p-button-outlined'}
        />
        <Button
          id="nextButton"
          label="Next"
          onClick={handleNextPage}
          disabled={
            state.currentPage * state.entriesPerPage >= state.totalEntries
          }
          className={'p-button-rounded p-button-outlined'}
        />
        <p className={styles.pageNumber}>
          Page {state.currentPage} of{' '}
          {Math.ceil(state.totalEntries / state.entriesPerPage)}
        </p>
      </div>
    </div>
  )
}

export default PaginatedEntriesTable
