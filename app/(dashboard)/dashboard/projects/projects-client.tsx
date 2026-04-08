'use client'

import { useState, useTransition } from 'react'
import { addProject, removeProject } from '@/app/actions'
import type { Project } from '@/lib/db/types'

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete(projectId: string) {
    if (!confirm('Are you sure you want to delete this project?')) return
    startTransition(async () => {
      await removeProject(projectId)
    })
  }

  return (
    <>
      {/* Header */}
      <div
        className="sticky top-0 z-40 shrink-0 flex items-center gap-4"
        style={{
          height: '56px',
          borderBottom: '1px solid var(--dash-border)',
          padding: '0 28px',
          background: 'var(--dash-bg)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--dash-text)',
            flex: 1,
          }}
        >
          Projects
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '6px 16px',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '6px',
            background: 'var(--acid)',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      <div className="flex-1 dashboard-scroll" style={{ padding: '28px' }}>
        {/* New project form */}
        {showForm && (
          <form
            action={async (formData) => {
              startTransition(async () => {
                await addProject(formData)
                setShowForm(false)
              })
            }}
            style={{
              padding: '20px',
              marginBottom: '24px',
              borderRadius: '10px',
              border: '1px solid var(--dash-border)',
              background: 'var(--dash-bg2)',
            }}
          >
            <div style={{ marginBottom: '14px' }}>
              <label
                htmlFor="project-name"
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.1em',
                  color: 'var(--dash-text-muted)',
                  marginBottom: '6px',
                }}
              >
                Project name
              </label>
              <input
                id="project-name"
                name="name"
                type="text"
                required
                maxLength={100}
                placeholder="My awesome project"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '13px',
                  borderRadius: '6px',
                  border: '1px solid var(--dash-border)',
                  background: 'var(--dash-bg)',
                  color: 'var(--dash-text)',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label
                htmlFor="project-desc"
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.1em',
                  color: 'var(--dash-text-muted)',
                  marginBottom: '6px',
                }}
              >
                Description (optional)
              </label>
              <textarea
                id="project-desc"
                name="description"
                rows={2}
                maxLength={500}
                placeholder="What is this project about?"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '13px',
                  borderRadius: '6px',
                  border: '1px solid var(--dash-border)',
                  background: 'var(--dash-bg)',
                  color: 'var(--dash-text)',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              style={{
                padding: '8px 20px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '6px',
                background: 'var(--acid)',
                color: '#000',
                border: 'none',
                cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.6 : 1,
              }}
            >
              {isPending ? 'Creating...' : 'Create Project'}
            </button>
          </form>
        )}

        {/* Projects list */}
        {initialProjects.length === 0 && !showForm ? (
          <div className="text-center" style={{ padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>&#9744;</div>
            <h2
              style={{
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--dash-text)',
                marginBottom: '8px',
              }}
            >
              No projects yet
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--dash-text-muted)', marginBottom: '20px' }}>
              Create your first project to get started.
            </p>
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: '10px 24px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '8px',
                background: 'var(--acid)',
                color: '#000',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              + New Project
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {initialProjects.map((project) => (
              <div
                key={project.id}
                style={{
                  padding: '18px 20px',
                  borderRadius: '10px',
                  border: '1px solid var(--dash-border)',
                  background: 'var(--dash-bg2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, var(--dash-bg3), var(--dash-bg4))',
                    border: '1px solid var(--acid-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-syne), sans-serif',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--acid)',
                    flexShrink: 0,
                  }}
                >
                  {project.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--dash-text)',
                      whiteSpace: 'nowrap' as const,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {project.name}
                  </div>
                  {project.description && (
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--dash-text-muted)',
                        marginTop: '2px',
                        whiteSpace: 'nowrap' as const,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {project.description}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-dm-mono), monospace',
                    fontSize: '11px',
                    color: 'var(--dash-text-muted)',
                    flexShrink: 0,
                  }}
                >
                  {formatDate(project.created_at)}
                </div>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={isPending}
                  style={{
                    padding: '6px 12px',
                    fontSize: '11px',
                    borderRadius: '5px',
                    background: 'transparent',
                    border: '1px solid var(--dash-border)',
                    color: 'var(--dash-text-muted)',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
