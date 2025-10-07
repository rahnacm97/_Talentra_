import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import Table from "../../components/admin/Table";
import Pagination from "../../components/admin/Pagination";
import Modal from "../../components/admin/Modal";
import SearchInput from "../../components/admin/SearchInput";

import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  fetchCandidates,
  toggleBlockCandidate,
} from "../../thunks/admin.thunk";

const AdminCandidates: React.FC = () => {
  const dispatch = useAppDispatch();
  const { candidates, total, loading } = useAppSelector(
    (state) => state.adminCandidates
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedCandidateName, setSelectedCandidateName] = useState<string>("");
  const [isBlockAction, setIsBlockAction] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  

  useEffect(() => {
    dispatch(fetchCandidates({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const openModal = (id: string, name: string, blocked: boolean) => {
    setSelectedCandidateId(id);
    setSelectedCandidateName(name);
    setIsBlockAction(!blocked);
    setShowModal(true);
  };

  const handleApprove = () => {
    if (selectedCandidateId && isBlockAction !== null) {
      dispatch(toggleBlockCandidate({ candidateId: selectedCandidateId, block: isBlockAction }));
    }
    setShowModal(false);
    setSelectedCandidateId(null);
    setSelectedCandidateName("");
    setIsBlockAction(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedCandidateId(null);
    setSelectedCandidateName("");
    setIsBlockAction(null);
  };

  const verifiedCount = candidates.filter((c: any) => !c.blocked).length;
  const blockedCount = candidates.filter((c: any) => c.blocked).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Candidate Management
        </h1>
        <p className="text-gray-600">
          Manage and monitor all registered candidates on your platform.
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <PersonIcon sx={{ fontSize: 24, color: "#2563eb" }} />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{total}</h3>
              <p className="text-gray-600 text-sm">Total Candidates</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircleIcon sx={{ fontSize: 24, color: "#10b981" }} />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {verifiedCount}
              </h3>
              <p className="text-gray-600 text-sm">Active Candidates</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100">
              <BlockIcon sx={{ fontSize: 24, color: "#ef4444" }} />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {blockedCount}
              </h3>
              <p className="text-gray-600 text-sm">Blocked Candidates</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <DescriptionIcon sx={{ fontSize: 24, color: "#7c3aed" }} />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {candidates.filter((c) => c.resume).length}
              </h3>
              <p className="text-gray-600 text-sm">Resumes Submitted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <SearchInput
          value={searchTerm}
          onChange={(e: any) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
            <FilterListIcon sx={{ fontSize: 18, marginRight: 1 }} />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table
            data={candidates}
            columns={[
              { key: "name", label: "Candidate" },
              { key: "email", label: "Email" },
              { key: "resume", label: "Resume" },
              { key: "status", label: "Status" },
            ]}
            renderActions={(candidate: any) => (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    openModal(candidate.id, candidate.name, candidate.blocked)
                  }
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    candidate.blocked
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {candidate.blocked ? (
                    <CheckCircleIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
                  ) : (
                    <BlockIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
                  )}
                  {candidate.blocked ? "Unblock" : "Block"}
                </button>

                <Link
                  to={`/admin-candidates/view/${candidate.id}`}
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
        </>
      )}

      <Modal
        isOpen={showModal}
        onApprove={handleApprove}
        onCancel={handleCancel}
        actionType={isBlockAction ? "block" : "unblock"}
        name={selectedCandidateName}
      />
    </div>
  );
};

export default AdminCandidates;

