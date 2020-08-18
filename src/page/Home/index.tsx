import React, { useState, useEffect } from 'react'
import Markdown from 'react-markdown'

import Menu from '../../components/Menu';
import CultoItem, { Iculto } from '../../components/CultoItem';

import './home.css'

import { diretrizes } from '../../assets/markdown'


function Home() {
    const [cultos, setCultos] = useState([]);

    useEffect(() => {
        const dados: any = [{
            id: '20200822N',
            name: 'Conciência Bíblica: A Igreja',
            datatime: '2020-08-16 20hs',
            vagas: 25,
            description: 'Identidade com Pastor Almir T.'
        },
        {
            id: '20200823N',
            name: 'Conciência Bíblica: A Igreja',
            datatime: '2020-08-23 20hs',
            vagas: 32,
            description: 'Contemporaneidade com Pastor Marcos P.'
        },
        {
            id: '20200823M',
            name: 'Conciência Bíblica: A Igreja - EBD',
            datatime: '2020-08-24 09hs',
            vagas: 40,
            description: 'Com Aulão sobre Eclesiologia, com os nossos pastores'
        },
        {
            id: '20200824N',
            name: 'Conciência Bíblica: A Igreja',
            datatime: '2020-08-24 19hs',
            vagas: 40,
            description: 'Mutualidade com Pastor Wagner Amaral.'
        }]

        setCultos(dados)
    }, [])

    return (
        <div id="page-home" >
            <Menu textButton="Increva-se para o culto presencial aqui" onClickText='subscribe' />
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

// https://github.com/sinval-albuquerque/proffyProject/blob/master/web/src/pages/TeacherList/index.tsx