import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import DescriptionIcon from "@mui/icons-material/Description";

const Table = ({ data, columns, renderActions }: any) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col: any) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row: any, i: number) => (
              <tr
                key={i}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                {columns.map((col: any) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {col.render ? (
                      col.render(row[col.key], row)
                    ) : col.key === "name" ? (
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <PersonIcon sx={{ fontSize: 20, color: "#2563eb" }} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {row[col.key]}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {row._id}
                          </div>
                        </div>
                      </div>
                    ) : col.key === "email" ? (
                      <div className="flex items-center">
                        <EmailIcon
                          sx={{
                            fontSize: 16,
                            color: "#6b7280",
                            marginRight: 1,
                          }}
                        />
                        <span>{row[col.key]}</span>
                      </div>
                    ) : col.key === "resume" ? (
                      <div className="flex items-center">
                        <DescriptionIcon
                          sx={{
                            fontSize: 16,
                            color: "#6b7280",
                            marginRight: 1,
                          }}
                        />
                        <span className="text-gray-600">
                          {row[col.key]
                            ? `Resume_${(row.name || "Candidate").replace(/\s+/g, "_")}.pdf`
                            : "No resume"}
                        </span>
                      </div>
                    ) : (
                      <span>{row[col.key]}</span>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {renderActions(row)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
