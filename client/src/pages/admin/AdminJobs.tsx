import React, { useState } from "react";
import { Link } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AddIcon from "@mui/icons-material/Add";
import Table from "../../components/admin/Table";
import Pagination from "../../components/admin/Pagination";
import Modal from "../../components/admin/Modal";
import SearchInput from "../../components/admin/SearchInput";

const AdminJobs: React.FC = () => {
  // Mock job data
  const mockJobs = [
    {
      _id: "1",
      title: "Software Engineer",
      companyName: "Tech Corp",
      jobType: "Full-time",
      applications: 25,
      isActive: true,
    },
    {
      _id: "2",
      title: "Product Manager",
      companyName: "Innovate Inc",
      jobType: "Part-time",
      applications: 10,
      isActive: false,
    },
    {
      _id: "3",
      title: "Data Analyst",
      companyName: "Data Solutions",
      jobType: "Full-time",
      applications: 15,
      isActive: true,
    },
    {
      _id: "4",
      title: "UX Designer",
      companyName: "Creative Labs",
      jobType: "Contract",
      applications: 8,
      isActive: false,
    },
    {
      _id: "5",
      title: "DevOps Engineer",
      companyName: "Cloud Systems",
      jobType: "Full-time",
      applications: 20,
      isActive: true,
    },
    {
      _id: "6",
      title: "Marketing Specialist",
      companyName: "Grow Easy",
      jobType: "Part-time",
      applications: 12,
      isActive: true,
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [jobs, setJobs] = useState(mockJobs);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [isActivateAction, setIsActivateAction] = useState<boolean | null>(
    null,
  );

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate pagination
  const total = filteredJobs.length;
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Calculate stats for header cards
  const activeJobsCount = jobs.filter((j) => j.isActive).length;
  const closedJobsCount = jobs.filter((j) => !j.isActive).length;
  const fullTimeCount = jobs.filter((j) => j.jobType === "Full-time").length;
  //const partTimeCount = jobs.filter((j) => j.jobType === "Part-time").length;

  const openModal = (id: string, title: string, isActive: boolean) => {
    setSelectedJobId(id);
    setSelectedJobTitle(title);
    setIsActivateAction(!isActive);
    setShowModal(true);
  };

  const handleToggleStatus = () => {
    if (selectedJobId && isActivateAction !== null) {
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === selectedJobId
            ? { ...job, isActive: isActivateAction }
            : job,
        ),
      );
      setShowModal(false);
      setSelectedJobId(null);
      setSelectedJobTitle("");
      setIsActivateAction(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedJobId(null);
    setSelectedJobTitle("");
    setIsActivateAction(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Jobs Management
        </h1>
        <p className="text-gray-600">
          Manage and monitor all registered Jobs on this platform.
        </p>
      </div>
      {/* Header Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="p-3 rounded-lg bg-blue-100">
            <WorkIcon sx={{ fontSize: 24, color: "#2563eb" }} />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl font-bold text-gray-900">{total}</h3>
            <p className="text-gray-600 text-sm">Total Jobs</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="p-3 rounded-lg bg-green-100">
            <ToggleOnIcon sx={{ fontSize: 24, color: "#10b981" }} />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {activeJobsCount}
            </h3>
            <p className="text-gray-600 text-sm">Active Jobs</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="p-3 rounded-lg bg-red-100">
            <ToggleOffIcon sx={{ fontSize: 24, color: "#ef4444" }} />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {closedJobsCount}
            </h3>
            <p className="text-gray-600 text-sm">Closed Jobs</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="p-3 rounded-lg bg-orange-100">
            <ScheduleIcon sx={{ fontSize: 24, color: "#f59e0b" }} />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {fullTimeCount}
            </h3>
            <p className="text-gray-600 text-sm">Full-time Jobs</p>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
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
          <Link
            to="/admin-jobs/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <AddIcon sx={{ fontSize: 18, marginRight: 1 }} />
            Add Job
          </Link>
        </div>
      </div>

      {/* Jobs Table */}
      <Table
        data={paginatedJobs}
        columns={[
          {
            key: "title",
            label: "Job Title",
            render: (value: string, job: any) => (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <WorkIcon sx={{ fontSize: 20, color: "#2563eb" }} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{value}</div>
                  <div className="text-xs text-gray-500">ID: {job._id}</div>
                </div>
              </div>
            ),
          },
          {
            key: "companyName",
            label: "Company",
            render: (value: string) => (
              <div className="flex items-center">
                <BusinessIcon
                  sx={{ fontSize: 16, color: "#6b7280", marginRight: 1 }}
                />
                {value}
              </div>
            ),
          },
          {
            key: "jobType",
            label: "Type",
            render: (value: string) => (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {value || "N/A"}
              </span>
            ),
          },
          {
            key: "applications",
            label: "Applications",
            render: (value: number) => (
              <span className="font-medium text-gray-900">{value || 0}</span>
            ),
          },
          {
            key: "isActive",
            label: "Status",
            render: (value: boolean) => (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  value
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {value ? "Active" : "Closed"}
              </span>
            ),
          },
        ]}
        renderActions={(job: any) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => openModal(job._id, job.title, job.isActive)}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                job.isActive
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {job.isActive ? (
                <ToggleOffIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
              ) : (
                <ToggleOnIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
              )}
              {job.isActive ? "Close" : "Activate"}
            </button>
            <Link
              to={`/admin-jobs/view/${job._id}`}
              className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
            >
              <VisibilityIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
              View
            </Link>
          </div>
        )}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={setCurrentPage}
        totalItems={total}
        itemsPerPage={itemsPerPage}
      />

      {/* Toggle Status Modal */}
      <Modal
        isOpen={showModal}
        onApprove={handleToggleStatus}
        onCancel={handleCancel}
        actionType={isActivateAction ? "block" : "unblock"}
        name={selectedJobTitle}
      />
    </div>
  );
};

export default AdminJobs;
