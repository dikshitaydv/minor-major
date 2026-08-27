import ChatMessage from './ChatMessage'

function ChatMessages() {
  const messages = [
    {
      id: 1,
      sender: 'ai',
      message:
        "Let's start with this problem. Take a moment to understand it and tell me how you would approach the solution.",
      time: '10:32 AM',
    },
    {
      id: 2,
      sender: 'candidate',
      message:
        'I would use a sliding window approach. I can maintain a window of unique characters and expand or shrink it as needed.',
      time: '10:33 AM',
    },
    {
      id: 3,
      sender: 'ai',
      message:
        'Good. Why did you choose a sliding window instead of checking every possible substring?',
      time: '10:33 AM',
    },
    {
      id: 4,
      sender: 'candidate',
      message:
        'Because checking every substring would take more time. With a sliding window, I can move the left and right pointers and maintain the characters in the current window.',
      time: '10:34 AM',
    },
    {
      id: 5,
      sender: 'ai',
      message:
        'That makes sense. What data structure would you use to keep track of the characters currently present in the window?',
      time: '10:34 AM',
    },
  ]

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-[#0b1220] px-5 py-6">

      <div className="mx-auto max-w-2xl">

        {/* Conversation label */}

        <div className="mb-6 flex items-center gap-3">

          <div className="h-px flex-1 bg-white/5" />

          <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-slate-600">
            Interview Conversation
          </span>

          <div className="h-px flex-1 bg-white/5" />

        </div>


        <div className="space-y-6">

          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
            />
          ))}

        </div>

      </div>

    </div>
  )
}

export default ChatMessages