import { useEffect, useRef, useState } from "react"
import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"

type TableState = {
  sorting?: SortingState
  columnFilters?: ColumnFiltersState
  columnVisibility?: VisibilityState
  pagination?: PaginationState
}

type TableStateSetters = {
  setSorting: OnChangeFn<SortingState>
  setColumnFilters: OnChangeFn<ColumnFiltersState>
  setColumnVisibility: OnChangeFn<VisibilityState>
  setPagination: OnChangeFn<PaginationState>
}

type TableStateResult = TableState &
  TableStateSetters & {
    /**
     * Whether the table state is still loading from localStorage
     */
    isLoading: boolean
  }

/**
 * Clear all persisted state for a specific table
 * @param tableId The unique identifier for the table
 */
export function clearPersistedTableState(tableId: string): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(`table-sorting-${tableId}`)
    localStorage.removeItem(`table-filters-${tableId}`)
    localStorage.removeItem(`table-visibility-${tableId}`)
    localStorage.removeItem(`table-pagination-${tableId}`)
  } catch (error) {
    console.error("Error clearing table state from localStorage:", error)
  }
}

/**
 * Clear all persisted table states from localStorage
 */
export function clearAllPersistedTableStates(): void {
  if (typeof window === "undefined") return

  try {
    const keysToRemove: string[] = []

    // Find all table state keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (
        key &&
        (key.startsWith("table-sorting-") ||
          key.startsWith("table-filters-") ||
          key.startsWith("table-visibility-") ||
          key.startsWith("table-pagination-"))
      ) {
        keysToRemove.push(key)
      }
    }

    // Remove all found keys
    keysToRemove.forEach(key => localStorage.removeItem(key))
  } catch (error) {
    console.error("Error clearing all table states from localStorage:", error)
  }
}

/**
 * A hook to manage and persist table state in localStorage
 * @param tableId A unique identifier for the table
 * @param defaultState Default state values
 * @returns Object containing state values, setters, and loading state
 */
export function usePersistedTableState(
  tableId: string,
  defaultState: TableState = {},
): TableStateResult {
  // Track if component is mounted
  const isMounted = useRef(false)

  // Initialize with default values first to avoid hydration mismatch
  const [sorting, setSortingState] = useState<SortingState>(defaultState.sorting ?? [])
  const [columnFilters, setColumnFiltersState] = useState<ColumnFiltersState>(
    defaultState.columnFilters ?? [],
  )
  const [columnVisibility, setColumnVisibilityState] = useState<VisibilityState>(
    defaultState.columnVisibility ?? {},
  )
  const [pagination, setPaginationState] = useState<PaginationState>(
    defaultState.pagination ?? { pageIndex: 0, pageSize: 10 },
  )

  // Flag to track if we've loaded from localStorage
  const [isInitialized, setIsInitialized] = useState(false)

  // Loading state to prevent layout shifts - start as false for SSR
  const [isLoading, setIsLoading] = useState(false)

  // Set mounted ref and initialize loading state on client only
  useEffect(() => {
    isMounted.current = true

    // Only set loading to true on the client
    if (typeof window !== "undefined") {
      setIsLoading(true)
    }

    return () => {
      isMounted.current = false
    }
  }, [])

  // Load state from localStorage after initial render
  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized && isMounted.current) {
      try {
        // Load sorting
        const storedSorting = localStorage.getItem(`table-sorting-${tableId}`)
        if (storedSorting && isMounted.current) {
          setSortingState(JSON.parse(storedSorting) as SortingState)
        }

        // Load column filters
        const storedFilters = localStorage.getItem(`table-filters-${tableId}`)
        if (storedFilters && isMounted.current) {
          setColumnFiltersState(JSON.parse(storedFilters) as ColumnFiltersState)
        }

        // Load column visibility
        const storedVisibility = localStorage.getItem(`table-visibility-${tableId}`)
        if (storedVisibility && isMounted.current) {
          setColumnVisibilityState(JSON.parse(storedVisibility) as VisibilityState)
        }

        // Load pagination
        const storedPagination = localStorage.getItem(`table-pagination-${tableId}`)
        if (storedPagination && isMounted.current) {
          setPaginationState(JSON.parse(storedPagination) as PaginationState)
        }

        if (isMounted.current) {
          setIsInitialized(true)

          // Small delay to ensure state updates have been applied
          // before showing the table to prevent layout shifts
          setTimeout(() => {
            if (isMounted.current) {
              setIsLoading(false)
            }
          }, 50)
        }
      } catch (error) {
        console.error("Error loading table state from localStorage:", error)
        if (isMounted.current) {
          setIsInitialized(true)
          setIsLoading(false)
        }
      }
    }
  }, [tableId, isInitialized, defaultState])

  // Create setters that update both state and localStorage
  const setSorting: OnChangeFn<SortingState> = updaterOrValue => {
    if (typeof window === "undefined") return updaterOrValue

    setSortingState(old => {
      if (!isMounted.current) return old

      const newState = typeof updaterOrValue === "function" ? updaterOrValue(old) : updaterOrValue
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`table-sorting-${tableId}`, JSON.stringify(newState))
        } catch (error) {
          console.error("Error saving sorting state to localStorage:", error)
        }
      }
      return newState
    })

    return updaterOrValue
  }

  const setColumnFilters: OnChangeFn<ColumnFiltersState> = updaterOrValue => {
    if (typeof window === "undefined") return updaterOrValue

    setColumnFiltersState(old => {
      if (!isMounted.current) return old

      const newState = typeof updaterOrValue === "function" ? updaterOrValue(old) : updaterOrValue
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`table-filters-${tableId}`, JSON.stringify(newState))
        } catch (error) {
          console.error("Error saving filters state to localStorage:", error)
        }
      }
      return newState
    })

    return updaterOrValue
  }

  const setColumnVisibility: OnChangeFn<VisibilityState> = updaterOrValue => {
    if (typeof window === "undefined") return updaterOrValue

    setColumnVisibilityState(old => {
      if (!isMounted.current) return old

      const newState = typeof updaterOrValue === "function" ? updaterOrValue(old) : updaterOrValue
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`table-visibility-${tableId}`, JSON.stringify(newState))
        } catch (error) {
          console.error("Error saving visibility state to localStorage:", error)
        }
      }
      return newState
    })

    return updaterOrValue
  }

  const setPagination: OnChangeFn<PaginationState> = updaterOrValue => {
    if (typeof window === "undefined") return updaterOrValue

    setPaginationState(old => {
      if (!isMounted.current) return old

      const newState = typeof updaterOrValue === "function" ? updaterOrValue(old) : updaterOrValue
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`table-pagination-${tableId}`, JSON.stringify(newState))
        } catch (error) {
          console.error("Error saving pagination state to localStorage:", error)
        }
      }
      return newState
    })

    return updaterOrValue
  }

  return {
    sorting,
    columnFilters,
    columnVisibility,
    pagination,
    setSorting,
    setColumnFilters,
    setColumnVisibility,
    setPagination,
    isLoading,
  }
}
