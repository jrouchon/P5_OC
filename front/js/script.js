//fetch on api (with a get), .then parse the promise result in json .treat it with display function
fetch("http://localhost:3000/api/products")
    .then(function (res) { return res.json() })
    .then(function (data) {
        displayProducts(data)
    })
    .catch(function (err) { console.error(err, "err: impossible de recuperer les produits de l api") }); //gestion d'erreur

//for each element in data array, create a link anchor and an article, append them to their parent.
function displayProducts(data) {
    for (let i = 0; i < data.length; i++) {
        let a = createA(data[i]._id);
        let article = createArticle(data[i].imageUrl, data[i].altTxt, data[i].name, data[i].description);

        appendChildren(a);
        appendChildrenParent(article, a);
    }
}

//create an anchor, attributing a like to it
function createA(_id) {
    const anchor = document.createElement("a");
    anchor.href = "./product.html?id=" + _id;
    return anchor;
}

//find parent in dom, if parent is found append it is child passed in function param
function appendChildren(a) {
    const items = document.querySelector("#items")
    if (items != null) {
        items.appendChild(a);
    }
    else {
        console.error("err: no parent in appendChildren");
    }
}

//append child (first param) to parent (second param), with error check
function appendChildrenParent(child, parent) {
    if (child != null && parent != null) {
        parent.appendChild(child);
    }
    else {
        console.error("err: can't appendChild children or parent missing");
    }
}

//create an article, then execute function to fill article and append child's article to it, return it
function createArticle(imageUrl, altTxt, name, description) {
    const article = document.createElement("article");
    const image = getImg(imageUrl, altTxt);
    const h3 = getH3(name);
    const p = getP(description);

    article.appendChild(image);
    article.appendChild(h3);
    article.appendChild(p);

    return article;
}

//create an image, attributing it proper url and source, return it
function getImg(imageUrl, altTxt) {
    const image = document.createElement("img")
    image.src = imageUrl;
    image.alt = altTxt;

    return image;
}

//create h3, attributing it the content passed in param, and a proper class attribute, return it
function getH3(name) {
    const h3 = document.createElement("h3");
    h3.textContent = name;
    h3.classList.add("productName");

    return h3;
}

//create a p, attributing it the content passed in function param, and a proper class attribute, return it
function getP(description) {
    const p = document.createElement("p");
    p.textContent = description;
    p.classList.add("productDescription");

    return p;
}



