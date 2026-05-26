import { menuArray } from "./data.js";

const foodMenuList = document.querySelector(".food-menu ul")
let mainSection = document.querySelector("main")
const orderSummary = document.querySelector(".orderSummary")
let cartObj = {}
let totalPrice = 0
const paymentModal = document.querySelector(".payment-modal")

function buildMenuItemsHtml() {
    foodMenuList.innerHTML = menuArray.map(({name, ingredients, price, emoji, id}) => {
        return `
                <li class="menu-item" id="${id}">
                    <span class="food-emoji" role="img" aria-label="${name}">${emoji}</span>
                    <div class="menu-item-content">
                        <h2>${name}</h2>
                        <p class="food-ingredients">${ingredients.join(", ")}</p>
                        <p class="food-price">$${price}</p>
                    </div>
                    <button class="add-menu-item-btn" type="button">+</button>
                </li>
        `
    }).join("")

    document.querySelectorAll(".add-menu-item-btn").forEach(addMenuItemBtn => {
        addMenuItemBtn.addEventListener("click", function(event){
            if (!orderSummary.innerHTML) {
                buildOrderSummary()
            }
            
            addMenuItem(event.target.parentElement.id)
        })
    })
}


function addMenuItem(id){
    let foodName = ""
    const menuItem = menuArray.reduce((acc, {name, price, id: itemId}) => {
        if (Number(id) === itemId) {
            acc[name] ??= []

            acc[name].push(name)
            acc[name].push(price)
            acc[name].push(itemId)

            foodName = name
        }
        return acc
    }, {})

    const {[foodName]: [name, price, itemId]} = menuItem

    if (!Object.hasOwn(cartObj, name)) {
        Object.assign(cartObj, menuItem)
    }

    renderCart()
    renderTotalPrice()
}

function renderCart(){
    document.querySelector(".cart").innerHTML = Object.entries(cartObj)
    .map(([name, [foodName, price, id]]) => {
        return `
        <li>
            <div class="name-container" id="${id}">
                <span>${foodName}</span>
                <button class="remove-btn">remove</button>
            </div>
            <span class="food-price">$${price}
            </span>
        </li>
        `
    })
    .join("")

    document.querySelectorAll(".remove-btn").forEach((removeBtn) => {
        removeBtn.addEventListener("click", function(event) {
            removeMenuItem(event.target.parentElement.id)
        })
    })
}

function renderTotalPrice(){
    totalPrice = Object.entries(cartObj).reduce((acc, [name, [foodName, price, id]]) => acc + price, 0)
    document.querySelector(".total-price-container").innerHTML = `
            <h2>Total price</h2>
            <span class="food-price">$${totalPrice}</span>
        `
}

function removeMenuItem(id){
    cartObj = Object.fromEntries(
        Object.entries(cartObj)
        .filter(([name, [foodName, price, itemId]]) => itemId !== Number(id)))
    
    if (!Object.entries(cartObj).length) {
        orderSummary.innerHTML = ""
    } else {
        renderCart()
        renderTotalPrice()
    }
}

function buildOrderSummary(){
    orderSummary.innerHTML = `
        <h2>Your order</h2>
        <ul class="cart"></ul>
        <div class="total-price-container"></div>
        <button class="complete-order-btn" type="button">Complete Order</button>
    `
    document.querySelector(".complete-order-btn").addEventListener("click", function(){
        getPaymentDetails()
    })
}

function getPaymentDetails(){
    paymentModal.innerHTML = `
    <h1 class="payment-form-title">Enter card details</h1>
    <form id="payment-form">
        <input type="text" placeholder="Enter your name" required>
        <input type="text" inputmode="numeric" pattern="[0-9]*" placeholder="Enter card number" required>
        <input type="text" inputmode="numeric" pattern="[0-9]{3,4}" placeholder="Enter CVV" required>
        <button type="submit" class="pay-btn">Pay</button>
    </form>
    `

    document.getElementById("payment-form").addEventListener("submit", function(e){
        e.preventDefault()
        closePaymentModal()
        successNotification()
    })

    paymentModal.classList.toggle("hidden")
    paymentModal.classList.toggle("visible")
}

function closePaymentModal(){
    paymentModal.classList.toggle("visible")
    paymentModal.classList.toggle("hidden")
}

function successNotification(){
    orderSummary.innerHTML = `
        <p class="success-notification">Thanks, James! Your order is on its way!</p>
    `
    setTimeout(() => {
        orderSummary.innerHTML = ""
    }, 2500)
}

buildMenuItemsHtml()