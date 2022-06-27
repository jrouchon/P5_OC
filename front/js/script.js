fetch("http://localhost:3000/api/products")
    .then(function (res) { return res.json() })
    .then(function (data) {
        //console.log(data)
        displayProducts(data)
    })
    .catch(function (err) { console.error(err, "err: impossible de recuperer les produits de l api") }); //gestion d'erreur

/*
class Product {
    constructor(_id, name, description, imageUrl, altTxt, colors, price) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.altTxt = altTxt;
        this.colors = colors;
        this.price = price;
    }
}*/

//me recup array de class 
/*
function getProducts(data) {
    console.log(data);

    let products = [];
    for (let i = 0; i < data.length; i++) {
        products.push(new Product(data[i]._id, data[i].name, data[i].description, data[i].imageUrl, data[i].altTxt, data[i].colors, data[i].price));
    }
    console.log("products :",products);
}
*/

function displayProducts(data) {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        let a = createA(data[i]._id);
        let article = createArticle(data[i].imageUrl, data[i].altTxt, data[i].name, data[i].description);

        appendChildren(a);
        appendChildrenParent(article, a);
    }
    
}

function createA(_id) {
    const anchor = document.createElement("a");
    anchor.href = "./product.html?id=" + _id;
    return anchor;
}

//gestion err a finir
function appendChildren(a) {
    const items = document.querySelector("#items")
    if (items != null) {
        items.appendChild(a);
    }
    else {
        console.error("err: no parent in appendChildren");
    }
}

//relation parent enfant html
function appendChildrenParent(child, parent) {
    if (child != null && parent != null) {
        parent.appendChild(child);
    }
    else {
        console.error("err: can't appendChild children or parent missing");
    }
}

function createArticle(imageUrl, altTxt, name, description) {
    const article = document.createElement("article");
    const image = getImg(imageUrl, altTxt);
    const h3 = getH3(name);
    //console.log("name :", name, "h3 :", h3);
    const p = getP(description);

    article.appendChild(image);
    article.appendChild(h3);
    article.appendChild(p);

    return article;

    // no gestion erreur
}

function getImg(imageUrl, altTxt) {
    const image = document.createElement("img")
    image.src = imageUrl;
    image.alt = altTxt;

    return image;
    // no gestion erreur

}

function getH3(name) {
    const h3 = document.createElement("h3");
    h3.textContent = name;
    h3.classList.add("productName");

    return h3;
    // no gestion erreur
}

function getP(description) {
    const p = document.createElement("p");
    p.textContent = description;
    p.classList.add("productDescription");

    return p;
    // no gestion erreur
}



