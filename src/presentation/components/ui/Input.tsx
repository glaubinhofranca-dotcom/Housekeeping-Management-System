import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...rest }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <input
        ref={ref}
        {...rest}
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
          placeholder:text-slate-400 focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20
          disabled:bg-slate-50 disabled:text-slate-400 ${error ? 'border-red-400' : ''} ${className}`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  ),
)
Input.displayName = 'Input'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, className = '', children, ...rest }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <select
        ref={ref}
        {...rest}
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
          focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20
          disabled:bg-slate-50 disabled:text-slate-400 ${className}`}
      >
        {children}
      </select>
    </div>
  ),
)
Select.displayName = 'Select'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className = '', ...rest }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <textarea
        ref={ref}
        {...rest}
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
          placeholder:text-slate-400 focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20
          resize-none ${className}`}
      />
    </div>
  ),
)
Textarea.displayName = 'Textarea'
