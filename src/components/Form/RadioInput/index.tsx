import React, { useEffect, useRef, InputHTMLAttributes } from 'react';
import { useField } from '@unform/core';

import './styles.css'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  options: {
    id: string;
    value: string;
    label: string;
  }[];
}

const RadioInput: React.FC<Props> = ({ name, label, options, ...rest }) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const { fieldName, registerField, defaultValue = '', error } = useField(name);
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRefs.current,
      getValue: (refs: HTMLInputElement[]) => {
        return refs.find(ref => ref.checked)?.value || '';
      },
      setValue: (refs: HTMLInputElement[], id: string) => {
        const inputRef = refs.find(ref => ref.id === id);
        if (inputRef) inputRef.checked = true;
      },
      clearValue: (refs: HTMLInputElement[]) => {
        const inputRef = refs.find(ref => ref.checked === true);
        if (inputRef) inputRef.checked = false;
      },
    });
  }, [defaultValue, fieldName, registerField]);
  return (
    <div id="radio-container">
      {label && <label className="input-label" htmlFor={fieldName}>{label}</label>}
      <div className="input-radio">
        {options.map(option => (
          <label htmlFor={option.id} key={option.id} className="radio-option">
            <input
              ref={ref => inputRefs.current.push(ref as HTMLInputElement)}
              id={option.id}
              type="radio"
              name={name}
              defaultChecked={defaultValue.includes(option.id)}
              value={option.value}
              {...rest}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};
export default RadioInput;