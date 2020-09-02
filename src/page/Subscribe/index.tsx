import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';

import { Form } from '@unform/web'
import { SubmitHandler, FormHandles, Scope } from '@unform/core';

import { Iculto } from '../../components/CultoItem';

import Menu from '../../components/Menu';
import Input from '../../components/Form/Input';
import InputMask from '../../components/Form/InputMask';
import RadioInput from '../../components/Form/RadioInput';
import Modal from '../../components/Modal';

import api from '../../service/api';
import calcIdade from '../../service/calcIdade'

import './subscribe.css'

interface CheckboxOption {
    id: string;
    value: string;
    label: string;
}

interface MemberProps {
    name: string,
    email: string,
    cpf: string,
    telefone: string,
    dtNascimento: string,
}

function Subscribe() {
    const { cultoId } = useParams()
    const [culto, setCulto] = useState<Iculto>();
    const [member, setMember] = useState<MemberProps>()
    const [complemento, setComplemento] = useState(false)
    const [questions, setQuestions] = useState(false)
    const [isModal, setIsModal] = useState(true)
    const [textModal, setTextModal] = useState({
        'title': "",
        'description': "",
        'type': ""
    })

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
        { id: "6", question: "6 - VOCÊ FAZ PARTE DE GRUPO DE RISCO? (Diabetes, Hipertensão, Problemas Cardiológicos, Gestante, entre outros)" },
        { id: "7", question: "7 - VOCÊ TRABALHA NA LINHA DE FRENTE DO ENFRENTAMENTO DO COVID-19 (CORONAVÍRUS)? " },
        { id: "8", question: "8 - VOCÊ TEM DIABETES?" },
        { id: "9", question: "9 - VOCÊ TEM PROBLEMAS CARDIOLÓGICOS?" },
        { id: "10", question: "10 - VOCÊ TEM MENOS DE 12 ANOS OU OU MAIS DE 59 ANOS?" },
        { id: "11", question: "11 - VOCÊ ESTÁ COM A COVID-19 (CORONAVÍRUS)?" },
        { id: "12", question: "12 - ALGUÉM DE SUA FAMÍLIA ESTÁ COM O COVID-19 (CORONAVÍRUS)?" },
        { id: "13", question: "13 - TEVE CONTATO COM ALGUÉM QUE ESTÁ COM A COVID-19 NOS ÚLTIMOS 14 DIAS?" },
        { id: "14", question: "14 - ESTÁ CIENTE QUE CASO ALGUMA DAS PERGUNTAS ACIMA SEJA RESPONDIDA POSITIVAMENTE VOCÊ NÃO PODERÁ TER ACESSO AOS CULTOS PRESENCIAS?" }
    ]

    const formRefMain = useRef<FormHandles>(null);
    const formRefQuestion = useRef<FormHandles>(null);

    useEffect(() => {
        setTextModal({
            'title': 'Solicitação Rejeitada',
            'description': 'Sua solicitação foi rejeitada, continue assistindo nossos cultos em www.youtube.com.br/c/igrejabatistariopequeno',
            'type': 'rejected'
        })
    }, [])

    useEffect(() => {
        api.get(`/cultos?id=${cultoId}`)
            .then((result: any) => {
                const uniqueData: any = result.data[0]

                uniqueData.id = cultoId
                delete uniqueData._id

                setCulto(uniqueData)
            })

    }, [cultoId]);

    async function seacherUser(name?: string, dtNascimento?: string, cpf?: string) {
        if (cpf) {
            try {
                return await api.get(`/auth?cpf=${cpf}`)
            } catch (error) {

            }
        }
        if (name) {
            return await api.get(`/auth?name=${name}&dtNascimento=${dtNascimento}`)
        }

        return await api.get(`/auth?cpf=12345678990`)
    }

    const handleSubmitMain: SubmitHandler<FormData> = async (data, { reset }) => {
        if (!complemento) {
            if (questions) {
                reset()
                setComplemento(false)
                setQuestions(false)
            } else {
                //Buscar
                const name = formRefMain.current!.getFieldValue('name');
                const dtNascimento = formRefMain.current!.getFieldValue('dtNascimento');
                const cpf = String(formRefMain.current!.getFieldValue('cpf')).replace('.', '').replace('.', '').replace('.', '').replace('-', '');

                //const cpfClear: string = String(cpf)

                seacherUser(name, dtNascimento, cpf)
                    .then(result => {
                        setMember(result.data.user)
                        localStorage.setItem('token', 'Bearer ' + result.data.token)
                        console.log(result, member)
                    })

                if (member) {
                    habiliteQuestions()
                }
                else {
                    //caso exista... segue...
                    //rota se não existir
                    setComplemento(!complemento)
                }
            }

            // {{!complemento
            //     ? questions ? <p>Cancelar</p> : <p>Buscar</p>
            //     : <p>Cancelar</p>}}

        } else { //Cancelar || Finalizar
            if (questions) { //Questionário aberto, verificar e finalizar
                reset()

            } else {
                reset()
                setComplemento(false)
                setQuestions(false)
            }
        }
    };

    const handleSubmitQuestion: SubmitHandler<FormData> = (data, { reset }) => {

        reset()

        formRefMain.current?.reset()


        habiliteQuestions()
    };

    async function HandleSave() {
        const name = formRefMain.current!.getFieldValue('name');
        const dtNascimento = formRefMain.current!.getFieldValue('dtNascimento');
        const cpf = String(formRefMain.current!.getFieldValue('cpf')).replace('.', '').replace('.', '').replace('.', '').replace('-', '');
        const telefone = formRefMain.current!.getFieldValue('telefone');
        const email = formRefMain.current!.getFieldValue('email');


        console.log({ name, email, cpf, telefone, dtNascimento })

        api.post('/auth/register', { name, email, cpf, telefone, dtNascimento })
            .then(result => {

                setMember(result.data.user)

                localStorage.setItem('token', 'Bearer ' + result.data.token)

            }).catch(err => {
                console.log(err)
            })

        habiliteQuestions()
    }

    function habiliteQuestions() {
        const hoje = Date.now()

        console.log({ hoje: new Date(hoje), nascimento: new Date(member!.dtNascimento) })

        const idade = calcIdade(new Date(member!.dtNascimento), new Date(Date.now()))
        console.log({ idade: idade })

        if (!(idade > 12 && idade < 60)) {
            setTextModal({
                'title': 'Solicitação Rejeitada',
                'description': 'Sua solicitação foi rejeitada, continue assistindo nossos cultos em www.youtube.com.br/c/igrejabatistariopequeno',
                'type': 'rejected'
            })
            setIsModal(true)
        } else {
            setComplemento(false)
            setQuestions(true)
        }
    }

    return (
        <div id="page-subscribe">
            {isModal &&
                <Modal id="modal"
                    title={textModal.title}
                    description={textModal.description}
                    type={textModal.type}
                    onClose={() => setIsModal(false)} >
                    <p>
                        1 Coríntios:10:31 (NVI)
                        <br />
                        Assim, quer vocês comam, bebam ou façam qualquer outra coisa, façam tudo para a glória de Deus.
                    </p>
                </Modal>
            }
            {!isModal &&
                <button onClick={() => setIsModal(true)}>Show Modal</button>
            }
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
                                ? questions ? <p>Cancelar</p> : <p>Buscar</p>
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
                                name="telefone"
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
                                    <RadioInput name={perguntas[13].id} options={checkboxOptions15} label={perguntas[13].question} />
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