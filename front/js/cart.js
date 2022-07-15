
getLocalStorage();

//create div elem set it with proper class, fill it with a h2 two p, append them, return it
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

//creat div elem, set it with proper class, fill it with a created p and a created input for his quantity and append them,
//add event listener on quantity input change, return div
function createDivSettingsQuantity(order, i) {
    const divSettingsQuantity = document.createElement("div");
    divSettingsQuantity.classList.add("cart__item__content__settings__quantity");

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
    divSettingsQuantity.appendChild(inputQ);

    inputQ.addEventListener("change", () => quantityChange(order, i, inputQ.value));
    
    return divSettingsQuantity;
}

//creat div elem, set it with proper class, fill it with a p with proper class and an event listener on click, return div
function createDivSettingsDelete(order, i) {
    const divSettingsDelete = document.createElement("div");
    divSettingsDelete.classList.add("cart__item__content__settings__delete");

    const deleteP = document.createElement("p");
    deleteP.classList.add("deleteItem");
    deleteP.textContent = 'Supprimer';

    divSettingsDelete.appendChild(deleteP);

    deleteP.addEventListener("click", () => deleteProduct(order, i));

    return divSettingsDelete;
}

//creat contentSettings div elem, set it with proper class, create his child and append them, return it
function createcontentSettings(order, i) { 
    const divSettings = document.createElement("div");
    divSettings.classList.add("cart__item__content__settings");


    const divSettingsQuantity = createDivSettingsQuantity(order, i);
    divSettings.appendChild(divSettingsQuantity);

    const divSettingsDelete = createDivSettingsDelete(order, i);
    divSettings.appendChild(divSettingsDelete);

    return divSettings;
}

//creat content div elem, set it with proper class, create his div child and append them, return it
function createContent(order, i) {
    const divContent = document.createElement("div");
    divContent.classList.add("cart__item__content");

    const contentDescription = createContentDescription(order);
    const contentSettings = createcontentSettings(order, i);

    divContent.appendChild(contentDescription);
    divContent.appendChild(contentSettings);

    return divContent;
}

//creat div elem, set it with proper class, creat img elem, set it with proper src and alt append it, return it
function createDivImage(order) {
    const div = document.createElement("div");
    div.classList.add("cart__item__img");

    const img = document.createElement("img");
    img.src = order.imgSrc;
    img.alt = order.imgAlt;

    div.appendChild(img);
    return div;
}

//query the parent, creat article elem, set it with proper class, set data attribute, append him to parent
//get div for image from function, get div for content from function, append them to parent
function createArticle(order, i) {
    const cartItems = document.querySelector("#cart__items");

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

//add all quantity from localStorage, and then pass it to the queried elem to display it
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

//add all price from localStorage, and display it in the element queried first
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

//get all element in localStorage except element [0] who is lsPrice, get total quantity and price
function getLocalStorage() {
    let i = localStorage.length;
    for (j = 1; j < i; j++) {
        let order = JSON.parse(localStorage.getItem(j));
        createArticle(order, j);
    }
    getTotalQuantity();
    getTotalPrice();
}

//get new quantity value (v), remove old order and set new order with the same index key (i), get new quantity and price
function quantityChange(order, i, v) {
    let temp = order;
    temp.quantity = v;
    localStorage.removeItem(i);
    localStorage.setItem(i, JSON.stringify(temp));

    getTotalQuantity();
    getTotalPrice();

}

//find index key of the product to delete, delete it, 
//for every element with bigger index, remove it and replace it with index - 1
//remove dom article with the deleted element index, get new price and quantity
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

//add an event listener on click on order button 
const orderButton = document.getElementById("order")
orderButton.addEventListener("click", (e) => submitOrder(e));

//prevent window change if something go wrong, verify an order is present on localStorage,
//check if form is properly filled, get order in proper object pattern, post the order, and change window location
function submitOrder(e) {
    e.preventDefault();
    let i = localStorage.length;
    if (i === 1) {
        alert("your cart is empty! You can't buy the void, please select an item!");
    }
    const isValid = checkForm();
    if (isValid === false) {
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
        .catch(function (err) { console.error(err, "-probleme au niveau de la commande") });
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

//get form element value set, execute function to get all orders id
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
    return order;
}

//create id array with each id's order on localStorage
function getFinalID() {
    const id = []
    for (i = 1; i < localStorage.length; i++) {
        let tmp = JSON.parse(localStorage.getItem(i));
        id.push(tmp.id);
    }
    return id;
}

//check form and execute each function verify
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

//get form input, for each input increase error if it's empty, do an alert if error found, and return bool
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

//get email input value, check with regex if email adress is valid, return bool
function isEmailValid() {
    const email = document.querySelector("#email")
    const regex = /^[A-Za-z0-9+_.-]+@+[A-Za-z]+[.]+[a-z]{2,3}$/
    if (regex.test(email.value) === false) {
        alert("your email is invalid");
        return false;
    }
    return true;
}

//get first name and last name and check with regex if it's only letters, return bool
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