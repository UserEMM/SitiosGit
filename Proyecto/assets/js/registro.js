$(document).ready(() => {
    const sessionActive = JSON.parse(localStorage.getItem("user"));    
    if (sessionActive) {
        const url = `${location.protocol}//${window.location.host}/`
        window.location.href = url;
    }
    //si el usuario quiere moverse a registro ya logeado, lo devuelve a la pagina de tienda
    
    //encontrar id
    $("#searchID").click((event) => {
        findIdDocument();
   });
    
    //al presionar boton crear usuario
    $("#createUser").click((event) => {
        validateIdDocument();
    });    

    $('#canton-row, #distrito-row').hide();

    const ubicaciones = [];
    getProvinciasData("/Proyecto/assets/json/provincias.json", (data) => {
        ubicaciones.push(data);
        setData(data.provincias, $("#provincia"));
    });

    $("#provincia").on("change", (event) => {
        const value = event.target.value;
        const array = ubicaciones[0].provincias[value];
        setData(array.cantones, $("#canton"));
        $('#canton-row').show();
        $('#distrito-row').hide();
    });

    $("#canton").on("change", (event) => {
        const valueCantones = event.target.value;
        const valueProvincias = $("#provincia").val();
        const array = ubicaciones[0].provincias[parseInt(valueProvincias)].cantones[valueCantones];
        setData(array.distritos, $("#distrito"), true);
        $('#distrito-row').show();
    });

});

const setData = (array, $select, special = false) => {
    $select.html($('<option selected disabled>').html('Choose option'));
    for(key in array) {
        $select.append($('<option>').html(special ? array[key] : array[key].nombre).val(key));
    }
}

//Provincias - Cantones - Distritos
const getProvinciasData = (url, callback) => {
    $.ajax({
        dataType: "json",
        url: url,
        type: 'GET',
        success: function (data) {
            callback(data);
        },
        error: function (e) {
            console.log(e);
        }
    });
}
const validateIdDocument = () => {
    const IdDocument = $('#identificationDocument').val();
    const body = {
        IdDocument: IdDocument,
    };
    axios.post('http://localhost:4001/validate-id-document', body)
    .then((response) => {
        if (response.data) {
            Swal.fire({
                icon: 'error',
                iconColor: '#FF0000',
                title: 'Email Already Registered',
                confirmButtonText: 'Continue',
                text: 'The ID Document is already existent in the system.',
                confirmButtonColor: '#FF0000',
            });
        } else {
            validateEmail();
        }
    });
}



const validateEmail = () => {
    const email = $('#emailAddress').val();
    const body = {
        Email: email,
    };

    axios.post('http://localhost:4001/validate-email', body)
        .then((response) => {
            console.log("correo existe", response.data)
            if (response.data) {
                Swal.fire({
                    icon: 'error',
                    iconColor: '#FF0000',
                    title: 'Email Already Registered',
                    confirmButtonText: 'Continue',
                    text: 'The Email is already existent in the system.',
                    confirmButtonColor: '#FF0000',
                });
            } else {
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
                            // Swal.fire(`${data.value}`);
                            validateToken(tokenValue);
                        }
                    });
                });
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




function generateRandomNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}

const sendToken = () => {
    const randomNumber = generateRandomNumber();
    
    const body = {
        Email: $('#emailAddress').val(),
        Token : randomNumber
    }
    axios.post('http://localhost:4001/create-account-token', body)
        
}

const validateToken = (tokenValue) => {
    console.log(tokenValue);
    const body = {
        Email: $('#emailAddress').val(),
        Token: tokenValue
    }

    axios.post('http://localhost:4001/validate-creation-token', body)

    .then((response) => {
        if (response.data) {
            createUser();

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


const createUser = () => {
    const passwordUser = $('#passwordUser').val();
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
        IdDocument: $('#identificationDocument').val(),
        FirstName: $('#firstName').val(),
        LastName: $('#lastName').val(),
        Email: $('#emailAddress').val(),
        Password: $('#passwordUser').val(),
        State: $("#provincia option:selected" ).text(),
        Canton: $("#canton option:selected" ).text(),
        District: $("#distrito option:selected" ).text(),
        SecurityQuestion1: $('#securityQuestion1').val(),
        SecurityQuestion2 : $('#securityQuestion2').val(),
        SecurityQuestion3: $('#securityQuestion3').val(),
        Status: "Active",
        //agarrar values de los html
    }

    axios.post('http://localhost:4001/create-user', body)
        .then((response) => {
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
                    }
                })
                //si el registro guarda apropiadamente, luego del boton lo manda al Login
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
        Email: $('#emailAddress').val(),
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
            deleteDataTokens();
            redirectToLoginPage();
            actionRegistered = "The user has been kicked of the system due failing the token authentication"
            LogAction(actionRegistered);
        }, 3000);
    }
}

function redirectToLoginPage() {
    const url = `${location.protocol}//${window.location.host}/`;
    window.location.href = url;
}


const LogAction = (actionRegistered) => {
    const body = {
        Email: $('#emailAddress').val(),
        Action: actionRegistered
    }
    axios.post('http://localhost:4001/create-log', body)
}

//cedulaaaa

const findIdDocument = () => {
    const Identification = $('#identificationDocument').val();
    try {
        axios.post('http://localhost:4001/findIdDocument/', { Identification })
            .then((response) => {
                console.log(response.data);
                const firstName = capitalizeFirstLetter(response.data.firstname);
                const lastName = capitalizeFirstLetter(response.data.temp);
                $('#firstName').val(firstName);
                $('#lastName').val(lastName);
            })
            .catch((error) => {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se encontró la información para la cédula proporcionada',
                });
            });

    } catch (error) {
        console.error('Error al obtener el valor de compra del dólar de product:', error);
    }
}
function capitalizeFirstLetter(string) {
    return string.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
