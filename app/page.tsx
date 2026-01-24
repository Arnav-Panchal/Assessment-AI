import ChatInput from "@/components/ChatInput"

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl">
        <ChatInput />
      </div>
    </main>
  )
}
