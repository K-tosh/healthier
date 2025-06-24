// ./frontend/src/app/[lang]/components/Navbar.tsx

"use client";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaChevronDown, FaChevronRight, FaSearch } from "react-icons/fa";

const DISEASES_CATEGORIES = [
  {
    title: "Infectious Diseases",
    examples: [
      "Malaria", "HIV/AIDS", "Hepatitis B", "Malaria", "Tuberculosis", "Typhoid Fever"
    ]
  },
  {
    title: "Mental Health",
    examples: [
      "Anxiety Disorders", "Depression", "Bipolar Disorders", "Post Traumatic Stress Disorder", "Schizophrenia"
    ]
  },
  {
    title: "Women's Health",
    examples: [
      "Endometriosis", "Fibroids", "PCOS", "Menstrual Disorders", "Breast Cancer"
    ]
  },
  {
    title: "Chronic Conditions",
    examples: [
      "Asthma", "Chronic Kidney Disease", "Diabetes Mellitus", "Hypertension", "Heart Disease"
    ]
  }
];

const NAV_LINKS = [
  { id: 1, url: "/diseases-conditions", newTab: false, text: "Diseases & Conditions", dropdown: true },
  { id: 2, url: "/drugs-medications", newTab: false, text: "Drugs & Medications", dropdown: true },
  { id: 3, url: "/symptoms-diagnosis", newTab: false, text: "Symptoms & Diagnosis", dropdown: true },
  { id: 4, url: "/wellness-lifestyle", newTab: false, text: "Wellness & Lifestyle", dropdown: true },
  { id: 5, url: "/health-news", newTab: false, text: "Health News" },
  { id: 6, url: "/contact", newTab: false, text: "Contact" },
];

export default function Navbar({
  links = NAV_LINKS,
  logoUrl = null,
  logoText = "HealthierKE",
}: {
  links?: Array<{ id: number; url: string; newTab: boolean; text: string; dropdown?: boolean }>;
  logoUrl?: string | null;
  logoText?: string | null;
}) {
  const path = usePathname();
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#19224b] text-white w-full border-b border-blue-900">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-extrabold tracking-tight text-white">{logoText}</span>
          </Link>
        </div>
        {/* Main Nav */}
        <ul className="hidden md:flex space-x-2 text-base font-bold uppercase">
          <li
            className="relative"
            onMouseEnter={() => setShowMegaMenu(true)}
            onMouseLeave={() => setShowMegaMenu(false)}
          >
            <button className={`flex items-center gap-1 py-2 px-4 border-b-2 border-transparent hover:border-white hover:text-blue-200 transition ${showMegaMenu ? "border-white" : ""}`}
              style={{ letterSpacing: "0.5px" }}
            >
              Diseases & Conditions <FaChevronDown className="h-3 w-3 ml-1" />
            </button>
            {showMegaMenu && (
              <div className="absolute left-0 top-full mt-2 w-[900px] bg-white text-[#19224b] shadow-2xl rounded-lg p-6 flex z-50 border border-gray-100">
                {DISEASES_CATEGORIES.map((cat, idx) => (
                  <div key={cat.title} className={`flex-1 min-w-[200px] px-4 ${idx < DISEASES_CATEGORIES.length - 1 ? "border-r border-gray-200" : ""} flex flex-col justify-between`}>
                    <div>
                      <h4 className="font-extrabold text-xs text-blue-700 uppercase tracking-wide mb-2 border-b border-gray-200 pb-1">{cat.title}</h4>
                      <ul>
                        {cat.examples.map((ex, i) => (
                          <li key={ex} className={`py-1 flex items-center group cursor-pointer hover:text-blue-700 ${i === 0 ? "font-bold" : "font-normal"}`}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                    {idx === 0 && (
                      <div className="mt-4 pt-2 border-t border-gray-200">
                        <Link href="/diseases-conditions" className="flex items-center font-extrabold text-sm text-[#19224b] hover:text-blue-700">
                          View All Conditions <FaChevronRight className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </li>
          {links.filter(l => l.text !== "Diseases & Conditions").map(link => (
            <li key={link.id} className="relative group">
              <Link
                href={link.url}
                className={`py-2 px-4 border-b-2 border-transparent hover:border-white hover:text-blue-200 transition ${path === link.url ? "border-white" : ""}`}
                style={{ letterSpacing: "0.5px" }}
              >
                {link.text}
                {link.dropdown && <FaChevronDown className="h-3 w-3 ml-1 inline-block" />}
              </Link>
              {/* You can add dropdowns for other menus here if needed */}
            </li>
          ))}
        </ul>
        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <button className="hidden md:inline-block border border-white text-white px-4 py-1 rounded hover:bg-white hover:text-[#19224b] font-bold transition">Subscribe</button>
          <Link href="/login" className="hidden md:inline-block hover:underline font-semibold">Log In</Link>
          <button className="ml-2 hover:text-blue-200">
            <FaSearch className="h-5 w-5" />
          </button>
          {/* Hamburger for mobile */}
          <button className="md:hidden p-2">
            <span className="sr-only">Open menu</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>
    </nav>
  );
}