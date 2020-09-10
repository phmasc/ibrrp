import React, { useEffect, useState } from 'react'

import api from '../../service/api'
import { Iculto } from '../../components/CultoItem';

import Menu from '../../components/Menu';

import './list.css'


export default function List() {
    const [cultos, setCultos] = useState<Iculto>();
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        api.get('/cultos/list')
            .then((result: any) => {

                console.log(result.data.member_id)

                setCultos({
                    id: result.data._id,
                    name: result.data.name,
                    schedule: result.data.schedule,
                    vagas: result.data.vagas,
                    description: result.data.description
                })

                setParticipants(result.data.member_id)

            })
            .catch(err => console.log(err))
    }, [])

    return (
        <div id="page-list" >
            <Menu
                title={
                    cultos?.name.toUpperCase()
                    + ' - ' +
                    String(cultos?.schedule).substr(0, 10)
                }
                description={cultos?.description}
                textButton=""
            />
            <div className="container">
                <h2>Listagem dos inscristos:</h2>
                <ul>
                    {participants.map((participant: any, index: number) => (
                        <li key={participant._id}>

                            <p>{participant.name}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div >
    )
}
