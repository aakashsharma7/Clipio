import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

export function Logo({ size = 'md', animated = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8',
    md: 'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10',
    lg: 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16'
  }

  const iconSizes = {
    sm: 'w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6',
    md: 'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8',
    lg: 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12'
  }

  const LogoIcon = () => (
    <img
      src="/logo.ico"
      alt="Logo"
      className={`${iconSizes[size]} object-contain`}
    />
  )

  if (animated) {
    return (
      <motion.div 
        className={`${sizeClasses[size]} bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-charcoal hover:shadow-accent-lg ${className}`}
        whileHover={{ 
          scale: 1.1, 
          rotate: 5,
          boxShadow: "0 0 30px rgba(16, 185, 129, 0.3)"
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 10 
        }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <LogoIcon />
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-charcoal ${className}`}>
      <LogoIcon />
    </div>
  )
}

export default Logo
