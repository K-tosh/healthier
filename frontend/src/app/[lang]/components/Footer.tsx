"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import { CgWebsite } from "react-icons/cg";
import { FaDiscord } from "react-icons/fa";
import { AiFillTwitterCircle, AiFillYoutube } from "react-icons/ai";

interface FooterLink {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
  social?: string;
}

// Define default arrays for all link sections
const defaultCategoryLinks = [
  { id: 1, url: '/conditions', text: 'Conditions' },
  { id: 2, url: '/symptoms', text: 'Symptoms' },
  { id: 3, url: '/drugs', text: 'Drugs & Supplements' },
  { id: 4, url: '/well-being', text: 'Well-Being' },
];
const defaultMenuLinks = [
  { id: 1, url: '/', text: 'Home', newTab: false },
  { id: 2, url: '/about', text: 'About', newTab: false },
];
const defaultLegalLinks = [
  { id: 1, url: '/privacy', text: 'Privacy Policy', newTab: false },
  { id: 2, url: '/terms', text: 'Terms of Use', newTab: false },
];
const defaultSocialLinks = [
  { id: 1, url: 'https://twitter.com', text: 'Twitter', newTab: true, social: 'TWITTER' },
];

function RenderSocialIcon({ social }: { social: string | undefined }) {
  switch (social) {
    case "WEBSITE":
      return <CgWebsite />;
    case "TWITTER":
      return <AiFillTwitterCircle />;
    case "YOUTUBE":
      return <AiFillYoutube />;
    case "DISCORD":
      return <FaDiscord />;
    default:
      return null;
  }
}

export default function Footer({
  logoUrl = null,
  logoText = "Healthier Kenya",
  menuLinks = defaultMenuLinks,
  categoryLinks = defaultCategoryLinks,
  legalLinks = defaultLegalLinks,
  socialLinks = defaultSocialLinks,
}: {
  logoUrl?: string | null;
  logoText?: string | null;
  menuLinks?: Array<FooterLink>;
  categoryLinks?: Array<any>;
  legalLinks?: Array<FooterLink>;
  socialLinks?: Array<FooterLink>;
} = {}) {
  const path = usePathname();
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Medical Disclaimer Banner */}
      <div className="bg-blue-900 border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3 text-sm text-blue-100">
            <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-center">
              <strong>Medical Disclaimer:</strong> This information is not intended to replace professional medical advice, diagnosis, or treatment. Always consult your doctor.
            </span>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Logo and Description */}
            <div className="md:col-span-1">
              <Logo src={logoUrl}>
                {logoText && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                      {logoText}
                    </h2>
                  </div>
                )}
              </Logo>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Your trusted source for evidence-based health information and medical resources. Committed to providing accurate, up-to-date health content.
              </p>
              
              {/* Trust Badges */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Medically Reviewed Content
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Trusted Health Source
                </div>
              </div>
            </div>

            {/* Health Categories */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Health Topics
              </h3>
              <ul className="space-y-3">
                {(categoryLinks || []).map((link) => (
                  <li key={link.id}>
                    <a 
                      href={link.url} 
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center gap-2 hover:translate-x-1 transform transition-transform"
                    >
                      <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {link.text || link.attributes?.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation Menu */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Quick Links
              </h3>
              <ul className="space-y-3">
                {(menuLinks || []).map((link: FooterLink) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      className={`text-sm transition-colors duration-300 flex items-center gap-2 hover:translate-x-1 transform transition-transform ${
                        path === link.url 
                          ? "text-blue-400 font-medium" 
                          : "text-gray-300 hover:text-blue-400"
                      }`}
                    >
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect & Legal */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Connect With Us
              </h3>
              <div className="flex space-x-4 mb-6">
                {(socialLinks || []).map((link: FooterLink) => {
                  return (
                    <a
                      key={link.id}
                      rel="noopener noreferrer"
                      href={link.url}
                      title={link.text}
                      target={link.newTab ? "_blank" : "_self"}
                      className="w-12 h-12 rounded-xl bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all duration-300 text-gray-300 hover:text-white transform hover:scale-110 shadow-lg"
                    >
                      <RenderSocialIcon social={link.social} />
                    </a>
                  );
                })}
              </div>
              <ul className="space-y-3">
                {(legalLinks || []).map((link: FooterLink) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      className="text-gray-400 hover:text-gray-300 text-sm transition-colors duration-300 flex items-center gap-2 hover:translate-x-1 transform transition-transform"
                    >
                      <svg className="w-3 h-3 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Border and Copyright */}
      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              ©{new Date().getFullYear()} {logoText || "Healthier Kenya"}. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2 md:mt-0 text-center">
              🔒 This information is not intended to replace professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 