const Table = ({ columns, data }) => {
  return (
    <>
      {/* Desktop View */}
      <div className="overflow-x-auto rounded-lg mt-10 hidden sm:block">
        <table className="w-full bg-transparent border border-gray-200 rounded-lg">
          <thead className="border-b border-gray-200 ">
            <tr
              className="px-3 py-3 grid"
              style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
            >
              {columns.map((col, index) => (
                <th key={index} className="font-semibold text-left px-4 py-2">
                  {col.heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors grid"
                style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="text-gray-700 px-4 py-3">
                    {col.render ? col.render(row) : row[col.key?.toLowerCase()] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="mt-10 space-y-3 sm:hidden">
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-semibold text-gray-800">
              {columns[0].render ? columns[0].render(row) : row[columns[0].key?.toLowerCase()] || "Item"}
            </h3>
            <div className="mt-3 space-y-2 pt-3 border-t border-gray-100">
              {columns.slice(1).map((col, colIndex) => (
                <div key={colIndex} className="flex justify-between">
                  <span className="font-medium text-gray-600">{col.heading}:</span>
                  <span className="text-gray-800 text-right">
                    {col.render ? col.render(row) : row[col.key?.toLowerCase()] || "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Table