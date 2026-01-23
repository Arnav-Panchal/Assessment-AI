import { NextResponse } from 'next/server'
import { generateText } from 'ai'
import { model } from '@/lib/ai'
import { getNextQuestion, QUESTIONS } from '@/services/questionFlow'

export async function POST(req: Request) {
  try {
    const { answers = {}, lastAnswer }: { answers?: Record<string, any>, lastAnswer?: string } = await req.json()

    // 1️⃣ Get next unanswered question
    const nextQuestion = getNextQuestion(answers)

    // First call: just return the first question
    if (!lastAnswer) {
      if (!nextQuestion) {
        return NextResponse.json({ done: true })
      }

      return NextResponse.json({
        done: false,
        question: nextQuestion.text,
        key: nextQuestion.key
      })
    }
    

    // 2️⃣ Use AI to normalize the last answer
    const { text } = await generateText({
      model,
      temperature: 0,
      system: `
You are a data normalizer.
Convert user answers into clean JSON.
Return ONLY valid JSON with key/value.
No explanations.
`,
      prompt: `
Question key: ${nextQuestion?.key}
User answer: "${lastAnswer}"

Return JSON in this format:
{ "${nextQuestion?.key}": value }
`
    })

    console.log(text)

    

    // 3️⃣ Parse AI output safely
    let parsedAnswer: Record<string, any> = {}
    try {
      parsedAnswer = JSON.parse(text)
    } catch (err) {
      console.error('Failed to parse AI response:', text)
      return NextResponse.json({
        error: 'Could not understand your answer. Please enter clearly.'
      })
    }

    // 4️⃣ Merge with existing answers
    const updatedAnswers = { ...answers, ...parsedAnswer }

    console.log("lastAnswer");

    // 5️⃣ Get the next question after updating
    const next = getNextQuestion(updatedAnswers)

    if (!next) {
      return NextResponse.json({ done: true })
    }

    return NextResponse.json({
      done: false,
      question: next.text,
      key: next.key
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error. Try again later.' }, { status: 500 })
  }
}
