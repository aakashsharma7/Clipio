'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { 
  Sparkles, 
  Zap, 
  Users, 
  Share2, 
  Tag, 
  Search, 
  Palette, 
  FolderOpen,
  ArrowRight,
  Play,
  Star,
  CheckCircle,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Github
} from 'lucide-react'
import { FloatingHeader } from '@/components/ui/floating-header'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'

export default function HomePage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Tagging",
      description: "Automatically tag and categorize your design assets using advanced AI algorithms"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Search",
      description: "Find any asset instantly with semantic search and visual similarity matching"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Share collections, collaborate in real-time, and manage team workflows"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Design Feedback",
      description: "Get instant AI-powered design suggestions and feedback on your assets"
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Seamless Integrations",
      description: "Connect with Figma, Adobe, Notion, and other design tools"
    },
    {
      icon: <FolderOpen className="w-6 h-6" />,
      title: "Organized Collections",
      description: "Create thematic collections and organize assets with drag-and-drop ease"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Designer",
      company: "TechCorp",
      content: "Clipio has revolutionized how our team manages design assets. The AI tagging is incredibly accurate!",
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Creative Director",
      company: "Design Studio",
      content: "The collaboration features are game-changing. Our workflow is 3x faster now.",
      avatar: "MR"
    },
    {
      name: "Emily Watson",
      role: "Product Manager",
      company: "StartupXYZ",
      content: "Finally, a tool that understands what designers actually need. Highly recommended!",
      avatar: "EW"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950">
      {/* Floating Header */}
      <FloatingHeader />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent-violet/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-accent-indigo/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-charcoal-50 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Capture. Organize.
              <span className="gradient-text">
                {" "}Inspire.
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-charcoal-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The AI-powered design asset management platform that helps creative teams 
              capture, organize, and discover inspiration faster than ever before.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/dashboard">
                <Button variant="gradient" size="lg" className="text-lg">
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Button 
                variant="glass" 
                size="lg"
                className="text-lg"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div 
              className="flex items-center justify-center space-x-8 text-charcoal-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal-50 mb-6">
              Everything you need to manage design assets
            </h2>
            <p className="text-xl text-charcoal-300 max-w-3xl mx-auto">
              From AI-powered tagging to seamless collaboration, Clipio provides all the tools 
              your creative team needs to stay organized and inspired.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card-glass p-8 hover-lift"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 shadow-charcoal">
                  <div className="text-charcoal-50">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-charcoal-100 mb-4">{feature.title}</h3>
                <p className="text-charcoal-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-charcoal-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal-50 mb-6">
              Loved by creative teams worldwide
            </h2>
            <p className="text-xl text-charcoal-300">
              Join thousands of designers who trust Clipio with their creative workflow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="card-glass p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-charcoal-50 font-bold shadow-charcoal">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-charcoal-100 font-semibold">{testimonial.name}</h4>
                    <p className="text-charcoal-400 text-sm">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                <p className="text-charcoal-300 italic mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal-50 mb-6">
              Ready to transform your design workflow?
            </h2>
            <p className="text-xl text-charcoal-300 mb-8">
              Join thousands of creative professionals who are already using Clipio to 
              organize their design assets and boost their productivity.
            </p>
            <Button variant="gradient" size="lg" className="text-lg">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-charcoal-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Logo size="sm" animated={false} />
                <span className="text-xl font-bold text-charcoal-50">Clipio</span>
              </div>
              <p className="text-charcoal-400">
                The AI-powered design asset management platform for creative teams.
              </p>
            </div>
            
            <div>
              <h3 className="text-charcoal-100 font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-charcoal-400">
                <li><a href="#" className="hover:text-charcoal-100 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-charcoal-100 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-charcoal-100 transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-charcoal-100 transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-charcoal-100 font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-charcoal-400">
                <li><a href="#" className="hover:text-charcoal-100 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-charcoal-100 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-charcoal-100 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-charcoal-100 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-charcoal-100 font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-charcoal-400 hover:text-charcoal-100 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-charcoal-400 hover:text-charcoal-100 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-charcoal-400 hover:text-charcoal-100 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-charcoal-400 hover:text-charcoal-100 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="text-charcoal-400 hover:text-charcoal-100 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-charcoal-800/50 text-center text-charcoal-400">
            <p>&copy; 2025 Clipio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
