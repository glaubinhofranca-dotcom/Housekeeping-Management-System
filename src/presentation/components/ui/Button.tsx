import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning'
type Size = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  loading?: boolean
  icon?: ReactNode
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    'bg-[#1e3a5f] hover:bg-[#16304f] text-white border border-[#1e3a5f] shadow-sm',
  secondary:
    'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm',
  ghost:
    'bg-transparent hover:bg-slate-100 text-slate-600 border border-transparent',
  danger:
    'bg-red-600 hover:bg-red-700 text-white border border-red-600 shadow-sm',
  success:
    'bg-green-600 hover:bg-green-700 text-white border border-green-600 shadow-sm',
  warning:
    'bg-amber-500 hover:bg-amber-600 text-white border border-amber-500 shadow-sm',
}

const SIZE_STYLES: Record<Size, string> = {
  xs: 'px-2 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  children,
  loading = false,
  icon,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANT_STYLES[variant]}
        ${SIZE_STYLES[size]}
        ${className}
      `}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
