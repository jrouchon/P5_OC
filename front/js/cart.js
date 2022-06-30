//cr�ation du panier

getLocalStorage();

function createContentDescription(order) {
    const divDescription = document.createElement("div");
    divDescription.classList.add("cart__item__content__description");

    const h2 = document.createElement("h2");
    h2.textContent = order.name
    const p = document.createElement("p");
    p.textContent = order.color;

    const p2 = document.createElement("p");
    p2.textContent = order.price + ' \u20ac';

    divDescription.appendChild(h2);
    divDescription.appendChild(p);
    divDescription.appendChild(p2);

    return divDescription;
}

function createcontentSettings(order, i) { // a diviser 
    const divSettings = document.createElement("div");
    divSettings.classList.add("cart__item__content__settings");

    //
    const divSettingsQuantity = document.createElement("div");
    divSettingsQuantity.classList.add("cart__item__content__settings__quantity");
    divSettings.appendChild(divSettingsQuantity);

    const quantityP = document.createElement("p");
    quantityP.textContent = 'Qt\u00e9 : ';
    divSettingsQuantity.appendChild(quantityP);

    const inputQ = document.createElement("input");
    inputQ.type = "number";
    inputQ.classList.add("itemQuantity");
    inputQ.name = "itemQuantity";
    inputQ.min = "1";
    inputQ.max = "100";
    inputQ.value = order.quantity;

    inputQ.addEventListener("change", () => quantityChange(order, i, inputQ.value)); // eventlistener sur la cr�ation mais pas apr�s (id object, new quantity)(order, )

    //inputQ.addEventListener("change", console.log("change")); // eventlistener sur la cr�ation mais pas apr�s

    divSettingsQuantity.appendChild(inputQ);

    //
    const divSettingsDelete = document.createElement("div");
    divSettingsDelete.classList.add("cart__item__content__settings__delete");
    divSettings.appendChild(divSettingsDelete);

    const deleteP = document.createElement("p");
    deleteP.classList.add("deleteItem");
    deleteP.textContent = 'Supprimer';
    divSettingsDelete.appendChild(deleteP);
    //

    return divSettings;
}

function createContent(order, i) {
    const divContent = document.createElement("div");
    divContent.classList.add("cart__item__content");

    const contentDescription = createContentDescription(order);
    const contentSettings = createcontentSettings(order, i);

    divContent.appendChild(contentDescription);
    divContent.appendChild(contentSettings);

    return divContent;
}

function createDivImage(order) {
    const div = document.createElement("div");
    div.classList.add("cart__item__img");

    const img = document.createElement("img");
    img.src = order.imgSrc;
    img.alt = order.imgAlt;

    div.appendChild(img);
    return div;
}

function createArticle(order, i) {
    const cartItems = document.querySelector("#cart__items");
    // gestion d'erreur

    const article = document.createElement("article");
    article.classList.add("cart__item");

    cartItems.appendChild(article);
    

    const divImage = createDivImage(order);
    const content = createContent(order, i);
    
    article.appendChild(divImage);
    article.appendChild(content);
}

function getTotalQuantity() {
    let quantity = document.querySelector("#totalQuantity");
    let totalQuantity = 0;
    let i = localStorage.length;
    for (j = 1; j < i; j++) {
        let order = JSON.parse(localStorage.getItem(j));
        totalQuantity = totalQuantity + parseInt(order.quantity);
        //console.log(totalQuantity);
    }
    quantity.textContent = totalQuantity;
}

function getTotalPrice() {
    let totalPrice = document.querySelector("#totalPrice");
    let total = 0;
    let i = localStorage.length;
    for (j = 1; j < i; j++) {
        let order = JSON.parse(localStorage.getItem(j));
        let semiPrice = 0;
        semiPrice = parseInt(order.price) * parseInt(order.quantity)
        total = total + semiPrice;
        //console.log(total);
    }
    totalPrice.textContent = total;
}

function getLocalStorage() {
    let i = localStorage.length;
    for (j = 1; j < i; j++) {
        let order = JSON.parse(localStorage.getItem(j));
        createArticle(order, j);
        //console.log(order);
    }
    getTotalQuantity();
    getTotalPrice();

    //let quantity = document.querySelectorAll(".itemQuantity");
    //console.log(quantity);
        //quantity.forEach(element => {
            //element.addEventListener('change', quantityChange);
    //});
    //let quantity = document.getElementsByName(".itemQuantity");
    //console.log(quantity);
    //quantity.addEventListener("change", quantityChange());
}


//modif quantit� et suppression 

//const quantity = document.querySelector(".itemQuantity");
//console.log(quantity);
//quantity.addEventListener("change", quantityChange());

/*document.querySelector(".itemQuantity").forEach(quantities => {
    quantities.addEventListener("change", quantityChange());
})*/


//const deleteI = document.querySelector(".deleteItem");
//deleteI.addEventListener("click", deleteItem);

function quantityChange(order, i, v) {
    console.log("order :", order);
    console.log("i :", i);
    //console.log("e :", e);
    console.log("v :", v);
    //localStorage.removeItem(compteurid);
    //localStorage.setItem(compteurid, JSON.stringify(object));
}