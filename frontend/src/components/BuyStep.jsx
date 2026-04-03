import { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../api'
import LottoBall from './LottoBall'

export default function BuyStep({ onComplete }) {
  const [amount, setAmount] = useState('')
  const [manualInput, setManualInput] = useState('')
  const [manualList, setManualList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const maxManual = Math.floor((parseInt(amount) || 0) / 1000)

  const addManual = () => {
    const nums = manualInput.trim().split(/[,\s]+/).map(Number).filter(n => n >= 1 && n <= 45)
    if (nums.length !== 6) { setError('6개의 번호를 입력하세요 (1~45)'); return }
    if (new Set(nums).size !== 6) { setError('중복 번호가 있습니다'); return }
    if (manualList.length >= maxManual) { setError('수동 구매 한도를 초과했습니다'); return }
    setManualList([...manualList, nums.sort((a,b) => a-b)])
    setManualInput('')
    setError('')
  }

  const removeManual = (idx) => setManualList(manualList.filter((_, i) => i !== idx))

  const handleBuy = async () => {
    const purchaseAmount = parseInt(amount)
    if (!purchaseAmount || purchaseAmount < 1000) { setError('최소 1,000원 이상 입력하세요'); return }
    if (purchaseAmount % 1000 !== 0) { setError('1,000원 단위로 입력하세요'); return }
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/api/lotto/buy', {
        purchaseAmount,
        manualNumbers: manualList.map(nums => nums.join(', '))
      })
      onComplete(res.data, purchaseAmount)
    } catch (e) {
      setError('구매 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h2 className="text-2xl font-bold text-white mb-4">구매 금액</h2>
        <div className="flex gap-3">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="금액 입력 (1,000원 단위)"
            className="flex-1 bg-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 outline-none border border-white/30 focus:border-yellow-400 transition-colors"
          />
        </div>
        {amount && parseInt(amount) >= 1000 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-yellow-300 mt-2">
            총 {Math.floor(parseInt(amount)/1000)}장 구매 가능
          </motion.p>
        )}
      </motion.div>

      {maxManual > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            수동 번호 입력
            <span className="text-sm font-normal text-purple-300 ml-2">({manualList.length}/{maxManual})</span>
          </h2>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={manualInput}
              onChange={e => setManualInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addManual()}
              placeholder="예: 1, 2, 3, 4, 5, 6"
              className="flex-1 bg-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 outline-none border border-white/30 focus:border-yellow-400 transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addManual}
              className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              추가
            </motion.button>
          </div>
          <div className="space-y-3">
            {manualList.map((nums, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 flex-wrap"
              >
                <span className="text-white/60 text-sm w-6">{idx+1}.</span>
                {nums.map((n, i) => <LottoBall key={i} number={n} delay={i * 0.05} size="sm" />)}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeManual(idx)}
                  className="ml-auto text-red-400 hover:text-red-300 text-xl"
                >x</motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-center">
          {error}
        </motion.p>
      )}

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleBuy}
        disabled={loading || !amount}
        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 disabled:opacity-50 text-gray-900 font-black text-xl py-4 rounded-2xl shadow-lg shadow-orange-500/30 transition-all"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block">⚙</motion.span>
            구매 중...
          </span>
        ) : '로또 구매하기!'}
      </motion.button>
    </div>
  )
}
