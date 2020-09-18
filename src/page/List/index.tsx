import React, { useEffect, useState } from 'react'

import api from '../../service/api'
import { Iculto } from '../../components/CultoItem';

import Menu from '../../components/Menu';

import './list.css'


export default function List() {
    const [cultoId, setCultoId] = useState('')
    const [cultoList, setCultoList] = useState([]);
    const [cultos, setCultos] = useState<Iculto>();
    const [participants, setParticipants] = useState([]);

    async function searchCulto(url: string) {
        api.get(url)
            .then((result: any) => {
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
    }

    useEffect(() => {
        if (cultoId) {
            searchCulto(`/cultos/list?id=${cultoId}`)
        } else {
            searchCulto('/cultos/list')
        }
    }, [cultoId])

    useEffect(() => {
        api.get('/cultos?qtd=-1')
            .then((result: any) => {
                const dataFormat = result.data.map((item: any, index: number) => {
                    const { _id, name, schedule, vagas, description } = item

                    const newSchedule = new Date(schedule)

                    return { id: _id, name, schedule: newSchedule, vagas, description }
                })

                setCultoList(dataFormat)

                console.log({ dataFormat })

                setCultoId(dataFormat[0].id)

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
                <h2>Listagem dos inscristos para o culto:</h2>
                <ul>
                    {participants.map((participant: any, index: number) => (
                        <li key={participant._id}>

                            <p>{String(participant.name).toLocaleLowerCase()}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="list-cultos">
                <strong>Selecione o culto para listar os participantes</strong>
                <ul>
                    {cultoList.map((culto: Iculto) => (
                        <li key={culto.id}>
                            <button
                                className={
                                    `list-button ${(culto.id === cultoId) ? 'button-selected' : ''}`
                                }
                                onClick={() => setCultoId(culto.id)}
                            >
                                <strong>{culto.name}</strong>
                                <p>{culto.schedule.toLocaleDateString()}</p>
                            </button>
                        </li>

                    ))}
                </ul>
            </div>
        </div >
    )
}
