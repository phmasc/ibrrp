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
    const [questions, setQuestions] = useState(false)

    const checkboxOptions: CheckboxOption[] = [
        { id: 'true', value: 'true', label: 'Sim' },
        { id: 'false', value: 'false', label: 'Não' },
    ];

    const checkboxOptions15: CheckboxOption[] = [
        { id: 'true', value: 'true', label: 'Sim' },
    ];


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
                    {complemento &&
                        <div className="complemento">
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
                                    <RadioInput name="1" options={checkboxOptions} label="1 - VOCÊ TEVE FEBRE NOS ÚLTIMOS 14 DIAS?" />
                                    <RadioInput name="2" options={checkboxOptions} label="2 - VOCÊ TEVE TOSSE NOS ÚLTIMOS 14 DIAS?" />
                                    <RadioInput name="3" options={checkboxOptions} label="3 - VOCÊ APRESENTOU CORIZA NOS ÚLTIMOS 14 DIAS?" />
                                    <RadioInput name="4" options={checkboxOptions} label="4 - VOCÊ APRESENTOU DIARREIA E VÔMITO NAS ÚLTIMAS DUAS SEMANAS?" />
                                    <RadioInput name="5" options={checkboxOptions} label="5 - VOCÊ TEVE ALGUM OUTRO SINTOMA FORA DE SUA ROTINA NAS ÚLTIMAS DUAS SEMANAS?" />
                                    <RadioInput name="6" options={checkboxOptions} label="6 - VOCÊ TEM ALGUMA DOENÇA CRÔNICA?" />
                                    <RadioInput name="7" options={checkboxOptions} label="7 - VOCÊ É HIPERTENSO?" />
                                    <RadioInput name="8" options={checkboxOptions} label="8 - VOCÊ TEM DIABETES?" />
                                    <RadioInput name="9" options={checkboxOptions} label="9 - VOCÊ TEM PROBLEMAS CARDIOLÓGICOS?" />
                                    <RadioInput name="10" options={checkboxOptions} label="10 - VOCÊ FAZ PARTE DE GRUPO DE RISCO?" />
                                    <RadioInput name="11" options={checkboxOptions} label="11 - VOCÊ TEM MAIS DE 60 ANOS?" />
                                    <RadioInput name="12" options={checkboxOptions} label="12 - VOCÊ ESTÁ COM A COVID-19 (CORONAVÍRUS)? " />
                                    <RadioInput name="13" options={checkboxOptions} label="13 - ALGUÉM DE SUA FAMÍLIA ESTÁ COM O CORONAVÍRUS?" />
                                    <RadioInput name="14" options={checkboxOptions} label="14 - TEVE CONTATO COM ALGUÉM QUE ESTÁ COM A COVID-19 NOS ÚLTIMOS 14 DIAS? " />
                                    <RadioInput name="15" options={checkboxOptions15} label="15 - ESTÁ CIENTE QUE CASO ALGUMA DAS PERGUNTAS ACIMA SEJA RESPONDIDA POSITIVAMENTE VOCÊ NÃO PODERÁ TER ACESSO AOS CULTOS PRESENCIAS?" />
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