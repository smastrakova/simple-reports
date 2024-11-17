import { ReportSummaryResponse } from '@/api/IReportResponse'

export type Action =
  | { type: 'FETCH_ALL_REQUEST' }
  | {
      type: 'FETCH_ALL_SUCCESS'
      payload: { reports: ReportSummaryResponse[]; total: number }
    }
  | { type: 'FETCH_ALL_FAILURE' }
  | { type: 'SET_PAGE'; payload: number }

export interface State {
  entries: ReportSummaryResponse[]
  loading: boolean
  totalEntries: number
  currentPage: number
  entriesPerPage: number
}

export const initialState: State = {
  entries: [],
  loading: true,
  totalEntries: 0,
  currentPage: 1,
  entriesPerPage: 5
}

export const tableReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_ALL_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_ALL_SUCCESS':
      return {
        ...state,
        loading: false,
        entries: action.payload.reports,
        totalEntries: action.payload.total
      }
    case 'FETCH_ALL_FAILURE':
      return { ...state, loading: false }
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload }
    default:
      return state
  }
}
