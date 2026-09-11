import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import InterviewLayout from '../../components/candidate/interviews/InterviewLayout'
import * as candidateApi from '../../api/candidate.api.js'

const mapQuestion = (question) => ({
  ...question,
  status: candidateApi.toLowerStatus(question.status),
})

const mapMessage = (message) => ({
  id: message.id,
  sender: candidateApi.toChatSender(message.sender),
  message: message.message,
  questionId: message.questionId,
  time: new Date(message.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }),
})

function CandidateInterview() {
  const { id: interviewId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [sessionId, setSessionId] = useState(null)
  const [title, setTitle] = useState('Interview')
  const [questions, setQuestions] = useState([])
  const [activeQuestionId, setActiveQuestionId] = useState(null)
  const [viewedQuestionId, setViewedQuestionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [sending, setSending] = useState(false)
  const [ending, setEnding] = useState(false)
  const [sessionEnded, setSessionEnded] = useState(false)

  const [remainingSeconds, setRemainingSeconds] = useState(null)
  const startedAtRef = useRef(null)
  const durationSecondsRef = useRef(null)
  const autoSubmitStartedRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      setLoading(true)
      setError('')

      try {
        const interview = await candidateApi.getInterview(interviewId)
        if (cancelled) return
        setTitle(interview.title)

        const started = await candidateApi.startInterview(interviewId)
        if (cancelled) return

        const [sessionData, messageData] = await Promise.all([
          candidateApi.getSession(started.sessionId),
          candidateApi.getMessages(started.sessionId),
        ])

        if (cancelled) return

        const mappedQuestions = sessionData.questions.map(mapQuestion)

        setSessionId(started.sessionId)
        setQuestions(mappedQuestions)
        setActiveQuestionId(sessionData.session.currentQuestionId)
        setViewedQuestionId(sessionData.session.currentQuestionId)
        setMessages(messageData.map(mapMessage))
        setSessionEnded(sessionData.session.status === 'COMPLETED')

        startedAtRef.current = new Date(sessionData.session.startedAt).getTime()
        durationSecondsRef.current = sessionData.session.duration
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load this interview.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [interviewId])

  // Countdown timer, derived from session start time + duration.
  useEffect(() => {
    if (!durationSecondsRef.current || sessionEnded) return

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000)
      const remaining = Math.max(0, durationSecondsRef.current - elapsed)
      setRemainingSeconds(remaining)
    }

    tick()
    const interval = setInterval(tick, 1000)

    return () => clearInterval(interval)
  }, [sessionId, sessionEnded])

  const handleSendMessage = useCallback(
    async (text) => {
      if (!sessionId || !activeQuestionId || sending) return

      setSending(true)

      // Optimistically show the candidate's own message right away.
      const optimisticId = `optimistic-${Date.now()}`
      setMessages((prev) => [
        ...prev,
        {
          id: optimisticId,
          sender: 'candidate',
          message: text,
          questionId: activeQuestionId,
          time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ])

      try {
        const result = await candidateApi.sendMessage(sessionId, {
          questionId: activeQuestionId,
          message: text,
        })

        setMessages((prev) => [
          ...prev.filter((m) => m.id !== optimisticId),
          mapMessage(result.candidateMessage),
          mapMessage(result.aiMessage),
        ])

        if (result.currentQuestionId && result.currentQuestionId !== activeQuestionId) {
          setActiveQuestionId(result.currentQuestionId)
          setViewedQuestionId(result.currentQuestionId)

          // Refresh question statuses (one just completed, next is now current).
          const sessionData = await candidateApi.getSession(sessionId)
          setQuestions(sessionData.questions.map(mapQuestion))
        } else if (!result.currentQuestionId) {
          // No more questions left - refresh statuses to show the last one completed.
          const sessionData = await candidateApi.getSession(sessionId)
          setQuestions(sessionData.questions.map(mapQuestion))
        }
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId))
        setError(err.message || 'Unable to send your message. Please try again.')
      } finally {
        setSending(false)
      }
    },
    [sessionId, activeQuestionId, sending],
  )

  const handleEndInterview = useCallback(async (automatic = false) => {
    if (!sessionId || ending) return

    if (!automatic) {
      const confirmed = window.confirm(
        'Are you sure you want to end this interview? This cannot be undone.',
      )
      if (!confirmed) return
    }

    if (automatic) {
      autoSubmitStartedRef.current = true
    }

    setEnding(true)
    setError('')

    try {
      await candidateApi.endInterview(sessionId)
      setSessionEnded(true)
      navigate(`/candidate/results/${interviewId}`)
    } catch (err) {
      if (automatic) {
        autoSubmitStartedRef.current = false
      }
      setError(err.message || 'Unable to end the interview. Please try again.')
    } finally {
      setEnding(false)
    }
  }, [sessionId, ending, interviewId, navigate])

  useEffect(() => {
    if (
      remainingSeconds !== 0 ||
      sessionEnded ||
      sending ||
      autoSubmitStartedRef.current
    ) {
      return
    }

    handleEndInterview(true)
  }, [
    remainingSeconds,
    sessionEnded,
    sending,
    handleEndInterview,
  ])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f4f8fc]">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#285b8f]/30 border-t-[#285b8f]" />
      </div>
    )
  }

  if (error && !sessionId) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-[#f4f8fc] px-6 text-center">
        <p className="max-w-md text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => navigate('/candidate/interviews')}
          className="bg-[#285b8f] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to Interviews
        </button>
      </div>
    )
  }

  const timeLabel =
    remainingSeconds === null
      ? null
      : `${String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:${String(
        remainingSeconds % 60,
      ).padStart(2, '0')}`

  return (
    <>
      {error && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-600 shadow-sm">
          {error}
        </div>
      )}

      <InterviewLayout
        title={title}
        questions={questions}
        activeQuestionId={activeQuestionId}
        viewedQuestionId={viewedQuestionId}
        onQuestionSelect={setViewedQuestionId}
        messages={messages}
        onSendMessage={handleSendMessage}
        sending={sending}
        sessionEnded={sessionEnded}
        timeLabel={timeLabel}
        onEndInterview={handleEndInterview}
        ending={ending}
      />
    </>
  )
}

export default CandidateInterview
