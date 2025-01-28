"use client"

import { useState, useEffect, useMemo } from "react"
import type { WebsiteData } from "@/types"
import { ArrowUpDown, ChevronLeft, ChevronRight, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

const ITEMS_PER_PAGE = 10

export default function DataTable() {
  const [data, setData] = useState<WebsiteData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sortColumn, setSortColumn] = useState<keyof WebsiteData>("domain")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filter, setFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch("/api/sheets")
      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }
      const jsonData: WebsiteData[] = await response.json()
      setData(jsonData)
      setLoading(false)
    } catch (err) {
      setError("Error fetching data. Please try again later.")
      setLoading(false)
    }
  }

  const handleSort = (column: keyof WebsiteData) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleLogout = () => {
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/")
  }

  const filteredAndSortedData = useMemo(() => {
    return data
      .filter((item) => item.domain.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
        if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
        return 0
      })
  }, [data, filter, sortColumn, sortDirection])

  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE)
  const paginatedData = filteredAndSortedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-2xl font-bold mb-4">Error</p>
          <p>{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-full overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Website Data</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by Domain Name"
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(data[0] || {}).map((column) => (
                <th
                  key={column}
                  onClick={() => handleSort(column as keyof WebsiteData)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.replace(/([A-Z])/g, " $1").trim()}</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {Object.entries(item).map(([key, value], i) => (
                  <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {key === "domain" ? (
                      <a
                        href={`https://${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col xs:flex-row items-center justify-between">
        <div className="mb-4 xs:mb-0 text-sm text-gray-700">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedData.length)} of {filteredAndSortedData.length}{" "}
          entries
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-sm"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

