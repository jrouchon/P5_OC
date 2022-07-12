//création du panier


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

    inputQ.addEventListener("change", () => quantityChange(order, i, inputQ.value)); 

    divSettingsQuantity.appendChild(inputQ);

    //
    const divSettingsDelete = document.createElement("div");
    divSettingsDelete.classList.add("cart__item__content__settings__delete");
    divSettings.appendChild(divSettingsDelete);

    const deleteP = document.createElement("p");
    deleteP.classList.add("deleteItem");
    deleteP.textContent = 'Supprimer';
    divSettingsDelete.appendChild(deleteP);
    deleteP.addEventListener("click", () => deleteProduct(order, i));
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
    article.dataset.id = i;
    article.dataset.color = order.color;

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
    }
    totalPrice.textContent = total;
}

function getLocalStorage() {
    let i = localStorage.length;
    for (j = 1; j < i; j++) {
        let order = JSON.parse(localStorage.getItem(j));
        createArticle(order, j);
    }
    getTotalQuantity();
    getTotalPrice();
}


function quantityChange(order, i, v) {
    
    let temp = order;
    temp.quantity = v;
    localStorage.removeItem(i);
    localStorage.setItem(i, JSON.stringify(temp));

    getTotalQuantity();
    getTotalPrice();

}

function deleteProduct(order, articleIndex) {
    let productToDelete = 0;
    for (i = 1; i < localStorage.length ; i++) {
        let temp = JSON.parse(localStorage.getItem(i))
        if ((order.id == temp.id) && (order.color == temp.color)) { 
            productToDelete = i;
        }
    }
    localStorage.removeItem(productToDelete);
    for (j = 1; j <= localStorage.length; j++) {
        if (j > productToDelete) {
            let temp = JSON.parse(localStorage.getItem(j));
            localStorage.removeItem(j);
            localStorage.setItem((j - 1), JSON.stringify(temp));
        }
    }

    let article = document.querySelector(`article[data-id="${articleIndex}"]`);
    article.remove();

    getTotalQuantity();
    getTotalPrice();
}


const orderButton = document.getElementById("order")
orderButton.addEventListener("click", (e) => submitOrder(e));

function submitOrder(e) {
    e.preventDefault();

    let i = localStorage.length;
    if (i === 1) {
        alert("your cart is empty! You can't buy the void, please select an item!");
    }
    const isValid = checkForm();
    if (isValid === false) {
        console.log("checkForm false should stop and don't post");
        return;
    }

    const order = getFinalOrder();

    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
            "Content-Type": "application/json"  
        }
    })
        .then((res) => res.json())
        .then((data) => {
            const orderId = data.orderId;
            window.location.href = "confirmation.html" + "?orderId=" + orderId
        })

        .catch(function (err) { console.error(err, "-problème au niveau de la commande") });


}

//formulaire de commande 
/**
 *
 * Expects request to contain:
 * contact: {
 *   firstName: string,
 *   lastName: string,
 *   address: string,
 *   city: string,
 *   email: string
 * }
 * products: [string] <-- array of product _id
 *
 */

function getFinalOrder() {

    const formInput = document.querySelector(".cart__order__form");

    const firstName = formInput.elements.firstName.value;
    const lastName = formInput.elements.lastName.value;
    const address = formInput.elements.address.value;
    const city = formInput.elements.city.value;
    const email = formInput.elements.email.value;

    const order = {
        contact: {
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email
        },
        products: getFinalID()
    }
    //console.log(order);
    return order;
}

function getFinalID() {
    const id = []
    for (i = 1; i < localStorage.length; i++) {
        let tmp = JSON.parse(localStorage.getItem(i));
        id.push(tmp.id);
    }
    return id;
}

function checkForm() {
    let ret;

    ret = isFormEmpty()
    if (ret === false) {
        return false;
    }

    ret = isNameValid()
    if (ret === false) {
        return false;
    }
    

    ret = isEmailValid()
    if (ret === false) {
        return false;
    }

}

function isFormEmpty() {
    const formInput = document.querySelector(".cart__order__form");
    inputs = formInput.querySelectorAll("input")
    let error = 0;
    inputs.forEach((input) => {
        if (input.value === "") {
            error += 1;
            return
        }
    })
    if (error > 0) {
        alert("Please fill all the field");
        return false;
    }
    return true;
}

function isEmailValid() {
    const email = document.querySelector("#email")
    const regex = /^[A-Za-z0-9+_.-]+@+[A-Za-z]+[.]+[a-z]{2,3}$/
    if (regex.test(email.value) === false) {
        alert("your email is invalid");
        return false;
    }
    return true;
}


function isNameValid() {
    const firstName = document.querySelector("#firstName").value;
    const lastName = document.querySelector("#lastName").value;
    const regex = /^[A-Za-z-]+$/
    if (regex.test(firstName) === false) {
        alert("your first name is invalid");
        return false;
    }
    if (regex.test(lastName) === false) {
        alert("your last name is invalid");
        return false;
    }

    return true;
}