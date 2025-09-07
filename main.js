// Global variable to store products
let products = [];
// Function to fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch('product.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        
        // Fallback to inline data if fetch fails (for local development)
        return [
            {
                "id": 1,
                "name": "Women Striped Shirt Dress",
                "category": "Dresses",
                "image": "images/dress1.jpg",
                "price": 99.00,
                "oldPrice": 129.00,
                "discount": 23,
                "rating": 4.5,
                "ratingCount": 5,
                "badge": "sale",
                "description": "Elegant striped shirt dress perfect for both casual and formal occasions. Made from high-quality cotton blend for comfort and durability.",
                "trending": true
            },
            {
                "id": 2,
                "name": "Men's Running Shoes",
                "category": "Footwear",
                "image": "images/Court-Shatter-Low-Sneakers.avif",
                "price": 129.00,
                "oldPrice": null,
                "discount": null,
                "rating": 4,
                "ratingCount": 12,
                "badge": "new",
                "description": "High-performance running shoes designed for comfort and speed. Features advanced cushioning and breathable mesh upper.",
                "trending": true
            },
            {
                "id": 3,
                "name": "Women Printed A-Line Dress",
                "category": "Dresses",
                "image": "images/dress2.jpg",
                "price": 110.00,
                "oldPrice": 149.00,
                "discount": 26,
                "rating": 5,
                "ratingCount": 42,
                "badge": "hot",
                "description": "Beautiful A-line dress with vibrant print. Perfect for summer outings and special occasions.",
                "trending": true
            },
            {
                "id": 4,
                "name": "Girls Fit and Flare Dress",
                "category": "Kids",
                "image": "images/dress3.jpg",
                "price": 99.00,
                "oldPrice": null,
                "discount": null,
                "rating": 4,
                "ratingCount": 5,
                "badge": "sold",
                "description": "Cute fit and flare dress for girls. Made from soft, comfortable fabric that's gentle on skin.",
                "trending": true
            },
            {
                "id": 5,
                "name": "Men's Casual Shirt",
                "category": "Men's Wear",
                "image": "images/Men's-Slim-Fit-Polo-T-shirt.avif",
                "price": 79.00,
                "oldPrice": 99.00,
                "discount": 20,
                "rating": 4.5,
                "ratingCount": 8,
                "badge": "sale",
                "description": "Comfortable casual shirt perfect for everyday wear. Made from breathable cotton fabric."
            },
            {
                "id": 6,
                "name": "Women's Handbag",
                "category": "Accessories",
                "image": "images/photo-1544005313-94ddf0286df2.avif",
                "price": 149.00,
                "oldPrice": null,
                "discount": null,
                "rating": 4,
                "ratingCount": 3,
                "badge": "new",
                "description": "Elegant handbag with plenty of room for all your essentials. Features multiple compartments and secure closure."
            },
            {
                "id": 7,
                "name": "Boys Solid Sweatshirt",
                "category": "Kids",
                "image": "images/Futuristic-Logo-Men's-Slim-Fit-Hoodie.avif",
                "price": 89.00,
                "oldPrice": 119.00,
                "discount": 25,
                "rating": 4.5,
                "ratingCount": 15,
                "badge": "hot",
                "description": "Warm and comfortable sweatshirt for boys. Perfect for cooler weather and outdoor activities."
            },
            {
                "id": 8,
                "name": "Women's Sneakers",
                "category": "Footwear",
                "image": "images/X-ray-Prism-Men's-Sneakers.avif",
                "price": 109.00,
                "oldPrice": null,
                "discount": null,
                "rating": 4,
                "ratingCount": 7,
                "badge": "new",
                "description": "Stylish and comfortable sneakers perfect for everyday wear. Features cushioned insole for all-day comfort."
            }
        ];
    }
}
// Function to render products
function renderProducts(productsToRender, tabId) {
    // Get the product grid for the specific tab
    const productGrid = document.getElementById(`productGrid-${tabId}`);
    if (!productGrid) return;
    
    productGrid.innerHTML = ''; // Clear existing products
    
    productsToRender.forEach(product => {
        // Create product card HTML
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.productId = product.id;
        
        // Badge HTML
        let badgeHtml = '';
        if (product.badge) {
            badgeHtml = `<div class="product-badge badge-${product.badge}">${product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}</div>`;
        }
        
        // Price HTML
        let priceHtml = `<span class="current-price">$${product.price.toFixed(2)}</span>`;
        if (product.oldPrice) {
            priceHtml += `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>`;
            priceHtml += `<span class="discount">-${product.discount}%</span>`;
        }
        
        // Rating HTML
        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 !== 0;
        let starsHtml = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        const emptyStars = 5 - Math.ceil(product.rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        
        // Product card HTML
        productCard.innerHTML = `
            ${badgeHtml}
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-actions">
                <div class="action-icon wishlist-btn">
                    <i class="fas fa-heart"></i>
                </div>
                <div class="action-icon cart-btn">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="action-icon details-btn">
                    <i class="fas fa-eye"></i>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${starsHtml}
                    </div>
                    <span class="rating-count">(${product.ratingCount})</span>
                </div>
                <div class="product-price">
                    ${priceHtml}
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to product cards
    addProductEventListeners();
    
    // Update wishlist icons based on localStorage
    updateWishlistIcons();
}

// Function to render trending products
function renderTrendingProducts() {
    const trendingGrid = document.getElementById('trendingProductsGrid');
    if (!trendingGrid) return;
    
    // Filter products that have trending: true
    const trendingProducts = products.filter(product => product.trending).slice(0, 4);
    
    trendingGrid.innerHTML = ''; // Clear existing products
    
    trendingProducts.forEach(product => {
        // Create product card HTML
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.productId = product.id;
        
        // Badge HTML
        let badgeHtml = '';
        if (product.badge) {
            badgeHtml = `<div class="product-badge badge-${product.badge}">${product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}</div>`;
        }
        
        // Price HTML
        let priceHtml = `<span class="current-price">$${product.price.toFixed(2)}</span>`;
        if (product.oldPrice) {
            priceHtml += `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>`;
            priceHtml += `<span class="discount">-${product.discount}%</span>`;
        }
        
        // Rating HTML
        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 !== 0;
        let starsHtml = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        const emptyStars = 5 - Math.ceil(product.rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        
        // Product card HTML
        productCard.innerHTML = `
            ${badgeHtml}
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-actions">
                <div class="action-icon wishlist-btn">
                    <i class="fas fa-heart"></i>
                </div>
                <div class="action-icon cart-btn">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="action-icon details-btn">
                    <i class="fas fa-eye"></i>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${starsHtml}
                    </div>
                    <span class="rating-count">(${product.ratingCount})</span>
                </div>
                <div class="product-price">
                    ${priceHtml}
                </div>
            </div>
        `;
        
        trendingGrid.appendChild(productCard);
    });
    
    // Add event listeners to product cards
    addProductEventListeners();
    
    // Update wishlist icons based on localStorage
    updateWishlistIcons();
}

// Function to add event listeners to product cards
function addProductEventListeners() {
    // Remove existing event listeners by cloning nodes
    document.querySelectorAll('.cart-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    document.querySelectorAll('.details-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    document.querySelectorAll('.product-img').forEach(img => {
        const newImg = img.cloneNode(true);
        img.parentNode.replaceChild(newImg, img);
    });

    // Add to cart buttons
    document.querySelectorAll('.cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();  // Prevent default behavior
            e.stopPropagation(); // Stop event bubbling
            const productId = parseInt(this.closest('.product-card').dataset.productId);
            addToCart(productId);
        });
    });
    
    // Add to wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();  // Prevent default behavior
            e.stopPropagation(); // Stop event bubbling
            const productId = parseInt(this.closest('.product-card').dataset.productId);
            addToWishlist(productId);
        });
    });
    
    // Product details buttons
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();  // Prevent default behavior
            e.stopPropagation(); // Stop event bubbling
            const productId = parseInt(this.closest('.product-card').dataset.productId);
            viewProductDetails(productId);
        });
    });
    
    // Product image clicks
    document.querySelectorAll('.product-img').forEach(img => {
        img.addEventListener('click', function(e) {
            e.preventDefault();  // Prevent default behavior
            e.stopPropagation(); // Stop event bubbling
            const productId = parseInt(this.closest('.product-card').dataset.productId);
            viewProductDetails(productId);
        });
    });
}

// Function to show notification
function showNotification(message, type = 'success') {
    const toast = document.getElementById('notificationToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('.toast-icon i');
    const toastClose = document.getElementById('toastClose');
    
    // Set message
    if (type === 'success') {
        toastTitle.textContent = 'Success!';
        toastIcon.className = 'fas fa-check-circle';
        toast.querySelector('.toast-icon').className = 'toast-icon success';
    } else if (type === 'wishlist') {
        toastTitle.textContent = 'Wishlist!';
        toastIcon.className = 'fas fa-heart';
        toast.querySelector('.toast-icon').className = 'toast-icon wishlist';
    }
    
    toastMessage.textContent = message;
    
    // Show toast
    toast.className = 'notification-toast show';
    if (type === 'wishlist') {
        toast.classList.add('wishlist');
    }
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        hideNotification();
    }, 3000);
    
    // Close button functionality
    toastClose.onclick = function() {
        hideNotification();
    };
}

// Function to hide notification
function hideNotification() {
    const toast = document.getElementById('notificationToast');
    toast.classList.add('hide');
    
    // Reset after animation completes
    setTimeout(() => {
        toast.className = 'notification-toast';
    }, 500);
}

// Function to open cart sidebar
function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        
        // Render cart items
        renderCartItems();
    }
}

// Function to close cart sidebar
function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }
}

// Function to render cart items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cartItemsContainer) return;
    // Clear cart items
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        // Show empty cart message
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        // Render cart items
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.dataset.productId = item.id;
            cartItem.dataset.size = item.size || '';
            cartItem.dataset.color = item.color || '';
            // Build variant info
            let variantInfo = '';
            if (item.size || item.color) {
                variantInfo = '<div class="cart-item-variant">';
                if (item.size) variantInfo += `Size: ${item.size}`;
                if (item.size && item.color) variantInfo += ' | ';
                if (item.color) variantInfo += `Color: ${item.color}`;
                variantInfo += '</div>';
            }
            cartItem.innerHTML = `
                <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    ${variantInfo}
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="decrease-quantity">-</button>
                        <input type="number" value="${item.quantity}" min="1" readonly>
                        <button class="increase-quantity">+</button>
                        <span class="cart-item-remove"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        // Add event listeners to cart items
        addCartItemEventListeners();
    }
    // Update cart subtotal
    updateCartSubtotal();
}

// Function to add event listeners to cart items
function addCartItemEventListeners() {
    // Decrease quantity buttons
    document.querySelectorAll('.decrease-quantity').forEach(btn => {
        btn.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const productId = parseInt(cartItem.dataset.productId);
            const size = cartItem.dataset.size || null;
            const color = cartItem.dataset.color || null;
            const quantityInput = cartItem.querySelector('input');
            let newQuantity = parseInt(quantityInput.value) - 1;
            if (newQuantity < 1) newQuantity = 1;
            updateCartItemQuantity(productId, newQuantity, size, color);
        });
    });
    // Increase quantity buttons
    document.querySelectorAll('.increase-quantity').forEach(btn => {
        btn.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const productId = parseInt(cartItem.dataset.productId);
            const size = cartItem.dataset.size || null;
            const color = cartItem.dataset.color || null;
            const quantityInput = cartItem.querySelector('input');
            let newQuantity = parseInt(quantityInput.value) + 1;
            updateCartItemQuantity(productId, newQuantity, size, color);
        });
    });
    // Remove item buttons
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const productId = parseInt(cartItem.dataset.productId);
            const size = cartItem.dataset.size || null;
            const color = cartItem.dataset.color || null;
            removeCartItem(productId, size, color);
        });
    });
}

// Function to update cart item quantity
function updateCartItemQuantity(productId, quantity, size = null, color = null) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Find the item in the cart with matching productId, size, and color
    const itemIndex = cart.findIndex(item =>
        item.id === productId &&
        item.size === size &&
        item.color === color
    );
    if (itemIndex !== -1) {
        // Update quantity
        cart[itemIndex].quantity = quantity;
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        // Update cart count in header
        updateCartCount();
        // Re-render cart items
        renderCartItems();
    }
}

// Function to remove cart item
function removeCartItem(productId, size = null, color = null) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Remove the item from the cart with matching productId, size, and color
    cart = cart.filter(item =>
        !(item.id === productId &&
          item.size === size &&
          item.color === color)
    );
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    // Update cart count in header
    updateCartCount();
    // Re-render cart items
    renderCartItems();
    // Show notification
    showNotification('Item removed from cart', 'success');
}

// Function to update cart subtotal
function updateCartSubtotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    const cartSubtotalElement = document.getElementById('cartSubtotal');
    if (cartSubtotalElement) {
        cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
}

// Function to add product to cart
async function addToCart(productId, selectedSize = null, selectedColor = null) {
    // Get existing cart from localStorage or create new array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Check if product is already in cart with same size/color
    const existingProduct = cart.find(item =>
        item.id === productId &&
        item.size === selectedSize &&
        item.color === selectedColor
    );
    if (existingProduct) {
        // Increase quantity if already exists with same size/color
        existingProduct.quantity += 1;
        showNotification('Quantity updated in cart!', 'success');
    } else {
        // Add new product to cart
        const product = products.find(p => p.id === productId);
        if (product) {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                size: selectedSize,
                color: selectedColor
            });
            showNotification('Product added to cart!', 'success');
        }
    }
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    // Update cart count in header
    updateCartCount();
}

// Function to add product to wishlist
function addToWishlist(productId) {
    // Get existing wishlist from localStorage or create new array
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Check if product is already in wishlist
    if (wishlist.includes(productId)) {
        // Remove if already exists
        wishlist = wishlist.filter(id => id !== productId);
        console.log('Product removed from wishlist:', productId);
        
        // Update heart icon to empty
        const wishlistBtn = document.querySelector(`.product-card[data-product-id="${productId}"] .wishlist-btn i`);
        if (wishlistBtn) {
            wishlistBtn.className = 'fas fa-heart';
        }
        showNotification('Removed from wishlist', 'wishlist');
    } else {
        // Add to wishlist
        wishlist.push(productId);
        console.log('Product added to wishlist:', productId);
        
        // Update heart icon to filled
        const wishlistBtn = document.querySelector(`.product-card[data-product-id="${productId}"] .wishlist-btn i`);
        if (wishlistBtn) {
            wishlistBtn.className = 'fas fa-heart text-danger';
        }
        showNotification('Added to your wishlist!', 'wishlist');
    }
    
    // Save wishlist to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Update wishlist count in header
    updateWishlistCount();
}

// Function to update wishlist icons based on localStorage
function updateWishlistIcons() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = parseInt(card.dataset.productId);
        const wishlistBtn = card.querySelector('.wishlist-btn i');
        
        if (wishlist.includes(productId)) {
            wishlistBtn.className = 'fas fa-heart text-danger';
        } else {
            wishlistBtn.className = 'fas fa-heart';
        }
    });
}

// Function to update wishlist count in header
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistCountElement = document.querySelector('.wishlist-count');
    if (wishlistCountElement) {
        wishlistCountElement.textContent = wishlist.length;
        
        // Update wishlist button state
        const wishlistBtn = document.querySelector('.wishlist-btn');
        if (wishlist.length > 0) {
            wishlistBtn.classList.add('active');
        } else {
            wishlistBtn.classList.remove('active');
        }
    }
}

// Function to view product details
function viewProductDetails(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// Function to update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Function to filter products by category
function filterProducts(category) {
    let filteredProducts;
    
    if (category === 'all') {
        filteredProducts = products;
    } else if (category === 'mens') {
        filteredProducts = products.filter(p => 
            p.category === "Men's Wear" || p.category === "Footwear"
        );
    } else if (category === 'womens') {
        filteredProducts = products.filter(p => 
            p.category === "Dresses" || p.category === "Accessories" || p.category === "Footwear"
        );
    } else if (category === 'kids') {
        filteredProducts = products.filter(p => p.category === "Kids");
    }
    
    renderProducts(filteredProducts, category);
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Fetch products from JSON file
    products = await fetchProducts();
    
    // Render trending products (4 products)
    renderTrendingProducts();
    
    // Render all products initially for featured section
    renderProducts(products, 'all');
    
    // Update cart count from localStorage
    updateCartCount();
    
    // Update wishlist count from localStorage
    updateWishlistCount();
    
    // Setup tab button event listeners
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Filter products based on selected tab
            filterProducts(tabId);
        });
    });
    
    // Setup cart sidebar event listeners
    const cartBtn = document.querySelector('.action-btn .fa-shopping-cart')?.closest('.action-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
    
    // Close cart button
    const closeCartBtn = document.getElementById('closeCart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    // Cart overlay
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }
    
    // Continue shopping button
    const continueShoppingBtn = document.getElementById('continueShopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', closeCart);
    }
    
    // View cart button
    document.getElementById('viewCart').addEventListener('click', function() {
        // Navigate to cart page
        closeCart();
        window.location.href = 'cart.html';
    });
    
    // Setup slider
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Auto-advance slider
    setInterval(nextSlide, 5000);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Setup countdown timer
    function updateCountdown() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const diff = tomorrow - now;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update countdown every second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
    
    // Setup back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});