import React, { InputHTMLAttributes } from 'react'

import './styles.css'

interface InputPropos extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
}

const Input: React.FC<InputPropos> = ({ name, label, ...rest }) => {
    return (
        <div className="input-block">
            <label htmlFor={name}>{label}</label>
            <input value="" id={name} {...rest}>
            </input>
        </div>
    );
}

export default Input;