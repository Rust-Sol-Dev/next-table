"use client";
import { useState, useMemo } from "react";

type TableProps = {
  data: { [k: string]: string | number }[];
};

const isRenderableType = (item: any) => {
  if (typeof item === "string") return true;
  if (typeof item === "number") return true;

  return false;
};

export default function TableComponent({ data }: TableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredData = useMemo(() => {
    let filtered = data;

    if (searchTerm && searchColumn) {
      filtered = filtered.filter((row) =>
        row[searchColumn]
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (sortColumn) {
      filtered.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, searchColumn, sortColumn, sortOrder]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  if (data.length <= 0) return <></>;

  return (
    <div className="w-full overflow-x-scroll border border-white rounded-md border-collapse">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-2 py-1"
        />
        <select
          value={searchColumn}
          onChange={(e) => setSearchColumn(e.target.value)}
          className="border px-2 py-1 ml-2"
        >
          <option value="">Select Column</option>
          {Object.keys(data[0]).map((header) =>
            isRenderableType(data[0][header]) ? (
              <option key={header} value={header}>
                {header}
              </option>
            ) : null
          )}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            {Object.keys(data[0]).map((header) =>
              isRenderableType(data[0][header]) ? (
                <th
                  key={header}
                  className="border border-white px-4 py-2 whitespace-nowrap cursor-pointer"
                  onClick={() => handleSort(header)}
                >
                  {header} {sortColumn === header ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
              ) : null
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, ind) => (
            <tr key={ind}>
              {Object.keys(row).map((itemKey, cellInd) =>
                isRenderableType(row[itemKey]) ? (
                  <td
                    key={`${ind}_${cellInd}`}
                    className="border border-white px-4 py-2 whitespace-nowrap"
                  >
                    {row[itemKey]}
                  </td>
                ) : null
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="border px-2 py-1"
        >
          Previous
        </button>
        <div className="flex justify-center">
        {Array.from({ length: Math.ceil(filteredData.length / pageSize) }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 mx-1 border ${
              page === currentPage ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(filteredData.length / pageSize))
            )
          }
          disabled={currentPage === Math.ceil(filteredData.length / pageSize)}
          className="border px-2 py-1"
        >
          Next
        </button>
        <span className="mx-2">
          Page {currentPage} of {Math.ceil(filteredData.length / pageSize)}
        </span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border px-2 py-1 ml-2"
        >
          {[10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}