/**
 * Display a question and read input from stdin.
 * @param {string}question
 * @return {Promise<string>}
 */
exports.read_input = (question) =>{
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        readline.question(question, (answer) => {
            resolve(answer);
            readline.close();
        });
    });
}
