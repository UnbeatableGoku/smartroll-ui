import { useCallback, useEffect, useState } from 'react'

import { filterOption } from '@pages/TeacherDashboard/session-history/types'
import { loader } from '@types'
import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import { Option } from '@components/common/multi-select'
import { useSearchParams } from 'react-router-dom'

interface FilterState {
  subjects: string[]
  startDate: string
  endDate: string
  semesters: string[]
  branches: string[]
  divisions: string[]
}

const useLectureSessions = () => {
  //custome api call hook
  const [StoredTokens, CallAPI] = useAPI()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    subjects: [],
    startDate: '',
    endDate: '',
    semesters: [],
    branches: [],
    divisions: [],
  })

  const [filterOption, setFilterOptions] = useState<filterOption>({
    branches: [],
    divisions: [],
    semesters: [],
    subjects: [],
  })
  const [searchParams, setSearchParams] = useSearchParams()

  // When page loads or URL changes, sync with query param
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (sessionId) {
      try {
        showStudentAttendanceHistory(sessionId)
      }
      catch (error) {
        setSearchParams({})
      }
    }
  }, [searchParams])


  const [students, setStudents] = useState<Array<Record<string, any>>>([])
  const [displayedLectures, setDisplayedLectures] = useState<Array<any>>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  /**fetch the filter meta-data options */
  const fetchFilterMetadata = async () => {
    const endpoint = `/manage/session/get_history_metadata`
    const header = {
      'ngrok-skip-browser-warning': true,
      Authorization: `Bearer ${StoredTokens.accessToken}`,
    }
    const axiosInstance = axios.create()
    const method = 'get'
    const response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      endpoint,
      method,
      header,
    )
    if (response_obj.error) {
      toast.error(response_obj.errorMessage?.message || 'Something went worng')
    }

    const branchList: Array<any> = get(
      response_obj,
      'response.data.data.branches',
      [],
    )
    const semesterList: Array<any> = get(
      response_obj,
      'response.data.data.semesters',
      [],
    )
    const divisionList: Array<any> = get(
      response_obj,
      'response.data.data.divisions',
      [],
    )
    const subjectList: Array<any> = get(
      response_obj,
      'response.data.data.subjects',
      [],
    )

    const branches: Option[] = branchList.map(
      (branch: Record<string, string>) => ({
        label: branch.branch_name,
        value: branch.slug,
      }),
    )
    const divisions: Option[] = divisionList.map(
      (division: Record<string, string>) => ({
        label: division.division_name,
        value: division.division_name,
      }),
    )
    const semesters: Option[] = semesterList.map((semester: string) => ({
      label: semester,
      value: semester,
    }))

    const subjects: Option[] = subjectList.map(
      (subject: Record<string, string>) => ({
        label: subject.subject_name,
        value: subject.slug,
      }),
    )
    setFilterOptions({
      branches,
      divisions,
      semesters,
      subjects,
    })
  }

  const fetchLectureSessions = async ({
    pageNumber,
    pageSize = null,
    filters = null,
    loaderType = loader.API,
  }: any) => {
    try {
      const endpoint = `/manage/session/get_sessions_of_teacher`
      const params: Record<string, any> = {
        page_size: pageSize ?? 20,
      }
      if (pageNumber) {
        params['page'] = pageNumber
      }

      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'post'
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
        filters ?? null,
        params,
        loaderType,
      )
      if (response_obj.error) {
        toast.error(
          response_obj.errorMessage?.message || 'Something went worng',
        )
      }

      const lectures = get(response_obj, 'response.data.data.results', [])
      const currentPage = get(
        response_obj,
        'response.data.data.current_page',
        0,
      )
      const totalPage = get(response_obj, 'response.data.data.num_pages', 0)
      setCurrentIndex(currentPage)
      setTotalPage(totalPage)

      if (pageNumber) {
        setDisplayedLectures((prev) => [...prev, ...lectures])
      } else {
        setDisplayedLectures(lectures)
      }
    } catch (error: any) {
      toast.error(error.message || 'something went worng')
    }
  }

  const loadMoreData = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Simulate API delay

    const nextIndex = currentIndex + 1

    if (nextIndex > totalPage) {
      setHasMore(false)
    } else {
      const body = checkFilters()
      await fetchLectureSessions({
        pageNumber: nextIndex,
        filters: body,
        loaderType: loader.PAGEINATION,
      })
      setHasMore(nextIndex < totalPage)
    }

    setIsLoading(false)
  }, [currentIndex, displayedLectures, isLoading, hasMore])

  const applyFilters = async () => {
    // let filtered = mockLectures
    const body = checkFilters()

    setIsFilterOpen(false)
    await fetchLectureSessions({ filters: body })
    // setFilteredLectures(filtered)
    // setSortState({ field: null, direction: null })
  }

  const checkFilters = () => {
    const body: Record<string, any> = {}
    if (filters.subjects.length > 0) {
      body['subjects'] = filters.subjects
    }
    if (filters.startDate) {
      body['start_date'] = filters.startDate
    }
    if (filters.endDate) {
      body['end_date'] = filters.endDate
    }
    if (filters.semesters.length > 0) {
      body['semesters'] = filters.semesters
    }
    if (filters.branches.length > 0) {
      body['branches'] = filters.branches
    }
    if (filters.divisions.length > 0) {
      body['divisions'] = filters.divisions
    }
    return body
  }

  const clearFilters = () => {
    setFilters({
      subjects: [],
      startDate: '',
      endDate: '',
      semesters: [],
      branches: [],
      divisions: [],
    })
  }

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | string[],
  ) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }))
  }

  const closeHistroySheet = () => {
    setIsHistorySheetOpen(false)
    setSearchParams({})
    setStudents([])
  }

  const showStudentAttendanceHistory = async (session_id: string) => {

    const header = {
      'ngrok-skip-browser-warning': true,
      Authorization: `Bearer ${StoredTokens.accessToken}`,
    }
    const axiosInstance = axios.create()
    const method = 'get'
    const endpoint = `/manage/session/get_session_data/${session_id}`
    const response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      endpoint,
      method,
      header,
    )
    if (response_obj.error === true) {
      return toast.error(response_obj.errorMessage?.message)
    }
    const response = get(response_obj, 'response.data.data', [])
    setIsHistorySheetOpen(true)
    setStudents(response.marked_attendances)
    setSessionId(session_id)


  }

  const showAttendancehistorySheet = (sessionId: string) => {
    setSearchParams({ session_id: sessionId }) // Updates URL query param
    showStudentAttendanceHistory(sessionId)
  }

  return {
    fetchFilterMetadata,
    fetchLectureSessions,
    setFilters,
    setDisplayedLectures,
    setCurrentIndex,
    setHasMore,
    setIsLoading,
    loadMoreData,
    applyFilters,
    clearFilters,
    checkFilters,
    handleFilterChange,
    setIsFilterOpen,
    closeHistroySheet,
    setSessionId,
    showStudentAttendanceHistory,
    showAttendancehistorySheet,
    sessionId,
    students,
    isHistorySheetOpen,
    isFilterOpen,
    isLoading,
    hasMore,
    currentIndex,
    filters,
    filterOption,
    displayedLectures,
  }
}

export default useLectureSessions
