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
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Logo src={logoUrl}>
              {logoText && <h2 className="text-2xl font-bold text-white mb-4">{logoText}</h2>}
            </Logo>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted source for health information and medical resources.
            </p>
          </div>

          {/* Health Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Health Topics</h3>
            <ul className="space-y-2">
              {(categoryLinks || []).map((link) => (
                <li key={link.id}>
                  <a 
                    href={link.url} 
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm"
                  >
                    {link.text || link.attributes?.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Menu */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2">
              {(menuLinks || []).map((link: FooterLink) => (
                <li key={link.id}>
                  <Link
                    href={link.url}
                    className={`text-sm transition-colors duration-200 ${
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
            <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
            <div className="flex space-x-3 mb-6">
              {(socialLinks || []).map((link: FooterLink) => {
                return (
                  <a
                    key={link.id}
                    rel="noopener noreferrer"
                    href={link.url}
                    title={link.text}
                    target={link.newTab ? "_blank" : "_self"}
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors duration-200 text-gray-300 hover:text-white"
                  >
                    <RenderSocialIcon social={link.social} />
                  </a>
                );
              })}
            </div>
            <ul className="space-y-2">
              {(legalLinks || []).map((link: FooterLink) => (
                <li key={link.id}>
                  <Link
                    href={link.url}
                    className="text-gray-400 hover:text-gray-300 text-sm transition-colors duration-200"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Border and Copyright */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              ©{new Date().getFullYear()} {logoText || "Healthier Kenya"}. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2 md:mt-0">
              This information is not intended to replace professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 