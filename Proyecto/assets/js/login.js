
$(document).ready(() => {
    const sessionActive = JSON.parse(localStorage.getItem("user"));    
    if (sessionActive) {
        const url = `${location.protocol}//${window.location.host}/`
        window.location.href = url;
    }

    $("#loginButton").click((event) => {
        validateUser();
    });
});

const validateUser = () => {
    const body = {
        Email: $('#email').val(),
        Password: $('#password').val(),
    }

    axios.post('http://localhost:4001/validate-user', body)
    //una vez hace el post para hacer comparación de datos, va crear un localstorage llamado user para moverse entre las validaciones y la pagina
        .then((response) => {
            if (response.data) {
                challengeQuestions();
            } else {
                Swal.fire({
                    icon: 'error',
                    iconColor: '#FF0000',
                    title: `Unable to login into your account.`,
                    confirmButtonText: 'Continue',
                    text: `Please enter a correct email and password.`,
                    confirmButtonColor: '#FF0000',
                })
            }
        })
        .catch((error) => {
            timeoutCounter();
            Swal.fire({
                icon: 'error',
                iconColor: '#FF0000',
                title: `Unable to login into your account.`,
                confirmButtonText: 'Continue',
                text: `Please enter a correct email and password. If so, your account may be inactive.`,
                confirmButtonColor: '#FF0000',
            });
        })
}


const challengeQuestions = () => {
    const questions = [
        "What is the name of your first pet?",
        "What city were you born in?",
        "What is your favorite book?"
    ];

    let currentQuestionIndex = 0;

    const showQuestion = () => {
        const question = questions[currentQuestionIndex];
        Swal.fire({
            title: question,
            input: "text",
            inputLabel: "Your answer",
            inputValue: "",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "You need to write something!";
                }
            }
        }).then((data) => {
            if (data.value) {
                // Enviar la respuesta al servidor para validación
                const body = {
                    Email: $('#email').val(),
                    SecurityQuestion: data.value,
                    currentQuestionIndex: currentQuestionIndex 
                };
                axios.post('http://localhost:4001/validate-question', body)
                    .then((response) => {
                        if (response.data) {
                            // Respuesta correcta, llamar al método correspondiente
                            handleCorrectAnswer();
                        } else {
                            timeoutCounter();
                            // Respuesta incorrecta, mostrar mensaje de error
                            Swal.fire({
                                icon: 'error',
                                iconColor: '#FF0000',
                                title: 'Wrong Answer.',
                                text: 'Please enter the correct answer.',
                                confirmButtonText: 'Continue',
                                confirmButtonColor: '#FF0000'
                            }).then(() => {
                                // Mostrar la siguiente pregunta
                                currentQuestionIndex++;
                                if (currentQuestionIndex < questions.length) {
                                    showQuestion();
                                }
                            });
                        }
                    });
            }
        });
    };

    const handleCorrectAnswer = () => {
        sendToken();
                Swal.fire({
                    icon: 'success',
                    iconColor: '#228B22',
                    title: `Check your email.`,
                    confirmButtonText: 'Continue',
                    text: `We sent a token to confirm your email`,
                    confirmButtonColor: '#228B22',
                }).then(() => {
                    Swal.fire({
                        title: "Enter your token",
                        input: "text",
                        inputLabel: "Your token",
                        inputValue: "",
                        showCancelButton: true,
                        inputValidator: (value) => {
                            if (!value) {
                                return "You need to write something!";
                            }
                        }
                    }).then((data) => {
                        if (data.value) {
                            tokenValue = data.value;
                            validateToken(tokenValue);
                        }
                    });
                });
    };

    showQuestion();
};




function generateRandomNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}

const sendToken = () => {
    const randomNumber = generateRandomNumber();
    
    const body = {
        Email: $('#email').val(),
        Token : randomNumber
    }
    axios.post('http://localhost:4001/create-account-token', body)
        
}

const validateToken = (tokenValue) => {
    console.log(tokenValue);
    const body = {
        Email: $('#email').val(),
        Token: tokenValue
    }

    axios.post('http://localhost:4001/validate-creation-token', body)

    .then((response) => {
        if (response.data) {
            moveUserToIndex();

        }else {
            timeoutCounter();
            Swal.fire({
                icon: 'error',
                iconColor: '#FF0000',
                title: `Wrong Token.`,
                confirmButtonText: 'Continue',
                text: `Please enter the correct token.`,
                confirmButtonColor: '#FF0000',
            }).then(() => {
                    Swal.fire({
                        title: "Enter your token",
                        input: "text",
                        inputLabel: "Your token",
                        inputValue: "",
                        showCancelButton: true,
                        inputValidator: (value) => {
                            if (!value) {
                                return "You need to write something!";
                            }
                        }
                    }).then((data) => {
                        if (data.value) {
                            tokenValue = data.value;
                            validateToken(tokenValue);
                            console.log("validar");
                        }
                    });
                });
        }

    })
}
const moveUserToIndex = () => {
    const body = {
        Email: $('#email').val(),
        Password: $('#password').val(),
    }
    axios.post('http://localhost:4001/send-local', body)
    //una vez hace el post para hacer comparación de datos, va crear un localstorage llamado user para moverse entre las validaciones y la pagina
    .then((response) => {
        if (response.data?._id) {
            localStorage.removeItem("user");
            const { _id, FirstName, LastName, Email, State, Canton } = response.data 
            const user = { _id, FirstName, LastName, Email, State, Canton }
            localStorage.setItem("user", JSON.stringify(user));//setteo del user con el array
            const url = `${location.protocol}//${window.location.host}/`
            window.location.href = url;
            actionRegistered = "The user has logged in to the system successfully."
            LogAction(actionRegistered);
            deleteDataTokens();
        } else {
            Swal.fire({
                icon: 'error',
                iconColor: '#FF0000',
                title: `Unable to login into your account.`,
                confirmButtonText: 'Continue',
                text: `Please enter a correct email and password.`,
                confirmButtonColor: '#FF0000',
            })
        }
    })
    .catch((error) => {
        Swal.fire({
            icon: 'error',
            iconColor: '#FF0000',
            title: `Unable to login into your account.`,
            confirmButtonText: 'Continue',
            text: `Please fill all the fields and try again.`,
            confirmButtonColor: '#FF0000',
        });
    })

}

const deleteDataTokens = () => {

    const body = {
        Email: $('#email').val(),
        Token: ""
    }

    axios.post('http://localhost:4001/delete-token', body)

    .then((response) => {
        console.log(response.data);
    })
    .catch((error) => {
        console.error(error);
    });

}

let counter = 0;
const maxCounter = 3;

const timeoutCounter = () => {
    counter++;
    if (counter === maxCounter) {
        alert('Has alcanzado el límite de intentos. Serás expulsado pronto.');
        setTimeout(() => {
            InactiveAccountUser();
            deleteDataTokens();
            redirectToLoginPage();
            actionRegistered = "The user has been kicked out of the system because token authentication could not be performed."
            LogAction(actionRegistered);
        }, 3000);
    }
}

function redirectToLoginPage() {
    const url = `${location.protocol}//${window.location.host}/Login`;
    window.location.href = url;
}

const InactiveAccountUser = () => {
    const body = {
        Email: $('#email').val(),
        Status: 'Inactive'
    }
    axios.post('http://localhost:4001/inactive-account', body)
}

const LogAction = (actionRegistered) => {
    const body = {
        Email: $('#email').val(),
        Action: actionRegistered
    }
    axios.post('http://localhost:4001/create-log', body)
}