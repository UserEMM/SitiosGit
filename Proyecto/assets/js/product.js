$(document).ready(function () {
    loadProduct();
    obtenerValorDolarDesdeServidor();
});

//Redirección y asignación de parámetros a la URL para visualizar un producto específico
const viewProduct = (id) => {
    const url = `/product?id=${id}`;
    window.location.href = url;
}


// Carga de la información del producto
const loadProduct = (id) => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.has('id')) { //Valida si el ID del producto existe como parámetro en la ruta

        const productId = urlParams.get('id') //Obtención del ID del producto

        axios.get(`http://localhost:4001/get-item-by-id/${productId}`)
            .then((response) => {
                const { Manufacturer, Model, ColorInstrumentText, Thumbnail, DescriptionInstrument, Currency, Price, ColorInstrumentHex } = response.data;
                $('#product-name').text(`${Manufacturer} - ${Model}`);
                $('#product-colorText').text(`Color: ${ColorInstrumentText}`);
                $('#product-image').attr("src", Thumbnail);
                $('#product-description').text(`Description: ${DescriptionInstrument}`);
                $('#product-price').text(`PRICE FROM: ${Currency}${Price}`);
                $('#product-color').css("background-color", ColorInstrumentHex);
            })
            .catch((error) => {
                console.log(error);
            });
    }

}

const obtenerValorDolarDesdeServidor = () => {
    try {
        axios.post('http://localhost:4001/getDollarValue/')
        .then((response) => {
            console.log(response.data);
            const valorCompraDolar = response.data;
        const dollarValueLabel = document.getElementById('dollarValueLabel');
        dollarValueLabel.textContent = `Valor del dolar a colones: ${valorCompraDolar} colones`;
        })
        .catch((error) => {
            console.error(error);
        });
    
    }
    catch (error) {
        console.error('Error al obtener el valor de compra del dólar de product:', error);
    }
}
