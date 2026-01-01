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
import SearchAppBar from "../../components/common/home/Search";
import { HistoryLock } from "../../components/common/auth/AuthRouteGuard";
import CategoryCard from "../../components/common/home/CategoryCard";
import StatsSection from "../../components/common/home/StatsSection";
import FeaturedJobsSection from "../../components/common/home/FeaturedJobs";
import TestimonialSlider from "../../components/home/TestimonialSlider";

const Homepage: React.FC = () => {
  const jobCategories = [
    { icon: Code, title: "Technology", jobCount: "2,500+", color: "blue" },
    { icon: Palette, title: "Design", jobCount: "1,200+", color: "purple" },
    { icon: BarChart3, title: "Marketing", jobCount: "1,800+", color: "green" },
    { icon: Building2, title: "Business", jobCount: "3,200+", color: "orange" },
    { icon: Heart, title: "Healthcare", jobCount: "900+", color: "pink" },
    { icon: Shield, title: "Finance", jobCount: "1,500+", color: "indigo" },
  ] as const;

  return (
    <div className="bg-gray-50 min-h-screen">
      <HistoryLock />
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

      <FeaturedJobsSection />

      <TestimonialSlider />

      <Footer />
    </div>
  );
};

export default Homepage;
