import zxcvbn from 'zxcvbn';

function zxcvbnTest() {
    const password = 'francisco';
    zxcvbnMain(password)
}

function zxcvbnMain(password: string) {
    const passwordStrength = zxcvbn(password);
    
    console.log(passwordStrength.score); // Output: 34
    console.log(passwordStrength.guesses)
    console.log(passwordStrength.sequence)
    console.log(passwordStrength.feedback)
}

export default {zxcvbnMain, zxcvbn}