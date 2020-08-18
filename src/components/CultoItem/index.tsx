import React from 'react'

import './styles.css'

export interface Iculto {
    id: string,
    name: string,
    datatime: string,
    vagas: number,
    description: string
}


export interface CultoProps {
    culto: Iculto,
}

const Culto: React.FC<CultoProps> = ({ culto }) => {
    return (
        <article className="culto-item">
            <header>
                <h2>{culto.name}</h2>
                <strong>{culto.datatime}</strong>
            </header>
            <p className='description'>{culto.description}</p>

            <button onClick={() => { alert(`Culto selecionado foi ${culto.description}`) }}>
                <strong>Inscreva-se</strong>
                <p>{culto.vagas} vagas</p>
            </button>
        </article>
    )
}

export default Culto;