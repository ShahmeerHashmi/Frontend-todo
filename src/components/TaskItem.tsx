/**
 * Technical Task Strip Component
 */

'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { taskAPI, APIError } from '@/lib/api';
import { EditTaskModal } from './EditTaskModal';
import type { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
}

export function TaskItem({ task, onUpdate }: TaskItemProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMutation = useMutation({
    mutationFn: () => taskAPI.toggleComplete(task.id, task.updated_at),
    onSuccess: () => {
      setError(null);
      onUpdate();
    },
    onError: (error) => {
      if (error instanceof APIError && error.statusCode === 409) {
        setError('Sync conflict. Refreshing...');
        setTimeout(() => onUpdate(), 1500);
      } else {
        setError('Update failed');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => taskAPI.delete(task.id),
    onSuccess: () => {
      setError(null);
      onUpdate();
    },
    onError: () => {
      setError('Delete failed');
    },
  });

  const handleDelete = () => {
    if (confirm('Confirm deletion?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <div
        className="group relative bg-white border border-[var(--color-light-gray)] transition-all duration-200 hover:border-[var(--color-electric)]"
        style={{
          borderRadius: '4px', // Sharper corners
          opacity: deleteMutation.isPending ? 0.5 : 1,
        }}
      >
        {/* Left Status Bar Accent */}
        <div 
           className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${
              task.completed ? 'bg-[var(--color-lime)]' : 'bg-[var(--color-electric)]'
           }`}
        />

        <div className="flex items-start gap-4 p-4 pl-6">
          {/* Tech Checkbox */}
          <div className="relative flex items-center justify-center mt-1">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleMutation.mutate()}
              disabled={toggleMutation.isPending || deleteMutation.isPending}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className={`w-5 h-5 border transition-all duration-200 flex items-center justify-center ${
                task.completed 
                  ? 'bg-[var(--color-navy)] border-[var(--color-navy)]' 
                  : 'bg-white border-gray-300 group-hover:border-[var(--color-electric)]'
              }`}
            >
               {task.completed && (
                 <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                   <path d="M1 5L3.5 7.5L9 1.5" stroke="white" strokeWidth="2" strokeLinecap="square"/>
                 </svg>
               )}
            </div>
          </div>

          {/* Data Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
               <h3
                 className="font-medium text-[0.95rem] leading-6 transition-colors duration-200"
                 style={{
                   color: task.completed ? 'var(--color-gray)' : 'var(--color-navy)',
                   textDecoration: task.completed ? 'line-through' : 'none',
                   fontFamily: 'var(--font-body)',
                 }}
               >
                 {task.title}
               </h3>
               
               {/* Metadata / Actions */}
               <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-4">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="text-xs font-mono font-medium text-[var(--color-electric)] hover:underline uppercase"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-xs font-mono font-medium text-[var(--color-pink)] hover:underline uppercase"
                  >
                    Del
                  </button>
               </div>
            </div>

            {task.description && (
              <p
                className="text-xs mt-1.5 leading-relaxed font-mono"
                style={{
                  color: 'var(--color-gray)',
                }}
              >
                {task.description}
              </p>
            )}

            {error && (
              <p className="text-xs text-[var(--color-pink)] mt-2 font-mono">{error}</p>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
}
