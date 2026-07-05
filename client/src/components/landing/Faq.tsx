import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const ease = [0.32, 0.72, 0, 1] as const

const RED = '#ea0a1a'
const RED_BRIGHT = '#ff1f2e'

const faqs = [
  {
    question: 'What is the best AI voice translator for online meetings?',
    answer:
      'OneLingo is built for real-time AI voice translation in online meetings, video calls, webinars, sales calls, customer support, and online classes. It supports 70+ languages and works with popular meeting apps.',
  },
  {
    question: 'Does OneLingo work with Zoom, Google Meet, and Microsoft Teams?',
    answer:
      'Yes. OneLingo is designed for Zoom, Google Meet, Microsoft Teams, Webex, and other browser-based meeting workflows, so participants can speak in one language and hear another live.',
  },
  {
    question: 'How many languages does OneLingo support?',
    answer:
      'OneLingo supports 70+ languages and more than 2,000 language pairs, including English, Urdu, Hindi, Spanish, Arabic, French, Portuguese, German, Japanese, Korean, and Chinese.',
  },
  {
    question: 'Who uses real-time AI voice translation?',
    answer:
      'Global teams, creators, educators, sales teams, support teams, and training organizations use real-time voice translation to run multilingual meetings, webinars, live streams, classes, and client calls.',
  },
]

export function Faq() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.12 })

  return (
    <section
      id="faq"
      ref={ref}
      className="relative overflow-hidden px-5 sm:px-6 lg:px-8"
      style={{
        paddingTop: 'clamp(80px, 10vw, 120px)',
        paddingBottom: 'clamp(80px, 9vw, 112px)',
        background: 'linear-gradient(180deg, #050208 0%, #030306 100%)',
      }}
    >
      <div className="relative z-10 mx-auto grid w-full gap-10 lg:grid-cols-[0.9fr_1.35fr] lg:gap-14" style={{ maxWidth: 1080 }}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
        >
          <SectionLabel>FAQ</SectionLabel>
          <h2
            style={{
              marginTop: 18,
              fontFamily: "'Manrope', sans-serif",
              fontSize: 'clamp(32px, 4.6vw, 54px)',
              lineHeight: 1.06,
              letterSpacing: '-0.04em',
              fontWeight: 700,
              color: '#F4F4F5',
              maxWidth: 480,
            }}
          >
            Real-time AI voice translation questions, answered.
          </h2>
          <p
            style={{
              marginTop: 18,
              maxWidth: 420,
              fontSize: 'clamp(15px, 1.4vw, 17px)',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.52)',
              letterSpacing: '-0.01em',
            }}
          >
            The essentials teams look for before using OneLingo for multilingual meetings, sales calls,
            webinars, support, and online education.
          </p>
        </motion.div>

        <div className="grid gap-3">
          {faqs.map((item, index) => (
            <motion.article
              key={item.question}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease, delay: 0.08 + index * 0.06 }}
              style={{
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'linear-gradient(180deg, rgba(12,12,15,0.74), rgba(7,7,10,0.58))',
                padding: '22px 22px 20px',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 'clamp(18px, 2vw, 21px)',
                  lineHeight: 1.25,
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  color: '#FFFFFF',
                }}
              >
                {item.question}
              </h3>
              <p
                style={{
                  marginTop: 10,
                  fontSize: '15px',
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.56)',
                  letterSpacing: '-0.01em',
                }}
              >
                {item.answer}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center"
      style={{
        gap: 8,
        padding: '5px 13px',
        borderRadius: '999px',
        border: '1px solid rgba(234,10,26,0.2)',
        background: 'rgba(234,10,26,0.06)',
      }}
    >
      <span
        style={{ width: 5, height: 5, borderRadius: 999, background: RED_BRIGHT, boxShadow: `0 0 6px ${RED_BRIGHT}` }}
      />
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10.5px',
          fontWeight: 600,
          color: RED,
          letterSpacing: '0.16em',
        }}
      >
        {children}
      </span>
    </div>
  )
}
