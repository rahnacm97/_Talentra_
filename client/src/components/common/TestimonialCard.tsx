import React, { useState } from "react";
import { Star, Quote } from "lucide-react";

// Testimonial Component
const TestimonialCard = ({ quote, author, position, company, rating }) => (
  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 relative">
    <div className="absolute -top-4 left-8">
      <div className="bg-blue-600 p-3 rounded-full">
        <Quote className="w-6 h-6 text-white" />
      </div>
    </div>

    <div className="pt-6">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
          />
        ))}
      </div>

      <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
        "{quote}"
      </p>

      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
          {author.charAt(0)}
        </div>
        <div className="ml-4">
          <p className="font-bold text-gray-900">{author}</p>
          <p className="text-gray-600 text-sm">
            {position} at {company}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default TestimonialCard;
