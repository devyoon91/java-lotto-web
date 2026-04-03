import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BuyStep from './components/BuyStep'
import ResultStep from './components/ResultStep'

export default function App() {
  const [step, setStep] = useState('buy')
  const [buyData, setBuyData] = useState(null)
  const [purchaseAmount, setPurchaseAmount] = useState(0)

  const handleBuyComplete = (data, amount) => {
    setBuyData(data)
    setPurchaseAmount(amount)
    setStep('result')
  }

  const handleReset = () => {
    setBuyData(null)
    setPurchaseAmount(0)
    setStep('buy')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-black shimmer-text mb-2">Lucky Lotto</h1>
          <p className="text-purple-300 text-lg">행운의 번호를 뽑아보세요!</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'buy' ? (
            <motion.div
              key="buy"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <BuyStep onComplete={handleBuyComplete} />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <ResultStep buyData={buyData} purchaseAmount={purchaseAmount} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
