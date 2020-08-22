import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';

import { Form } from '@unform/web'
import { SubmitHandler, FormHandles, Scope } from '@unform/core';

import { data } from '../../assets/markdown';
import { Iculto } from '../../components/CultoItem';

import Menu from '../../components/Menu';
import Input from '../../components/Form/Input';
import InputMask from '../../components/Form/InputMask';
import RadioInput from '../../components/Form/RadioInput';

import './subscribe.css'

interface CheckboxOption {
    id: string;
    value: string;
    label: string;
}

function Subscribe() {
    const { cultoId } = useParams()
    const [culto, setCulto] = useState<Iculto>();
    const [complemento, setComplemento] = useState(false)
    const [questions, setQuestions] = useState(true)

    const checkboxOptions: CheckboxOption[] = [
        { id: 'true', value: 'true', label: 'Sim' },
        { id: 'false', value: 'false', label: 'Não' },
    ];

    const checkboxOptions15: CheckboxOption[] = [
        { id: 'true', value: 'true', label: 'Sim' },
    ];

    const perguntas: any = [
        { id: "1", question: "1 - VOCÊ TEVE FEBRE NOS ÚLTIMOS 14 DIAS?" },
        { id: "2", question: "2 - VOCÊ TEVE TOSSE NOS ÚLTIMOS 14 DIAS?" },
        { id: "3", question: "3 - VOCÊ APRESENTOU CORIZA NOS ÚLTIMOS 14 DIAS?" },
        { id: "4", question: "4 - VOCÊ APRESENTOU DIARREIA E VÔMITO NAS ÚLTIMAS DUAS SEMANAS?" },
        { id: "5", question: "5 - VOCÊ TEVE ALGUM OUTRO SINTOMA FORA DE SUA ROTINA NAS ÚLTIMAS DUAS SEMANAS?" },
        { id: "6", question: "6 - VOCÊ TEM ALGUMA DOENÇA CRÔNICA?" },
        { id: "7", question: "7 - VOCÊ É HIPERTENSO?" },
        { id: "8", question: "8 - VOCÊ TEM DIABETES?" },
        { id: "9", question: "9 - VOCÊ TEM PROBLEMAS CARDIOLÓGICOS?" },
        { id: "10", question: "10 - VOCÊ FAZ PARTE DE GRUPO DE RISCO?" },
        { id: "11", question: "11 - VOCÊ TEM MAIS DE 60 ANOS?" },
        { id: "12", question: "12 - VOCÊ ESTÁ COM A COVID-19 (CORONAVÍRUS)?" },
        { id: "13", question: "13 - ALGUÉM DE SUA FAMÍLIA ESTÁ COM O CORONAVÍRUS?" },
        { id: "14", question: "14 - TEVE CONTATO COM ALGUÉM QUE ESTÁ COM A COVID-19 NOS ÚLTIMOS 14 DIAS?" },
        { id: "15", question: "15 - ESTÁ CIENTE QUE CASO ALGUMA DAS PERGUNTAS ACIMA SEJA RESPONDIDA POSITIVAMENTE VOCÊ NÃO PODERÁ TER ACESSO AOS CULTOS PRESENCIAS?" }
    ]

    const formRefMain = useRef<FormHandles>(null);
    const formRefQuestion = useRef<FormHandles>(null);

    useEffect(() => {
        const uniqueData: any = data.reduce((prev, current) => {
            return (current.id === cultoId) ? current : prev
        })
        setCulto(uniqueData)
    }, [cultoId]);

    const handleSubmitMain: SubmitHandler<FormData> = (data, { reset }) => {
        console.log({ dados: data, complemento: complemento });

        if (!complemento) { //Buscar
            //verificar se beneficiario existe
            //caso exista... segue...

            //rota se não existir

            setComplemento(!complemento)
        } else { //Cancelar || Finalizar
            if (questions) { //Questionário aberto, verificar e finalizar
                reset()

            } else {
                reset()
                setComplemento(false)
            }
        }
    };

    const handleSubmitQuestion: SubmitHandler<FormData> = (data, { reset }) => {
        console.log({ dados: data, complemento: complemento });

        if (!complemento) { //Buscar
            //verificar se beneficiario existe
            //caso exista... segue...

            //rota se não existir

            setComplemento(!complemento)
        } else { //Cancelar || Finalizar
            if (questions) { //Questionário aberto, verificar e finalizar
                reset()

            } else {
                reset()
                setComplemento(false)
            }
        }
    };

    function HandleSave() {
        const dataSave = formRefMain.current?.getData();
        console.log({ dataSave })
        setComplemento(false)
        setQuestions(true)
    }


    return (
        <div id="page-subscribe">
            <Menu
                title={culto?.name.toUpperCase()}
                description={culto?.description}
                textButton=""
            />
            <div className="body">
                <Form
                    ref={formRefMain}
                    className="form-container"
                    onSubmit={handleSubmitMain}
                >
                    <div className="form-main">
                        <Input
                            name="name"
                            label="Nome Completo"
                            placeholder="Nome (sem abreviações)"
                        />
                        <Input
                            name="dtNascimento"
                            label="Data de Nascimento"
                            type="date"
                        />
                        <InputMask
                            name="cpf"
                            label="CPF"
                            mask="999.999.999-99"
                            placeholder="000.000.000-00"
                        />
                        <button type="submit">
                            {!complemento
                                ? questions ? <p>Cancela</p> : <p>Buscar</p>
                                : <p>Cancelar</p>}
                        </button>
                    </div>
                    {complemento &&
                        <div className="form-complemento">
                            <Input
                                name="email"
                                label="E-mail"
                                type="email"
                                placeholder="email@email.com.br"
                            />
                            <InputMask
                                name="telepone"
                                label="Telefone"
                                mask="(99) 99999-9999"
                                placeholder="(00) 00000-0000"
                            />
                            <button type="button" onClick={HandleSave}>
                                Salvar e Prosseguir
                        </button>
                        </div>
                    }

                </Form>
                {questions &&
                    <>
                        <Form
                            ref={formRefQuestion}
                            className="form-questions"
                            onSubmit={handleSubmitQuestion}
                        >
                            <div className="questions">
                                <h3>Formulário de Inscrição</h3>
                                <Scope path="answers">
                                    <RadioInput name={perguntas[0].id} options={checkboxOptions} label={perguntas[0].question} />
                                    <RadioInput name={perguntas[1].id} options={checkboxOptions} label={perguntas[1].question} />
                                    <RadioInput name={perguntas[2].id} options={checkboxOptions} label={perguntas[2].question} />
                                    <RadioInput name={perguntas[3].id} options={checkboxOptions} label={perguntas[3].question} />
                                    <RadioInput name={perguntas[4].id} options={checkboxOptions} label={perguntas[4].question} />
                                    <RadioInput name={perguntas[5].id} options={checkboxOptions} label={perguntas[5].question} />
                                    <RadioInput name={perguntas[6].id} options={checkboxOptions} label={perguntas[6].question} />
                                    <RadioInput name={perguntas[7].id} options={checkboxOptions} label={perguntas[7].question} />
                                    <RadioInput name={perguntas[8].id} options={checkboxOptions} label={perguntas[8].question} />
                                    <RadioInput name={perguntas[9].id} options={checkboxOptions} label={perguntas[9].question} />
                                    <RadioInput name={perguntas[10].id} options={checkboxOptions} label={perguntas[10].question} />
                                    <RadioInput name={perguntas[11].id} options={checkboxOptions} label={perguntas[11].question} />
                                    <RadioInput name={perguntas[12].id} options={checkboxOptions} label={perguntas[12].question} />
                                    <RadioInput name={perguntas[13].id} options={checkboxOptions} label={perguntas[13].question} />
                                    <RadioInput name={perguntas[14].id} options={checkboxOptions15} label={perguntas[14].question} />
                                </Scope>
                            </div>
                            <button type="submit">Finalizar</button>
                        </Form>

                    </>

                }
            </div>
        </div>
    )
}

export default Subscribe;