import zxcvbn from 'zxcvbn';

function zxcvbnTest() {
    const password = 'francisco';
    const passwordStrength = zxcvbn(password)
    
    //console.log(passwordStrength.score) 
    //console.log(passwordStrength.guesses)
    //console.log(passwordStrength.sequence)
    //console.log(passwordStrength.feedback)
}

/**
 * Esta função retorna a avaliação de 0-4 relativamente à avaliação da password.
 * Apenas retorna 4 se o valor de guesses_log for igual ou superior a 14.
 * @param password 
 * @returns 
 */
function getScore(password: string): number {
    const passwordStrength = zxcvbn(password)
    //console.log(passwordStrength.guesses_log10)

    if(passwordStrength.score == 4 && passwordStrength.guesses_log10 < 14) return 3
    return passwordStrength.score
}

export { getScore }