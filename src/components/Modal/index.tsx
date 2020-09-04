import React, { ReactChild } from 'react';

import './modal.css'

interface ModalProps {
    id: string,
    title: string,
    type?: string,
    description?: string,
    onClose?: Function,
    children?: ReactChild
}

const Modal: React.FC<ModalProps> = ({ id, title, description, type, onClose, children }) => {

    function HandleOutsideClick(e: any) {
        if (e.target.id === id) { onClose!() }
    }

    console.log(type)

    return (
        <div id={id} className={`modal ${type}`} onClick={(e) => HandleOutsideClick(e)}>
            <div className="container">
                <button className="close" onClick={() => onClose!()} />
                <div className='content'>
                    <h1>{title}</h1>
                    <h2>{description}</h2>
                    <div className="child">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;