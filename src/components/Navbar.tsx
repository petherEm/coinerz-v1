"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, TrendingUp } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-green-500 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-black" />
            </div>
            <span className="text-white font-bold text-xl">CryptoTracker</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              Market
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              Portfolio
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              News
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-white hover:text-green-400 hover:bg-green-500/10"
            >
              Sign In
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-green-400"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/95 border-t border-green-500/20">
              <a
                href="#"
                className="block px-3 py-2 text-gray-300 hover:text-green-400"
              >
                Home
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-gray-300 hover:text-green-400"
              >
                Market
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-gray-300 hover:text-green-400"
              >
                Portfolio
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-gray-300 hover:text-green-400"
              >
                News
              </a>
              <div className="px-3 py-2 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full text-white hover:text-green-400 hover:bg-green-500/10"
                >
                  Sign In
                </Button>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
