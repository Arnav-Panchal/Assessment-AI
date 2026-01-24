"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

type Applicant = {
  id: number;
  name: string;
  email: string;
  program: string;
  answers: Record<string, any>;
  score?: number;
};

type Question = {
  id: number;
  question_text: string;
  program: string;
};

/* ================= COMPONENT ================= */

export default function Dashboard() {
  const router = useRouter();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newText, setNewText] = useState("");

  // ➕ Add question state
  const [addText, setAddText] = useState("");
  const [addProgram, setAddProgram] = useState("BC");

  /* ========== AUTH CHECK ========== */
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) router.push("/login");
  }, [router]);

  /* ========== FETCH DATA ========== */
  const loadData = async () => {
    try {
      const appRes = await fetch("/api/admin/applicants");
      const appData = await appRes.json();

      setApplicants(
        appData.map((a: any) => ({
          id: a.id,
          name: a.name ?? a.full_name,
          email: a.email,
          program: a.program ?? a.program_applied,
          answers: a.answers,
          score: a.score,
        }))
      );

      const qRes = await fetch("/api/admin/questions");
      const qData = await qRes.json();

      setQuestions(
        qData.map((q: any) => ({
          id: q.id,
          question_text: q.question_text,
          program: q.program,
        }))
      );
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ========== UPDATE QUESTION ========== */
  const saveQuestion = async () => {
    if (!editingQuestion || !newText.trim()) return;

    await fetch(`/api/admin/questions/${editingQuestion.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_text: newText }),
    });

    setEditingQuestion(null);
    setNewText("");
    loadData();
  };

  /* ========== ADD QUESTION ========== */
  const addQuestion = async () => {
    if (!addText.trim()) return;

    await fetch("/api/admin/questions/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_text: addText,
        program: addProgram,
      }),
    });

    setAddText("");
    loadData();
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* HEADER */}
        <h1 className="text-4xl font-bold text-white mb-10">
          Admin Dashboard
        </h1>

        {/* ================= ADD QUESTION ================= */}
<div className="bg-gray-800 rounded-xl p-6 mb-10 border border-gray-700">
  <h2 className="text-xl font-semibold text-white mb-4">
    ➕ Add New Question
  </h2>

  <div className="grid md:grid-cols-4 gap-4">

    {/* Question Text */}
    <div className="md:col-span-2">
      <label htmlFor="questionText" className="sr-only">
        Question text
      </label>
      <input
        id="questionText"
        value={addText}
        onChange={e => setAddText(e.target.value)}
        placeholder="Enter question text"
        className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg"
      />
    </div>

    {/* Program Select */}
    <div>
      <label htmlFor="programSelect" className="sr-only">
        Select program
      </label>
      <select
        id="programSelect"
        value={addProgram}
        onChange={e => setAddProgram(e.target.value)}
        className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg"
      >
        <option value="BC">British Columbia</option>
        <option value="NS">Nova Scotia</option>
      </select>
    </div>

    {/* Add Button */}
    <button
      onClick={addQuestion}
      className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6"
    >
      Add
    </button>
  </div>
</div>


        {/* ================= QUESTIONS ================= */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700">
          <div className="px-6 py-4 bg-purple-700">
            <h2 className="text-2xl font-semibold text-white">
              Chatbot Questions
            </h2>
          </div>

          <div className="p-6 space-y-3">
            {questions.map(q => (
              <div
                key={q.id}
                className="flex justify-between items-center bg-gray-900 p-4 rounded-lg border border-gray-700"
              >
                <div>
                  <p className="text-white">{q.question_text}</p>
                  <span className="text-xs text-gray-400">
                    Program: {q.program}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setEditingQuestion(q);
                    setNewText(q.question_text);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>

          {/* EDIT MODAL */}
          {editingQuestion && (
            <div className="p-6 border-t border-gray-700 bg-gray-900">
              <h3 className="text-lg font-semibold text-white mb-3">
                Edit Question
              </h3>

              <input
              
                value={newText}
                onChange={e => setNewText(e.target.value)}
                className="w-full mb-4 px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
              />

              <div className="flex gap-3">
                <button
                  onClick={saveQuestion}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingQuestion(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
