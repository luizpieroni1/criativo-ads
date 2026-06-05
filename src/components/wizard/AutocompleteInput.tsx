'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Props {
  fieldName: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  multiline?: boolean
  rows?: number
}

export default function AutocompleteInput({
  fieldName,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
}: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [allHistory, setAllHistory] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const fetched = useRef(false)

  // Busca o histórico do campo uma única vez ao montar
  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    fetch(`/api/field-history?field=${encodeURIComponent(fieldName)}`)
      .then(r => r.json())
      .then((data: string[]) => setAllHistory(data))
      .catch(() => {})
  }, [fieldName])

  // Filtra sugestões conforme o usuário digita
  useEffect(() => {
    if (!value.trim()) {
      setSuggestions(allHistory.slice(0, 8))
    } else {
      const q = value.toLowerCase()
      setSuggestions(
        allHistory.filter(h => h.toLowerCase().includes(q) && h !== value).slice(0, 8)
      )
    }
    setHighlighted(-1)
  }, [value, allHistory])

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault()
      onChange(suggestions[highlighted])
      setOpen(false)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const sharedProps = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(e.target.value)
      setOpen(true)
    },
    onFocus: () => setOpen(true),
    onKeyDown: handleKeyDown,
    placeholder,
    className: 'input w-full',
  }

  return (
    <div ref={containerRef} className="relative">
      {multiline ? (
        <textarea {...sharedProps} rows={rows} className="input w-full resize-none" />
      ) : (
        <input {...sharedProps} type="text" />
      )}

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-[#1e1e1e] border border-white/15 rounded-xl shadow-xl overflow-hidden">
          {suggestions.map((s, i) => (
            <li
              key={s}
              onMouseDown={() => { onChange(s); setOpen(false) }}
              className={`px-4 py-2.5 text-sm cursor-pointer truncate transition ${
                i === highlighted
                  ? 'bg-orange-500/20 text-orange-300'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
