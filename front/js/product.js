
const paramsString = window.location.search;
//console.log({ paramsString });

const searchParams = new URLSearchParams(paramsString); //array
const id = searchParams.get("id");
//console.log({ id });

//localStorage.clear();

fetch(`http://localhost:3000/api/products/${id}`) //`` permet de composer avec variables
    .then(function (res) { return res.json() })
    .then(function (data) {
        //console.log(data)
        fillProduct(data);
    })
    .catch(function (err) { console.error(err, "-impossible de recuperer ce produit de l api") });



function fillProduct(productData) {
    createImage(productData);
    getTitle(productData);
    getDescription(productData);
    getPrice(productData); //local storage
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
    img.src = imageUrl;
    img.alt = altTxt;
    return img;
    // no gestion erreur
}

//item__img > img
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

}

//listen click event, get id quantity and color in local storage, sent them to cart somehow
const button = document.querySelector("#addToCart");
button.addEventListener("click", addToCartEvent);

function addToCartEvent() {
    console.log("click");
    const color = document.querySelector("#colors").value;
    const quantity = document.querySelector("#quantity").value;
    if (color == "" || quantity == "0") {
        alert("no color or quantity selected "); // do a function pop up
    }
    else {

        localStorage.id = id;
        localStorage.color = color;
        localStorage.quantity = quantity;

        window.location.href = "cart.html" //perd le localstorage sur firefox
    }

}