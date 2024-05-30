$(document).ready(() => {

    $("#createServiceOrder, #createServiceOrderPaypal, #createServiceOrderBank").click((event) => {
        createServiceOrder();
    });
});
const createServiceOrder = () => {
    sessionActive = JSON.parse(localStorage.getItem("user"));
    const body = {
        CustomerName: sessionActive.FirstName,
        Email: sessionActive.Email,
        CustomerState: sessionActive.State,
        CustomerCanton: sessionActive.Canton,
        Service: $('#service').val(),
        CustomerDescription: $('#customerDescription').val(),
        
    };
    axios.post('http://localhost:4001/service-order', body)
        .then((response) => {
            Swal.fire({
                icon: 'success',
                iconColor: '#228B22',
                title: `Your purchase has been created.`,
                confirmButtonText: 'Continue',
                text: `Check your email to see our agents contacting you`,
                confirmButtonColor: '#228B22',
            });
        })
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
