import React, { useEffect, useState } from 'react'



import api from '../../service/api'
import { Iculto } from '../../components/CultoItem';

import Menu from '../../components/Menu';

import './check.css'


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

                const newPart = result.data.member_id.sort((a: any, b: any) => {
                    if (String(a.name).toLocaleLowerCase() < String(b.name).toLocaleLowerCase()) return -1;
                    if (String(a.name).toLocaleLowerCase() > String(b.name).toLocaleLowerCase()) return 1;
                    return 0;
                })

                setParticipants(newPart)
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
                setCultoId(dataFormat[0].id)
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <div id="page-check" >
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
                            <button>{"AssignmentTurnedInOutlinedIcon"}</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="check-cultos">
                <strong>Selecione o culto para listar os participantes</strong>
                <ul>
                    {cultoList.map((culto: Iculto) => (
                        <li key={culto.id}>
                            <button
                                className={
                                    `check-button ${(culto.id === cultoId) ? 'button-selected' : ''}`
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
