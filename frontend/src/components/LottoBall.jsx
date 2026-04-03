import { motion } from 'framer-motion'

const getBallColor = (num) => {
  if (num <= 10) return 'from-yellow-400 to-yellow-600'
  if (num <= 20) return 'from-blue-400 to-blue-600'
  if (num <= 30) return 'from-red-400 to-red-600'
  if (num <= 40) return 'from-gray-400 to-gray-600'
  return 'from-green-400 to-green-600'
}

const getBallShadow = (num) => {
  if (num <= 10) return 'shadow-yellow-500/50'
  if (num <= 20) return 'shadow-blue-500/50'
  if (num <= 30) return 'shadow-red-500/50'
  if (num <= 40) return 'shadow-gray-500/50'
  return 'shadow-green-500/50'
}

export default function LottoBall({ number, delay = 0, size = 'md', highlight = false }) {
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-14 h-14 text-lg' : 'w-10 h-10 text-sm'

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 15,
        delay: delay
      }}
      whileHover={{ scale: 1.2, rotate: 10 }}
      className={`
        ${sizeClass} rounded-full
        bg-gradient-to-br ${getBallColor(number)}
        flex items-center justify-center
        font-black text-white
        shadow-lg ${getBallShadow(number)}
        cursor-default select-none
        ${highlight ? 'ring-4 ring-yellow-300 ring-offset-2 ring-offset-transparent' : ''}
      `}
    >
      {number}
    </motion.div>
  )
}
