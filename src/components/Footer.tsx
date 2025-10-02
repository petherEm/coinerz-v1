"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Twitter, Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-green-500 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-black" />
              </div>
              <span className="text-white font-bold text-xl">
                CryptoTracker
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              The most trusted cryptocurrency trading platform. Track, analyze,
              and trade digital assets with professional-grade tools.
            </p>
            <div className="flex space-x-4">
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-green-400 hover:bg-green-500/10"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-green-400 hover:bg-green-500/10"
              >
                <Github className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-green-400 hover:bg-green-500/10"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-green-400 hover:bg-green-500/10"
              >
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Products</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Spot Trading
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Futures Trading
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Portfolio Tracker
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Market Analysis
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Mobile App
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Press
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-4">
              Get the latest crypto news and market insights delivered to your
              inbox.
            </p>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
              />
              <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 CryptoTracker. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
