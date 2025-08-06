//Shop-Now Button
function scrollToProducts() {
    document.getElementById('product1').scrollIntoView({ behavior: 'smooth' });
}

// Making cart function
function ready() {
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    //console.log(removeCartButtons);
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem);
    }
    // Changing quantity of items in cart
    var quantityInputs = document.getElementsByClassName('cart-quantity');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }
    // Adding items to cart
    let addCart_btns = document.querySelectorAll('.add-cart');
    addCart_btns.forEach(btn => {
        btn.addEventListener('click', handle_addCartItem);
    });

    // Functionality to 'Buy Now' button
    const buyNowButton = document.querySelector('.btn-buy');
    buyNowButton.addEventListener('click', handleBuyNow);
}

function handle_addCartItem(event) {
    let product = this.parentElement;
    let title = product.querySelector('.product-title').innerText;
    let price = product.querySelector('.product-price').innerText;
    let image = product.querySelector('.product-img').src;
    let quantity = product.querySelector('input[type="number"]').value;
    let productId = product.getAttribute('data-id');
    addProductToCart(title, price, image, quantity,productId);
    updatetotal();
}

// Remove cart items function
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal();
}

// Quantity changed function
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updatetotal();
}

// Update cart total function
function updatetotal() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        var price = parseFloat(priceElement.innerText.replace('£', ''));
        var quantity = quantityElement.value;
        total += price * quantity;
    }
    // Edge cases for float numbers
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('total-price')[0].innerText = '£' + total;

    if (cartBoxes.length === 0) {
        document.getElementsByClassName('total-price')[0].innerText = '£0';
    }
}

// Add product to cart function
function addProductToCart(title, price, image, quantity,productId) {
    const cartContent = document.querySelector('.cart-content');
    const cartBox = document.createElement('div');
    cartBox.classList.add('cart-box');
    cartBox.setAttribute('data-id', productId);
    console.log("Hello this is the id of the product:",productId);
    console.log(title,price,image,quantity);
    cartBox.innerHTML = `
        <img src="${image}" alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="${quantity}" min="1" class="cart-quantity">
            <input type="hidden" value="${productId}" class="product-id">
        </div>
        <i class="fa-solid fa-trash cart-remove"></i>
    `;

    cartContent.appendChild(cartBox);

    // Add event listeners for the new cart item
    cartBox.querySelector('.cart-remove').addEventListener('click', removeCartItem);
    cartBox.querySelector('.cart-quantity').addEventListener('change', quantityChanged);
}


async function handleBuyNow() {
    const cartBoxes = document.querySelectorAll('.cart-box');
    for (let cartBox of cartBoxes) {
        const productId = cartBox.querySelector('.product-id').value;
        const quantity = cartBox.querySelector('.cart-quantity').value;
        //console.log(`Buying product with ID: ${productId} and quantity: ${quantity}`);
        try {
            const response = await fetch(`/api/v1/products/${productId}/buy`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: quantity })
            });

            const data = await response.json();
            if (response.ok) {
                Toastify({

                    text: `Items have been bought successfully: ${data.data.product.title}`,
                    
                    duration: 3000
                    
                    }).showToast();
            } else {
                Toastify({

                    text: `Failed to buy items: ${data.message}`,
                    
                    duration: 3000
                    
                    }).showToast();
            }
        } catch (error) {
            Toastify({

                text: `Error: ${error.message}`,
                
                duration: 3000
                
                }).showToast();
            
        }
    }
    // Clear the cart after purchase
    document.querySelector('.cart-content').innerHTML = '';
    updatetotal();
}

//Cart
let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart-container');
let closeCart = document.querySelector('#close-cart');

cartIcon.onclick = () => { 
    cart.classList.add("active");  
};
closeCart.onclick = () => {
    cart.classList.remove("active");
};

// Ensure the cart icon in mobile mode is clickable
let mobileCartIcon = document.querySelector('#mobile .fa-cart-shopping');
if (mobileCartIcon) {
    mobileCartIcon.addEventListener('click', () => {
        cart.classList.add("active");
    });
}

//Mobile responsive navbar
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click',() => {
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click',() => {
        nav.classList.remove('active');
    })
}

let isPreviewActive = false;

//Functions for previewing products + buttons
function setupPreview() {
    let previewContainer = document.querySelector('.products-preview');
    let previewBox = previewContainer.querySelectorAll('.preview');

    document.querySelectorAll('.pro-container .pro').forEach(product => {
        product.onclick = async (event) => {
            event.preventDefault();
            event.stopPropagation();

            isPreviewActive = true;

            const productId = product.getAttribute('data-id');
            try {
                let response = await fetch(`http://localhost:1230/api/v1/products/${productId}`);
                let data = await response.json();
                const productDetails = data.data.product;

                // Generate star rating HTML
                let stars = '';
                for (let i = 0; i < productDetails.rating; i++) {
                    stars += '<i class="fa-solid fa-star"></i>';
                }
                let sizes = '';
                for (let i = 0; i < productDetails.size_options.length; i++) {
                    sizes += `<option value="${productDetails.size_options[i]}">${productDetails.size_options[i]}</option>`;
                }

                const productDiv = document.createElement('div');
                productDiv.className = 'preview active';
                productDiv.setAttribute('data-target', productDetails.title);

                productDiv.innerHTML = `
                <i class="fa-solid fa-xmark"></i>
                <img src="${productDetails.image_url}" alt="">
                <div class="product-details">
                    <h3 class="product-title">${productDetails.title}</h3>
                    <h4 class="product-price">£${productDetails.price}</h4>
                    <select>
                        ${sizes}
                    </select>
                    <div class="star">
                        ${stars}
                    </div>
                    <input type="number" value="1" min="1">
                    <button class="add-cart">Add to Cart</button>
                    <h5>Product Description</h5>
                    <p>${productDetails.description}</p>
                    <div class="stock-count">In Stock: ${productDetails.stock_count}</div>
                </div>
            `;

            previewContainer.innerHTML = ''; // Clear previous previews
            previewContainer.appendChild(productDiv);
            previewContainer.style.display = 'flex';

            productDiv.querySelector('.fa-xmark').onclick = () => {
                productDiv.classList.remove('active');
                previewContainer.style.display = 'none';
                isPreviewActive = false;
            };
            // Add event listener for the "Add to Cart" button
            productDiv.querySelector('.add-cart').addEventListener('click', () => {
                addProductToCart(productDetails.title, productDetails.price, productDetails.image_url, productDiv.querySelector('input[type="number"]').value,productId);
                updatetotal();
                previewContainer.style.display = 'none';
                isPreviewActive = false; // Reset the flag when the product is added to the cart
            });

        } catch (e) {
            Toastify({

                text: "Failed to connect to the server. Trying to reconnect...",
                
                duration: 3000
                
                }).showToast();
        }
    };
});
}

function setupButtonSelector(buttonSelector) {
    const buttons = document.querySelectorAll(buttonSelector);
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

////// WEB DEV STUFF FOR CLIENT
window.addEventListener('DOMContentLoaded', () => {
    const fetchContinuous = async () => {

        if (isPreviewActive) return;

        const filterButtonsContainer = document.querySelector('#filter-buttons');
        const productList = document.querySelector('.pro-container');
        const previewContainer = document.querySelector('.products-preview');

        // Stop regeneration
        productList.innerHTML = '';
        previewContainer.innerHTML = '';
        filterButtonsContainer.innerHTML = '<button class="filter-btn active" data-filter="all">All</button>'; // Reset filter buttons

        try {
            let response = await fetch('http://localhost:1230/api/v1/sellers');
            let data = await response.json();
            //console.log(data); // Debugging

            const sellers = data.data.sellers;
            if (!Array.isArray(sellers)) {
                throw new Error('Sellers data is not an array');
            }

            sellers.forEach(seller => {
                let button = document.createElement('button');
                button.className = 'filter-btn';
                button.setAttribute('data-filter', seller.id);

                let img = document.createElement('img');
                img.src = seller.logo;
                img.alt = seller.name;

                button.appendChild(img);
                filterButtonsContainer.appendChild(button);

                button.addEventListener('click', async function () {
                    let response = await fetch(`http://localhost:1230/api/v1/sellers/${seller.id}`);
                    let data = await response.json();
                    const products = data.data.products;

                    // Clear the current product list
                    productList.innerHTML = '';

                    // Render the products for the selected seller
                    products.forEach(product => {
                        const productDiv = document.createElement('div');
                        productDiv.className = 'pro';

                        // Generate star rating HTML
                        let stars = '';
                        for (let i = 0; i < product.rating; i++) {
                            stars += '<i class="fa-solid fa-star"></i>';
                        }

                        productDiv.innerHTML = `
                            <img class="product-img" src="${product.image_url}" alt="">
                            <div class="des">
                                <span>${product.id}</span>
                                <h5 class="product-title">${product.title}</h5>
                                <div class="star">
                                    ${stars}
                                </div>
                                <h4 class="product-price">£${product.price}</h4>
                            </div>
                            <a class="cart"><i class="fa-solid fa-cart-shopping add-cart"></i></a>
                        `;
                        productList.appendChild(productDiv);
                        productDiv.setAttribute('data-name', product.title);
                        productDiv.setAttribute('data-id', product.id);
                    });
                    setupPreview(); // Re-setup preview for new products
                    ready();
                });
            });

            const allButton = document.querySelector('.filter-btn[data-filter="all"]');
            allButton.addEventListener('click', async function () {
                let response = await fetch('http://localhost:1230/api/v1/products');
                let data = await response.json();
                const products = data.data.products;

                // Clear current product list
                productList.innerHTML = '';

                // Render all products
                products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.className = 'pro';

                    // Generate star rating HTML
                    let stars = '';
                    for (let i = 0; i < product.rating; i++) {
                        stars += '<i class="fa-solid fa-star"></i>';
                    }
                    productDiv.innerHTML = `
                        <img class="product-img" src="${product.image_url}" alt="">
                        <div class="des">
                            <span>${product.id}</span>
                            <h5 class="product-title">${product.title}</h5>
                            <div class="star">
                                ${stars}
                            </div>
                            <h4 class="product-price">£${product.price}</h4>
                        </div>
                        <a class="cart"><i class="fa-solid fa-cart-shopping add-cart"></i></a>
                    `;
                    productList.appendChild(productDiv);
                });
                setupPreview();
                ready();
            });
        } catch (e) {
            Toastify({

                text: `Error fetching sellers. Trying to reconnect to server...`,
                
                duration: 3000
                
                }).showToast();
            
        }
        setupButtonSelector('.filter-btn');
    };

    const fetchProducts = async () => {

        if (isPreviewActive) return;

        const productList = document.querySelector('.pro-container');
        const previewContainer = document.querySelector('.products-preview');

        // stopping previous regenerations
        productList.innerHTML = '';
        previewContainer.innerHTML = '';

        try {
            let response = await fetch('http://localhost:1230/api/v1/products');
            let data = await response.json();
            data.data.products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'pro';

                // Generate star rating HTML
                let stars = '';
                for (let i = 0; i < product.rating; i++) {
                    stars += '<i class="fa-solid fa-star"></i>';
                }

                productDiv.innerHTML = `
                    <img class="product-img" src="${product.image_url}" alt="">
                    <div class="des">
                        <span>${product.id}</span>
                        <h5 class="product-title">${product.title}</h5>
                        <div class="star">
                            ${stars}
                        </div>
                        <h4 class="product-price">£${product.price}</h4>
                    </div>
                    <a class="cart"><i class="fa-solid fa-cart-shopping add-cart"></i></a>
                `;
                productDiv.setAttribute('data-name', product.title);
                productDiv.setAttribute('data-id', product.id);
                productList.appendChild(productDiv);
            });
            setupPreview();
            ready();
        } catch (e) {
            Toastify({

                text: "Failed to connect to the server. Trying to reconnect...",
                
                duration: 3000
                
                }).showToast();
        }
    };

    fetchContinuous();
    fetchProducts();
    setInterval(() => {
        fetchContinuous();
        fetchProducts();
    }, 9000);
});

/*
window.addEventListener('DOMContentLoaded', async function() {
    const filterButtonsContainer = document.querySelector('#filter-buttons');
    const productList = document.querySelector('.pro-container');

    productList.innerHTML = '';

    try {
        let response = await fetch('http://localhost:1230/api/v1/sellers');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        console.log(data); // Debugging: Log the entire response to check its structure

        const sellers = data.data.sellers;
        if (!Array.isArray(sellers)) {
            throw new Error('Sellers data is not an array');
        }

        const allButton = document.querySelector('.filter-btn[data-filter="all"]');
        allButton.addEventListener('click', async function() {
            try {
                let response = await fetch('http://localhost:1230/api/v1/products');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                let data = await response.json();
                const products = data.data.products;

                // Clear the current product list
                productList.innerHTML = '';

                // Render all products
                products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.className = 'pro';

                    // Generate star rating HTML
                    let stars = '';
                    for (let i = 0; i < product.rating; i++) {
                        stars += '<i class="fa-solid fa-star"></i>';
                    }
                    productDiv.innerHTML = `
                        <img class="product-img" src="${product.image_url}" alt="">
                        <div class="des">
                            <span>${product.id}</span>
                            <h5 class="product-title">${product.title}</h5>
                            <div class="star">
                                ${stars}
                            </div>
                            <h4 class="product-price">£${product.price}</h4>
                        </div>
                        <a class="cart"><i class="fa-solid fa-cart-shopping add-cart"></i></a>
                    `;
                    productList.appendChild(productDiv);
                });
            } catch (e) {
                console.error('Error fetching all products:', e);
            }
        });
                            
        sellers.forEach(seller => {
            let button = document.createElement('button');
            button.className = 'filter-btn';
            button.setAttribute('data-filter', seller.id);

            let img = document.createElement('img');
            img.src = seller.logo; // Ensure this matches the actual property name in your API response
            img.alt = seller.name;

            button.appendChild(img);
            filterButtonsContainer.appendChild(button);

            button.addEventListener('click', async function() {
                try {
                    let response = await fetch(`http://localhost:1230/api/v1/sellers/${seller.id}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    let data = await response.json();
                    const products = data.data.products;

                    // Clear the current product list
                    productList.innerHTML = '';

                    // Render the products for the selected seller
                    products.forEach(product => {
                        const productDiv = document.createElement('div');
                        productDiv.className = 'pro';

                        // Generate star rating HTML
                        let stars = '';
                        for (let i = 0; i < product.rating; i++) {
                            stars += '<i class="fa-solid fa-star"></i>';
                        }

                        productDiv.innerHTML = `
                            <img class="product-img" src="${product.image_url}" alt="">
                            <div class="des">
                                <span>${product.id}</span>
                                <h5 class="product-title">${product.title}</h5>
                                <div class="star">
                                    ${stars}
                                </div>
                                <h4 class="product-price">£${product.price}</h4>
                            </div>
                            <a class="cart"><i class="fa-solid fa-cart-shopping add-cart"></i></a>
                        `;
                        productList.appendChild(productDiv);
                        productDiv.setAttribute('data-name',product.title);
                        productDiv.setAttribute('data-id',product.id);
                    });
                } catch (e) {
                    console.error('Error fetching seller products: Trying to reconnect to server...');
                }
            });
        });
    } catch (e) {
        console.error('Error fetching sellers:', e);
    }
    setupButtonSelector('.filter-btn');
});
        
window.addEventListener('DOMContentLoaded', async function(event){
    try{
        let response = await fetch('http://localhost:1230/api/v1/products');
        let data = await response.json();
        const productList = document.querySelector('.pro-container');
        productList.innerHTML = '';
        data.data.products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'pro';

            // Generate star rating HTML
            let stars = '';
            for (let i = 0; i < product.rating; i++) {
                stars += '<i class="fa-solid fa-star"></i>';
            }

            productDiv.innerHTML = `
                <img class="product-img" src="${product.image_url}" alt="">
                <div class="des">
                    <span>${product.id}</span>
                    <h5 class="product-title">${product.title}</h5>
                    <div class="star">
                        ${stars}
                    </div>
                    <h4 class="product-price">£${product.price}</h4>
                </div>
                <a class="cart"><i class="fa-solid fa-cart-shopping add-cart"></i></a>
            `;
            productDiv.setAttribute('data-name',product.title);
            productDiv.setAttribute('data-id',product.id);
            productList.appendChild(productDiv);
        });
    } catch(e) {
        alert(e);
    }
    setupPreview();
});
*/