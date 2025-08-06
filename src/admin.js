//Mobile responsive navbar
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('sizeForm');
    const checkboxes = form.querySelectorAll('input[type="checkbox"][name="size"]');

    // Function to ensure at least one checkbox is selected
    function ensureAtLeastOneCheckbox() {
        if (Array.from(checkboxes).every(checkbox => !checkbox.checked)) {
            checkboxes[0].checked = true;
        }
    }

    // Event listeners for individual size checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            ensureAtLeastOneCheckbox();
        });
    });

    // Ensure at least one checkbox is selected on form submission
    form.addEventListener('submit', function (event) {
        ensureAtLeastOneCheckbox();
        alert('Form submitted with selected sizes: ' + 
              Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value).join(', '));
        event.preventDefault(); // Prevent form submission for demonstration purposes
    });

    // Initial check to ensure at least one checkbox is selected
    ensureAtLeastOneCheckbox();
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const addProductButton = document.querySelector('input[type="submit"]');

    addProductButton.addEventListener('click', async (event) => {
        event.preventDefault();

        // Collect form data
        const title = document.querySelector('input[placeholder="Enter product name"]').value;
        const image_url = document.querySelector('input[placeholder="Enter image URL"]').value;
        const price = document.querySelector('input[placeholder="Enter product price"]').value;
        const rating = document.querySelector('input[placeholder="Enter product rating"]').value;
        const description = document.querySelector('input[placeholder="Enter product description"]').value;
        const stock_count = document.querySelector('input[placeholder="Enter stock count for product"]').value;
        const seller_id = document.querySelector('input[name="seller"]:checked')?.value;

        // Collect size options
        const sizeOptions = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(checkbox => checkbox.value);

        // Validate form data
        if (!title || !image_url || !price || !rating || !description || !stock_count || !seller_id || sizeOptions.length === 0) {
            Toastify({

                text: "Please fill in all fields before submitting.",
                
                duration: 3000
                
                }).showToast();
            return;
        }

        // Validate rating
        const ratingValue = parseInt(rating);
        if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5 || !Number.isInteger(ratingValue)) {
            Toastify({

                text: "Rating must be an integer between 1 and 5.",
                
                duration: 3000
                
                }).showToast();
            return;
        }

        // Validate stock count
        const stockCountValue = parseInt(stock_count);
        if (isNaN(stockCountValue) || stockCountValue < 1 || !Number.isInteger(stockCountValue)) {
            Toastify({

                text: "Stock count must be a positive integer.",
                
                duration: 3000
                
                }).showToast();
            return;
        }

        // Validate price
        const priceValue = parseFloat(price);
        if (isNaN(priceValue) || priceValue < 0) {
            Toastify({

                text: "Price must be a non-negative number.",
                
                duration: 3000
                
                }).showToast();
            return;
        }

        // Create product object
        const newProduct = {
            title,
            image_url,
            price: priceValue,
            rating: ratingValue,
            description,
            size_options: sizeOptions,
            stock_count: stockCountValue,
            seller_id
        };

        try {
            // Send POST request to the server
            const response = await fetch('/api/v1/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            if (response.ok) {
                const result = await response.json();
                Toastify({

                    text: "Product added successfully!",

                    duration: 3000
                    
                    }).showToast();
                form.reset(); // Clear the form
            } else {
                const error = await response.json();
                Toastify({

                    text: `Error: ${error.message}`,
                    
                    duration: 3000
                    
                    }).showToast();
            }
        } catch (error) {
            Toastify({

                text: "An error occurred while adding the product.",

                duration: 3000
                
                }).showToast();
        }
    });
});