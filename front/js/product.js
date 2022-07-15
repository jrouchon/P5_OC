
const paramsString = window.location.search;

const searchParams = new URLSearchParams(paramsString); 
const id = searchParams.get("id");
let imgSrc;
let imgAlt;


fetch(`http://localhost:3000/api/products/${id}`) //`` permet de composer avec variables
    .then(function (res) { return res.json() })
    .then(function (data) {
        fillProduct(data);
    })
    .catch(function (err) { console.error(err, "-impossible de recuperer ce produit de l api") });



function fillProduct(productData) {
    createImage(productData);
    getTitle(productData);
    getDescription(productData);
    getPrice(productData);
    createColorOption(productData);

}

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

function getPrice(productData) {
    const price = document.querySelector("#price");
    localStorage.setItem ("lsprice", productData.price);
    price.textContent = localStorage.lsprice;
}

function getDescription(productData) {
    const description = document.querySelector("#description");
    description.textContent = productData.description;
}

function getTitle(productData) {
    const title = document.querySelector("#title");
    title.textContent = productData.name;
}

function getImg(imageUrl, altTxt) {
    const img = document.createElement("img")
    imgSrc = imageUrl;
    imgAlt = altTxt;
    return img;
}

function appendChildItemImg(child) {
    const parent = document.querySelector(".item__img")
    if (parent != null) {
        parent.appendChild(child);
    }
    else {
        console.error("err: no parent in appendChildItemImg");
    }
}

function createImage(productData) {
    let img = getImg(productData.imageUrl, productData.altTxt);
    appendChildItemImg(img);
    img.src = productData.imageUrl;
    img.alt = productData.altTxt;
}


const button = document.querySelector("#addToCart");
button.addEventListener("click", addToCartEvent);

function getOrder(name, color, quantity) {
    let order = {
        id: id,
        name: name,
        color: color,
        quantity: quantity,
        price: localStorage.lsprice,
        imgSrc: imgSrc,
        imgAlt: imgAlt
    }
    if (order.id == null || order.color == null || order.quantity == null || order.price == null) {
        alert("something went wrong please refresh this page");
        return;
    }
        
    addToLocalStorage(order);
}

function addToLocalStorage(order) {
    let i = localStorage.length;
    

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