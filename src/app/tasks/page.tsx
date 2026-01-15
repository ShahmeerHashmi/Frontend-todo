/**
 * Productivity OS - Task Dashboard
 * Precision, Density, Focus.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Header } from '@/components/Header';
import { AddTaskForm } from '@/components/AddTaskForm';
import { TaskItem } from '@/components/TaskItem';
import { ChatPanel } from '@/components/ChatPanel';
import { taskAPI } from '@/lib/api';

export default function TasksPage() {
  const [showChat, setShowChat] = useState(true);

  const { data: tasks, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskAPI.getAll,
  });

  const activeTasks = tasks?.filter(task => !task.completed) || [];
  const completedTasks = tasks?.filter(task => task.completed) || [];
  
  const totalTasks = tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Date formatting for the "OS" feel
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* Dot grid overlay handled in globals.css body */}
        
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: HUD & Stats (Sticky on Desktop) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              
              {/* Main Welcome Card */}
              <div className="tech-panel rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 font-mono text-4xl font-bold rotate-90 origin-top-right">
                  HUD.v2
                </div>
                
                <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  Command Center
                </h1>
                <p className="text-sm font-mono text-[var(--color-gray)] mb-6">
                  {dateStr} • {timeStr}
                </p>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-medium text-[var(--color-slate)]">Daily Velocity</span>
                    <span className="text-2xl font-bold font-mono text-[var(--color-electric)]">{progress}%</span>
                  </div>
                  {/* Technical Progress Bar */}
                  <div className="h-2 w-full bg-gray-200 rounded-sm overflow-hidden">
                     <div 
                        className="h-full bg-[var(--color-electric)] transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                     />
                  </div>
                </div>
              </div>

              {/* Stats Grid (Bento) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="tech-panel rounded-2xl p-5 flex flex-col justify-between aspect-square transition-transform hover:scale-[1.02]">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-electric-light)] flex items-center justify-center text-[var(--color-electric)]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono">{activeTasks.length}</div>
                    <div className="text-xs font-medium text-[var(--color-gray)] uppercase tracking-wider">Active</div>
                  </div>
                </div>

                <div className="tech-panel rounded-2xl p-5 flex flex-col justify-between aspect-square transition-transform hover:scale-[1.02]">
                   <div className="w-8 h-8 rounded-lg bg-[rgba(0,255,136,0.15)] flex items-center justify-center text-[var(--color-lime-dark)]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono">{completedTasks.length}</div>
                    <div className="text-xs font-medium text-[var(--color-gray)] uppercase tracking-wider">Done</div>
                  </div>
                </div>
              </div>

               {/* Add Task Widget (Compact) */}
               <div className="tech-panel rounded-2xl p-1 shadow-sm">
                  <div className="bg-[var(--color-background)] rounded-xl p-4 border border-[var(--color-light-gray)]">
                     <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-gray)] mb-3">Quick Input</h3>
                     <AddTaskForm onSuccess={refetch} />
                  </div>
               </div>

               {/* AI Chat Panel */}
               <div className="tech-panel rounded-2xl overflow-hidden">
                  <button
                     onClick={() => setShowChat(!showChat)}
                     className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[var(--color-lime)] rounded-full" />
                        <span className="text-sm font-semibold">AI Assistant</span>
                     </div>
                     <svg
                        className={`w-4 h-4 transition-transform ${showChat ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                     </svg>
                  </button>
                  {showChat && (
                     <div className="h-[400px]">
                        <ChatPanel onTasksChanged={refetch} />
                     </div>
                  )}
               </div>

            </div>

            {/* RIGHT COLUMN: Task Streams */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Error/Loading States */}
              {isLoading && (
                 <div className="tech-panel rounded-xl p-8 text-center animate-pulse">
                    <div className="font-mono text-sm text-[var(--color-gray)]">INITIALIZING SYSTEM...</div>
                 </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   <span>Failed to load data stream.</span>
                   <button onClick={() => refetch()} className="underline font-semibold ml-auto">Retry</button>
                </div>
              )}

              {/* Active Stream */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--color-electric)] rounded-full animate-pulse"/>
                    Active Stream
                  </h2>
                  <span className="font-mono text-xs text-[var(--color-gray)] bg-white px-2 py-1 rounded border border-gray-200">
                    {activeTasks.length} ITEM{activeTasks.length !== 1 ? 'S' : ''}
                  </span>
                </div>

                {tasks && activeTasks.length === 0 && (
                   <div className="tech-panel rounded-xl p-12 text-center border-dashed border-2 border-[var(--color-light-gray)]">
                      <div className="text-[var(--color-gray)] font-mono text-sm mb-2">NO ACTIVE TASKS DETECTED</div>
                      <p className="text-sm">System clear. Ready for input.</p>
                   </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {activeTasks.map((task, index) => (
                    <div key={task.id} className="animate-slideUp" style={{ animationDelay: `${index * 0.05}s` }}>
                      <TaskItem task={task} onUpdate={refetch} />
                    </div>
                  ))}
                </div>
              </section>

              {/* Completed Stream */}
              {completedTasks.length > 0 && (
                <section className="pt-8 opacity-80 hover:opacity-100 transition-opacity">
                   <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--color-slate)]">
                      <span className="w-2 h-2 bg-[var(--color-lime)] rounded-full"/>
                      Archive
                    </h2>
                     <span className="font-mono text-xs text-[var(--color-gray)] bg-white px-2 py-1 rounded border border-gray-200">
                      {completedTasks.length} DONE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {completedTasks.map((task, index) => (
                      <div key={task.id} className="animate-slideUp" style={{ animationDelay: `${index * 0.05}s` }}>
                        <TaskItem task={task} onUpdate={refetch} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
