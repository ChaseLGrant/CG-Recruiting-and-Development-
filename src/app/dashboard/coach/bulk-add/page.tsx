'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { DashboardShell } from '@/components/dashboard-shell'
import { POSITIONS } from '@/lib/types'
import type { BulkPlayerRow, Program } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

const navItems = [
  { label: 'Program Profile', href: '/dashboard/coach' },
  { label: 'Bulk Add Players', href: '/dashboard/coach/bulk-add' },
  { label: 'Manage Players', href: '/dashboard/coach/players' },
]

const EMPTY_ROW = (): BulkPlayerRow => ({
  _rowId: uuidv4(),
  name: '',
  position_primary: '',
  grad_year: '',
  availability_start: '',
  availability_end: '',
  contact_email: '',
  contact_phone: '',
  bats: '',
  throws: '',
  height: '',
  weight: '',
  video_url: '',
  notes: '',
})

interface Column {
  key: string
  label: string
  width: string
  type?: 'select' | 'date'
  options?: readonly string[]
}

const COLUMNS: Column[] = [
  { key: 'name', label: 'Name *', width: 'w-40' },
  { key: 'position_primary', label: 'Position *', width: 'w-28', type: 'select', options: POSITIONS },
  { key: 'grad_year', label: 'Grad Year *', width: 'w-24' },
  { key: 'availability_start', label: 'Avail Start *', width: 'w-36', type: 'date' },
  { key: 'availability_end', label: 'Avail End *', width: 'w-36', type: 'date' },
  { key: 'contact_email', label: 'Email *', width: 'w-44' },
  { key: 'contact_phone', label: 'Phone', width: 'w-32' },
  { key: 'bats', label: 'Bats', width: 'w-20', type: 'select', options: ['R', 'L', 'S'] },
  { key: 'throws', label: 'Throws', width: 'w-20', type: 'select', options: ['R', 'L'] },
  { key: 'height', label: 'Height', width: 'w-24' },
  { key: 'weight', label: 'Weight', width: 'w-24' },
  { key: 'video_url', label: 'Video URL', width: 'w-44' },
  { key: 'notes', label: 'Notes', width: 'w-44' },
]

export default function BulkAddPage() {
  const supabase = createClient()
  const [rows, setRows] = useState<BulkPlayerRow[]>([EMPTY_ROW(), EMPTY_ROW(), EMPTY_ROW()])
  const [program, setProgram] = useState<Program | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadProgram()
  }, [])

  async function loadProgram() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('programs')
      .select('*')
      .eq('created_by', user.id)
      .single()
    if (data) setProgram(data)
  }

  const addRow = () => setRows(prev => [...prev, EMPTY_ROW()])

  const addRows = (count: number) => {
    const newRows = Array.from({ length: count }, () => EMPTY_ROW())
    setRows(prev => [...prev, ...newRows])
  }

  const removeRow = (rowId: string) => {
    setRows(prev => prev.filter(r => r._rowId !== rowId))
  }

  const updateCell = useCallback((rowId: string, key: string, value: string) => {
    setRows(prev => prev.map(r =>
      r._rowId === rowId ? { ...r, [key]: value, _error: undefined } : r
    ))
  }, [])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text/plain')
    if (!text.includes('\t') && !text.includes('\n')) return

    e.preventDefault()
    const lines = text.trim().split('\n').filter(l => l.trim())
    const newRows: BulkPlayerRow[] = lines.map(line => {
      const cells = line.split('\t')
      const row = EMPTY_ROW()
      const keys = ['name', 'position_primary', 'grad_year', 'availability_start', 'availability_end', 'contact_email', 'contact_phone', 'bats', 'throws', 'height', 'weight', 'video_url', 'notes']
      keys.forEach((key, i) => {
        if (cells[i]?.trim()) {
          (row as unknown as Record<string, string>)[key] = cells[i].trim()
        }
      })
      return row
    })

    setRows(prev => {
      const nonEmpty = prev.filter(r => r.name || r.contact_email)
      return [...nonEmpty, ...newRows]
    })
  }, [])

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n').filter(l => l.trim())
      // Skip header row
      const dataLines = lines.slice(1)
      const newRows: BulkPlayerRow[] = dataLines.map(line => {
        const cells = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
        const row = EMPTY_ROW()
        const keys = ['name', 'position_primary', 'grad_year', 'availability_start', 'availability_end', 'contact_email', 'contact_phone', 'bats', 'throws', 'height', 'weight', 'video_url', 'notes']
        keys.forEach((key, i) => {
          if (cells[i]?.trim()) {
            (row as unknown as Record<string, string>)[key] = cells[i].trim()
          }
        })
        return row
      })

      setRows(prev => {
        const nonEmpty = prev.filter(r => r.name || r.contact_email)
        return [...nonEmpty, ...newRows]
      })
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const downloadTemplate = () => {
    const headers = 'Name,Position,Grad Year,Avail Start (YYYY-MM-DD),Avail End (YYYY-MM-DD),Email,Phone,Bats,Throws,Height,Weight,Video URL,Notes'
    const sample = 'John Smith,SS,2026,2026-06-01,2026-08-15,john@school.edu,555-0123,R,R,6-1,190,https://example.com/video,Good glove'
    const csv = headers + '\n' + sample
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'player_upload_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function validate(): boolean {
    let valid = true
    const updated = rows.map(row => {
      const errors: string[] = []
      if (!row.name.trim()) errors.push('Name required')
      if (!row.position_primary) errors.push('Position required')
      if (!row.grad_year) errors.push('Grad year required')
      if (!row.availability_start) errors.push('Start date required')
      if (!row.availability_end) errors.push('End date required')
      if (!row.contact_email.trim()) errors.push('Email required')
      if (row.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.contact_email)) {
        errors.push('Invalid email')
      }
      if (errors.length) {
        valid = false
        return { ...row, _error: errors.join(', ') }
      }
      return { ...row, _error: undefined }
    })
    setRows(updated)
    return valid
  }

  async function handleSubmit() {
    if (!validate()) return
    if (!program) {
      setResults({ success: 0, errors: ['Please create a program profile first.'] })
      return
    }

    setSubmitting(true)
    setResults(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const toInsert = rows.filter(r => !r._saved).map(row => ({
      program_id: program.id,
      created_by_coach_id: user.id,
      name: row.name.trim(),
      position_primary: row.position_primary,
      grad_year: parseInt(row.grad_year),
      availability_start: row.availability_start,
      availability_end: row.availability_end,
      contact_email: row.contact_email.trim(),
      contact_phone: row.contact_phone.trim() || null,
      bats: row.bats || null,
      throws: row.throws || null,
      height: row.height.trim() || null,
      weight: row.weight.trim() || null,
      video_url: row.video_url.trim() || null,
      availability_notes: row.notes.trim() || null,
    }))

    const { data, error } = await supabase
      .from('players')
      .insert(toInsert)
      .select()

    if (error) {
      setResults({ success: 0, errors: [error.message] })
    } else {
      setResults({ success: data.length, errors: [] })
      setRows(rows.map(r => ({ ...r, _saved: true })))
    }
    setSubmitting(false)
  }

  return (
    <DashboardShell title="Coach Dashboard" navItems={navItems}>
      <div className="space-y-6">
        {!program && (
          <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
            Please create a program profile first before adding players.
          </div>
        )}

        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold">Bulk Add Players</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={downloadTemplate}
                className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
              >
                Download CSV Template
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
              >
                Upload CSV
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleCSVUpload}
              />
            </div>
          </div>

          <div className="mb-3 rounded-lg bg-surface-2 px-4 py-2.5 text-xs text-muted">
            <strong>Tip:</strong> Copy rows from Google Sheets or Excel and paste directly into any cell below.
            Columns: Name | Position | Grad Year | Start Date | End Date | Email | Phone | B | T | Height | Weight | Video | Notes
          </div>

          {/* Spreadsheet grid */}
          <div className="overflow-x-auto rounded-lg border border-border" onPaste={handlePaste}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2">
                  <th className="w-8 px-2 py-2 text-center text-xs font-medium text-muted">#</th>
                  {COLUMNS.map(col => (
                    <th key={col.key} className={`${col.width} px-2 py-2 text-left text-xs font-medium text-muted`}>
                      {col.label}
                    </th>
                  ))}
                  <th className="w-10 px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={row._rowId}
                    className={`border-b border-border/50 ${row._error ? 'bg-error/5' : row._saved ? 'bg-success/5' : ''}`}
                  >
                    <td className="px-2 py-1 text-center text-xs text-muted">{idx + 1}</td>
                    {COLUMNS.map(col => (
                      <td key={col.key} className="px-1 py-1">
                        {col.type === 'select' ? (
                          <select
                            value={(row as unknown as Record<string, string>)[col.key] || ''}
                            onChange={e => updateCell(row._rowId, col.key, e.target.value)}
                            disabled={row._saved}
                            className="w-full rounded border border-transparent bg-transparent px-2 py-1.5 text-sm focus:border-accent focus:bg-surface-2 focus:outline-none disabled:opacity-50"
                          >
                            <option value="">—</option>
                            {col.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={col.type === 'date' ? 'date' : 'text'}
                            value={(row as unknown as Record<string, string>)[col.key] || ''}
                            onChange={e => updateCell(row._rowId, col.key, e.target.value)}
                            disabled={row._saved}
                            className="w-full rounded border border-transparent bg-transparent px-2 py-1.5 text-sm focus:border-accent focus:bg-surface-2 focus:outline-none disabled:opacity-50"
                            placeholder={col.key === 'name' ? 'Player name' : ''}
                          />
                        )}
                      </td>
                    ))}
                    <td className="px-1 py-1">
                      {!row._saved && (
                        <button
                          onClick={() => removeRow(row._rowId)}
                          className="rounded p-1 text-muted hover:text-error"
                          title="Remove row"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Row errors */}
          {rows.some(r => r._error) && (
            <div className="mt-3 space-y-1">
              {rows.map((r, i) =>
                r._error ? (
                  <div key={r._rowId} className="text-xs text-error">
                    Row {i + 1}: {r._error}
                  </div>
                ) : null
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={addRow}
              className="rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
            >
              + Add Row
            </button>
            <button
              onClick={() => addRows(5)}
              className="rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
            >
              + Add 5 Rows
            </button>
            <button
              onClick={() => addRows(10)}
              className="rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
            >
              + Add 10 Rows
            </button>
            <div className="flex-1" />
            <button
              onClick={() => validate()}
              className="rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
            >
              Validate
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !program || rows.every(r => r._saved)}
              className="rounded-lg bg-accent px-6 py-2 font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit All Players'}
            </button>
          </div>

          {results && (
            <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${results.errors.length ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
              {results.errors.length > 0 ? (
                <div>
                  <strong>Errors:</strong>
                  {results.errors.map((e, i) => <div key={i}>{e}</div>)}
                </div>
              ) : (
                <div>Successfully added {results.success} player{results.success !== 1 ? 's' : ''}!</div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
