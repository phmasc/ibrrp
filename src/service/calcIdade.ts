export default function calcIdade(nascimento: Date, refencia: Date) {
    const idade: number = (new Date(refencia.getFullYear(), nascimento.getMonth(), nascimento.getDay()) < refencia)
        ? refencia.getFullYear() - nascimento.getFullYear() - 1
        : refencia.getFullYear() - nascimento.getFullYear()
    return idade
}