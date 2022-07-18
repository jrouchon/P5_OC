//find and parse url
const paramsString = window.location.search;
//parse params after the? in url, returning an array
const searchParams = new URLSearchParams(paramsString);
//initialize id variable, and attributing it the value of key id in searchParams
const id = searchParams.get("id");

let imgSrc;
let imgAlt;

//fetch api on a specific product, then treat promise and execute fillProduct function
fetch(`http://localhost:3000/api/products/${id}`) //`` permet de composer avec variables
    .then(function (res) { return res.json() })
    .then(function (data) {
        fillProduct(data);
    })
    .catch(function (err) { console.error(err, "-impossible de recuperer ce produit de l api") });

//execute all function in fillProduct, to fill product info on product html page 
function fillProduct(productData) {
    createImage(productData);
    getTitle(productData);
    getDescription(productData);
    getPrice(productData);
    createColorOption(productData);
}

//query dom element with colors id (the parent), get colors from array in param function,
//for each color in colors create an option element set is value and text content, and append it to his parent
function createColorOption(productData) {
    const colorSelect = document.querySelector("#colors");
    let colors = productData.colors;
    colors.forEach(function (color) {
        const option = document.createElement("option");
        option.value = color;
        option.textContent = color;

        colorSelect.appendChild(option);
    })
}

//query price id, setItem lsprice in localStorage with proper price's product passed in param,
//set this price to price dom element queried before
function getPrice(productData) {
    const price = document.querySelector("#price");
    //localStorage.setItem ("lsprice", productData.price);
    price.textContent = productData.price;
}

//query dom elem, set his textcontent to product description passed in param
function getDescription(productData) {
    const description = document.querySelector("#description");
    description.textContent = productData.description;
}

//query dom elem, set his textcontent to product name passed in param
function getTitle(productData) {
    const title = document.querySelector("#title");
    title.textContent = productData.name;
}


//query parent with item__img class, append it his child passed in param
function appendChildItemImg(child) {
    const parent = document.querySelector(".item__img")
    if (parent != null) {
        parent.appendChild(child);
    }
    else {
        console.error("err: no parent in appendChildItemImg");
    }
}

//create an img elem, append it to his parent, 
//set his url value to src attribute and alternative description value to alt attribute from productData array
//set imgSrc and imgAlt var from outside
function createImage(productData) {
    const img = document.createElement("img")
    appendChildItemImg(img);
    img.src = productData.imageUrl;
    img.alt = productData.altTxt;

    imgSrc = productData.imageUrl;
    imgAlt = productData.altTxt;
}

//query the button to add an event listener on click and execute function
const button = document.querySelector("#addToCart");
button.addEventListener("click", addToCartEvent);

//create object order, set it, execute function to add it to localStorage 
function getOrder(name, color, quantity) {
    let order = {
        id: id,
        name: name,
        color: color,
        quantity: quantity,
        //price: localStorage.lsprice,
        imgSrc: imgSrc,
        imgAlt: imgAlt
    }
    if (order.id == null || order.color == null || order.quantity == null) {
        alert("something went wrong please refresh this page");
        return;
    }
    addToLocalStorage(order);
}

//add to localStorage, check if it need to modify quantity in similar ordered element in ls, 
//or create a new ordered element
function addToLocalStorage(order) {
    let i = localStorage.length;
    i += 1;
    if (i > 1) { //on passe sur la commande du ls
        let isFound = false;
        for (j = 1; j < i; j++) {
            let ordered = JSON.parse(localStorage.getItem(j));
            if (ordered.id == order.id && ordered.color == order.color) { //si on trouve le même on modif la quantité
                isFound = true;
                let k = parseInt(ordered.quantity) + parseInt(order.quantity);
                order.quantity = k.toString();
                localStorage.removeItem(j);
                localStorage.setItem(j, JSON.stringify(order));
            }
        }
        if (isFound == false) // si on n'a pas de commande identique
            localStorage.setItem(i, JSON.stringify(order));
    }
    else {
        localStorage.setItem(i, JSON.stringify(order));
    }
}

//query name, color and quantity, execute function to get order in localStorage, change window url
function addToCartEvent() {
    const name = document.querySelector("#title").textContent;
    const color = document.querySelector("#colors").value;
    const quantity = document.querySelector("#quantity").value;
    if (color == "" || quantity == "0") {
        alert("no color or quantity selected "); 
    }
    else {
        getOrder(name, color, quantity);

        window.location.href = "cart.html" 
    }

}