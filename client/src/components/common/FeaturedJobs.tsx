import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchJobsForCandidate } from "../../thunks/job.thunk";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import JobCard from "../common/JobCard";

const FeaturedJobsSection: React.FC = () => {
  const dispatch = useAppDispatch();

  const { jobs: allJobs, loading } = useAppSelector(
    (state) => state.candidateJobs,
  );

  const { selectedSkills } = useAppSelector((s) => s.candidateJobs);

  const [page] = useState(1);

  const [location] = useState("");
  const [jobType] = useState<
    "all" | "Full-time" | "Part-time" | "Contract" | "Internship"
  >("all");
  const [experience] = useState<
    "all" | "0" | "1-2" | "3-5" | "6-8" | "9-12" | "13+"
  >("all");
  const [debouncedSearch] = useState("");

  const limit = 4;

  useEffect(() => {
    dispatch(
      fetchJobsForCandidate({
        page,
        limit,
        search: debouncedSearch || undefined,
        location: location || undefined,
        type: jobType === "all" ? undefined : jobType,
        experience: experience === "all" ? undefined : experience,
        skills: selectedSkills.length ? selectedSkills : undefined,
      }),
    );
  }, [
    dispatch,
    page,
    debouncedSearch,
    location,
    jobType,
    experience,
    selectedSkills,
  ]);

  const featuredJobs = allJobs.slice(0, 4);

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Jobs
            </h2>
            <p className="text-xl text-gray-600">
              Latest opportunities from top companies
            </p>
          </div>
          <Link
            to={FRONTEND_ROUTES.JOBVIEW}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-md"
          >
            <span>View All Jobs</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {loading && featuredJobs.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border border-gray-100"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-48 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-32" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {featuredJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {featuredJobs.map((job) => {
              const company = job.employer;

              return (
                <Link
                  key={job.id}
                  to={FRONTEND_ROUTES.JOBDETAILS.replace(":id", job.id)}
                  className="block group"
                >
                  <JobCard
                    title={job.title}
                    company={company.companyName}
                    salary={job.salary || "Competitive"}
                    location={job.location}
                    type={job.type}
                    posted={new Date(job.postedDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )}
                    logo={company.logo}
                  />
                </Link>
              );
            })}
          </div>
        )}

        {!loading && featuredJobs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">
              No featured jobs available at the moment.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              New opportunities are posted daily!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedJobsSection;
