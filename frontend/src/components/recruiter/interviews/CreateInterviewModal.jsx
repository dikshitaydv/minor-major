import { useEffect, useMemo, useState } from 'react'
import { createInterview } from '../../../api/interview.api.js'
import { getRecruiterQuestions } from '../../../api/question.api.js'

function CreateInterviewModal({ onClose, onSuccess }) {
    const [title, setTitle] = useState('')
    const [type, setType] = useState('Technical Interview')
    const [company, setCompany] = useState('')
    const [candidateId, setCandidateId] = useState('')
    const [scheduledAt, setScheduledAt] = useState('')
    const [focusAreas, setFocusAreas] = useState([])

    const [questions, setQuestions] = useState([])
    const [selectedQuestions, setSelectedQuestions] = useState([])

    const [difficulty, setDifficulty] = useState('ALL')
    const [showDifficultyMenu, setShowDifficultyMenu] =
        useState(false)

    const [loadingQuestions, setLoadingQuestions] =
        useState(false)

    const [questionError, setQuestionError] =
        useState(null)

    const [currentPage, setCurrentPage] = useState(1)

    const [creating, setCreating] = useState(false)
    const [error, setError] = useState(null)

    const QUESTIONS_PER_PAGE = 5


    // ============================================================
    // FETCH QUESTIONS FROM THE BACKEND QUESTION BANK
    // ============================================================

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoadingQuestions(true)
                setQuestionError(null)

                const questionList = await getRecruiterQuestions(
                    difficulty === 'ALL' ? undefined : difficulty,
                )

                setQuestions(questionList || [])

                setCurrentPage(1)
            } catch (error) {
                console.error(
                    'Question fetch error:',
                    error,
                )

                setQuestionError(error.message)
            } finally {
                setLoadingQuestions(false)
            }
        }

        fetchQuestions()
    }, [difficulty])


    // ============================================================
    // NORMALIZE QUESTION DATA
    // ============================================================

    const normalizedQuestions = useMemo(() => {
        return questions.map((question) => ({
            id:
                question.questionFrontendId ||
                question.id ||
                question.titleSlug ||
                question.title,

            title:
                question.title ||
                'Untitled Question',

            slug:
                question.titleSlug ||
                question.slug ||
                '',

            difficulty:
                question.difficulty ||
                'UNKNOWN',

            topics:
                question.topicTags ||
                question.tags ||
                [],
        }))
    }, [questions])


    // ============================================================
    // PAGINATION
    // ============================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            normalizedQuestions.length /
            QUESTIONS_PER_PAGE,
        ),
    )

    const paginatedQuestions =
        normalizedQuestions.slice(
            (currentPage - 1) * QUESTIONS_PER_PAGE,
            currentPage * QUESTIONS_PER_PAGE,
        )


    // ============================================================
    // SELECT / REMOVE QUESTION
    // ============================================================

    const toggleQuestion = (question) => {
        setSelectedQuestions((previous) => {
            const exists = previous.some(
                (item) => item.id === question.id,
            )

            if (exists) {
                return previous.filter(
                    (item) => item.id !== question.id,
                )
            }

            return [
                ...previous,
                {
                    ...question,
                    time: 10,
                },
            ]
        })
    }


    // ============================================================
    // UPDATE QUESTION TIMER
    // ============================================================

    const updateQuestionTime = (
        questionId,
        value,
    ) => {
        const time = Number(value)

        setSelectedQuestions((previous) =>
            previous.map((question) =>
                question.id === questionId
                    ? {
                        ...question,
                        time:
                            Number.isNaN(time) || time < 1
                                ? 1
                                : time,
                    }
                    : question,
            ),
        )
    }


    // ============================================================
    // TOTAL TIME
    // ============================================================

    const totalTime = selectedQuestions.reduce(
        (total, question) =>
            total + Number(question.time || 0),
        0,
    )


    // ============================================================
    // DIFFICULTY COLOR
    // ============================================================

    const getDifficultyClass = (difficulty) => {
        if (difficulty === 'EASY') {
            return 'bg-emerald-50 text-emerald-600'
        }

        if (difficulty === 'MEDIUM') {
            return 'bg-amber-50 text-amber-600'
        }

        if (difficulty === 'HARD') {
            return 'bg-red-50 text-red-600'
        }

        return 'bg-slate-100 text-slate-500'
    }


    // ============================================================
    // CREATE INTERVIEW
    // ============================================================

    const handleCreateInterview = async (event) => {
        event.preventDefault()

        if (!title.trim() || !candidateId.trim() || !scheduledAt) {
            setError('Title, candidate ID, and schedule are required.')
            return
        }

        try {
            setCreating(true)
            setError(null)

            const payload = {
                title: title.trim(),
                type,
                company: company.trim() || undefined,
                focusAreas,
                scheduledAt: new Date(scheduledAt).toISOString(),
                duration: totalTime,
                candidateId: candidateId.trim(),
                questionIds: selectedQuestions.map(
                    (question) => question.id,
                ),
            }

            await createInterview(payload)

            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Create interview error:', error)
            setError(
                error.message ||
                'Failed to create interview',
            )
        } finally {
            setCreating(false)
        }
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#07111f]/40 p-4">

            <div className="my-8 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden bg-white shadow-2xl">


                {/* =====================================================
            HEADER
        ====================================================== */}

                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">

                    <div>

                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3972a7]">
                            Recruiter Dashboard
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-[#17324f]">
                            Create Interview
                        </h2>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <CloseIcon />
                    </button>

                </div>


                {/* =====================================================
            CONTENT
        ====================================================== */}

                <form
                    onSubmit={handleCreateInterview}
                    className="min-h-0 flex-1 overflow-y-auto"
                >

                    <div className="space-y-8 p-6">


                        {/* =================================================
                BASIC DETAILS
            ================================================== */}

                        <section>

                            <SectionTitle>
                                Interview Details
                            </SectionTitle>


                            <div className="mt-4 grid gap-4 md:grid-cols-2">

                                <Field
                                    label="Interview Title"
                                    required
                                >

                                    <input
                                        value={title}
                                        onChange={(event) =>
                                            setTitle(event.target.value)
                                        }
                                        placeholder="Technical Interview"
                                        className="Input"
                                    />

                                </Field>


                                <Field label="Interview Type">

                                    <select
                                        value={type}
                                        onChange={(event) =>
                                            setType(event.target.value)
                                        }
                                        className="Input"
                                    >
                                        <option>
                                            Technical Interview
                                        </option>

                                        <option>
                                            Coding Interview
                                        </option>

                                        <option>
                                            DSA Interview
                                        </option>

                                    </select>

                                </Field>


                                <Field label="Company">

                                    <input
                                        value={company}
                                        onChange={(event) =>
                                            setCompany(event.target.value)
                                        }
                                        placeholder="Optional"
                                        className="Input"
                                    />

                                </Field>


                                <Field
                                    label="Candidate ID"
                                    required
                                >

                                    <input
                                        value={candidateId}
                                        onChange={(event) =>
                                            setCandidateId(event.target.value)
                                        }
                                        placeholder="Enter candidate ID"
                                        className="Input"
                                    />

                                </Field>


                                <Field
                                    label="Schedule"
                                    required
                                >

                                    <input
                                        type="datetime-local"
                                        value={scheduledAt}
                                        onChange={(event) =>
                                            setScheduledAt(
                                                event.target.value,
                                            )
                                        }
                                        className="Input"
                                    />

                                </Field>


                                <Field label="Focus Area">

                                    <select
                                        value=""
                                        onChange={(event) => {
                                            const value =
                                                event.target.value

                                            if (
                                                value &&
                                                !focusAreas.includes(value)
                                            ) {
                                                setFocusAreas([
                                                    ...focusAreas,
                                                    value,
                                                ])
                                            }
                                        }}
                                        className="Input"
                                    >

                                        <option value="">
                                            Select topic
                                        </option>

                                        <option value="Arrays">
                                            Arrays
                                        </option>

                                        <option value="Strings">
                                            Strings
                                        </option>

                                        <option value="Trees">
                                            Trees
                                        </option>

                                        <option value="Graphs">
                                            Graphs
                                        </option>

                                        <option value="Dynamic Programming">
                                            Dynamic Programming
                                        </option>

                                        <option value="Binary Search">
                                            Binary Search
                                        </option>

                                    </select>

                                </Field>

                            </div>


                            {/* Selected Topics */}

                            {focusAreas.length > 0 && (

                                <div className="mt-3 flex flex-wrap gap-2">

                                    {focusAreas.map((area) => (

                                        <button
                                            key={area}
                                            type="button"
                                            onClick={() =>
                                                setFocusAreas(
                                                    focusAreas.filter(
                                                        (item) =>
                                                            item !== area,
                                                    ),
                                                )
                                            }
                                            className="flex items-center gap-2 bg-[#edf5fc] px-3 py-1.5 text-[10px] font-semibold text-[#3972a7]"
                                        >

                                            {area}

                                            <span className="text-xs">
                                                ×
                                            </span>

                                        </button>

                                    ))}

                                </div>

                            )}

                        </section>


                        {/* =================================================
                SELECTED QUESTIONS
            ================================================== */}

                        <section className="border border-slate-200">

                            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">

                                <div>

                                    <SectionTitle>
                                        Selected Questions
                                    </SectionTitle>

                                    <p className="mt-1 text-[10px] text-slate-400">
                                        Add individual time limits for
                                        each question.
                                    </p>

                                </div>


                                <div className="text-right">

                                    <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                        Total Time
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-[#17324f]">
                                        {totalTime} min
                                    </p>

                                </div>

                            </div>


                            {selectedQuestions.length === 0 ? (

                                <div className="px-5 py-8 text-center">

                                    <p className="text-xs text-slate-400">
                                        No questions selected yet.
                                    </p>

                                </div>

                            ) : (

                                <div className="divide-y divide-slate-100">

                                    {selectedQuestions.map(
                                        (question, index) => (

                                            <div
                                                key={question.id}
                                                className="flex items-center gap-4 px-5 py-4"
                                            >

                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#edf5fc] text-[10px] font-bold text-[#3972a7]">
                                                    {index + 1}
                                                </span>


                                                <div className="min-w-0 flex-1">

                                                    <p className="truncate text-xs font-semibold text-slate-700">
                                                        {question.title}
                                                    </p>

                                                    <span
                                                        className={`mt-1 inline-block px-2 py-0.5 text-[9px] font-semibold ${getDifficultyClass(
                                                            question.difficulty,
                                                        )}`}
                                                    >
                                                        {question.difficulty}
                                                    </span>

                                                </div>


                                                <div className="flex items-center gap-2">

                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={question.time}
                                                        onChange={(event) =>
                                                            updateQuestionTime(
                                                                question.id,
                                                                event.target.value,
                                                            )
                                                        }
                                                        className="w-16 border border-slate-200 px-2 py-2 text-center text-xs outline-none focus:border-[#8eb9df]"
                                                    />

                                                    <span className="text-[10px] text-slate-400">
                                                        min
                                                    </span>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleQuestion(question)
                                                        }
                                                        className="ml-2 text-sm text-slate-400 hover:text-red-500"
                                                    >
                                                        ×
                                                    </button>

                                                </div>

                                            </div>

                                        ),
                                    )}

                                </div>

                            )}

                        </section>


                        {/* =================================================
                QUESTION LIBRARY
            ================================================== */}

                        <section className="border border-slate-200">


                            {/* Header */}

                            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                                <div>

                                    <SectionTitle>
                                        Question Library
                                    </SectionTitle>

                                    <p className="mt-1 text-[10px] text-slate-400">
                                        Select questions for this
                                        interview.
                                    </p>

                                </div>


                                {/* Difficulty Filter */}

                                <div className="relative">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowDifficultyMenu(
                                                !showDifficultyMenu,
                                            )
                                        }
                                        className="flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                                        title="Filter difficulty"
                                    >
                                        <SortIcon />
                                    </button>


                                    {showDifficultyMenu && (

                                        <div className="absolute right-0 top-11 z-20 w-36 border border-slate-200 bg-white py-1 shadow-lg">

                                            {[
                                                'ALL',
                                                'EASY',
                                                'MEDIUM',
                                                'HARD',
                                            ].map((item) => (

                                                <button
                                                    key={item}
                                                    type="button"
                                                    onClick={() => {
                                                        setDifficulty(item)
                                                        setShowDifficultyMenu(
                                                            false,
                                                        )
                                                    }}
                                                    className={`block w-full px-4 py-2 text-left text-[10px] font-medium hover:bg-slate-50 ${difficulty === item
                                                        ? 'text-[#3972a7]'
                                                        : 'text-slate-500'
                                                        }`}
                                                >
                                                    {item === 'ALL'
                                                        ? 'All Questions'
                                                        : item}
                                                </button>

                                            ))}

                                        </div>

                                    )}

                                </div>

                            </div>


                            {/* Loading */}

                            {loadingQuestions && (

                                <div className="px-5 py-10 text-center">

                                    <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#3972a7]" />

                                    <p className="mt-3 text-xs text-slate-400">
                                        Loading questions...
                                    </p>

                                </div>

                            )}


                            {/* Error */}

                            {questionError && !loadingQuestions && (

                                <div className="px-5 py-10 text-center">

                                    <p className="text-xs font-medium text-red-500">
                                        Failed to load questions
                                    </p>

                                    <p className="mt-2 text-[10px] text-slate-400">
                                        {questionError}
                                    </p>

                                </div>

                            )}


                            {/* Questions */}

                            {!loadingQuestions &&
                                !questionError && (

                                    <div className="divide-y divide-slate-100">

                                        {paginatedQuestions.map(
                                            (question) => {

                                                const selected =
                                                    selectedQuestions.some(
                                                        (item) =>
                                                            item.id === question.id,
                                                    )

                                                return (

                                                    <div
                                                        key={question.id}
                                                        className="flex items-center gap-4 px-5 py-4"
                                                    >

                                                        <div className="min-w-0 flex-1">

                                                            <p className="text-xs font-semibold text-slate-700">
                                                                {question.title}
                                                            </p>


                                                            <div className="mt-2 flex flex-wrap gap-2">

                                                                <span
                                                                    className={`px-2 py-0.5 text-[9px] font-semibold ${getDifficultyClass(
                                                                        question.difficulty,
                                                                    )}`}
                                                                >
                                                                    {question.difficulty}
                                                                </span>


                                                                {question.topics
                                                                    ?.slice(0, 3)
                                                                    .map((topic) => {

                                                                        const topicName =
                                                                            typeof topic ===
                                                                                'string'
                                                                                ? topic
                                                                                : topic.name

                                                                        return (

                                                                            <span
                                                                                key={topicName}
                                                                                className="bg-slate-100 px-2 py-0.5 text-[9px] text-slate-500"
                                                                            >
                                                                                {topicName}
                                                                            </span>

                                                                        )
                                                                    })}

                                                            </div>

                                                        </div>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleQuestion(question)
                                                            }
                                                            className={`px-4 py-2 text-[10px] font-semibold transition ${selected
                                                                ? 'bg-red-50 text-red-500'
                                                                : 'bg-[#edf5fc] text-[#3972a7] hover:bg-[#dfeefa]'
                                                                }`}
                                                        >
                                                            {selected
                                                                ? 'Remove'
                                                                : 'Add'}
                                                        </button>

                                                    </div>

                                                )
                                            },
                                        )}


                                        {paginatedQuestions.length === 0 && (

                                            <div className="px-5 py-10 text-center">

                                                <p className="text-xs text-slate-400">
                                                    No questions found.
                                                </p>

                                            </div>

                                        )}

                                    </div>

                                )}


                            {/* =================================================
                  PAGINATION
              ================================================== */}

                            {!loadingQuestions &&
                                !questionError &&
                                normalizedQuestions.length > 0 && (

                                    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">

                                        <p className="text-[10px] text-slate-400">
                                            Page {currentPage} of {totalPages}
                                        </p>


                                        <div className="flex gap-2">

                                            <button
                                                type="button"
                                                disabled={currentPage === 1}
                                                onClick={() =>
                                                    setCurrentPage(
                                                        currentPage - 1,
                                                    )
                                                }
                                                className="border border-slate-200 bg-white px-3 py-1.5 text-[10px] text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Previous
                                            </button>


                                            <button
                                                type="button"
                                                disabled={
                                                    currentPage === totalPages
                                                }
                                                onClick={() =>
                                                    setCurrentPage(
                                                        currentPage + 1,
                                                    )
                                                }
                                                className="border border-slate-200 bg-white px-3 py-1.5 text-[10px] text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Next
                                            </button>

                                        </div>

                                    </div>

                                )}

                        </section>


                        {/* =================================================
                ERROR
            ================================================== */}

                        {error && (

                            <div className="border border-red-100 bg-red-50 px-4 py-3">

                                <p className="text-xs font-medium text-red-500">
                                    {error}
                                </p>

                            </div>

                        )}

                    </div>


                    {/* ===================================================
              FOOTER
          ==================================================== */}

                    <div className="sticky bottom-0 flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={creating}
                            className="bg-[#285b8f] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#214d79] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {creating
                                ? 'Creating...'
                                : `Create Interview (${totalTime} min)`}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}


/* ============================================================
   REUSABLE COMPONENTS
============================================================ */

function SectionTitle({ children }) {
    return (
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3972a7]">
            {children}
        </p>
    )
}


function Field({
    label,
    required,
    children,
}) {
    return (
        <div>

            <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-wider text-slate-400">

                {label}

                {required && (
                    <span className="ml-1 text-red-400">
                        *
                    </span>
                )}

            </label>

            {children}

        </div>
    )
}


/* ============================================================
   ICONS
============================================================ */

function CloseIcon() {
    return (
        <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="m6 6 12 12M18 6 6 18" />
        </svg>
    )
}


function SortIcon() {
    return (
        <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M4 7h10" />
            <path d="M4 12h16" />
            <path d="M4 17h7" />
            <path d="m16 5 3 2-3 2" />
        </svg>
    )
}


export default CreateInterviewModal