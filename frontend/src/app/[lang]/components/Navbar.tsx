"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

interface NavLink {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
}

export default function Navbar({
  links,
  logoUrl,
  logoText,
}: {
  links: Array<NavLink>;
  logoUrl: string | null;
  logoText: string | null;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="border-b border-healthierke-dark-imperial-blue shadow-lg sticky top-0 z-50 backdrop-blur-sm" style={{ backgroundColor: 'var(--healthierke-oxford-blue)' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar with trust indicators */}
        <div className="border-b border-healthierke-dark-imperial-blue py-2" style={{ backgroundColor: 'var(--healthierke-oxford-blue)' }}>
          <div className="flex items-center justify-between text-xs text-gray-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" style={{ color: 'var(--healthierke-vista-blue)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Medically Reviewed
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" style={{ color: 'var(--healthierke-vista-blue)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Evidence-Based
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" style={{ color: 'var(--healthierke-vista-blue)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Trusted Source
              </span>
            </div>
            <div className="text-xs">
              Last Updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
        
        {/* Main navigation */}
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo src={logoUrl}>
              {logoText && (
                <span className="text-2xl font-bold text-white">
                  {logoText}
                </span>
              )}
            </Logo>
          </div>
          
          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center space-x-1">
            {links.map(({ id, url, text }) => (
              <li key={id}>
                <Link
                  href={url}
                  className={`px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 ${
                    pathname === url
                      ? "text-white font-semibold shadow-md border border-healthierke-vista-blue bg-healthierke-dark-imperial-blue"
                      : "text-gray-200 hover:text-white hover:bg-healthierke-dark-imperial-blue hover:shadow-sm"
                  }`}
                >
                  {text}
                </Link>
              </li>
            ))}
          </ul>

        {/* Mobile Nav */}
        <div className="lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-healthierke-dark-imperial-blue transition-all duration-300 hover:scale-110">
                <Menu className="h-6 w-6 text-gray-200" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] sm:w-[350px] bg-white text-black border-l border-gray-200"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <span className="text-lg font-semibold text-gray-900">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Trust indicators for mobile */}
              <div className="mb-6 p-3 rounded-lg border" style={{ backgroundColor: 'var(--healthierke-oxford-blue)', borderColor: 'var(--healthierke-vista-blue)' }}>
                <div className="text-xs font-medium mb-2" style={{ color: 'var(--healthierke-vista-blue)' }}>Trusted Health Information</div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-100">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" style={{ color: 'var(--healthierke-vista-blue)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Medically Reviewed
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" style={{ color: 'var(--healthierke-vista-blue)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Evidence-Based
                  </span>
                </div>
              </div>
              
              <ul className="space-y-2">
                {links.map(({ id, url, text }) => (
                  <li key={id}>
                    <Link
                      href={url}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block text-base font-medium transition-all duration-300 px-4 py-3 rounded-lg transform hover:scale-[1.02] ${
                        pathname === url
                          ? "text-healthierke-oxford-blue font-semibold bg-healthierke-vista-blue/20 border border-healthierke-vista-blue shadow-sm"
                          : "text-gray-700 hover:text-healthierke-oxford-blue hover:bg-healthierke-vista-blue/10 hover:shadow-sm"
                      }`}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
        </div>
      </div>
    </nav>
  );
}
