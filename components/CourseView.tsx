import React, { useState, useEffect } from 'react';
import { CourseData } from '../types';
import { LessonBlock } from './LessonBlock';
import { Button } from './Button';
import { BookOpen, CheckCircle, ChevronLeft, ChevronRight, Menu, X, Trophy, GraduationCap, Link2 } from 'lucide-react';
import clsx from 'clsx'; // Simple helper if available, but I'll write inline logic to minimize deps

interface CourseViewProps {
  course: CourseData;
  onReset: () => void;
}

export const CourseView: React.FC<CourseViewProps> = ({ course, onReset }) => {
  const [currentUnit, setCurrentUnit] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showingFinal, setShowingFinal] = useState(false);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, [currentUnit, currentLesson, showingFinal]);

  const totalLessons = course.units.reduce((acc, unit) => acc + unit.lessons.length, 0);
  const completedCount = Object.keys(completed).length;
  const progress = Math.round((completedCount / totalLessons) * 100);

  const activeLessonData = !showingFinal 
    ? course.units[currentUnit]?.lessons[currentLesson] 
    : null;

  const markComplete = () => {
    if (showingFinal) return;
    setCompleted(prev => ({ ...prev, [`${currentUnit}-${currentLesson}`]: true }));
  };

  const handleNext = () => {
    markComplete();
    const unit = course.units[currentUnit];
    
    // Check if next lesson exists in current unit
    if (currentLesson + 1 < unit.lessons.length) {
      setCurrentLesson(currentLesson + 1);
    } 
    // Check if next unit exists
    else if (currentUnit + 1 < course.units.length) {
      setCurrentUnit(currentUnit + 1);
      setCurrentLesson(0);
    } 
    // Go to final assessment
    else {
      setShowingFinal(true);
    }
  };

  const handlePrev = () => {
    if (showingFinal) {
      setShowingFinal(false);
      setCurrentUnit(course.units.length - 1);
      setCurrentLesson(course.units[course.units.length - 1].lessons.length - 1);
      return;
    }

    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    } else if (currentUnit > 0) {
      setCurrentUnit(currentUnit - 1);
      const prevUnit = course.units[currentUnit - 1];
      setCurrentLesson(prevUnit.lessons.length - 1);
    }
  };

  const Sidebar = () => (
    <div className="h-full overflow-y-auto py-6 px-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">{course.title}</h2>
        <div className="mt-2 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-xs text-slate-500 mt-1 text-right">{progress}% completado</p>
      </div>

      <nav className="space-y-6">
        {course.units.map((unit, uIdx) => (
          <div key={uIdx}>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Unidad {uIdx + 1}</div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">{unit.title}</h3>
            <ul className="space-y-1">
              {unit.lessons.map((lesson, lIdx) => {
                const isActive = !showingFinal && currentUnit === uIdx && currentLesson === lIdx;
                const isCompleted = completed[`${uIdx}-${lIdx}`];
                
                return (
                  <li key={lIdx}>
                    <button
                      onClick={() => {
                        setShowingFinal(false);
                        setCurrentUnit(uIdx);
                        setCurrentLesson(lIdx);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between group transition-colors ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-700 font-medium' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate pr-2">{lIdx + 1}. {lesson.title}</span>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${isActive ? 'border-indigo-400' : 'border-slate-300'}`}></div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="pt-4 border-t border-slate-100">
           <button
              onClick={() => setShowingFinal(true)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 font-bold ${
                showingFinal 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Evaluación Final & Proyectos
            </button>
        </div>
      </nav>
      
      <div className="mt-8 pt-6 border-t border-slate-200">
        <Button variant="ghost" onClick={onReset} className="w-full text-sm">
          Salir del curso
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white z-50 border-b px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold text-slate-800 truncate mr-2">{course.title}</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:block w-80 bg-white border-r border-slate-200 flex-shrink-0 h-full">
        <Sidebar />
      </aside>

      {/* Sidebar - Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl z-50">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto pt-16 md:pt-0 scroll-smooth">
        <div className="max-w-4xl mx-auto px-4 py-8 md:p-12">
          
          {/* Header Section */}
          <header className="mb-10">
             <div className="flex flex-wrap gap-2 mb-3">
               {course.tags.map((tag, i) => (
                 <span key={i} className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-semibold uppercase tracking-wide">
                   {tag}
                 </span>
               ))}
             </div>
             <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
               {showingFinal ? "Evaluación Final y Proyecto" : activeLessonData?.title}
             </h1>
             {!showingFinal && activeLessonData && (
                <p className="text-slate-500 text-lg">
                  Unidad {currentUnit + 1}: {course.units[currentUnit].title}
                </p>
             )}
          </header>

          {/* Lesson Content */}
          {!showingFinal && activeLessonData && (
            <div className="space-y-4 animate-fadeIn">
              <LessonBlock 
                type="idea" 
                title="Idea Clave" 
                content={activeLessonData.keyIdea} 
              />
              <LessonBlock 
                type="example" 
                title="Ejemplo Aplicado" 
                content={activeLessonData.appliedExample} 
              />
              <LessonBlock 
                type="activity" 
                title="Actividad Práctica" 
                content={activeLessonData.practicalActivity} 
              />
              <LessonBlock 
                type="quiz" 
                title="Test Rápido" 
                quizData={activeLessonData.quiz} 
              />
            </div>
          )}

          {/* Final Assessment Content */}
          {showingFinal && (
             <div className="space-y-8 animate-fadeIn">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                 <div className="flex items-center gap-3 mb-6 border-b pb-4">
                   <Trophy className="w-8 h-8 text-yellow-500" />
                   <h2 className="text-2xl font-bold text-slate-800">Evaluación del Curso</h2>
                 </div>
                 <LessonBlock 
                   type="quiz" 
                   title="Examen Final" 
                   quizData={course.finalAssessment} 
                 />
               </div>

               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                  <div className="flex items-center gap-3 mb-6 border-b pb-4">
                   <GraduationCap className="w-8 h-8 text-indigo-600" />
                   <h2 className="text-2xl font-bold text-slate-800">Proyectos Finales</h2>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                   {course.finalProjects.map((proj, idx) => (
                     <div key={idx} className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                       <h3 className="font-bold text-lg text-indigo-900 mb-2">Proyecto {idx + 1}: {proj.title}</h3>
                       <p className="text-slate-600 leading-relaxed">{proj.description}</p>
                     </div>
                   ))}
                 </div>
               </div>

               {/* References */}
               {course.references && course.references.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-slate-200">
                    <h3 className="font-bold text-slate-400 uppercase tracking-wider text-sm mb-4">Fuentes y Referencias</h3>
                    <ul className="space-y-2">
                      {course.references.map((ref, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <Link2 className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                          <span className="break-all">{ref}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
               )}
             </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 flex items-center justify-between pt-6 border-t border-slate-200">
             <Button 
               variant="outline" 
               onClick={handlePrev}
               disabled={!showingFinal && currentUnit === 0 && currentLesson === 0}
             >
               <ChevronLeft className="w-4 h-4" /> Anterior
             </Button>

             {!showingFinal && (
               <Button onClick={handleNext} variant="primary">
                 Siguiente Lección <ChevronRight className="w-4 h-4" />
               </Button>
             )}
          </div>

        </div>
      </main>
    </div>
  );
};
