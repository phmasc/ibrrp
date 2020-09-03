import React, { useState, useEffect } from 'react'
import Markdown from 'react-markdown'

import api from '../../service/api'

import Menu from '../../components/Menu';
import CultoItem, { Iculto } from '../../components/CultoItem';

import './home.css'

import { diretrizes } from '../../assets/markdown'


function Home() {
    const [cultos, setCultos] = useState([]);

    useEffect(() => {
        api.get('/cultos')
            .then((result: any) => {
                console.log(result)
                const dataFormat = result.data.map((item: any, index: number) => {
                    const { _id, name, schedule, vagas, description } = item

                    const newSchedule = new Date(schedule)

                    return { id: _id, name, schedule: newSchedule, vagas, description }
                })

                setCultos(dataFormat)
            })
            .catch(err => console.log(err))
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

