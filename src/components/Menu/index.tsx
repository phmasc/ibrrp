import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../assets/logo.png'

import './Menu.css'

interface MenuProps {
    textButton: string,
    onClickText?: string,
    visibility?: boolean,
}

const Menu: React.FC<MenuProps> = ({ textButton, onClickText, visibility }) => {
    return (
        <nav className="Menu">
            <Link to="/">
                <img src={Logo} alt="Igreja Batista em Rio Pequeno" className="Logo" />
            </Link>
            <div className="header-text">
                <h1>Cultos Presenciais</h1>
                <h3>LEIA COM ATENÇÃO AS INSTRUÇÕES ABAIXO.</h3>
            </div>
            {visibility &&
                <Link className="ButtonLink" to={() => {
                    console.log(onClickText)
                    if (onClickText === '') {
                        console.log('dentro do none')
                        return ('')
                    }
                    if (onClickText === 'subscribe') {
                        return ('/subscribe')
                    }
                    if (onClickText === 'home') {
                        return ('/')
                    }
                    return ('')
                }
                }>
                    <p>{textButton}</p>
                </Link>
            }
        </nav>
    )
}

export default Menu;