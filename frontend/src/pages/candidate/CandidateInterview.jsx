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
  const [autoSubmitting, setAutoSubmitting] = useState(false)
  const [sessionEnded, setSessionEnded] = useState(false)
  const [submittingAssessment, setSubmittingAssessment] = useState(false)

  const [remainingSeconds, setRemainingSeconds] = useState(null)

  const startedAtRef = useRef(null)
  const durationSecondsRef = useRef(null)
  const autoSubmitStartedRef = useRef(false)

  // ------------------------------------------------------------
  // INITIALIZE INTERVIEW
  // ------------------------------------------------------------
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

        const completed = sessionData.session.status === 'COMPLETED'

        setSessionEnded(completed)

        startedAtRef.current = new Date(
          sessionData.session.startedAt,
        ).getTime()

        durationSecondsRef.current = sessionData.session.duration

        // If the backend tells us the session is already complete,
        // don't start a countdown.
        if (completed) {
          setRemainingSeconds(0)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Unable to load this interview.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (interviewId) {
      init()
    }

    return () => {
      cancelled = true
    }
  }, [interviewId])

  // ------------------------------------------------------------
  // COUNTDOWN TIMER
  // ------------------------------------------------------------
  useEffect(() => {
    if (
      !sessionId ||
      !startedAtRef.current ||
      !durationSecondsRef.current ||
      sessionEnded
    ) {
      return
    }

    const tick = () => {
      const elapsedSeconds = Math.max(
        0,
        Math.floor(
          (Date.now() - startedAtRef.current) / 1000,
        ),
      )

      const remaining = Math.max(
        0,
        durationSecondsRef.current - elapsedSeconds,
      )

      setRemainingSeconds(remaining)
    }

    tick()

    const intervalId = window.setInterval(tick, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [sessionId, sessionEnded])

  // ------------------------------------------------------------
  // SEND CANDIDATE MESSAGE
  // ------------------------------------------------------------
  const handleSendMessage = useCallback(
    async (text) => {
      if (
        !sessionId ||
        !activeQuestionId ||
        sending ||
        ending ||
        sessionEnded
      ) {
        return
      }

      setSending(true)
      setError('')

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

        // The backend can tell us that the session expired while
        // this answer was being submitted.
        if (result?.sessionEnded) {
          setMessages((prev) =>
            prev.filter((message) => message.id !== optimisticId),
          )

          setSessionEnded(true)
          setSending(false)

          navigate(`/candidate/results/${interviewId}`)
          return
        }

        setMessages((prev) => [
          ...prev.filter((message) => message.id !== optimisticId),
          mapMessage(result.candidateMessage),
          mapMessage(result.aiMessage),
        ])

        if (
          result.currentQuestionId &&
          result.currentQuestionId !== activeQuestionId
        ) {
          setActiveQuestionId(result.currentQuestionId)
          setViewedQuestionId(result.currentQuestionId)

          const sessionData = await candidateApi.getSession(sessionId)

          setQuestions(
            sessionData.questions.map(mapQuestion),
          )
        } else if (!result.currentQuestionId) {
          const sessionData = await candidateApi.getSession(sessionId)

          setQuestions(
            sessionData.questions.map(mapQuestion),
          )
        }
      } catch (err) {
        setMessages((prev) =>
          prev.filter((message) => message.id !== optimisticId),
        )

        setError(
          err?.message ||
            'Unable to send your message. Please try again.',
        )
      } finally {
        setSending(false)
      }
    },
    [
      sessionId,
      activeQuestionId,
      sending,
      ending,
      sessionEnded,
      interviewId,
      navigate,
    ],
  )

  // ------------------------------------------------------------
  // END INTERVIEW
  // ------------------------------------------------------------
  const handleEndInterview = useCallback(
    async (automatic = false) => {
      if (
        !sessionId ||
        ending ||
        sending ||
        sessionEnded
      ) {
        return
      }

      if (!automatic) {
        const confirmed = window.confirm(
          'Are you sure you want to end this interview? This cannot be undone.',
        )

        if (!confirmed) {
          return
        }
      }

      if (automatic) {
        autoSubmitStartedRef.current = true
        setAutoSubmitting(true)
      }

      setEnding(true)
      setSubmittingAssessment(true)
      setError('')

      try {
        await candidateApi.endInterview(sessionId)

        setSessionEnded(true)

        navigate(`/candidate/results/${interviewId}`)
      } catch (err) {
        if (automatic) {
          autoSubmitStartedRef.current = false
          setAutoSubmitting(false)
        }

        setSubmittingAssessment(false)

        setError(
          err?.message ||
            'Unable to end the interview. Please try again.',
        )
      } finally {
        setEnding(false)
      }
    },
    [
      sessionId,
      ending,
      sending,
      sessionEnded,
      interviewId,
      navigate,
    ],
  )

  // ------------------------------------------------------------
  // AUTOMATIC SUBMISSION WHEN TIMER REACHES ZERO
  // ------------------------------------------------------------
  useEffect(() => {
    if (
      remainingSeconds !== 0 ||
      sessionEnded ||
      autoSubmitStartedRef.current
    ) {
      return
    }

    // If an answer is currently being submitted, wait for it
    // to finish. Because `sending` is a dependency, this effect
    // will run again after sending becomes false.
    if (sending) {
      return
    }

    handleEndInterview(true)
  }, [
    remainingSeconds,
    sessionEnded,
    sending,
    handleEndInterview,
  ])

  // ------------------------------------------------------------
  // SUBMISSION STATE
  // ------------------------------------------------------------
  // Show this screen immediately when the candidate manually ends
  // the interview or when the timer reaches 00:00.
  if (submittingAssessment) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f4f8fc] px-6">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl font-semibold text-green-700">
            ✓
          </div>

          <h1 className="text-3xl font-semibold text-gray-900">
            Thank You for the Attempt
          </h1>

          <p className="mt-4 text-lg text-gray-700">
            Your assessment is being submitted.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Please do not close or refresh this page.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3 text-sm font-semibold text-gray-700">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#285b8f]" />
            Submitting assessment...
          </div>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------------
  // LOADING STATE
  // ------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f4f8fc]">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#285b8f]/30 border-t-[#285b8f]" />
      </div>
    )
  }

  // ------------------------------------------------------------
  // FATAL ERROR STATE
  // ------------------------------------------------------------
  if (error && !sessionId) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-[#f4f8fc] px-6 text-center">
        <p className="max-w-md text-sm text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate('/candidate/interviews')
          }
          className="bg-[#285b8f] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to Interviews
        </button>
      </div>
    )
  }

  // ------------------------------------------------------------
  // TIMER LABEL
  // ------------------------------------------------------------
  const timeLabel =
    remainingSeconds === null
      ? null
      : `${String(
          Math.floor(remainingSeconds / 60),
        ).padStart(2, '0')}:${String(
          remainingSeconds % 60,
        ).padStart(2, '0')}`

  // ------------------------------------------------------------
  // INTERVIEW UI
  // ------------------------------------------------------------
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
        autoSubmitting={autoSubmitting}
      />
    </>
  )
}

export default CandidateInterview