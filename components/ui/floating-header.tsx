'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from './button'
import { Logo } from './logo'
import { Menu, X } from 'lucide-react'

interface FloatingHeaderProps {
  className?: string
}

export function FloatingHeader({ className = '' }: FloatingHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  const backdropBlur = useTransform(
    scrollY,
    [0, 50],
    [20, 20] // Keep consistent blur
  )

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobileMenuOpen])

  const navigationItems = [
    { name: 'Features', href: '#features' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ]

  return (
    <>
      <motion.header
        className={`relative z-50 transition-all duration-500 border-b-2 border-charcoal-700/30 ${className}`}
        style={{
          backgroundColor: 'rgba(15, 17, 20, 0.1)',
          backdropFilter: `blur(${backdropBlur}px)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <Logo size="md" animated={true} />
              <motion.span
                className="text-xl font-bold text-charcoal-50"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Clipio
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="nav-item group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.a>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button variant="gradient" size="sm">
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 text-charcoal-300 hover:text-charcoal-100 transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="md:hidden"
          initial={false}
          animate={isMobileMenuOpen ? "open" : "closed"}
          variants={{
            open: { height: "auto", opacity: 1 },
            closed: { height: 0, opacity: 0 }
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="px-4 pb-4 space-y-4 border-t border-charcoal-700/30">
            {navigationItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="block text-charcoal-300 hover:text-charcoal-100 transition-colors duration-300 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {item.name}
              </motion.a>
            ))}
            <div className="pt-4 space-y-3">
              <Button variant="ghost" className="w-full">
                Sign In
              </Button>
              <Button variant="gradient" className="w-full">
                Get Started
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.header>
    </>
  )
}

export default FloatingHeader
