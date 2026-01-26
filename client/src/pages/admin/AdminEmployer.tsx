import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchEmployers, blockUnblockEmployer } from "../../thunks/admin.thunk";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedIcon from "@mui/icons-material/Verified";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import WarningIcon from "@mui/icons-material/Warning";
import Table from "../../components/admin/Table";
import Pagination from "../../components/admin/Pagination";
import Modal from "../../components/admin/Modal";
import SearchInput from "../../components/admin/SearchInput";
import { StatCard } from "../../components/admin/Statcard";

const AdminEmployers: React.FC = () => {
  const dispatch = useAppDispatch();
  const { employers, total, actionLoading } = useAppSelector(
    (state) => state.adminEmployers,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [selectedEmployerId, setSelectedEmployerId] = useState<string | null>(
    null,
  );
  const [selectedEmployerName, setSelectedEmployerName] = useState("");
  const [isBlockAction, setIsBlockAction] = useState<boolean | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "active" | "blocked" | "all"
  >("all");
  const [verificationFilter, setVerificationFilter] = useState<
    "verified" | "pending" | "all"
  >("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(
      fetchEmployers({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
        status: statusFilter,
        verification: verificationFilter,
      }),
    );
  }, [
    dispatch,
    currentPage,
    debouncedSearch,
    statusFilter,
    verificationFilter,
  ]);

  const openModal = (id: string, name: string, blocked: boolean) => {
    setSelectedEmployerId(id);
    setSelectedEmployerName(name);
    setIsBlockAction(!blocked);
    setShowModal(true);
  };

  const handleApprove = () => {
    if (selectedEmployerId && isBlockAction !== null) {
      dispatch(
        blockUnblockEmployer({
          employerId: selectedEmployerId,
          block: isBlockAction,
        }),
      ).then((result) => {
        if (blockUnblockEmployer.fulfilled.match(result)) {
          setShowModal(false);
          setSelectedEmployerId(null);
          setSelectedEmployerName("");
          setIsBlockAction(null);
        }
      });
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedEmployerId(null);
    setSelectedEmployerName("");
    setIsBlockAction(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setVerificationFilter("all");
    setCurrentPage(1);
  };

  const verifiedCount = employers.filter((e: any) => e.verified).length;
  const blockedCount = employers.filter((e: any) => e.blocked).length;
  const pendingCount = employers.filter((e: any) => !e.verified).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Employer Management
        </h1>
        <p className="text-gray-600">
          Manage and monitor all registered Employers on this platform.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Employers"
          value={total}
          icon={BusinessIcon}
          iconBg="bg-blue-100"
          iconColor="#2563eb"
        />
        <StatCard
          title="Verified Employers"
          value={verifiedCount}
          icon={VerifiedIcon}
          iconBg="bg-green-100"
          iconColor="#10b981"
        />
        <StatCard
          title="Blocked Employers"
          value={blockedCount}
          icon={BlockIcon}
          iconBg="bg-red-100"
          iconColor="#ef4444"
        />
        <StatCard
          title="Pending Verification"
          value={pendingCount}
          icon={WarningIcon}
          iconBg="bg-orange-100"
          iconColor="#f59e0b"
        />
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <SearchInput
          value={searchTerm}
          onChange={(e: any) => setSearchTerm(e.target.value)}
          placeholder="Search by company name or email…"
        />

       

      <div className="flex items-center space-x-3">

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <select
            value={verificationFilter}
            onChange={(e) =>
              setVerificationFilter(
                e.target.value as "verified" | "pending" | "all",
              )
            }
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">All Verification</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "active" | "blocked" | "all")
            }
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          {(searchTerm ||
            statusFilter !== "all" ||
            verificationFilter !== "all") && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center"
            >
              <FilterListOffIcon sx={{ fontSize: 18, marginRight: 0.5 }} />
              Clear Filters
            </button>
          )}

        </div>
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
                <EmailIcon
                  sx={{ fontSize: 16, color: "#6b7280", marginRight: 1 }}
                />
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
                  value
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
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
            key: "blocked",
            label: "Status",
            render: (value: boolean) => (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  value
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
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
                emp.blocked
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              {emp.blocked ? (
                <CheckCircleIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
              ) : (
                <BlockIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
              )}
              {emp.blocked ? "Unblock" : "Block"}
            </button>

            <Link
              to={`/employers/view/${emp.id}`}
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
        isLoading={actionLoading}
      />
    </div>
  );
};

export default AdminEmployers;
