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
    if (!toast) {
        // Fallback notification for pages without toast element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'wishlist' ? '#ec4899' : '#ef4444'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        return;
    }
    
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

// Function to render cart items (works for both sidebar and cart page)
function renderCartItems() {
    // Try to find the sidebar cart container first
    let cartItemsContainer = document.getElementById('cartItems');
    let isSidebar = true;
    
    // If not found, try to find the cart page container
    if (!cartItemsContainer) {
        cartItemsContainer = document.getElementById('cartItemsContainer');
        isSidebar = false;
    }
    
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cartItemsContainer) return;
    
    // Clear cart items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        // Show empty cart message
        if (isSidebar) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3 class="empty-cart-title">Your cart is empty</h3>
                    <p class="empty-cart-message">Looks like you haven't added any items to your cart yet. Start shopping to fill it with amazing products!</p>
                    <a href="index.html" class="shopping-btn">
                        <i class="fas fa-shopping-bag"></i>
                        Start Shopping
                    </a>
                </div>
            `;
            
            // Hide summary if cart is empty
            const cartSummary = document.querySelector('.cart-summary');
            if (cartSummary) cartSummary.style.display = 'none';
        }
    } else {
        // Show summary if cart has items (only for cart page)
        if (!isSidebar) {
            const cartSummary = document.querySelector('.cart-summary');
            if (cartSummary) cartSummary.style.display = 'block';
        }
        
        // Render cart items
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.dataset.productId = item.id;
            cartItem.dataset.size = item.size || '';
            cartItem.dataset.color = item.color || '';
            
            if (isSidebar) {
                // Sidebar cart item structure
                cartItem.innerHTML = `
                    <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-variant">
                            ${item.size ? `Size: ${item.size}` : ''} ${item.size && item.color ? ' | ' : ''} ${item.color ? `Color: ${item.color}` : ''}
                        </div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="decrease-quantity">-</button>
                            <input type="number" value="${item.quantity}" min="1" readonly>
                            <button class="increase-quantity">+</button>
                            <span class="cart-item-remove"><i class="fas fa-trash"></i></span>
                        </div>
                    </div>
                `;
            } else {
                // Cart page item structure
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <div class="cart-item-meta">
                            ${item.size ? `Size: ${item.size}` : ''} ${item.color ? `| Color: ${item.color}` : ''}
                        </div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease-quantity">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
                            <button class="quantity-btn increase-quantity">+</button>
                        </div>
                        <button class="cart-item-remove">
                            <i class="fas fa-trash"></i>
                            Remove
                        </button>
                    </div>
                `;
            }
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Add event listeners to cart items
        addCartItemEventListeners();
    }
    
    // Update cart subtotal
    updateCartSubtotal();
}

// Function to add event listeners to cart items (works for both sidebar and cart page)
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
    
    // Update sidebar subtotal
    const cartSubtotalElement = document.getElementById('cartSubtotal');
    if (cartSubtotalElement) {
        cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    // Update cart page summary if we are on the cart page
    if (document.getElementById('cartItemsContainer')) {
        const shipping = subtotal > 0 ? (subtotal > 2000 ? 0 : 15) : 0;
        const tax = subtotal * 0.08; // 8% tax
        
        const subtotalElement = document.getElementById('subtotal');
        const shippingElement = document.getElementById('shipping');
        const taxElement = document.getElementById('tax');
        const totalElement = document.getElementById('total');
        
        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${(subtotal + shipping + tax).toFixed(2)}`;
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
    
    // Re-render cart items
    renderCartItems();
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

// Function to initialize cart page
function initializeCartPage() {
    // Render cart items
    renderCartItems();

    // Setup cart button for sidebar
    const cartBtn = document.getElementById('cartButton');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }

    // Setup close cart button
    const closeCartBtn = document.getElementById('closeCart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }

    // Setup cart overlay click to close
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    // Setup continue shopping button
    const continueShoppingBtn = document.getElementById('continueShopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', closeCart);
    }

    // Setup view cart button (though we're already on cart page, maybe redirect or close)
    const viewCartBtn = document.getElementById('viewCart');
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', function() {
            closeCart();
            // Since we're on cart page, just close the sidebar
        });
    }

    // Setup checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                showNotification('Your cart is empty. Add items to proceed to checkout.', 'error');
            } else {
                window.location.href = 'checkout.html';
            }
        });
    }

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
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
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we are on the cart page
    if (document.getElementById('cartItemsContainer')) {
        // We are on the cart page
        initializeCartPage();
    } else {
        // We are on a page with the cart sidebar
        initializeCartAndWishlist();
    }
    
    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});