$(document).ready(() => {
    const sessionActive = JSON.parse(localStorage.getItem("user"));    
    if (sessionActive) {
        const url = `${location.protocol}//${window.location.host}/`
        window.location.href = url;
    }
    //si el usuario quiere moverse a registro ya logeado, lo devuelve a la pagina de tienda

    $("#findAccount").click((event) => {
         validateEmail();
    });    
});

const validateEmail = () => {
    const email = $('#email').val();
    const body = {
        Email: email,
    };

    axios.post('http://localhost:4001/validate-email', body)
        .then((response) => {
            console.log("correo existe", response.data)
            if (response.data) {
                challengeQuestions();
            } else {
                
                Swal.fire({
                icon: 'error',
                iconColor: '#FF0000',
                title: 'Email non existent',
                confirmButtonText: 'Continue',
                text: 'This Email is not registered the system.',
                confirmButtonColor: '#FF0000',
                    
            })
            }
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                iconColor: '#FF0000',
                title: 'Error at validating email',
                confirmButtonText: 'Continue',
                text: 'Try again.',
                confirmButtonColor: '#FF0000',
            });
        });
};

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
            Swal.fire({
                title: "Write your new password",
                html: 'Password must be at least <b>8 characters</b> long and contain at least one <b>uppercase letter</b> and one <b>symbol</b>.',
                input: "text",
                inputLabel: "New Password:",
                inputValue: "",
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return "You need to write something!";
                    }
                }
            }).then((data) => {
                if (data.value) {
                    NewPassword = data.value;
                    newPasswordValidation(NewPassword);
                    actionRegistered = "The user has validated a token to recover its password"
                    LogAction(actionRegistered);
                }
            });

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

const newPasswordValidation = (NewPassword) => {

    const passwordUser = NewPassword
    const passwordPolicyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordPolicyRegex.test(passwordUser)) {
        Swal.fire({
            icon: 'error',
            iconColor: '#FF0000',
            title: `Password does not meet requirements.`,
            confirmButtonText: 'OK',
            text: `Password must be at least 8 characters long and contain at least one uppercase letter and one symbol.`,
            confirmButtonColor: '#FF0000',
        });
        return; // Detiene la ejecución si la contraseña no cumple con los requisitos
    }else{
    const body = {
        Email: $('#email').val(),
        Password: passwordUser,
        Status: 'Active'
        //agarrar values de los html
    }

    axios.post('http://localhost:4001/recover-account', body)
    .then((response) => {
        if(response.data){
            Swal.fire({
                icon: 'success',
                iconColor: '#228B22',
                title: `Your account has been created.`,
                confirmButtonText: 'Continue',
                text: `Click on the continue button to login into your account`,
                confirmButtonColor: '#228B22',
            })
                .then((result) => {
                    console.log(result)
                    if (result.isConfirmed) {
                        const url = `${location.protocol}//${window.location.host}/Login`
                        window.location.href = url;
                         deleteDataTokens();
                         actionRegistered = "The user has changed their status to Active and a new password."
                         LogAction(actionRegistered);
                    }
                })
                //si el registro guarda apropiadamente, luego del boton lo manda al Login
        }
       
    })
    .catch((error) => {
        Swal.fire({
            icon: 'error',
            iconColor: '#FF0000',
            title: `Unable to create a user.`,
            confirmButtonText: 'Continue',
            text: `Please fill all the fields and try again.`,
            confirmButtonColor: '#FF0000',
        })
    })


    }
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