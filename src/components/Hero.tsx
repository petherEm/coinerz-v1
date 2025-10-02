"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Shield, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative h-[80vh] flex items-center overflow-hidden bg-black">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-center h-full">
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-white text-sm font-medium mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Zap className="w-4 h-4 mr-2 text-green-400" />
                Real-time Market Data
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Track Crypto Markets
                <span className="block text-green-400">Like a Pro</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Get real-time cryptocurrency prices, advanced charts, and market
                insights. Make informed trading decisions with our
                professional-grade platform.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-4 text-lg"
                >
                  Start Trading Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10 px-8 py-4 text-lg bg-transparent"
                >
                  View Live Demo
                </Button>
              </motion.div>

              {/* Feature Icons */}
              <motion.div
                className="flex flex-wrap gap-6 text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                  <span>Advanced Charts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span>Secure Trading</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-green-400" />
                  <span>Real-time Data</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="relative hidden lg:block">
            {/* Floating squares background */}
            <div className="absolute inset-0">
              {Array.from({ length: 25 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-green-500/10 border border-green-500/20"
                  style={{
                    width: Math.random() * 80 + 30,
                    height: Math.random() * 80 + 30,
                    left: `${Math.random() * 80}%`,
                    top: `${Math.random() * 90}%`,
                  }}
                  animate={{
                    y: [0, -40, 0],
                    x: [0, Math.random() * 30 - 15, 0],
                    rotate: [0, Math.random() * 15 - 7.5, 0],
                    opacity: [0.1, 0.4, 0.1],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: Math.random() * 3,
                  }}
                />
              ))}
            </div>

            {/* Animated chart bars */}
            <motion.div
              className="relative z-10 flex items-end justify-center space-x-2 h-64 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-gradient-to-t from-green-500/80 to-green-400/60 rounded-t-sm"
                  style={{
                    width: Math.random() * 20 + 15,
                  }}
                  animate={{
                    height: [
                      Math.random() * 100 + 50,
                      Math.random() * 150 + 80,
                      Math.random() * 120 + 60,
                    ],
                  }}
                  transition={{
                    duration: Math.random() * 4 + 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>

            {/* Floating price indicators */}
            <div className="absolute inset-0">
              {[
                {
                  symbol: "BTC",
                  price: "$67,234",
                  change: "+2.4%",
                  x: "20%",
                  y: "15%",
                },
                {
                  symbol: "ETH",
                  price: "$3,456",
                  change: "+1.8%",
                  x: "70%",
                  y: "25%",
                },
                {
                  symbol: "ADA",
                  price: "$0.89",
                  change: "-0.5%",
                  x: "15%",
                  y: "60%",
                },
                {
                  symbol: "SOL",
                  price: "$156",
                  change: "+5.2%",
                  x: "75%",
                  y: "70%",
                },
              ].map((coin, i) => (
                <motion.div
                  key={coin.symbol}
                  className="absolute bg-black/80 border border-green-500/30 rounded-lg p-3 backdrop-blur-sm"
                  style={{ left: coin.x, top: coin.y }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: [0.7, 1, 0.7],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: i * 0.8,
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <div>
                      <div className="text-white font-semibold text-sm">
                        {coin.symbol}
                      </div>
                      <div className="text-green-400 text-xs">{coin.price}</div>
                      <div
                        className={`text-xs ${
                          coin.change.startsWith("+")
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {coin.change}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Animated grid lines */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`line-${i}`}
                  className="absolute h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"
                  style={{ top: `${(i + 1) * 12}%`, width: "100%" }}
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
