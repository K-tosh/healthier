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
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Logo src={logoUrl}>
            {logoText && (
              <span className="text-2xl font-semibold text-blue-700">
                {logoText}
              </span>
            )}
          </Logo>
        </div>
        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center space-x-6">
          {links.map(({ id, url, text }) => (
            <li key={id}>
              <Link
                href={url}
                className={`text-base font-medium transition-colors px-2 py-1 rounded-md ${
                  pathname === url
                    ? "text-blue-600 font-medium bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
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
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-gray-700" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] sm:w-[300px] bg-white text-black"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-blue-700">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <ul className="space-y-4">
                {links.map(({ id, url, text }) => (
                  <li key={id}>
                    <Link
                      href={url}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block text-base font-medium transition-colors px-2 py-1 rounded-md ${
                        pathname === url
                          ? "text-blue-600 font-medium bg-blue-50"
                          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
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
    </nav>
  );
}
