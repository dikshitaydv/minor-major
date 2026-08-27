import { useState } from 'react'
import InterviewTopBar from './InterviewTopBar'
import QuestionSidebar from './QuestionSidebar'
import QuestionPanel from './QuestionPanel'
import ChatPanel from './ChatPanel'

function InterviewLayout({
  questions,
  currentQuestion,
  selectedQuestion,
  onQuestionSelect,
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f4f8fc]">

      <InterviewTopBar
        currentQuestion={currentQuestion}
        totalQuestions={questions.length}
      />

      <div
        className={`grid min-h-0 flex-1 transition-[grid-template-columns] duration-200 ${
          isSidebarCollapsed
            ? 'grid-cols-[64px_minmax(0,0.9fr)_minmax(0,1.1fr)]'
            : 'grid-cols-[220px_minmax(0,0.9fr)_minmax(0,1.1fr)]'
        }`}
      >

        {/* Question Sidebar */}

        <QuestionSidebar
          questions={questions}
          currentQuestion={currentQuestion}
          onQuestionSelect={onQuestionSelect}
          isCollapsed={isSidebarCollapsed}
          onToggle={() =>
            setIsSidebarCollapsed((previous) => !previous)
          }
        />


        {/* Question Panel */}

        <QuestionPanel
          question={selectedQuestion}
          questionNumber={currentQuestion}
          totalQuestions={questions.length}
        />


        {/* Chat Panel */}

        <ChatPanel
          question={selectedQuestion}
        />

      </div>

    </div>
  )
}

export default InterviewLayout