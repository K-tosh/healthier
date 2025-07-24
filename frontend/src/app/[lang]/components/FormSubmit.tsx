"use client";
import { useState } from "react";
import { getStrapiURL } from "../utils/api-helpers";

export default function FormSubmit({
  placeholder,
  text,
}: {
  placeholder: string;
  text: string;
}) {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const token = process.env.NEXT_PUBLIC_STRAPI_FORM_SUBMISSION_TOKEN;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleSubmit() {
    if (email === "") {
      setErrorMessage("Email cannot be blank.");
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    const res = await fetch(getStrapiURL() + "/api/lead-form-submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: { email } }),
    });

    if (!res.ok) {
      setErrorMessage("Email failed to submit.");
      return;
    }
    setErrorMessage("");
    setSuccessMessage("Email successfully submitted!");
    setEmail("");
  }

  return (
    <div className="w-full">
      {successMessage ? (
        <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-green-700 font-medium">{successMessage}</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder={placeholder}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
              errorMessage 
                ? 'border-red-300 bg-red-50 placeholder-red-400' 
                : 'border-gray-300 bg-white'
            }`}
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {text}
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700 text-sm">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
