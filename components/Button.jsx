'use client'

export function Button({ variant = 'primary', size = 'md', children, onClick, style = {}, ...props }) {
  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: 13 },
    md: { padding: '10px 20px', fontSize: 14.5 },
    lg: { padding: '14px 26px', fontSize: 16 },
  }
  const variantStyles = {
    primary: { background: 'var(--color-blue-600)', color: '#fff', border: 'none' },
    secondary: { background: 'transparent', color: 'var(--color-blue-600)', border: '1.5px solid var(--color-blue-600)' },
    'secondary-dark': { background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,.7)' },
  }
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'inherit',
        fontWeight: 700,
        borderRadius: 8,
        cursor: 'pointer',
        lineHeight: 1.2,
        transition: 'all .15s var(--ease-default)',
        ...sizeStyles[size],
        ...(variantStyles[variant] || variantStyles.primary),
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  )
}
