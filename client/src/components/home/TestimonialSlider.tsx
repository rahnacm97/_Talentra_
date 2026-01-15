import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchFeaturedFeedback } from "../../thunks/feedback.thunk";
import type { RootState } from "../../app/store";
import { Star, ChevronLeft, ChevronRight, Quote, User } from "lucide-react";

const TestimonialSlider: React.FC = () => {
  const dispatch = useAppDispatch();
  const { featuredFeedbacks, loading } = useAppSelector(
    (state: RootState) => state.feedback,
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchFeaturedFeedback());
  }, [dispatch]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredFeedbacks.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + featuredFeedbacks.length) % featuredFeedbacks.length,
    );
  };

  if (loading && featuredFeedbacks.length === 0) return null;
  if (featuredFeedbacks.length === 0) return null;

  return (
    <section className="py-20 bg-indigo-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Loved by thousands of Professionals
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            See what candidates and employers are saying about their experience
            with Talentra.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Background Decoration */}
          <div className="absolute -top-10 -left-10 text-indigo-200">
            <Quote size={120} />
          </div>

          <div className="relative bg-white rounded-3xl shadow-xl p-8 md:p-12 overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {featuredFeedbacks.map((item) => (
                <div key={item.id} className="w-full flex-shrink-0">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                    <div className="flex-shrink-0">
                      {typeof item.userId === "object" &&
                      item.userId.profileImage ? (
                        <img
                          src={item.userId.profileImage}
                          alt={item.userId.name}
                          className="w-24 h-24 rounded-2xl object-cover shadow-lg border-4 border-indigo-50"
                        />
                      ) : item.userAvatar ? (
                        <img
                          src={item.userAvatar}
                          alt={item.userName}
                          className="w-24 h-24 rounded-2xl object-cover shadow-lg border-4 border-indigo-50"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-indigo-100 flex items-center justify-center shadow-lg border-4 border-indigo-50">
                          <User size={40} className="text-indigo-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-center md:justify-start gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            className={`${
                              item.rating >= star
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-medium mb-8 italic">
                        "{item.comment}"
                      </p>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          {typeof item.userId === "object"
                            ? item.userId.name
                            : item.userName}
                        </h4>
                        <p className="text-indigo-600 font-medium uppercase tracking-wider text-sm mt-1">
                          {item.userType} • Talentra User
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12">
            <button
              onClick={prevSlide}
              className="p-3 bg-white rounded-full shadow-lg text-gray-600 hover:text-indigo-600 hover:scale-110 transition-all focus:outline-none border border-gray-100"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12">
            <button
              onClick={nextSlide}
              className="p-3 bg-white rounded-full shadow-lg text-gray-600 hover:text-indigo-600 hover:scale-110 transition-all focus:outline-none border border-gray-100"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {featuredFeedbacks.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  currentIndex === index
                    ? "w-8 bg-indigo-600"
                    : "w-2.5 bg-indigo-200 hover:bg-indigo-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
