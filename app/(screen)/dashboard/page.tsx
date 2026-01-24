"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Save, X, Users, MessageSquare, LogOut } from "lucide-react";

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
    const isLoggedIn = sessionStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) router.push("/login");
  }, [router]);

  /* ========== LOGOUT ========== */
  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    router.push("/login");
  };

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
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-card text-card-foreground rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div className="border-b border-border px-6 py-5 bg-secondary/5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage questions and view applicants
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* ================= ADD QUESTION ================= */}
        <div className="bg-card text-card-foreground rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div className="border-b border-border px-6 py-4 bg-secondary/5">
            <div className="flex items-center gap-2">
              <Plus size={20} className="text-accent" />
              <h2 className="text-lg font-semibold text-foreground">Add New Question</h2>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Question Text */}
              <input
                value={addText}
                onChange={e => setAddText(e.target.value)}
                placeholder="Enter question text..."
                className="flex-1 bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />

              {/* Program Select */}
              <select
                value={addProgram}
                onChange={e => setAddProgram(e.target.value)}
                className="bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all md:w-48"
              >
                <option value="BC">British Columbia</option>
                <option value="NS">Nova Scotia</option>
              </select>

              {/* Add Button */}
              <button
                onClick={addQuestion}
                disabled={!addText.trim()}
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
              >
                <Plus size={20} />
                <span>Add Question</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= QUESTIONS ================= */}
        <div className="bg-card text-card-foreground rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div className="border-b border-border px-6 py-4 bg-secondary/5">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} className="text-accent" />
              <h2 className="text-lg font-semibold text-foreground">Chatbot Questions</h2>
              <span className="ml-auto text-sm text-muted-foreground">
                {questions.length} question{questions.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="px-6 py-6 space-y-3 max-h-[500px] overflow-y-auto">
            {questions.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare size={48} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No questions yet. Add your first question above.</p>
              </div>
            ) : (
              questions.map(q => (
                <div
                  key={q.id}
                  className="bg-secondary/10 border border-secondary/20 rounded-xl p-4 flex justify-between items-start gap-4"
                >
                  <div className="flex-1">
                    <p className="text-foreground leading-relaxed">{q.question_text}</p>
                    <span className="inline-block mt-2 text-xs text-muted-foreground bg-accent/10 px-2 py-1 rounded">
                      {q.program === 'BC' ? 'British Columbia' : 'Nova Scotia'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setEditingQuestion(q);
                      setNewText(q.question_text);
                    }}
                    className="bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 whitespace-nowrap"
                  >
                    <Edit2 size={16} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* EDIT MODAL */}
          {editingQuestion && (
            <div className="border-t border-border px-6 py-4 bg-secondary/5">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Edit2 size={18} className="text-accent" />
                Edit Question
              </h3>

              <div className="space-y-3">
                <input
                  value={newText}
                  onChange={e => setNewText(e.target.value)}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />

                <div className="flex gap-3">
                  <button
                    onClick={saveQuestion}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingQuestion(null);
                      setNewText("");
                    }}
                    className="bg-secondary/20 hover:bg-secondary/30 text-foreground border border-border px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200"
                  >
                    <X size={18} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= APPLICANTS ================= */}
        <div className="bg-card text-card-foreground rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div className="border-b border-border px-6 py-4 bg-secondary/5">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-accent" />
              <h2 className="text-lg font-semibold text-foreground">Applicants</h2>
              <span className="ml-auto text-sm text-muted-foreground">
                {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="px-6 py-6 max-h-[500px] overflow-y-auto">
            {applicants.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No applicants yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applicants.map(app => (
                  <div
                    key={app.id}
                    className="bg-secondary/10 border border-secondary/20 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{app.name}</h3>
                        <p className="text-sm text-muted-foreground">{app.email}</p>
                      </div>
                      {app.score !== undefined && (
                        <span className="bg-accent/20 text-accent px-3 py-1 rounded-lg text-sm font-medium">
                          Score: {app.score}
                        </span>
                      )}
                    </div>
                    <span className="inline-block text-xs text-muted-foreground bg-accent/10 px-2 py-1 rounded">
                      {app.program === 'BC' ? 'British Columbia' : app.program === 'NS' ? 'Nova Scotia' : app.program}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}