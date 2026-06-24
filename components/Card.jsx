'use client'

export function Card({ variant, padding, radius, children, onClick, style = {}, ...props }) {
  const padMap = { sm: 12, md: 16, lg: 20 }
  const radMap = { sm: 8, md: 12, lg: 16 }
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        ...(variant === 'bordered'
          ? { border: '1px solid var(--color-neutral-200)' }
          : { boxShadow: 'var(--shadow-sm)' }),
        borderRadius: radMap[radius] || 12,
        padding: padMap[padding] || 20,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
