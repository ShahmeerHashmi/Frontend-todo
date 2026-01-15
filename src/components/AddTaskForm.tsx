/**
 * Modern SaaS Add Task Form
 */

'use client';

import { useState, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { taskAPI, APIError } from '@/lib/api';

interface AddTaskFormProps {
  onSuccess: () => void;
}

export function AddTaskForm({ onSuccess }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDescription, setShowDescription] = useState(false);

  const createMutation = useMutation({
    mutationFn: (data: { title: string; description?: string }) =>
      taskAPI.create(data),
    onSuccess: () => {
      setTitle('');
      setDescription('');
      setErrors({});
      setShowDescription(false);
      onSuccess();
    },
    onError: (error) => {
      if (error instanceof APIError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(Object.keys(fieldErrors).length > 0 ? fieldErrors : { general: error.message });
      } else {
        setErrors({ general: 'Failed to create task' });
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

    createMutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
    });
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--color-light-gray)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-float)',
        transition: 'all 0.3s var(--ease-spring)',
      }}
    >
      {/* Accent gradient bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, var(--color-electric) 0%, var(--color-lime) 100%)',
        }}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field text-base font-medium"
            disabled={createMutation.isPending}
            maxLength={100}
            placeholder="What needs to be done?"
            autoComplete="off"
            style={{
              fontSize: '1rem',
              padding: '0.875rem 1rem',
            }}
          />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>

        {showDescription && (
          <div className="animate-scaleIn">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none text-sm"
              disabled={createMutation.isPending}
              maxLength={500}
              rows={3}
              placeholder="Add more details (optional)..."
              style={{
                lineHeight: '1.6',
              }}
            />
            {errors.description && <p className="error-message">{errors.description}</p>}
          </div>
        )}

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

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={createMutation.isPending || !title.trim()}
            className="btn-primary px-6 py-3"
          >
            {createMutation.isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Adding...
              </span>
            ) : (
              'Add task'
            )}
          </button>

          {!showDescription && (
            <button
              type="button"
              onClick={() => setShowDescription(true)}
              className="text-sm px-4 py-2.5 rounded-xl font-semibold transition-all hover:scale-105"
              style={{
                color: 'var(--color-electric)',
                background: 'var(--color-electric-light)',
              }}
            >
              + Description
            </button>
          )}

          {showDescription && (
            <button
              type="button"
              onClick={() => {
                setShowDescription(false);
                setDescription('');
              }}
              className="text-sm px-4 py-2.5 rounded-xl font-medium transition-all hover:bg-gray-100"
              style={{ color: 'var(--color-gray)' }}
            >
              Remove
            </button>
          )}
        </div>
      </form>
    </div>
  );
}