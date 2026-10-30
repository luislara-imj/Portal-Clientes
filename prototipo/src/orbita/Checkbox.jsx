import { forwardRef, useEffect, useId, useImperativeHandle, useRef } from 'react';
import { cx } from './cx.js';
import './Checkbox.css';

/**
 * Checkbox de Órbita (§12.3). Input nativo (accesible) con caja dibujada de 16 × 16.
 * label, helper · checked / defaultChecked · indeterminate · disabled · error
 * Sin label visible pasa `aria-label`. state="hover" | "focus": solo galería.
 */
export const Checkbox = forwardRef(function Checkbox(
  { label, helper, indeterminate = false, error = false, disabled = false, state, className, id: idProp, ...rest },
  ref
) {
  const autoId = useId();
  const id = idProp ?? `cb-${autoId}`;
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => inputRef.current);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div
      className={cx('ui-checkbox', error && 'is-error', disabled && 'is-disabled', className)}
      data-state={state}
    >
      <span className="ui-checkbox__control">
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          className="ui-checkbox__input"
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={helper ? `${id}-help` : undefined}
          {...rest}
        />
        <span className="ui-checkbox__box" aria-hidden="true">
          <svg className="ui-checkbox__check" viewBox="0 0 10 8" focusable="false">
            <path d="M1 4.2 3.7 7 9 1" />
          </svg>
          <span className="ui-checkbox__dash" />
        </span>
      </span>
      {(label || helper) && (
        <span className="ui-checkbox__text">
          {label && (
            <label className="ui-checkbox__label" htmlFor={id}>
              {label}
            </label>
          )}
          {helper && (
            <span id={`${id}-help`} className="ui-checkbox__helper">
              {helper}
            </span>
          )}
        </span>
      )}
    </div>
  );
});

export default Checkbox;
