import React, { useState } from 'react';
import { CourseData, UserInput } from './types';
import { CourseForm } from './components/CourseForm';
import { CourseView } from './components/CourseView';
import { generateCourse } from './services/geminiService';
import { BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'course'>('home');
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateCourse = async (input: UserInput) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateCourse(input);
      setCourseData(data);
      setView('course');
    } catch (err) {
      setError("Hubo un error al conectar con el ProfesorIA. Por favor, intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setView('home');
    setCourseData(null);
    setError(null);
  };

  if (view === 'course' && courseData) {
    return <CourseView course={courseData} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Navbar for Home */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xl">
            <BookOpen className="w-6 h-6" />
            <span>ProfesorIA</span>
          </div>
          <div className="text-sm font-medium text-slate-500 hidden sm:block">
            Aula Virtual Generativa
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Crea tu aula virtual <br className="hidden md:block"/>
            <span className="text-indigo-600">en cuestión de minutos</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            Describe qué quieres aprender y nuestra Inteligencia Artificial diseñará un plan de estudio completo con lecciones, actividades prácticas y evaluaciones a tu medida.
          </p>
        </div>

        {/* Form Section */}
        <CourseForm onSubmit={handleCreateCourse} isLoading={loading} />

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Feature Highlights */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 text-xl font-bold">1</div>
            <h3 className="font-bold text-lg mb-2">Diseño Instruccional</h3>
            <p className="text-slate-500">Estructura pedagógica lógica adaptada a tu nivel y objetivos.</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 text-xl font-bold">2</div>
            <h3 className="font-bold text-lg mb-2">Contenido Real</h3>
            <p className="text-slate-500">Información verificada mediante Google Search para mayor precisión.</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 text-xl font-bold">3</div>
            <h3 className="font-bold text-lg mb-2">Evaluación Continua</h3>
            <p className="text-slate-500">Tests y proyectos prácticos para asegurar que dominas la materia.</p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;
