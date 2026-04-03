import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api'
import confetti from 'canvas-confetti'
import LottoBall from './LottoBall'

const RANK_LABELS = {
  FIRST:  { label: '1등', prize: '20억원', emoji: '🥇' },
  SECOND: { label: '2등', prize: '3천만원', emoji: '🥈' },
  THIRD:  { label: '3등', prize: '150만원', emoji: '🥉' },
  FOURTH: { label: '4등', prize: '5만원',  emoji: '🎖' },
  FIFTH:  { label: '5등', prize: '5천원',  emoji: '🍀' },
  MISS:   { label: '꽝',  prize: '0원',    emoji: '😢' },
}

function fireConfetti() {
  const duration = 3000
  const end = Date.now() + duration
  const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']
  ;(function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors })
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

export default function ResultStep({ buyData, purchaseAmount, onReset }) {
  const [winningInput, setWinningInput] = useState('')
  const [bonusInput, setBonusInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showLottos, setShowLottos] = useState(false)

  useEffect(() => { setTimeout(() => setShowLottos(true), 300) }, [])

  const handleCheck = async () => {
    const bonus = parseInt(bonusInput)
    if (!winningInput.trim()) { setError('당첨 번호를 입력하세요'); return }
    if (!bonus || bonus < 1 || bonus > 45) { setError('보너스 번호를 입력하세요 (1~45)'); return }
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/api/lotto/result', {
        lottos: buyData.lottos.map(l => l.numbers),
        winningNumbers: winningInput,
        bonusNumber: bonus,
        purchaseAmount
      })
      setResult(res.data)
      const hasWin = res.data.statistics.some(s => s.rank !== 'MISS' && s.winCount > 0)
      if (hasWin) setTimeout(fireConfetti, 500)
    } catch (e) {
      setError('결과 확인 중 오류가 발생했습니다')
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">
            구매한 로또 <span className="text-yellow-300">{buyData?.totalCount}장</span>
          </h2>
          <span className="text-purple-300 text-sm">자동 {buyData?.autoCount} / 수동 {buyData?.manualCount}</span>
        </div>
        <AnimatePresence>
          {showLottos && buyData?.lottos.map((lotto, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="flex items-center gap-2 mb-3 flex-wrap"
            >
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                lotto.autoGeneration ? 'bg-blue-500/30 text-blue-300' : 'bg-purple-500/30 text-purple-300'
              }`}>
                {lotto.autoGeneration ? '자동' : '수동'}
              </span>
              {lotto.numbers.map((n, i) => (
                <LottoBall key={i} number={n} delay={idx * 0.08 + i * 0.04} size="sm" />
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h2 className="text-2xl font-bold text-white mb-4">당첨 번호 입력</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={winningInput}
            onChange={e => setWinningInput(e.target.value)}
            placeholder="당첨 번호 6개 (예: 1, 2, 3, 4, 5, 6)"
            className="w-full bg-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 outline-none border border-white/30 focus:border-yellow-400 transition-colors"
          />
          <input
            type="number"
            value={bonusInput}
            onChange={e => setBonusInput(e.target.value)}
            placeholder="보너스 번호 (1~45)"
            className="w-full bg-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 outline-none border border-white/30 focus:border-yellow-400 transition-colors"
          />
        </div>
      </motion.div>

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-center">
          {error}
        </motion.p>
      )}

      {!result && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCheck}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:opacity-50 text-white font-black text-xl py-4 rounded-2xl shadow-lg shadow-purple-500/30 transition-all"
        >
          {loading ? '확인 중...' : '당첨 확인하기!'}
        </motion.button>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4 text-center">당첨 결과</h2>
            <div className="space-y-3 mb-6">
              {result.statistics.filter(s => s.rank !== 'MISS').map((stat, idx) => {
                const info = RANK_LABELS[stat.rank] || {}
                return (
                  <motion.div
                    key={stat.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      stat.winCount > 0 ? 'bg-yellow-400/20 border border-yellow-400/50' : 'bg-white/5'
                    }`}
                  >
                    <span className="text-2xl">{info.emoji}</span>
                    <div className="flex-1 ml-3">
                      <p className="text-white font-bold">{info.label}</p>
                      <p className="text-white/60 text-sm">{stat.matchCount}개 일치{stat.bonusMatch ? ' + 보너스' : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-300 font-bold">{info.prize}</p>
                      <p className="text-white font-black text-lg">{stat.winCount}개</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`text-center p-4 rounded-xl ${
                result.profit ? 'bg-green-400/20 border border-green-400/50' : 'bg-red-400/20 border border-red-400/50'
              }`}
            >
              <p className="text-white/70 mb-1">수익률</p>
              <p className={`text-4xl font-black ${
                result.profit ? 'text-green-300' : 'text-red-300'
              }`}>
                {(result.profitRate * 100).toFixed(0)}%
              </p>
              <p className="text-white/60 mt-1">
                총 당첨금: {result.totalPrize.toLocaleString()}원
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onReset}
        className="w-full bg-white/10 hover:bg-white/20 text-white font-bold text-lg py-3 rounded-2xl border border-white/20 transition-all"
      >
        다시 구매하기
      </motion.button>
    </div>
  )
}
