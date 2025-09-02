// Shared Cart and Wishlist JavaScript Functions

// Global variables for cart and wishlist
let cart = [];
let wishlist = [];

// Function to update cart count in header
function updateCartCount() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Function to update wishlist count in header
function updateWishlistCount() {
    wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistCountElement = document.querySelector('.wishlist-count');
    if (wishlistCountElement) {
        wishlistCountElement.textContent = wishlist.length;

        // Update wishlist button state
        const wishlistBtn = document.querySelector('.wishlist-btn');
        if (wishlist.length > 0) {
            wishlistBtn?.classList.add('active');
        } else {
            wishlistBtn?.classList.remove('active');
        }
    }
}

// Function to show notification
function showNotification(message, type = 'success') {
    const toast = document.getElementById('notificationToast');
    if (!toast) return;

    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastClose = document.getElementById('toastClose');

    // Set message
    if (type === 'success') {
        if (toastTitle) toastTitle.textContent = 'Success!';
        if (toastIcon) {
            toastIcon.className = 'toast-icon success';
            toastIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        }
    } else if (type === 'wishlist') {
        if (toastTitle) toastTitle.textContent = 'Wishlist!';
        if (toastIcon) {
            toastIcon.className = 'toast-icon wishlist';
            toastIcon.innerHTML = '<i class="fas fa-heart"></i>';
        }
    } else {
        if (toastTitle) toastTitle.textContent = 'Notice!';
        if (toastIcon) {
            toastIcon.className = 'toast-icon error';
            toastIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
        }
    }

    if (toastMessage) toastMessage.textContent = message;

    // Show toast
    toast.classList.add('show');

    // Auto hide after 3 seconds
    setTimeout(() => {
        hideNotification();
    }, 3000);

    // Close button functionality
    if (toastClose) {
        toastClose.onclick = function() {
            hideNotification();
        };
    }
}

// Function to hide notification
function hideNotification() {
    const toast = document.getElementById('notificationToast');
    if (toast) {
        toast.classList.remove('show');
    }
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

        // Prevent body scroll when cart is open
        document.body.style.overflow = 'hidden';
    }
}

// Function to close cart sidebar
function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');

        // Restore body scroll when cart is closed
        document.body.style.overflow = 'auto';
    }
}

// Function to render cart items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    cart = JSON.parse(localStorage.getItem('cart')) || [];

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
    cart = JSON.parse(localStorage.getItem('cart')) || [];

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
    cart = JSON.parse(localStorage.getItem('cart')) || [];

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
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    const cartSubtotalElement = document.getElementById('cartSubtotal');
    if (cartSubtotalElement) {
        cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
}

// Function to add product to cart
function addToCart(productId, selectedSize = null, selectedColor = null, quantity = 1) {
    // Get existing cart from localStorage or create new array
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product is already in cart with same size/color
    const existingProduct = cart.find(item =>
        item.id === productId &&
        item.size === selectedSize &&
        item.color === selectedColor
    );

    if (existingProduct) {
        // Increase quantity if already exists with same size/color
        existingProduct.quantity += quantity;
        showNotification('Quantity updated in cart!', 'success');
    } else {
        // Add new product to cart
        // Note: This function assumes products array is available in the calling context
        const product = products ? products.find(p => p.id === productId) : null;
        if (product) {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
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
    wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

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
    wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    document.querySelectorAll('.product-card').forEach(card => {
        const productId = parseInt(card.dataset.productId);
        const wishlistBtn = card.querySelector('.wishlist-btn i');

        if (wishlist.includes(productId)) {
            if (wishlistBtn) wishlistBtn.className = 'fas fa-heart text-danger';
        } else {
            if (wishlistBtn) wishlistBtn.className = 'fas fa-heart';
        }
    });
}

// Function to initialize cart and wishlist functionality
function initializeCartAndWishlist() {
    // Update counts on page load
    updateCartCount();
    updateWishlistCount();

    // Setup cart button event listeners
    const cartBtn = document.getElementById('cartButton') || document.querySelector('.action-btn .fa-shopping-cart')?.closest('.action-btn');
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
    const viewCartBtn = document.getElementById('viewCart');
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', function() {
            // Navigate to cart page
            closeCart();
            window.location.href = 'cart.html';
        });
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeCartAndWishlist();
});
