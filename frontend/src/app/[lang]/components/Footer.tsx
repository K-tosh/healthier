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
    <footer className="text-white" style={{ backgroundColor: 'var(--healthierke-oxford-blue)' }}>
      {/* Medical Disclaimer Banner */}
      <div className="border-b" style={{ backgroundColor: 'var(--healthierke-rich-black)', borderBottomColor: 'var(--healthierke-vista-blue)' }}>
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

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo and Description */}
            <div className="md:col-span-1">
              <Logo src={logoUrl}>
                {logoText && (
                  <h2 className="text-2xl font-bold text-white mb-6">
                    {logoText}
                  </h2>
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
              <h3 className="text-lg font-semibold text-white mb-6">
                Health Topics
              </h3>
              <ul className="space-y-3">
                {(categoryLinks || []).map((link) => (
                  <li key={link.id}>
                    <a 
                      href={link.url} 
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform transition-transform"
                    >
                      {link.text || link.attributes?.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation Menu */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {(menuLinks || []).map((link: FooterLink) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      className={`text-sm transition-colors duration-300 hover:translate-x-1 transform transition-transform ${
                        path === link.url 
                          ? "text-blue-400 font-medium" 
                          : "text-gray-300 hover:text-blue-400"
                      }`}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect & Legal */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">
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
                      className="text-gray-400 hover:text-gray-300 text-sm transition-colors duration-300 hover:translate-x-1 transform transition-transform"
                    >
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
      <div className="border-t border-gray-700" style={{ backgroundColor: 'var(--healthierke-cetacean-blue)' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
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