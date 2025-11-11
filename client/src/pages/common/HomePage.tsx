import type React from "react";
import {
  Briefcase,
  TrendingUp,
  Star,
  ArrowRight,
  Play,
  Building2,
  Code,
  Palette,
  BarChart3,
  Heart,
  Shield,
  Zap,
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import SearchAppBar from "../../components/common/Search";
import CategoryCard from "../../components/common/CategoryCard";
import JobCard from "../../components/common/JobCard";
import TestimonialCard from "../../components/common/TestimonialCard";
import StatsSection from "../../components/common/StatsSection";

const Homepage: React.FC = () => {
  const jobCategories = [
    { icon: Code, title: "Technology", jobCount: "2,500+", color: "blue" },
    { icon: Palette, title: "Design", jobCount: "1,200+", color: "purple" },
    { icon: BarChart3, title: "Marketing", jobCount: "1,800+", color: "green" },
    { icon: Building2, title: "Business", jobCount: "3,200+", color: "orange" },
    { icon: Heart, title: "Healthcare", jobCount: "900+", color: "pink" },
    { icon: Shield, title: "Finance", jobCount: "1,500+", color: "indigo" },
  ] as const;

  const featuredJobs = [
    {
      title: "Senior React Developer",
      company: "TechCorp Inc.",
      salary: "₹120K - ₹150K",
      location: "San Francisco, CA",
      type: "Full-time",
      posted: "2 days ago",
      logo: "T",
    },
    {
      title: "Product Manager",
      company: "Innovation Labs",
      salary: "₹100K - ₹130K",
      location: "Remote",
      type: "Full-time",
      posted: "1 day ago",
      logo: "I",
    },
    {
      title: "UX Designer",
      company: "Design Studio",
      salary: "₹80K - ₹110K",
      location: "New York, NY",
      type: "Full-time",
      posted: "3 days ago",
      logo: "D",
    },
    {
      title: "Data Scientist",
      company: "Analytics Pro",
      salary: "₹110K - ₹140K",
      location: "Seattle, WA",
      type: "Full-time",
      posted: "1 day ago",
      logo: "A",
    },
  ];

  const testimonials = [
    {
      quote:
        "Talentra helped me find my dream job in just 2 weeks! The platform is intuitive and connects you with amazing opportunities.",
      author: "Sarah Johnson",
      position: "Software Engineer",
      company: "Google",
      rating: 5,
    },
    {
      quote:
        "As a hiring manager, I've found exceptional talent through Talentra. The quality of candidates is outstanding.",
      author: "Michael Chen",
      position: "Head of Talent",
      company: "Microsoft",
      rating: 5,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4 mr-2" />
                #1 Job Portal in 2025
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Talentra
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                Discover your dream career or find exceptional talent. Join
                millions of professionals building their future.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg">
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-4 rounded-xl border border-gray-200 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>

            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-white rounded-2xl p-6 w-80 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <Briefcase className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Find Your Dream Job
                      </h3>
                      <p className="text-gray-600">
                        Join thousands of professionals
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -left-4 bg-white p-3 rounded-2xl shadow-lg animate-bounce">
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-lg animate-pulse">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-16">
          <SearchAppBar />
        </div>
      </section>

      <StatsSection />

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Job Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover opportunities across diverse industries and find the
              perfect role that matches your skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobCategories.map((category, index) => (
              <CategoryCard key={index} {...category} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Featured Jobs
              </h2>
              <p className="text-xl text-gray-600">
                Hand-picked opportunities from top companies
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2">
              <span>View All Jobs</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {featuredJobs.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied professionals who found their perfect
              match through Talentra.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-800 to-indigo-700 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join millions of professionals who trust Talentra to advance their
            careers and build amazing teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white hover:bg-gray-50 text-blue-600 font-semibold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
              Find Jobs
            </button>
            <button className="bg-transparent hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl border-2 border-white transition-all duration-200 transform hover:scale-105">
              Hire Talent
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Homepage;
