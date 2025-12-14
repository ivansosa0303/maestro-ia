import React, { useState } from 'react';
import { UserInput, CourseLevel, CourseFormat } from '../types';
import { Button } from './Button';
import { Input, Select } from './Input';
import { Sparkles } from 'lucide-react';

interface CourseFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

export const CourseForm: React.FC<CourseFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    topic: '',
    level: 'Principiante',
    profile: '',
    goal: '',
    timeAvailable: '',
    format: 'Mixto',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic || !formData.profile) return; // Basic validation
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6" />
          Diseña tu Curso
        </h2>
        <p className="text-indigo-100 text-sm mt-1">La IA generará el temario, lecciones y exámenes por ti.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Tema del Curso" 
            name="topic" 
            id="topic"
            placeholder="Ej. Introducción a la Astronomía" 
            value={formData.topic} 
            onChange={handleChange} 
            required
          />
          <Select 
            label="Nivel" 
            name="level" 
            id="level"
            options={['Principiante', 'Intermedio', 'Avanzado']} 
            value={formData.level} 
            onChange={handleChange} 
          />
        </div>

        <Input 
          label="Perfil del Alumno" 
          name="profile" 
          id="profile"
          placeholder="Ej. Estudiante de bachillerato, Programador Junior..." 
          value={formData.profile} 
          onChange={handleChange} 
          required
        />

        <Input 
          label="Objetivo Principal" 
          name="goal" 
          id="goal"
          placeholder="Ej. Aprobar examen final, mejorar soft skills..." 
          value={formData.goal} 
          onChange={handleChange} 
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Tiempo Disponible" 
            name="timeAvailable" 
            id="timeAvailable"
            placeholder="Ej. 2 semanas, 1 hora diaria" 
            value={formData.timeAvailable} 
            onChange={handleChange} 
            required
          />
          <Select 
            label="Formato Preferido" 
            name="format" 
            id="format"
            options={['Lecturas breves', 'Lecturas + ejercicios', 'Esquemas + problemas', 'Mixto']} 
            value={formData.format} 
            onChange={handleChange} 
          />
        </div>

        <div className="pt-4">
          <Button type="submit" fullWidth disabled={isLoading} className="text-lg py-3">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando Estructura del Curso...
              </span>
            ) : (
              "Diseñar Curso Ahora"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
