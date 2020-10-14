import React, { useEffect, useState, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom';

import { Form } from '@unform/web'
import { SubmitHandler, FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Menu from '../../components/Menu';
import Modal from '../../components/Modal';
import { Iculto } from '../../components/CultoItem';

import Input from '../../components/Form/Input';
import InputMask from '../../components/Form/InputMask';
import RadioInput from '../../components/Form/RadioInput';

import api from '../../service/api';
import calcIdade from '../../service/calcIdade'

import './subscribe.css'

interface CheckboxOption {
    id: string;
    value: string;
    label: string;
}

interface MemberProps {
    _id: string,
    name: string,
    email: string,
    cpf: string,
    telefone: string,
    dtNascimento: string,
}

function Subscribe() {
    const { cultoId } = useParams()
    const history = useHistory();

    const [culto, setCulto] = useState<Iculto>();
    const [member, setMember] = useState<MemberProps>()
    const [complemento, setComplemento] = useState(false)
    const [questions, setQuestions] = useState(false)

    //Campos para Modal
    const [isModal, setIsModal] = useState(false)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState('')

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

    const initialMember: MemberProps = {
        _id: '',
        name: '',
        email: '',
        cpf: '',
        telefone: '',
        dtNascimento: '',
    }

    useEffect(() => {
        api.get(`/cultos?id=${cultoId}`)
            .then((result: any) => {
                const uniqueData: any = result.data[0]

                uniqueData.id = cultoId
                delete uniqueData._id

                if (!uniqueData.idadeMin) uniqueData.idadeMin = 12
                if (!uniqueData.idadeMax) uniqueData.idadeMax = 60

                setCulto(uniqueData)
            })

    }, [cultoId]);

    useEffect(() => {
        if (questions) {
            formRefMain.current?.setFieldValue('name', member?.name)
            formRefMain.current?.setFieldValue('dtNascimento', member?.dtNascimento.substr(0, 10))
        }
    }, [questions, member])

    async function seacherUser(name?: string, dtNascimento?: string, cpf?: string): Promise<any> {
        if (cpf) {
            return new Promise((resolve, reject) => {
                api.get(`/auth?cultoId=${cultoId}&cpf=${cpf}`)
                    .then(result => { resolve(result) })
                    .catch(error => {
                        console.log({ error, 'url': `/auth?cpf=${cpf}` })
                        reject(error)
                    })
            })
        }
        if (name) {
            return new Promise((resolve, reject) => {
                api.get(`/auth?cultoId=${cultoId}&name=${name}&dtNascimento=${dtNascimento}`)
                    .then(result => { resolve(result) })
                    .catch(error => {
                        console.log({ error, 'url': `/auth?name=${name}&dtNascimento=${dtNascimento}` })
                        reject(error)
                    })
            })
        }
    }

    function OpenModal(title: string, description: string, type: string) {
        setTitle(title)
        setDescription(description)
        setType(type)
        setIsModal(true)
    }

    function closeModal() {
        setIsModal(false)
        formRefQuestion.current?.reset()
        formRefMain.current?.reset()
        history.push('/')
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

                //const result = await 
                seacherUser(name, dtNascimento, cpf)
                    .then(result => {
                        localStorage.setItem('token', 'Bearer ' + result.data.token)

                        setMember(result.data.user)

                        const warn = result.data.warn[0]

                        console.log({ user: result.data.user, warn })


                        if (warn.type === "duplicate") {
                            OpenModal(
                                warn.title,
                                warn.description,
                                warn.type
                            )
                        }

                        habiliteQuestions(result.data.user!.dtNascimento)
                    })
                    .catch(error => {
                        setComplemento(!complemento)
                    })

            }
        } else { //Cancelar
            if (questions) { //Questionário aberto, verificar e finalizar
                reset()
                setMember(initialMember)
            } else {
                reset()
                setMember(initialMember)
                setComplemento(false)
                setQuestions(false)
            }
        }
    };

    const handleSubmitQuestion: SubmitHandler<FormData> = async (data, { reset }) => {
        try {
            formRefQuestion.current?.setErrors({})
            const schema = Yup.object().shape({
                'r0': Yup.string().min(4, 'Esta questão é obrigatória'),
                'r1': Yup.string().min(4, 'Esta questão é obrigatória'),
                'r2': Yup.string().min(4, 'Esta questão é obrigatória'),
                'r3': Yup.string().min(4, 'Esta questão é obrigatória'),
                'r4': Yup.string().min(4, 'Esta questão é obrigatória'),
                'r5': Yup.string().min(4, 'Esta questão é obrigatória'),
                'r6': Yup.string().min(4, 'Esta questão é obrigatória'),
                'r7': Yup.string().min(4, 'Esta questão é obrigatória'),
                'r8': Yup.string().min(4, 'Esta questão é obrigatória'),
                'r9': Yup.string().min(4, 'Esta questão é obrigatória'),
                'r10': Yup.string().min(4, 'Esta questão é obrigatória'),
                'r11': Yup.string().min(4, 'Esta questão é obrigatória'),
                'r12': Yup.string().min(4, 'Esta questão é obrigatória'),
                'r13': Yup.string().min(4, 'Esta questão é obrigatória'),
                'r14': Yup.string().min(4, 'Esta questão é obrigatória'),
            })
            await schema.validate(data, { abortEarly: false, })

            const able = Object.keys(data).reduce((prevValue, key) => {
                return (!prevValue ? (key !== "r14" && data[key] === "true") : prevValue)
            }, false)

            if (able) {
                OpenModal(
                    'Solicitação Rejeitada',
                    'Sua solicitação foi rejeitada, continue assistindo nossos cultos em www.youtube.com.br/c/igrejabatistariopequeno',
                    'rejected'
                )
            } else {
                const dataSend = {
                    'id': member?._id,
                    'cultoId': cultoId
                }

                try {
                    const warn = await api.post('/auth/booking', dataSend)
                    OpenModal(
                        warn.data.title,
                        warn.data.description,
                        warn.data.type
                    )
                } catch (error) { console.log(error) }


            }
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const MessageError = {}
                err.inner.forEach((error: any) => {
                    MessageError[error.path] = error.message;
                })
                formRefQuestion.current?.setErrors(MessageError)
            }
        }
    };

    function formatDate(date: any) {
        return new Date(date).toLocaleDateString()
    }

    async function HandleSave() {
        try {
            formRefMain.current?.setErrors({})
            const referencia: Date = new Date("2020-01-01T03:00:00");

            const schema = Yup.object().shape({
                "name": Yup.string()
                    .required('O nome é obrigatório')
                    .matches(/[a-z]\s[a-z]/i, 'Insira o nome completo'),
                "dtNascimento": Yup.date()
                    .required('A data de nascimento é obrigaória')
                    .typeError('A data é obrigatória')
                    .max(referencia, ({ max }) => `É necessário uma data anterior a ${formatDate(max)}`),
                "cpf": Yup.string().required('O CPF é obrigatório'),
                "email": Yup.string().email('É necessário um e-mail valido').required('O e-mail é obrigatório'),
            })

            const name = formRefMain.current!.getFieldValue('name');
            const dtNascimento = formRefMain.current!.getFieldValue('dtNascimento');
            const cpf = String(formRefMain.current!.getFieldValue('cpf')).replace('.', '').replace('.', '').replace('.', '').replace('-', '');
            const telefone = formRefMain.current!.getFieldValue('telefone');
            const email = formRefMain.current!.getFieldValue('email');

            await schema.validate({ name, dtNascimento, cpf, telefone, email }, { abortEarly: false, })


            api.post('/auth/register', { name, email, cpf, telefone, dtNascimento })
                .then(result => {
                    localStorage.setItem('token', 'Bearer ' + result.data.token)
                    setMember(result.data.user)
                    habiliteQuestions(result.data.user!.dtNascimento)
                }).catch(err => { console.log('Erro da API', err) })

        } catch (err) {
            console.log(`HandleSaveCatch err: ${err}`)
            if (err instanceof Yup.ValidationError) {
                const MessageError = {}
                err.inner.forEach((error: any) => {
                    MessageError[error.path] = error.message;
                })
                formRefMain.current?.setErrors(MessageError)
            }
        }



    }

    function habiliteQuestions(dtNascimento: string) {
        const idade = calcIdade(new Date(dtNascimento), new Date(Date.now()))

        console.log(`Habilite Questions dtnasc ${dtNascimento} com idade ${idade}`)


        if (!(idade >= (culto?.idadeMin || 12) && idade < (culto?.idadeMax || 60))) {
            OpenModal(
                'Solicitação Rejeitada',
                'Sua solicitação foi rejeitada, continue assistindo nossos cultos em www.youtube.com.br/c/igrejabatistariopequeno',
                'rejected'
            )
        } else {
            setComplemento(false)
            setQuestions(true)
            //formRefMain.current?.reset()
        }
    }

    return (
        <div id="page-subscribe">
            {isModal &&
                <Modal id="modal"
                    title={title}
                    description={description}
                    type={type}
                    onClose={() => closeModal()} >
                    <div>
                        {type && (type === "duplicate")
                            ?
                            <button> Caroquinha</button>
                            :
                            ''
                        }
                        <footer>
                            Hebreus 13:17 (NVI)
                        <br />
                    Obedeçam aos seus líderes e submetam-se à autoridade deles.
                    Eles cuidam de vocês como quem deve prestar contas. Obedeçam-lhes, para que o trabalho deles seja uma alegria e não um peso, pois isso não seria proveitoso para vocês.

                    </footer>
                    </div>
                </Modal>
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
                            <button type="button" onClick={HandleSave} className='save-button'>
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
                                <RadioInput name={'r' + perguntas[0].id} options={checkboxOptions} label={perguntas[0].question} />
                                <RadioInput name={'r' + perguntas[1].id} options={checkboxOptions} label={perguntas[1].question} />
                                <RadioInput name={'r' + perguntas[2].id} options={checkboxOptions} label={perguntas[2].question} />
                                <RadioInput name={'r' + perguntas[3].id} options={checkboxOptions} label={perguntas[3].question} />
                                <RadioInput name={'r' + perguntas[4].id} options={checkboxOptions} label={perguntas[4].question} />
                                <RadioInput name={'r' + perguntas[5].id} options={checkboxOptions} label={perguntas[5].question} />
                                <RadioInput name={'r' + perguntas[6].id} options={checkboxOptions} label={perguntas[6].question} />
                                <RadioInput name={'r' + perguntas[7].id} options={checkboxOptions} label={perguntas[7].question} />
                                <RadioInput name={'r' + perguntas[8].id} options={checkboxOptions} label={perguntas[8].question} />
                                <RadioInput name={'r' + perguntas[9].id} options={checkboxOptions} label={perguntas[9].question} />
                                <RadioInput name={'r' + perguntas[10].id} options={checkboxOptions} label={perguntas[10].question} />
                                <RadioInput name={'r' + perguntas[11].id} options={checkboxOptions} label={perguntas[11].question} />
                                <RadioInput name={'r' + perguntas[12].id} options={checkboxOptions} label={perguntas[12].question} />
                                <RadioInput name={'r' + perguntas[13].id} options={checkboxOptions15} label={perguntas[13].question} />
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