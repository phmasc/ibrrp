import React, { useState, FormEvent } from 'react'


import Select from '../../components/Select';
import Input from '../../components/Input';

import './subscribe.css'
import Menu from '../../components/Menu';

function Subscribe() {
    const [status, setStatus] = useState(false);
    const [acompName, setAcompName] = useState('')
    const [acompDtNascimento, setAcompDtNascimento] = useState('')

    const [together, setTogether] = useState([
        { name: '', dtnascimento: '' }
    ])

    const optBoolean = [
        { value: 'Sim', label: 'Sim' },
        { value: 'Não', label: 'Não' },
    ]

    const [optionCulto, setOptionCulto] = useState({
        name: '',
        dtnascimento: '',
        email: '',
        telefone: '',
        culto: '',
        position: '',
        together: [{ name: '', dtnascimento: '' }]
    })

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        await handleChange('together', together)
        console.log(optionCulto)
    }

    function addTogether() {
        console.log({ status, acompName, acompDtNascimento })
        if (!status) {
            return setStatus(true)
        }

        if (acompName && acompDtNascimento) {
            const indexMax = together.length - 1
            const updateTogether = together.map((people, index) => {
                if (index === indexMax && people.name === '') {
                    return { 'name': acompName, 'dtnascimento': acompDtNascimento }
                }
                if (people.name === acompName) {
                    return { 'name': acompName, 'dtnascimento': acompDtNascimento }
                }
                return people
            })
            console.log("update", updateTogether)
            setTogether([
                ...updateTogether,
                { name: '', dtnascimento: '' }
            ])
        }

        console.log(together)
    }

    function deleteTogether(position: number) {
        alert('Deletar o caso')
    }


    function setTogetherItems(position: number, chave: string, valor: string) {
        const updateTogether = together.map((people, index) => {
            if (position === index) {
                return { ...people, [chave]: valor };
            }
            return people
        })
        setTogether(updateTogether)
    }

    const cultosData = [
        { value: '20200812N', label: 'Quarta 20h 12/08/2020 - 5 vagas' },
        { value: '20200816N', label: 'Domingo 19h 09/08/2020 - 12 vagas' },
        { value: '20200819N', label: 'Quarta 20h 19/08/2020 - 32 vagas' },
        { value: '20200823N', label: 'Domingo 19h 23/08/2020 - 40 vagas' },
        { value: '20200826N', label: 'Quarta 20h 26/08/2020 - 39 vagas' },
    ]

    async function handleChange(chave: string, value: any) {
        await setOptionCulto({
            ...optionCulto,
            [chave]: value
        })
    }

    async function detalhar() {
        await handleChange('together', together)
        console.log(together)
        console.log(optionCulto)
    }

    return (
        <div id="page-Subscribe" >
            <Menu
                textButton="Enviando o Formulário"
                visibility={false}
            />
            <form id="subcribe-form" onSubmit={() => handleSubmit}>
                <fieldset>
                    <legend>
                        Cadastro para o Culto Presencial
                        <button
                            type="submit"
                            className="ButtonLink"
                            disabled={true}
                        >
                            Preencha todas as informações
                        </button>
                    </legend>
                    <p>Seus dados pessoais</p>
                    <div className="group-Input">
                        <Input
                            className="field-form"
                            name="name"
                            required={true}
                            label="Nome Completo (sem abreviações)"
                            value={optionCulto.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        <Input
                            className="field-form"
                            name="dtnascimento"
                            label="Data de nascimento"
                            type="date"
                            value={optionCulto.dtnascimento}
                            onChange={(e) => handleChange('dtnascimento', e.target.value)}
                        />
                        <Input
                            className="field-form"
                            name="email"
                            label="E-mail"
                            type="email"
                            value={optionCulto.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                        <Input
                            className="field-form"
                            name="tefelone"
                            label="Telefone"
                            value={optionCulto.telefone}
                            onChange={(e) => handleChange('telefone', e.target.value)}
                        />

                    </div>
                </fieldset>
                <fieldset>
                    <p>Declarações de Saúde</p>
                    <div className="group-Input">
                        <Select
                            className="field-form"
                            name="culto"
                            label="Declaro não ter contato"
                            onChange={(e) => handleChange('culto', e.target.value)}
                            options={optBoolean}
                        />
                    </div>
                </fieldset>
                <fieldset>
                    <p> Opções de Culto</p>
                    <div className="group-Input">
                        <Select
                            className="field-form"
                            name="culto"
                            label="Escolha o culto que gostaria de participar"
                            value={optionCulto.culto}
                            onChange={(e) => handleChange('culto', e.target.value)}
                            options={cultosData}
                        />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        Acompanhantes
                        {(!status) &&
                            <button type="button" onClick={addTogether}>
                                + Acompanhante
                            </button>}
                    </legend>
                    {status
                        ? (
                            <>
                                <h2>Familiares que moram juntamente com você e que irão ao culto</h2>
                                <p>Clique em '+' para inserir outra pessoa</p>

                                <div className="schedule-item">
                                    <Input
                                        className="input-form"
                                        name="namePeople"
                                        label="Nome Completo (sem abreviações)"
                                        value={acompName}
                                        onChange={e => setAcompName(e.target.value)}
                                    />
                                    <Input
                                        className="input-form"
                                        name="dtNascimentoPeople"
                                        label="Data Nascimento"
                                        type="date"
                                        value={acompDtNascimento}
                                        onChange={e => setAcompDtNascimento(e.target.value)}
                                    />
                                    <button className="button-together" type="button" onClick={addTogether}>
                                        +
                                     </button>
                                </div>
                            </>

                        )
                        : (
                            <div>
                                <h3>Clique em '+ Acompanhante' para inserir uma pessoa</h3>
                            </div>
                        )
                    }
                    {(together.length > 1) &&
                        together.map((people, index) => {
                            if (index !== together.length - 1) {
                                return (
                                    <div key={index} className="list-item">
                                        <p>{people.name} </p>
                                        <p>{people.dtnascimento}</p>
                                        <button className="button-together" type="button" onClick={() => deleteTogether(index)}>
                                            -
                                        </button>
                                    </div>
                                )
                            }
                            return ''
                        })
                    }

                </fieldset>
            </form>
            <button onClick={detalhar}>Console log</button>
        </ div >
    )
}

export default Subscribe;