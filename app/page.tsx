import ChatInput from "@/components/ChatInput"

export default async function ChatPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white border rounded-lg p-6 shadow space-y-4">
        <h1 className="text-2xl font-bold">Entrepreneur Assessment</h1>
        <ChatInput />
      </div>
    </main>
  )
}
