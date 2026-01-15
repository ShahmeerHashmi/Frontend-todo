/**
 * Edit task modal component with optimistic concurrency control.
 */

'use client';

import { useState, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { taskAPI, APIError } from '@/lib/api';
import type { Task } from '@/types/task';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditTaskModal({ task, onClose, onSuccess }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateMutation = useMutation({
    mutationFn: (data: { title?: string; description?: string; updated_at: string }) =>
      taskAPI.update(task.id, data),
    onSuccess: () => {
      setErrors({});
      onSuccess();
    },
    onError: (error) => {
      if (error instanceof APIError) {
        if (error.statusCode === 409) {
          setErrors({
            general: 'Task was modified elsewhere. Please refresh and try again.',
          });
        } else {
          const fieldErrors: Record<string, string> = {};
          error.errors.forEach(err => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(Object.keys(fieldErrors).length > 0 ? fieldErrors : { general: error.message });
        }
      } else {
        setErrors({ general: 'Failed to update task' });
      }
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    if (description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    updateMutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      updated_at: task.updated_at,
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-scaleIn"
      style={{
        background: 'rgba(10, 14, 39, 0.6)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full animate-floatIn"
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-float-lg)',
          border: '2px solid var(--color-light-gray)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5 rounded-t-xl"
          style={{
            background: 'linear-gradient(90deg, var(--color-electric) 0%, var(--color-lime) 100%)',
          }}
        />

        <div className="p-8 pt-10">
          <div className="flex justify-between items-center mb-6">
            <h2
              className="text-2xl font-bold"
              style={{
                color: 'var(--color-navy)',
                fontFamily: 'var(--font-display)',
              }}
            >
              Edit Task
            </h2>
            <button
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              style={{
                color: 'var(--color-gray)',
                background: 'var(--color-light-gray)',
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="edit-title" className="form-label">
                Task Title
              </label>
              <input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field font-medium"
                disabled={updateMutation.isPending}
                maxLength={100}
                autoFocus
              />
              {errors.title && <p className="error-message">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="edit-description" className="form-label">
                Description (optional)
              </label>
              <textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field resize-none"
                disabled={updateMutation.isPending}
                maxLength={500}
                rows={4}
                style={{ lineHeight: '1.6' }}
              />
              {errors.description && <p className="error-message">{errors.description}</p>}
            </div>

            {errors.general && (
              <div
                className="px-4 py-3 rounded-xl border-2 text-sm font-medium animate-scaleIn"
                style={{
                  backgroundColor: 'var(--color-pink-light)',
                  borderColor: 'var(--color-pink)',
                  color: 'var(--color-pink)',
                }}
              >
                {errors.general}
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={updateMutation.isPending}
                className="btn-secondary px-6 py-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="btn-primary px-6 py-3"
              >
                {updateMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
