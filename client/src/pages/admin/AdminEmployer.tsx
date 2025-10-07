import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchEmployers, blockUnblockEmployer } from "../../thunks/admin.thunk";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedIcon from "@mui/icons-material/Verified";
import WarningIcon from "@mui/icons-material/Warning";
import AddIcon from "@mui/icons-material/Add";
import Table from "../../components/admin/Table";
import Pagination from "../../components/admin/Pagination";
import Modal from "../../components/admin/Modal";
import SearchInput from "../../components/admin/SearchInput";

const AdminEmployers: React.FC = () => {
  const dispatch = useAppDispatch();
  const { employers, total } = useAppSelector((state) => state.adminEmployers);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [selectedEmployerId, setSelectedEmployerId] = useState<string | null>(null);
  const [selectedEmployerName, setSelectedEmployerName] = useState("");
  const [isBlockAction, setIsBlockAction] = useState<boolean | null>(null);
  

  useEffect(() => {
    dispatch(fetchEmployers({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const openModal = (id: string, name: string, blocked: boolean) => {
    setSelectedEmployerId(id);
    setSelectedEmployerName(name);
    setIsBlockAction(!blocked);
    setShowModal(true);
  };

  const handleApprove = () => {
    if (selectedEmployerId && isBlockAction !== null) {
      dispatch(blockUnblockEmployer({ employerId: selectedEmployerId, block: isBlockAction }));
      setShowModal(false);
      setSelectedEmployerId(null);
      setSelectedEmployerName("");
      setIsBlockAction(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedEmployerId(null);
    setSelectedEmployerName("");
    setIsBlockAction(null);
  };

  const verifiedCount = employers.filter((e: any) => e.verified).length;
  const blockedCount = employers.filter((e: any) => e.blocked).length;
  const pendingCount = employers.filter((e: any) => !e.verified).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="p-3 rounded-lg bg-blue-100">
            <BusinessIcon sx={{ fontSize: 24, color: "#2563eb" }} />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl font-bold text-gray-900">{total}</h3>
            <p className="text-gray-600 text-sm">Total Employers</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="p-3 rounded-lg bg-green-100">
            <VerifiedIcon sx={{ fontSize: 24, color: "#10b981" }} />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl font-bold text-gray-900">{verifiedCount}</h3>
            <p className="text-gray-600 text-sm">Verified Employers</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="p-3 rounded-lg bg-red-100">
            <BlockIcon sx={{ fontSize: 24, color: "#ef4444" }} />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl font-bold text-gray-900">{blockedCount}</h3>
            <p className="text-gray-600 text-sm">Blocked Employers</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="p-3 rounded-lg bg-orange-100">
            <WarningIcon sx={{ fontSize: 24, color: "#f59e0b" }} />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl font-bold text-gray-900">{pendingCount}</h3>
            <p className="text-gray-600 text-sm">Pending Verification</p>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <SearchInput value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} />
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
            <FilterListIcon sx={{ fontSize: 18, marginRight: 1 }} />
            Filter
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <AddIcon sx={{ fontSize: 18, marginRight: 1 }} />
            Add Employer
          </button>
        </div>
      </div>

      <Table
        data={employers}
        columns={[
          {
            key: "name",
            label: "Company",
            render: (value: string, emp: any) => (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <BusinessIcon sx={{ fontSize: 20, color: "#2563eb" }} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{value}</div>
                  <div className="text-xs text-gray-500">ID: {emp._id}</div>
                </div>
              </div>
            ),
          },
          {
            key: "email",
            label: "Email",
            render: (value: string) => (
              <div className="flex items-center">
                <EmailIcon sx={{ fontSize: 16, color: "#6b7280", marginRight: 1 }} />
                {value}
              </div>
            ),
          },
          {
            key: "verified",
            label: "Verification Status",
            render: (value: boolean) => (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  value ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {value ? (
                  <>
                    <VerifiedIcon sx={{ fontSize: 12, marginRight: 0.5 }} />
                    Verified
                  </>
                ) : (
                  <>
                    <WarningIcon sx={{ fontSize: 12, marginRight: 0.5 }} />
                    Pending
                  </>
                )}
              </span>
            ),
          },
          {
            key: "jobsPosted",
            label: "Jobs Posted",
            render: (value: number) => <span className="font-medium text-gray-900">{value || 0}</span>,
          },
          {
            key: "blocked",
            label: "Status",
            render: (value: boolean) => (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  value ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                }`}
              >
                {value ? "Blocked" : "Active"}
              </span>
            ),
          },
        ]}
        renderActions={(emp: any) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => openModal(emp.id, emp.name, emp.blocked)}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                emp.blocked ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              {emp.blocked ? <CheckCircleIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> : <BlockIcon sx={{ fontSize: 16, marginRight: 0.5 }} />}
              {emp.blocked ? "Unblock" : "Block"}
            </button>

            <Link
              to={`/admin-employers/view/${emp._id}`}
              className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
            >
              <VisibilityIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
              View
            </Link>
          </div>
        )}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(total / itemsPerPage)}
        paginate={setCurrentPage}
        totalItems={total}
        itemsPerPage={itemsPerPage}
      />

      <Modal
        isOpen={showModal}
        onApprove={handleApprove}
        onCancel={handleCancel}
        actionType={isBlockAction ? "block" : "unblock"}
        name={selectedEmployerName}
      />
    </div>
  );
};

export default AdminEmployers;


