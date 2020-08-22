import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../assets/logo.png'

import './Menu.css'

interface MenuProps {
    title?: string,
    description?: string,
    textButton: string,
    onClickText?: string,
    visibility?: boolean,
}

const Menu: React.FC<MenuProps> = ({ title, description, textButton, onClickText, visibility }) => {
    return (
        <nav className="Menu">
            <Link to="/">
                <img src={Logo} alt="Igreja Batista em Rio Pequeno" className="Logo" />
            </Link>
            <div className="header-text">
                <h1>{title}</h1>
                <h3>{description}</h3>
            </div>
        </nav>
    )
}

export default Menu;