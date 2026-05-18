"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ArrowRight,
  Zap,
  BarChart3,
  Users,
  Filter,
  Download,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-card/95 backdrop-blur-sm shadow-lg border-b border-input"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-foreground">LeadFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Features
            </a>
            <a
              href="#stats"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Stats
            </a>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {user ? (
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-primary hover:bg-primary/90">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse top-20 left-10" />
          <div className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse bottom-20 right-10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-block">
              <div className="px-4 py-2 rounded-full bg-card border border-input backdrop-blur-sm">
                <p className="text-sm font-medium text-primary flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  New in 2026: AI-Powered Lead Management
                </p>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Smart Lead Management
                </span>
                <br />
                <span className="text-foreground">Made Simple</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Manage, filter, and track your sales leads with powerful tools
                designed for modern teams. Get results faster.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 rounded-lg shadow-lg"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-lg"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">10K+</p>
                <p className="text-muted-foreground">Active Leads</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">5M+</p>
                <p className="text-muted-foreground">Conversions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">99.9%</p>
                <p className="text-muted-foreground">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative py-24 px-4 sm:px-6 lg:px-8 bg-card"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to manage leads effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Filter,
                title: "Smart Filtering",
                description:
                  "Filter leads by status, source, and custom fields with ease",
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description:
                  "Real-time insights into your lead performance and conversions",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description:
                  "Assign leads to team members and track progress together",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Optimized for speed with instant search and filtering",
              },
              {
                icon: Download,
                title: "CSV Export",
                description: "Export your leads anytime for external analysis",
              },
              {
                icon: TrendingUp,
                title: "Growth Tracking",
                description:
                  "Monitor conversion rates and improve your pipeline",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-xl border border-input bg-background hover:bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg transition-all">
                  <feature.icon className="text-primary-foreground w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Why Teams Choose LeadFlow
                </h2>
                <p className="text-xl text-muted-foreground">
                  Join thousands of successful teams managing their leads
                  smarter
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Streamlined lead management process",
                  "Real-time team collaboration tools",
                  "Advanced filtering and search",
                  "Secure data with 99.9% uptime",
                  "Easy integration with your tools",
                  "24/7 customer support",
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500 shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-2xl p-8 border border-input backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="h-3 bg-input rounded-full w-3/4 animate-pulse" />
                  <div className="h-3 bg-input rounded-full w-full animate-pulse animation-delay-100" />
                  <div className="h-3 bg-input rounded-full w-5/6 animate-pulse animation-delay-200" />
                  <div className="h-32 bg-primary/10 rounded-lg mt-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-foreground">
              Ready to Transform Your Lead Management?
            </h2>
            <p className="text-xl text-muted-foreground">
              Start managing leads like a pro today. No credit card required.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 rounded-lg shadow-lg w-full sm:w-auto"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-lg w-full sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-input py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="text-primary-foreground w-6 h-6" />
              </div>
              <span className="text-lg font-bold text-foreground">
                LeadFlow
              </span>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-foreground">Product</p>
              <div className="space-y-2 text-muted-foreground">
                <a
                  href="#features"
                  className="block hover:text-foreground transition"
                >
                  Features
                </a>
                <a
                  href="#stats"
                  className="block hover:text-foreground transition"
                >
                  Pricing
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-foreground">Company</p>
              <div className="space-y-2 text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition">
                  About
                </a>
                <a href="#" className="block hover:text-foreground transition">
                  Blog
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-foreground">Legal</p>
              <div className="space-y-2 text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition">
                  Privacy
                </a>
                <a href="#" className="block hover:text-foreground transition">
                  Terms
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-input pt-8">
            <p className="text-center text-muted-foreground">
              © 2026 LeadFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animation-delay-100 {
          animation-delay: 100ms;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}
