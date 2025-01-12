/* Image Filter Section */
const allFilterItems = document.querySelectorAll('.filter-item');
const allFilterBtns = document.querySelectorAll('.filter-btn');

window.addEventListener('DOMContentLoaded', () => {
    allFilterBtns[1].classList.add('active-btn');
});

allFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        showFilteredContent(btn);
    });
});

function showFilteredContent(btn) {
    allFilterItems.forEach((item) => {
        if (item.classList.contains(btn.id)) {
            resetActiveBtn();
            btn.classList.add('active-btn');
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}

function resetActiveBtn() {
    allFilterBtns.forEach((btn) => {
        btn.classList.remove('active-btn');
    });
}

/* Shopping Cart Section */
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    var removeCartItemButton = document.getElementsByClassName('btn-danger');
    for (var i = 0; i < removeCartItemButton.length; i++) {
        var button = removeCartItemButton[i];
        button.addEventListener('click', removeCartItem);
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button');
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i];
        button.addEventListener('click', addToCartClicked);
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked);

    // Promo Code Button Event
    document.getElementById("apply-promo-code").addEventListener("click", applyPromoCode);
}

function purchaseClicked() {
    alert('Thank you for your purchase!!!');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    isPromoApplied = false; // Reset promo code usage after purchase
    document.getElementById("promo-code-message").innerText = ""; // Clear promo message
    updateCartTotal();
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
}

function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement.parentElement;
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;

    if (addItemToCart(title, price, imageSrc)) {
        showNotification(`${title} has been added to your cart!`);
    }
    updateCartTotal();
}

function addItemToCart(title, price, imageSrc) {
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title');

    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already in the cart!');
            return false; // Item already in cart
        }
    }

    var cartRow = document.createElement('tr');
    cartRow.classList.add('cart-row');
    var cartRowContents = `
        <td class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="50" height="50">
            <span class="cart-item-title">${title}</span>                  
        </td>
        <td class="cart-item cart-column">
            <span class="cart-price cart-column">${price}</span>
        </td>
        <td class="cart-item cart-column">
            <input class="cart-quantity-input" type="number" value="1" style="width: 50px">
            <button class="btn btn-danger" type="button">Remove</button>
        </td>        
    `;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);
    return true; // Item successfully added
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    var subtotal = 0;

    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        var price = parseFloat(priceElement.innerText.replace('BDT ', ''));
        var quantity = quantityElement.value;
        subtotal += price * quantity;
    }

    let discount = 0;
    if (isPromoApplied) {
        discount = subtotal * DISCOUNT_RATE; // Apply promo code discount
    }

    const finalTotal = subtotal - discount;

    // Update Cart Summary
    document.getElementById("cart-subtotal").innerText = `BDT ${subtotal.toFixed(2)}`;
    document.getElementById("discount-amount").innerText = `BDT ${discount.toFixed(2)}`;
    document.getElementById("final-total").innerText = `BDT ${finalTotal.toFixed(2)}`;
}

// Define constants for the promo codes and their respective discounts
const PROMO_CODES = {
    "ostad10": 0.10,  // 10% discount
    "ostad5": 0.05,   // 5% discount
};

let appliedDiscount = 0;  // Discount value after applying promo code
let isPromoApplied = false; // Track if a promo code has been applied

// Apply Promo Code Function
function applyPromoCode() {
    const promoInput = document.getElementById("promo-code-input").value.trim();
    const promoMessage = document.getElementById("promo-code-message");

    // Check if the entered promo code exists in the defined list
    if (PROMO_CODES[promoInput] && !isPromoApplied) {
        appliedDiscount = PROMO_CODES[promoInput];  // Get the discount percentage
        isPromoApplied = true;
        updateCartSummary();
        promoMessage.style.color = "green";
        promoMessage.innerText = `${promoInput} applied! You get ${appliedDiscount * 100}% off.`;
    } else if (isPromoApplied) {
        promoMessage.style.color = "orange";
        promoMessage.innerText = "Promo code already applied.";
    } else {
        promoMessage.style.color = "red";
        promoMessage.innerText = "Invalid promo code. Please try again.";
    }
}

// Update Cart Summary (Subtotal, Discount, Final Total)
function updateCartSummary() {
    const cartItemContainer = document.getElementsByClassName('cart-items')[0];
    const cartRows = cartItemContainer.getElementsByClassName('cart-row');
    let subtotal = 0;

    // Calculate the subtotal by adding each item price * quantity
    for (let i = 0; i < cartRows.length; i++) {
        const cartRow = cartRows[i];
        const priceElement = cartRow.getElementsByClassName('cart-price')[0];
        const quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        const price = parseFloat(priceElement.innerText.replace('BDT ', ''));
        const quantity = quantityElement.value;
        subtotal += price * quantity;
    }

    // Calculate the discount and final total
    const discount = subtotal * appliedDiscount;
    const finalTotal = subtotal - discount;

    // Update the UI with the calculated values
    document.getElementById("cart-subtotal").innerText = `BDT ${subtotal.toFixed(2)}`;
    document.getElementById("discount-amount").innerText = `BDT ${discount.toFixed(2)}`;
    document.getElementById("final-total").innerText = `BDT ${finalTotal.toFixed(2)}`;
}

// Show Notification Function
function showNotification(message) {
    var notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;

    // Add styles for the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 20px';
    notification.style.backgroundColor = '#28a745';
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    notification.style.fontSize = '16px';
    notification.style.zIndex = '1000';

    document.body.appendChild(notification);

    // Automatically remove the notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

