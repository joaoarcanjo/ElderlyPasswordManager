import Algorithm from "../../screens/password_generator/actions/algorithm"
import { Requirements } from "./constants"

/**
 * Verifica se a combinação atual de requisitos é válida.
 * @param currentCase O caso atual a ser verificado.
 * @param uppercase Indica se o requisito de letras maiúsculas está ativado.
 * @param lowercase Indica se o requisito de letras minúsculas está ativado.
 * @param numbers Indica se o requisito de números está ativado.
 * @param special Indica se o requisito de caracteres especiais está ativado.
 * @returns Retorna true se a combinação atual de requisitos for válida, caso contrário retorna false.
 */
export function verifyPool(
    currentCase: string,
    uppercase: boolean,
    lowercase: boolean,
    numbers: boolean,
    special: boolean
): boolean {
    switch (currentCase) {
        case Requirements.Upper:
            return uppercase && !lowercase && !numbers && !special
        case Requirements.Lower:
            return !uppercase && lowercase && !numbers && !special
        case Requirements.Special:
            return !lowercase && special && !uppercase && !numbers
        case Requirements.Numbers:
            return !lowercase && !special && numbers && !uppercase
        default:
            return !lowercase && !uppercase && !numbers && !special
    }
}

/**
 * Atualiza o estado da flag de letras maiúsculas.
 * @param setFunction Função de atualização do estado.
 * @param uppercase Indica se o requisito de letras maiúsculas está ativado.
 * @param lowercase Indica se o requisito de letras minúsculas está ativado.
 * @param numbers Indica se o requisito de números está ativado.
 * @param special Indica se o requisito de caracteres especiais está ativado.
 */
export const updateUpperCase = (
    setFunction: Function,
    uppercase: boolean,
    lowercase: boolean,
    numbers: boolean,
    special: boolean
): void => {
    if (!verifyPool(Requirements.Upper, uppercase, lowercase, numbers, special)) {
        setFunction(!uppercase);
    }
};

/**
 * Atualiza o estado da flag de letras minúsculas.
 * @param setFunction Função de atualização do estado.
 * @param uppercase Indica se o requisito de letras maiúsculas está ativado.
 * @param lowercase Indica se o requisito de letras minúsculas está ativado.
 * @param numbers Indica se o requisito de números está ativado.
 * @param special Indica se o requisito de caracteres especiais está ativado.
 */
export const updateLowerCase = (
    setFunction: Function,
    uppercase: boolean,
    lowercase: boolean,
    numbers: boolean,
    special: boolean
): void => {
    if (!verifyPool(Requirements.Lower, uppercase, lowercase, numbers, special)) {
        setFunction(!lowercase);
    }
};

/**
 * Atualiza o estado da flag de caracteres especiais.
 * @param setFunction Função de atualização do estado.
 * @param uppercase Indica se o requisito de letras maiúsculas está ativado.
 * @param lowercase Indica se o requisito de letras minúsculas está ativado.
 * @param numbers Indica se o requisito de números está ativado.
 * @param special Indica se o requisito de caracteres especiais está ativado.
 */
export const updateSpecial = (
    setFunction: Function,
    uppercase: boolean,
    lowercase: boolean,
    numbers: boolean,
    special: boolean
): void => {
    if (!verifyPool(Requirements.Special, uppercase, lowercase, numbers, special)) {
        setFunction(!special);
    }
};

/**
 * Atualiza o estado da flag de números.
 * @param setFunction Função de atualização do estado.
 * @param uppercase Indica se o requisito de letras maiúsculas está ativado.
 * @param lowercase Indica se o requisito de letras minúsculas está ativado.
 * @param numbers Indica se o requisito de números está ativado.
 * @param special Indica se o requisito de caracteres especiais está ativado.
 */
export const updateNumbers = (
    setFunction: Function,
    uppercase: boolean,
    lowercase: boolean,
    numbers: boolean,
    special: boolean
): void => {
    if (!verifyPool(Requirements.Numbers, uppercase, lowercase, numbers, special)) {
        setFunction(!numbers);
    }
}

/**
 * Incrementa o valor do comprimento da password.
 * @param setLength Função de atualização do comprimento.
 * @param length O comprimento atual.
 */
export const incLength = (setLength: Function, length: number): void => {
    if (length < 40) {
        setLength(length + 1);
    }
};

/**
 * Decrementa o valor do comprimento da password.
 * @param setLength Função de atualização do comprimento.
 * @param length O comprimento atual.
 */
export const decLength = (setLength: Function, length: number): void => {
    if (length > 8) {
        setLength(length - 1);
    }
}

/**
 * Regenera a password com base nos requisitos fornecidos e atualiza o estado da mesma.
 * 
 * @param requirements - Os requisitos para gerar a password.
 * @param setPassword - A função para atualizar o estado da password.
 */
export const regeneratePassword = (requirements: Object, setPassword: Function) => {
    const password = Algorithm(requirements)
    setPassword(password)
}