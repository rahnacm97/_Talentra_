import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import SearchInput from "../../components/admin/SearchInput";
import Table from "../../components/admin/Table";
import Pagination from "../../components/admin/Pagination";
import { StatCard } from "../../components/admin/Statcard";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchAdminSubscriptions } from "../../thunks/adminSubscription.thunk";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";

const AdminSubscriptions: React.FC = () => {
  const dispatch = useAppDispatch();
  const { subscriptions, total, totalRevenue, loading } = useAppSelector(
    (state) => state.adminSubscriptions,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(
      fetchAdminSubscriptions({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
        status: statusFilter,
      }),
    );
  }, [dispatch, currentPage, debouncedSearch, statusFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const columns = [
    {
      key: "employerId",
      label: "Employer",
      render: (employer: any) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-bold uppercase">
              {employer?.name?.charAt(0) || "E"}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {employer?.name || "Unknown"}
            </div>
            <div className="text-xs text-gray-500">
              {employer?.email || "N/A"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "plan",
      label: "Plan",
      render: (plan: string) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
          ${
            plan === "enterprise"
              ? "bg-purple-100 text-purple-800"
              : plan === "professional"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {plan}
        </span>
      ),
    },
    {
      key: "totalAmount",
      label: "Amount",
      render: (amount: number) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            ₹{amount.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500">incl. GST</span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (date: string) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-900">
            {format(new Date(date), "MMM dd, yyyy")}
          </span>
          <span className="text-xs text-gray-500">
            {format(new Date(date), "hh:mm a")}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status: string) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
          ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : status === "expired"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      key: "transactionId",
      label: "Transaction ID",
      render: (id: string) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">
          {id || "N/A"}
        </code>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <ReceiptLongIcon className="text-blue-600" sx={{ fontSize: 32 }} />
          Subscriptions & Transactions
        </h1>
        <p className="text-gray-600">
          Monitor revenue and manage employer subscription history across the
          platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Transactions"
          value={total}
          icon={CreditCardIcon}
          iconBg="bg-blue-100"
          iconColor="#2563eb"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={CurrencyRupeeIcon}
          iconBg="bg-green-100"
          iconColor="#10b981"
        />
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by employer name or email..."
        />

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {(searchTerm || statusFilter !== "all") && (
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

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <Table
            data={subscriptions}
            columns={columns}
            renderActions={() => (
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Details
              </button>
            )}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(total / itemsPerPage)}
            paginate={setCurrentPage}
            totalItems={total}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}
    </div>
  );
};

export default AdminSubscriptions;
