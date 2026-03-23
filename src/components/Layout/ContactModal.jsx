import { useState } from 'react'
import { MessageSquare, X, Send, Bug, HelpCircle, Lightbulb, CheckCircle, Loader2 } from 'lucide-react'

const WEB3FORMS_KEY = 'b6a6218f-b812-4dd9-a358-26536d4bb141'

const CATEGORIES = [
  { id: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-400' },
  { id: 'question', label: 'Question', icon: HelpCircle, color: 'text-blue-400' },
  { id: 'suggestion', label: 'Suggestion', icon: Lightbulb, color: 'text-amber-400' },
]

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [category, setCategory] = useState('suggestion')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setStatus('sending')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[USII Tracker] ${category.charAt(0).toUpperCase() + category.slice(1)} from visitor`,
          from_name: 'USII Tracker Contact Form',
          email: email.trim() || 'anonymous@visitor.com',
          message: `Category: ${category}\n\n${message}`,
          botcheck: '',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setTimeout(() => {
          setIsOpen(false)
          setStatus('idle')
          setMessage('')
          setEmail('')
          setCategory('suggestion')
        }, 3000)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {/* Floating button — bottom-left, above the bottom bars */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 left-4 z-[1000] flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/30 ring-1 ring-blue-400/30 px-3 py-2.5 sm:px-4 transition-all duration-200 hover:scale-105 cursor-pointer"
          title="Contact Us"
        >
          <MessageSquare size={16} />
          <span className="hidden sm:inline text-xs font-semibold">Contact</span>
        </button>
      )}

      {/* Modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => { if (status !== 'sending') { setIsOpen(false); setStatus('idle') } }}
          />

          {/* Panel */}
          <div className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-xl shadow-2xl animate-[slideUp_0.3s_ease-out]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-blue-400" />
                <h2 className="text-sm font-bold text-gray-100">Contact Us</h2>
              </div>
              <button
                onClick={() => { if (status !== 'sending') { setIsOpen(false); setStatus('idle') } }}
                className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              {status === 'success' ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <CheckCircle size={40} className="text-green-400" />
                  <p className="text-sm font-semibold text-gray-200">Message sent!</p>
                  <p className="text-xs text-gray-500">We'll review it shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Category pills */}
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2 block">Category</label>
                    <div className="flex gap-2">
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon
                        const active = category === cat.id
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            className={`flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                              active
                                ? 'bg-blue-600 border-blue-500 text-white'
                                : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700'
                            }`}
                          >
                            <Icon size={12} className={active ? 'text-white' : cat.color} />
                            {cat.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">
                      Email <span className="text-gray-600 normal-case">(optional, for reply)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-600 px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">Message *</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe the bug, ask a question, or share a suggestion..."
                      rows={4}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-600 px-3 py-2 outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Error message */}
                  {status === 'error' && (
                    <p className="text-xs text-red-400">Something went wrong. Please try again.</p>
                  )}

                  {/* Honeypot — hidden from users, catches bots */}
                  <input type="hidden" name="botcheck" value="" />

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'sending' || !message.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
