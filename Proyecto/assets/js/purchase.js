$(document).ready(() => {

    $("#createPurchase, #createPurchaseProductPaypal, #createPurchaseProductBank").click((event) => {
        // createPurchase();
        completePurchase();
    });
});

const completePurchase = () => {
    const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productID = urlParams.get('id')
sessionActive = JSON.parse(localStorage.getItem("user"));
const amount = 600
var productPriceText = document.getElementById('product-price').innerText;
var match = productPriceText.match(/\$([0-9.]+)/);
var productPrice = match ? parseFloat(match[1]) : null;

    const body = {
        CustomerName: sessionActive.FirstName,
        Email: sessionActive.Email,
        CustomerState: sessionActive.State,
        CustomerCanton: sessionActive.Canton,
        IdItem: productID,
        creditCard: $('#creditCardNumber').val(),
        monthExpiration: $('#monthExpiration').val(),
        yearExpiration: $('#yearExpiration').val(),
        cvv: $('#cvv').val(),
        amount: amount,
        productCharge: productPrice
    }
    console.log('Datos a enviar:', body);
    axios.post('http://localhost:4001/complete-purchase',body)
        .then(response => {
            if (response.data === true) {
                createPurchase();
                Swal.fire({
                    icon: 'success',
                    iconColor: '#228B22',
                    title: `Your purchase has been created.`,
                    confirmButtonText: 'Continue',
                    text: `Check your email to see our agents contacting you`,
                    confirmButtonColor: '#228B22',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    iconColor: '#FF0000',
                    title: `Unable to complete the purchase.`,
                    confirmButtonText: 'Continue',
                    text: `Please fill all the fields, verify your credit card and its amount able.`,
                    confirmButtonColor: '#FF0000',
                })
            }
        })
        .catch(error => {
        console.error(error);
        });
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productID = urlParams.get('id')
//obtener la id
const createPurchase = () => {
    sessionActive = JSON.parse(localStorage.getItem("user"));
    const body = {
        CustomerName: sessionActive.FirstName,
        Email: sessionActive.Email,
        CustomerState: sessionActive.State,
        CustomerCanton: sessionActive.Canton,
        IdItem: productID 
    };

    axios.post('http://localhost:4001/create-order', body)
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                iconColor: '#FF0000',
                title: `Unable to create a purchase.`,
                confirmButtonText: 'Continue',
                text: `Please fill all the fields and try again.`,
                confirmButtonColor: '#FF0000',
            });
        });
};
