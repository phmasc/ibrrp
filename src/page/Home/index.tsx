import React, { useState, useEffect } from 'react'
import Markdown from 'react-markdown'

import Menu from '../../components/Menu';
import CultoItem, { Iculto } from '../../components/CultoItem';

import './home.css'

import { diretrizes, data } from '../../assets/markdown'


function Home() {
    const [cultos, setCultos] = useState([]);

    useEffect(() => {
        const dados: any = data

        setCultos(dados)
    }, [])

    return (
        <div id="page-home" >
            <Menu
                title="CULTOS PRESENCIAIS"
                description="LEIA COM ATENÇÃO AS INSTRUÇÕES."
                textButton="Increva-se para o culto presencial aqui" onClickText='subscribe'
            />
            <div className="diretrizes">
                <Markdown source={diretrizes} />
                <div className="list-cultos">
                    <h1>Escolha seu culto</h1>
                    {cultos.map((culto: Iculto) => {
                        return <CultoItem key={culto.id} culto={culto} />
                    })

                    }
                </div>
            </div>
        </ div >
    )
}

export default Home;

