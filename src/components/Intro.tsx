"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  Shield,
  Smartphone,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export function IntroSection() {
  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Professional-grade charts and technical indicators to analyze market trends and make informed decisions.",
      highlight: "99.9% Uptime",
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description:
        "Your funds and data are protected with enterprise-grade security measures and cold storage solutions.",
      highlight: "256-bit Encryption",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Execute trades in milliseconds with our high-performance infrastructure and real-time market data.",
      highlight: "< 10ms Latency",
    },
    {
      icon: Smartphone,
      title: "Mobile Trading",
      description:
        "Trade on the go with our responsive web app that works seamlessly across all your devices.",
      highlight: "iOS & Android",
    },
    {
      icon: Users,
      title: "Expert Support",
      description:
        "Get help from our team of crypto experts and join a community of successful traders.",
      highlight: "24/7 Support",
    },
    {
      icon: TrendingUp,
      title: "Smart Insights",
      description:
        "AI-powered market analysis and personalized recommendations to maximize your trading potential.",
      highlight: "AI-Powered",
    },
  ];

  return (
    <section className="py-24 bg-background relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 crypto-pattern opacity-30"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-white text-sm font-medium mb-6">
            Why Choose CryptoTracker
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need to
            <span className="block text-green-600">Succeed in Crypto</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From beginners to professional traders, our platform provides the
            tools and insights you need to navigate the cryptocurrency markets
            with confidence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-green-500/30 bg-card/50 backdrop-blur-sm"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                    {feature.highlight}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-green-600 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "500K+", label: "Active Users" },
            { value: "$2.5B+", label: "Trading Volume" },
            { value: "150+", label: "Cryptocurrencies" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
