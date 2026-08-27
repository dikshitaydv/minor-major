import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'

function ChatPanel() {
  return (
    <section className="flex min-h-0 flex-col border-l border-[#202b3b] bg-[#0b1220] text-white">

      <ChatHeader />

      <ChatMessages />

      <ChatInput />

    </section>
  )
}

export default ChatPanel