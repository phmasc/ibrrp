import React, { useEffect, useRef, InputHTMLAttributes } from 'react';
import { useField } from '@unform/core';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    options: {
        id: string;
        value: string;
        label: string;
    }[];
}

const Checkbox: React.FC<Props> = ({ name, label, options, ...rest }) => {
    const inputRefs = useRef<HTMLInputElement[]>([]);
    const { fieldName, registerField, defaultValue = [], error } = useField(name);
    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRefs.current,
            getValue: (refs: HTMLInputElement[]) => {
                return refs.filter(ref => ref.checked).map(ref => ref.value);
            },
            clearValue: (refs: HTMLInputElement[]) => {
                refs.forEach(ref => {
                    ref.checked = false;
                });
            },
            setValue: (refs: HTMLInputElement[], values: string[]) => {
                refs.forEach(ref => {
                    if (values.includes(ref.id)) {
                        ref.checked = true;
                    }
                });
            },
        });
    }, [defaultValue, fieldName, registerField]);
    return (
        <div>
            {label && <label className="input-label" htmlFor={fieldName}>{label}</label>}
            {options.map((option, index) => (
                <label htmlFor={option.id} key={option.id}>
                    <input
                        defaultChecked={defaultValue.find((dv: string) => dv === option.id)}
                        ref={ref => {
                            inputRefs.current[index] = ref as HTMLInputElement;
                        }}
                        value={option.value}
                        type="checkbok"
                        id={option.id}
                        {...rest}
                    />
                    {option.label}
                </label>
            ))}
            {error && <span className="input-error">{error}</span>}
        </div>
    );
};
export default Checkbox;