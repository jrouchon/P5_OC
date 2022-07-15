//parse url to find orderId after ?, display the order id
const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
const orderId = searchParams.get("orderId");
getOrderId(orderId);
window.localStorage.clear()

function getOrderId(orderId) {
	const orderIdElem = document.getElementById("orderId");
	orderIdElem.textContent = orderId;
}