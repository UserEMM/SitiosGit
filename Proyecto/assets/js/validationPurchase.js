$(document).ready(() => {

    $("#validationPurchase, #validationPurchaseService").click((event) => {
        validateUserToBuy();
    });
});
const validateUserToBuy = () => {
const sessionActive = JSON.parse(localStorage.getItem("user"));    
    if (!sessionActive) {
            Swal.fire({
                icon: 'error',
                iconColor: '#FF0000',
                title: `Create a user before doing a purchase.`,
                confirmButtonText: 'Continue',
                text: `Please go create an account.`,
                confirmButtonColor: '#FF0000',
            }).then((result) => {
                console.log(result)
                const url = `${location.protocol}//${window.location.host}/`
                    window.location.href = url;
            });
    }
}
//js creado para que solo usuarios logeados puedan ir al modal de la compra final