import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Award, 
  Play, 
  Save, 
  Settings, 
  Sparkles,
  BookOpen,
  Check,
  X
} from 'lucide-react';
import { useStore } from '../../services/store';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  courseId: string;
  passingScorePercentage: number;
  questions: QuizQuestion[];
  isCertificateEligible: boolean;
}

export const QuizBuilder: React.FC = () => {
  const { courses } = useStore();

  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: 'quiz_01',
      title: 'Avaliação Final: Formação VIP PRO Master',
      courseId: courses[0]?.id || 'course-1',
      passingScorePercentage: 70,
      isCertificateEligible: true,
      questions: [
        {
          id: 'q1',
          question: 'Qual é o pilar fundamental para escalar uma oferta com alta conversão?',
          options: [
            'Aumentar o orçamento sem validar o Criativo e a VSL',
            'Alinhar Promessa Única de Valor (PUV), Mecanismo Único e Prova Social irrefutável',
            'Apenas trocar o botão de checkout',
            'Depender exclusivamente de tráfego orgânico sem métricas'
          ],
          correctOptionIndex: 1,
          explanation: 'Uma oferta vencedora precisa de clareza, mecanismo único e alta percepção de valor com prova social.'
        },
        {
          id: 'q2',
          question: 'Em quanto tempo uma notificação de Webhook deve processar a compra para liberar o aluno?',
          options: [
            'Em até 24 horas',
            'Instantaneamente (em poucos milissegundos via Postback)',
            'Apenas no final do mês',
            'Manualmente após conferência em planilha'
          ],
          correctOptionIndex: 1,
          explanation: 'A automação por Webhook deve ser em tempo real para proporcionar uma experiência VIP instantânea ao cliente.'
        }
      ]
    }
  ]);

  const [selectedQuizId, setSelectedQuizId] = useState<string>(quizzes[0]?.id || 'quiz_01');
  const [isTestMode, setIsTestMode] = useState(false);
  const [testAnswers, setTestAnswers] = useState<{ [qId: string]: number }>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  const activeQuiz = quizzes.find(q => q.id === selectedQuizId) || quizzes[0];

  // Add Question
  const handleAddQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: 'q_' + Date.now(),
      question: 'Nova Pergunta de Avaliação...',
      options: [
        'Alternativa A',
        'Alternativa B',
        'Alternativa C',
        'Alternativa D'
      ],
      correctOptionIndex: 0,
      explanation: 'Explicação detalhada da resposta correta...'
    };

    setQuizzes(prev => prev.map(q => q.id === activeQuiz.id ? {
      ...q,
      questions: [...q.questions, newQuestion]
    } : q));
  };

  const handleUpdateQuestion = (qIndex: number, field: keyof QuizQuestion, value: any) => {
    setQuizzes(prev => prev.map(q => {
      if (q.id !== activeQuiz.id) return q;
      const updatedQuestions = [...q.questions];
      updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], [field]: value };
      return { ...q, questions: updatedQuestions };
    }));
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, text: string) => {
    setQuizzes(prev => prev.map(q => {
      if (q.id !== activeQuiz.id) return q;
      const updatedQuestions = [...q.questions];
      const updatedOptions = [...updatedQuestions[qIndex].options];
      updatedOptions[optIndex] = text;
      updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], options: updatedOptions };
      return { ...q, questions: updatedQuestions };
    }));
  };

  const handleRemoveQuestion = (qIndex: number) => {
    setQuizzes(prev => prev.map(q => {
      if (q.id !== activeQuiz.id) return q;
      return {
        ...q,
        questions: q.questions.filter((_, idx) => idx !== qIndex)
      };
    }));
  };

  // Test Mode Scoring
  const calculateScore = () => {
    let correct = 0;
    activeQuiz.questions.forEach(q => {
      if (testAnswers[q.id] === q.correctOptionIndex) {
        correct++;
      }
    });
    return Math.round((correct / activeQuiz.questions.length) * 100) || 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E5A83B]/10 border border-[#E5A83B]/30 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-[#E5A83B]" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Criador de Quizzes & Provas</h2>
            <p className="text-xs text-[#8E9BB0]">
              Avalie o aprendizado dos alunos, defina notas de corte e libere certificados oficiais automaticamente.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsTestMode(!isTestMode);
              setTestSubmitted(false);
              setTestAnswers({});
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              isTestMode 
                ? 'bg-[#151922] text-[#E5A83B] border border-[#E5A83B]' 
                : 'bg-[#151922] text-[#8E9BB0] hover:text-white border border-[#1D2230]'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isTestMode ? 'Voltar ao Editor' : 'Simular como Aluno'}</span>
          </button>

          <button
            onClick={() => {
              setSaveSuccessToast(true);
              setTimeout(() => setSaveSuccessToast(false), 2500);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#E5A83B] hover:bg-[#D4AF37] text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#E5A83B]/20 transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Quiz</span>
          </button>
        </div>
      </div>

      {saveSuccessToast && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Quiz salvo e publicado com sucesso para os alunos do curso!</span>
        </div>
      )}

      {/* Simulator Test Mode */}
      {isTestMode ? (
        <div className="p-8 rounded-3xl bg-[#0D0F12] border border-[#1D2230] max-w-3xl mx-auto space-y-6 shadow-2xl">
          <div className="border-b border-[#1D2230] pb-4">
            <span className="text-[10px] text-[#E5A83B] font-mono font-bold uppercase tracking-widest block">
              SIMULADOR DE QUIZ DO ALUNO
            </span>
            <h3 className="text-lg font-extrabold text-white mt-1">{activeQuiz.title}</h3>
            <p className="text-xs text-[#8E9BB0]">Nota mínima para aprovação: {activeQuiz.passingScorePercentage}%</p>
          </div>

          <div className="space-y-6">
            {activeQuiz.questions.map((q, idx) => (
              <div key={q.id} className="p-5 rounded-2xl bg-[#08090C] border border-[#1D2230] space-y-3">
                <p className="text-sm font-bold text-white">
                  <span className="text-[#E5A83B] font-mono mr-2">#{idx + 1}</span>
                  {q.question}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = testAnswers[q.id] === optIdx;
                    const isCorrect = q.correctOptionIndex === optIdx;

                    let optionStyle = 'bg-[#151922] border-[#1D2230] text-[#8E9BB0] hover:border-[#E5A83B]/50';
                    if (testSubmitted) {
                      if (isCorrect) optionStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold';
                      else if (isSelected && !isCorrect) optionStyle = 'bg-rose-500/10 border-rose-500/40 text-rose-400';
                    } else if (isSelected) {
                      optionStyle = 'bg-[#E5A83B]/10 border-[#E5A83B] text-white font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={testSubmitted}
                        onClick={() => setTestAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {testSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                        {testSubmitted && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-400" />}
                      </button>
                    );
                  })}
                </div>

                {testSubmitted && (
                  <div className="p-3 rounded-xl bg-[#121724] border border-[#1D2230] text-xs text-[#8E9BB0]">
                    <strong className="text-[#E5A83B]">Explicação:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!testSubmitted ? (
            <button
              onClick={() => setTestSubmitted(true)}
              className="w-full py-3 rounded-xl bg-[#E5A83B] text-black font-bold text-xs uppercase tracking-wider"
            >
              Finalizar & Ver Resultado
            </button>
          ) : (
            <div className="p-5 rounded-2xl bg-[#08090C] border border-[#1D2230] text-center space-y-3">
              <p className="text-xs text-[#8E9BB0]">Seu Desempenho:</p>
              <p className={`text-4xl font-black ${calculateScore() >= activeQuiz.passingScorePercentage ? 'text-emerald-400' : 'text-rose-400'}`}>
                {calculateScore()}%
              </p>
              <p className="text-xs text-white">
                {calculateScore() >= activeQuiz.passingScorePercentage 
                  ? '🎉 Parabéns! Você foi APROVADO e seu certificado foi gerado!' 
                  : '❌ Você não atingiu a pontuação mínima necessária. Tente novamente!'}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Builder Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Sidebar */}
          <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Configurações do Quiz
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">Título do Quiz</label>
                <input
                  type="text"
                  value={activeQuiz.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQuizzes(prev => prev.map(q => q.id === activeQuiz.id ? { ...q, title: val } : q));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white focus:border-[#E5A83B] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">Curso Associado</label>
                <select
                  value={activeQuiz.courseId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQuizzes(prev => prev.map(q => q.id === activeQuiz.id ? { ...q, courseId: val } : q));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white focus:border-[#E5A83B] focus:outline-none"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">Nota Mínima de Corte (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={activeQuiz.passingScorePercentage}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setQuizzes(prev => prev.map(q => q.id === activeQuiz.id ? { ...q, passingScorePercentage: val } : q));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white focus:border-[#E5A83B] focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-[#1D2230] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Emitir Certificado</p>
                  <p className="text-[10px] text-[#8E9BB0]">Libera o certificado após aprovação</p>
                </div>
                <input
                  type="checkbox"
                  checked={activeQuiz.isCertificateEligible}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setQuizzes(prev => prev.map(q => q.id === activeQuiz.id ? { ...q, isCertificateEligible: val } : q));
                  }}
                  className="w-4 h-4 accent-[#E5A83B] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Question List Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-6">
              <div className="flex items-center justify-between border-b border-[#1D2230] pb-4">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Perguntas ({activeQuiz.questions.length})
                </h3>

                <button
                  onClick={handleAddQuestion}
                  className="px-3.5 py-1.5 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-xs font-bold text-[#E5A83B] border border-[#E5A83B]/40 flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Pergunta</span>
                </button>
              </div>

              {/* Questions Accordion / List */}
              <div className="space-y-6">
                {activeQuiz.questions.map((question, qIdx) => (
                  <div key={question.id} className="p-5 rounded-2xl bg-[#08090C] border border-[#1D2230] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#E5A83B] uppercase">
                        PERGUNTA #{qIdx + 1}
                      </span>
                      {activeQuiz.questions.length > 1 && (
                        <button
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remover</span>
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => handleUpdateQuestion(qIdx, 'question', e.target.value)}
                      placeholder="Digite a pergunta aqui..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white font-medium focus:border-[#E5A83B] focus:outline-none"
                    />

                    {/* Options list */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-[#8E9BB0] uppercase font-mono block">
                        ALTERNATIVAS (Marque o círculo da resposta correta):
                      </span>
                      {question.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct_${question.id}`}
                            checked={question.correctOptionIndex === optIdx}
                            onChange={() => handleUpdateQuestion(qIdx, 'correctOptionIndex', optIdx)}
                            className="w-4 h-4 accent-[#E5A83B] cursor-pointer"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-[#151922] border border-[#1D2230] text-xs text-white focus:border-[#E5A83B] focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Explanation */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#8E9BB0] uppercase font-mono">Feedback / Explicação da Resposta</label>
                      <input
                        type="text"
                        value={question.explanation}
                        onChange={(e) => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                        placeholder="Explicar por que essa é a resposta correta..."
                        className="w-full px-3.5 py-2 rounded-lg bg-[#151922] border border-[#1D2230] text-xs text-white focus:border-[#E5A83B] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
