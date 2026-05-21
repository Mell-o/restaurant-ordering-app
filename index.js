import { menuArray } from "./data.js";

const foodMenuList = document.querySelector(".food-menu ul")

function buildMenuItemsHtml() {
    const menuItemsHtml = menuArray.map(({name, ingredients, price, emoji}) => {
        return `
            <li class="menu-item">
                <span class="food-emoji" role="img" aria-label="${name}">${emoji}</span>
                <div class="menu-item-content">
                    <h2>${name}</h2>
                    <p class="food-ingredients">${ingredients}</p>
                    <p class="food-price">${price}</p>
                </div>
                <button type="button" onclick="">+</button>
            </li>
        `
    })
}