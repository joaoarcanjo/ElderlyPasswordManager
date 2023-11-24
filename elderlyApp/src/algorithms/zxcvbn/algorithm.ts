import zxcvbn from 'zxcvbn';

function zxcvbnTest() {
    const password = 'francisco';
    zxcvbnMain(password)
}

function zxcvbnMain(password: string) {
    const passwordStrength = zxcvbn(password)
    
    console.log(passwordStrength.score) 
    console.log(passwordStrength.guesses)
    console.log(passwordStrength.sequence)
    console.log(passwordStrength.feedback)
}

//ALTEREI O ALGORITMO DE MODO A QUE APENAS RETORNE O NIVEL MÁXIMO SE O GUESSES_LOG > 13.5
function getScore(password: string): number {
    const passwordStrength = zxcvbn(password)
    console.log(passwordStrength.guesses_log10)

    if(passwordStrength.score == 4 && passwordStrength.guesses_log10 < 13.5) return 3
    return passwordStrength.score
}

export {zxcvbnMain, getScore }