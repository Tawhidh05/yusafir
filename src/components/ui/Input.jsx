import { forwardRef, useId } from 'react';

const variants = {
  outline: 'rounded-xl border bg-surface px-4 focus:border-brand focus:ring-2 focus:ring-brand/40',
  filled: 'rounded-xl border border-transparent bg-subtle px-4 font-semibold focus:ring-2 focus:ring-brand/60',
  underline: 'rounded-none border-0 border-b bg-transparent px-0 focus:border-brand',
};

/**
 * Labelled form control. `as` switches between input, textarea and select.
 * The label is tied to the control with htmlFor/id and errors are announced via aria-describedby.
 */
const Input = forwardRef(function Input({ label, error, hint, id, variant = 'outline', as: Tag = 'input', className = '', children, ...props }, ref) {
  const auto = useId();
  const inputId = id || auto;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  const size = Tag === 'textarea' ? 'min-h-28 py-3' : 'h-11';
  const border = error ? 'border-red-500' : variant === 'filled' ? '' : 'border-line';

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <Tag
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`w-full text-ink outline-none transition placeholder:text-mute ${variants[variant]} ${size} ${border}`}
        {...props}
      >
        {children}
      </Tag>
      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1 text-xs text-mute">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
