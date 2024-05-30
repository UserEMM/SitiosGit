$(document).ready(() => {
    let currentCategory = location.pathname.substring(location.pathname.lastIndexOf("/") + 1)  
    currentCategory = currentCategory.split('.html')[0];
    createCategory(currentCategory);
});
//Arranque de categoría para ver la categoría en cada pagina relacionado a un instrumento


const createCategory = (category) => {
    axios.get(`http://localhost:4001/get-item/${category}`)
        .then((response) => {
            const { data } = response;

            console.log(data)
            
            data.forEach(item => {
                //llamado a la base de datos con html dinámico
                const { Thumbnail, Manufacturer, Model, ColorInstrumentText, Currency, Price, _id } = item;
                const htmlData = `
                    <div class="col-sm-12 col-md-3 item">
                        <img src="${Thumbnail}">
                        <h4>${Manufacturer} ${Model} - ${ColorInstrumentText}</h4>
                        <h2>${Currency}${Price}</h2>
                        <a class="button" onClick="viewProduct('${_id}')">VIEW</a>
                    </div> 
                `;
                $("#categories_items").append(htmlData);//pegar el diseñado con la data
            });

        })
        .catch((error) => {
            console.log(error);
        });
}