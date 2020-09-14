import React, { InputHTMLAttributes, useRef, useEffect } from 'react'
import { useField } from '@unform/core'

import './styles.css'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    name: string,
    label?: string,
}

const Input: React.FC<Props> = ({ name, label, ...rest }) => {
    const inputRef = useRef(null);
    const { fieldName, registerField, defaultValue, error } = useField(name);

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            path: 'value',
        });
    }, [fieldName, registerField]);

    return (
        <div id="input-container" className={`${error ? 'error' : ''}`}>
            {label && <label className="input-label" htmlFor={fieldName}>{label}</label>}
            <input
                id={fieldName}
                ref={inputRef}
                defaultValue={defaultValue}
                {...rest}
            />
            { error && <span className="input-error">{error}</span>}
        </div >
    );
}

export default Input;