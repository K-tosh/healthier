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
      "Malaria", "HIV/AIDS", "Hepatitis B", "Tuberculosis", "Typhoid Fever"
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

type Category = {
  title: string;
  examples: string[];
};

const MEGAMENUS: Record<string, Category[]> = {
  "Diseases & Conditions": DISEASES_CATEGORIES,
  "Drugs & Medications": [
    {
      title: "Drug Classes",
      examples: ["Antibiotics", "Analgesics", "Antidepressants", "Antihypertensives", "Antivirals"]
    },
    {
      title: "Common Medications",
      examples: ["Paracetamol", "Ibuprofen", "Amoxicillin", "Metformin", "Amlodipine"]
    },
    {
      title: "Usage & Safety",
      examples: ["Dosage Info", "Side Effects", "Interactions", "Pregnancy Safety", "Storage"]
    }
  ],
  "Symptoms & Diagnosis": [
    {
      title: "Common Symptoms",
      examples: ["Fever", "Cough", "Headache", "Fatigue", "Nausea"]
    },
    {
      title: "Diagnostic Tools",
      examples: ["Blood Tests", "Imaging", "Physical Exam", "Questionnaires", "Screenings"]
    },
    {
      title: "When to See a Doctor",
      examples: ["Emergency Signs", "Persistent Symptoms", "Self-Assessment", "Red Flags", "Follow-up"]
    }
  ],
  "Wellness & Lifestyle": [
    {
      title: "Healthy Living",
      examples: ["Nutrition", "Exercise", "Sleep", "Stress Management", "Hydration"]
    },
    {
      title: "Preventive Care",
      examples: ["Vaccinations", "Screenings", "Check-ups", "Healthy Habits", "Mental Wellness"]
    },
    {
      title: "Lifestyle Tips",
      examples: ["Work-Life Balance", "Healthy Aging", "Travel Health", "Family Wellness", "Community Support"]
    }
  ]
};

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
  const [openMegaMenu, setOpenMegaMenu] = useState<string | null>(null);

  console.log("Navbar links:", links);

  const MEGAMENU_KEYS = [
    "Diseases & Conditions",
    "Drugs & Medications",
    "Symptoms & Diagnosis",
    "Wellness & Lifestyle"
  ];

  const effectiveLinks = links.filter(l => !l.newTab);

  return (
    <nav className="sticky top-0 z-50 bg-[#19224b] text-white w-full border-b border-blue-900">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-extrabold tracking-tight text-white" style={{ fontFamily: "'Source Sans Pro', 'Proxima Nova', sans-serif" }}>{logoText}</span>
          </Link>
        </div>
        {/* Main Nav */}
        <ul className="hidden md:flex flex-1 justify-center space-x-2 text-[1.08rem] font-bold uppercase tracking-wide items-center ml-6" style={{ fontFamily: "'Source Sans Pro', 'Proxima Nova', sans-serif" }}>
          {effectiveLinks
            .filter(l => l.text !== 'Health News' && l.text !== 'Contact')
            .filter(l => MEGAMENU_KEYS.some(key => l.text.trim().toLowerCase() === key.toLowerCase()))
            .map(link => (
              <li
                key={link.id}
            className="relative"
                onMouseEnter={() => setOpenMegaMenu(link.text)}
                onMouseLeave={() => setOpenMegaMenu(null)}
          >
                <button className={`flex items-center gap-2 py-4 px-4 border-b-2 border-transparent hover:border-white hover:text-blue-200 transition-all duration-150 whitespace-nowrap ${openMegaMenu === link.text ? "border-white" : ""}`}
                  style={{ letterSpacing: "0.5px", fontFamily: "'Source Sans Pro', 'Proxima Nova', sans-serif" }}
            >
                  {link.text} <FaChevronDown className="h-4 w-4 ml-1" />
            </button>
                {openMegaMenu === link.text && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 max-w-[90vw] w-[900px] bg-white text-[#19224b] shadow-2xl rounded-lg p-6 flex z-50 border border-gray-100"
                    style={{ right: 'auto', left: '50%', transform: 'translateX(-50%)' }}
                  >
                    {MEGAMENUS[link.text]?.map((cat: Category, idx: number) => (
                      <div key={cat.title} className={`flex-1 min-w-[200px] px-4 ${idx < MEGAMENUS[link.text].length - 1 ? "border-r border-gray-200" : ""} flex flex-col justify-between`}>
                    <div>
                          <h4 className="font-extrabold text-lg text-blue-800 uppercase tracking-wide mb-2 border-b border-gray-200 pb-2" style={{ fontFamily: "'Source Sans Pro', 'Proxima Nova', sans-serif" }}>{cat.title}</h4>
                      <ul>
                            {cat.examples.map((ex: string, i: number) => (
                              <li key={ex} className="py-2 flex items-center group cursor-pointer text-[0.98rem] font-normal hover:text-blue-700 transition-colors duration-150 border-b border-gray-200 last:border-b-0" style={{ fontFamily: "'Source Sans Pro', 'Proxima Nova', sans-serif" }}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                    {idx === 0 && (
                          <div className="mt-4 pt-2 border-t border-gray-200 flex justify-end">
                            <Link href={link.url} className="flex items-center font-bold text-sm text-blue-600 hover:underline transition-colors" style={{ fontFamily: "'Source Sans Pro', 'Proxima Nova', sans-serif" }}>
                              View All <FaChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </li>
            ))}
          {effectiveLinks
            .filter(l => l.text !== 'Health News' && l.text !== 'Contact')
            .filter(l => !MEGAMENU_KEYS.some(key => l.text.trim().toLowerCase() === key.toLowerCase()))
            .map(link => (
              <li key={link.id} className="relative group flex items-center">
              <Link
                href={link.url}
                  className={`py-4 px-4 border-b-2 border-transparent hover:border-white hover:text-blue-200 transition-all duration-150 whitespace-nowrap flex items-center ${path === link.url ? "border-white" : ""}`}
                  style={{ letterSpacing: "0.5px", fontFamily: "'Source Sans Pro', 'Proxima Nova', sans-serif" }}
              >
                  {link.text === 'Health News' ? 'health news' : link.text === 'Contact' ? 'contact' : link.text}
              </Link>
            </li>
          ))}
        </ul>
        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <button className="border border-white text-white px-4 py-1 rounded hover:bg-white hover:text-[#19224b] font-bold transition" style={{ fontFamily: "'Source Sans Pro', 'Proxima Nova', sans-serif" }}>Subscribe</button>
          <Link href="/login" className="hover:underline font-semibold text-white" style={{ fontFamily: "'Source Sans Pro', 'Proxima Nova', sans-serif" }}>Log In</Link>
          <button className="ml-2 hover:text-blue-200 text-white">
            <FaSearch className="h-5 w-5" />
          </button>
        </div>
          {/* Hamburger for mobile */}
        <button className="md:hidden p-2 ml-2">
            <span className="sr-only">Open menu</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
      </div>
    </nav>
  );
}