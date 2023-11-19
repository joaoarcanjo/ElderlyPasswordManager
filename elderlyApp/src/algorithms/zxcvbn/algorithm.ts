import zxcvbn from 'zxcvbn';

export default function zxcvbnTest() {
    const password = 'francisco';
    const passwordStrength = zxcvbn(password);
    
    console.log(passwordStrength.score); // Output: 34
    console.log(passwordStrength.guesses)
    console.log(passwordStrength.sequence)
    console.log(passwordStrength.feedback)
}