import React from 'react'

import './styles.css'
import { useHistory } from 'react-router-dom'

export interface Iculto {
    id: string,
    name: string,
    schedule: Date,
    vagas: number,
    idadeMin?: number,
    idadeMax?: number,
    description: string
}


export interface CultoProps {
    culto: Iculto,
}

const Culto: React.FC<CultoProps> = ({ culto }) => {
    const history = useHistory()
    function HandleClick() {
        history.push(`/subscribe/${culto.id}`)
    }

    return (
        <article className="culto-item">
            <header>
                <h2>{culto.name}</h2>
                <strong>{new Intl.DateTimeFormat('pt-BR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                }).format(culto.schedule)}</strong>

            </header>
            <p className='description'>{culto.description}</p>

            <button onClick={HandleClick}>
                <strong>Inscreva-se</strong>
                <p>{culto.vagas} vagas</p>
            </button>
        </article>
    )
}

export default Culto;