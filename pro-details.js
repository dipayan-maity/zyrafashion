// product.js - Product Details Page JavaScript

// Global variables
let products = [];
let currentProduct = null;
let selectedSize = null;
let selectedColor = null;
let quantity = 1;

// Function to get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: parseInt(params.get('id')) || null
    };
}

// Function to fetch products from JSON
async function fetchProducts() {
    try {
        const response = await fetch('product.json');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Function to get product by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Function to render product details
function renderProductDetails(product) {
    if (!product) {
        document.querySelector('.product-details').innerHTML = '<div class="container"><h2>Product not found</h2></div>';
        return;
    }

    currentProduct = product;

    // Set basic product info
    document.getElementById('productTitle').textContent = product.name;
    document.getElementById('productTitleBreadcrumb').textContent = product.name;
    document.getElementById('currentPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('productDescription').textContent = product.description || 'No description available for this product.';
    document.getElementById('ratingCount').textContent = `(${product.ratingCount})`;

    // Set product badge
    const badgeElement = document.getElementById('productBadge');
    if (product.badge) {
        badgeElement.textContent = product.badge.charAt(0).toUpperCase() + product.badge.slice(1);
        badgeElement.className = `product-badge badge-${product.badge}`;
        badgeElement.style.display = 'inline-block';
    } else {
        badgeElement.style.display = 'none';
    }

    // Set old price and discount
    if (product.oldPrice) {
        document.getElementById('oldPrice').textContent = `$${product.oldPrice.toFixed(2)}`;
        document.getElementById('oldPrice').style.display = 'inline-block';
        document.getElementById('discount').textContent = `-${product.discount}%`;
        document.getElementById('discount').style.display = 'inline-block';
    } else {
        document.getElementById('oldPrice').style.display = 'none';
        document.getElementById('discount').style.display = 'none';
    }

    // Set main product image
    document.getElementById('mainProductImage').src = product.image;
    document.getElementById('mainProductImage').alt = product.name;

    // Render product images gallery
    renderProductImages(product);

    // Render product rating
    renderProductRating(product.rating);

    // Render size options
    renderSizeOptions();

    // Render color options
    renderColorOptions();

    // Set tab description
    document.getElementById('tabDescription').textContent = product.description || 'No description available for this product.';

    // Render specifications
    renderSpecifications(product);

    // Render reviews
    renderReviews(product);

    // Update wishlist button state
    updateWishlistButton();

    // Render related products
    renderRelatedProducts(product);
}

// Function to render product images gallery
function renderProductImages(product) {
    const thumbnailContainer = document.getElementById('thumbnailImages');
    thumbnailContainer.innerHTML = '';

    // Add main image as first thumbnail
    const mainThumbnail = createThumbnail(product.image, 0, true);
    thumbnailContainer.appendChild(mainThumbnail);

    // Add additional images (for demo, we'll use the same image)
    for (let i = 1; i < 4; i++) {
        const thumbnail = createThumbnail(product.image, i, false);
        thumbnailContainer.appendChild(thumbnail);
    }
}

// Function to create thumbnail
function createThumbnail(src, index, isActive) {
    const thumbnail = document.createElement('div');
    thumbnail.className = `thumbnail ${isActive ? 'active' : ''}`;
    thumbnail.innerHTML = `<img src="${src}" alt="Product thumbnail ${index + 1}">`;
    
    thumbnail.addEventListener('click', () => {
        document.getElementById('mainProductImage').src = src;
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
    });

    return thumbnail;
}

// Function to render product rating
function renderProductRating(rating) {
    const starsContainer = document.getElementById('productStars');
    starsContainer.innerHTML = '';

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        starsContainer.innerHTML += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsContainer.innerHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsContainer.innerHTML += '<i class="far fa-star"></i>';
    }
}

// Function to render size options
function renderSizeOptions() {
    const sizeContainer = document.getElementById('sizeOptions');
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    
    sizeContainer.innerHTML = '';
    sizes.forEach(size => {
        const sizeOption = document.createElement('div');
        sizeOption.className = 'size-option';
        sizeOption.textContent = size;
        sizeOption.addEventListener('click', () => selectSize(size, sizeOption));
        sizeContainer.appendChild(sizeOption);
    });
}

// Function to select size
function selectSize(size, element) {
    selectedSize = size;
    document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
}

// Function to render color options
function renderColorOptions() {
    const colorContainer = document.getElementById('colorOptions');
    const colors = [
        { name: 'Black', value: '#000000' },
        { name: 'White', value: '#FFFFFF' },
        { name: 'Red', value: '#FF0000' },
        { name: 'Blue', value: '#0000FF' }
    ];
    
    colorContainer.innerHTML = '';
    colors.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        colorOption.style.backgroundColor = color.value;
        colorOption.title = color.name;
        colorOption.addEventListener('click', () => selectColor(color, colorOption));
        colorContainer.appendChild(colorOption);
    });
}

// Function to select color
function selectColor(color, element) {
    selectedColor = color;
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
}

// Function to render specifications
function renderSpecifications(product) {
    const specTable = document.getElementById('specTable');
    const specifications = [
        { label: 'Material', value: '100% Cotton' },
        { label: 'Care', value: 'Machine wash cold' },
        { label: 'Origin', value: 'Made in USA' },
        { label: 'Fit', value: 'Regular fit' },
        { label: 'Season', value: 'All Season' }
    ];

    specTable.innerHTML = '';
    specifications.forEach(spec => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${spec.label}</td>
            <td>${spec.value}</td>
        `;
        specTable.appendChild(row);
    });
}

// Function to render reviews
function renderReviews(product) {
    const reviewsContainer = document.getElementById('reviewsContainer');
    
    // Sample reviews data
    const reviews = [
        {
            name: 'Sarah Johnson',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            rating: 5,
            date: '2025-01-15',
            text: 'Absolutely love this product! The quality is amazing and it fits perfectly.'
        },
        {
            name: 'Mike Chen',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            rating: 4,
            date: '2025-01-10',
            text: 'Great value for money. The material is soft and comfortable.'
        }
    ];

    reviewsContainer.innerHTML = '';
    reviews.forEach(review => {
        const reviewElement = createReviewElement(review);
        reviewsContainer.appendChild(reviewElement);
    });
}

// Function to create review element
function createReviewElement(review) {
    const reviewDiv = document.createElement('div');
    reviewDiv.className = 'review-item';
    
    const stars = Array(5).fill(0).map((_, i) => 
        `<i class="fas fa-star${i < review.rating ? '' : '-o'}"></i>`
    ).join('');

    reviewDiv.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <img src="${review.avatar}" alt="${review.name}" class="reviewer-avatar">
                <div>
                    <div class="reviewer-name">${review.name}</div>
                    <div class="review-date">${review.date}</div>
                </div>
            </div>
            <div class="review-rating">${stars}</div>
        </div>
        <div class="review-text">${review.text}</div>
    `;

    return reviewDiv;
}

// Function to render related products
function renderRelatedProducts(currentProduct) {
    const relatedContainer = document.getElementById('relatedProductsGrid');
    
    // Get related products (excluding current product)
    const relatedProducts = products
        .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
        .slice(0, 4);

    relatedContainer.innerHTML = '';
    relatedProducts.forEach(product => {
        const productCard = createRelatedProductCard(product);
        relatedContainer.appendChild(productCard);
    });
}

// Function to create related product card
function createRelatedProductCard(product) {
    const card = document.createElement('div');
    card.className = 'col-md-3 mb-4';
    card.innerHTML = `
        <div class="card related-product-card h-100">
            <img src="${product.image}" alt="${product.name}" class="card-img-top related-product-img" style="height: 200px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title related-product-name">${product.name}</h5>
                <p class="card-text related-product-price">$${product.price.toFixed(2)}</p>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `product-details.html?id=${product.id}`;
    });

    return card;
}

// Function to update wishlist button state
function updateWishlistButton() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistBtn = document.getElementById('wishlistBtn');
    
    if (wishlist.includes(currentProduct.id)) {
        wishlistBtn.classList.add('active');
    } else {
        wishlistBtn.classList.remove('active');
    }
}

// Function to show notification
function showNotification(message, type = 'success') {
    const toast = document.getElementById('notificationToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastClose = document.getElementById('toastClose');
    
    // Set message
    if (type === 'success') {
        toastTitle.textContent = 'Success!';
        toastIcon.className = 'toast-icon success';
        toastIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    } else {
        toastTitle.textContent = 'Notice!';
        toastIcon.className = 'toast-icon error';
        toastIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    }
    
    toastMessage.textContent = message;
    
    // Show toast
    toast.classList.add('show');
    
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
    toast.classList.remove('show');
}

// Function to add to cart
function addToCart() {
    if (!selectedSize) {
        showNotification('Please select a size', 'error');
        return;
    }

    // Get existing cart from localStorage or create new array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product is already in cart with same size/color
    const existingProduct = cart.find(item =>
        item.id === currentProduct.id &&
        item.size === selectedSize &&
        item.color === (selectedColor ? selectedColor.name : null)
    );

    if (existingProduct) {
        // Increase quantity if already exists with same size/color
        existingProduct.quantity += quantity;
        showNotification('Quantity updated in cart!', 'success');
    } else {
        // Add new product to cart
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.image,
            quantity: quantity,
            size: selectedSize,
            color: selectedColor ? selectedColor.name : null
        });
        showNotification('Product added to cart!', 'success');
    }

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart count
    updateCartCount();
}

// Function to buy now
function buyNow() {
    addToCart();
    // Navigate to cart page
    window.location.href = 'cart.html';
}

// Function to toggle wishlist
function toggleWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistBtn = document.getElementById('wishlistBtn');
    
    if (wishlist.includes(currentProduct.id)) {
        wishlist.splice(wishlist.indexOf(currentProduct.id), 1);
        wishlistBtn.classList.remove('active');
        showNotification('Removed from wishlist');
    } else {
        wishlist.push(currentProduct.id);
        wishlistBtn.classList.add('active');
        showNotification('Added to wishlist!');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

// Function to update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Function to update wishlist count
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistCountElement = document.querySelector('.wishlist-count');
    if (wishlistCountElement) {
        wishlistCountElement.textContent = wishlist.length;
    }
}

// Initialize product details page
document.addEventListener('DOMContentLoaded', async function() {
    // Fetch products
    products = await fetchProducts();
    
    // Get product ID from URL
    const params = getUrlParams();
    const productId = params.id;
    
    if (productId) {
        const product = getProductById(productId);
        renderProductDetails(product);
    } else {
        // Redirect to home page if no product ID
        window.location.href = 'index.html';
    }

    // Quantity controls
    document.getElementById('decreaseQty').addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            document.getElementById('quantity').value = quantity;
        }
    });

    document.getElementById('increaseQty').addEventListener('click', () => {
        if (quantity < 10) {
            quantity++;
            document.getElementById('quantity').value = quantity;
        }
    });

    // Add to cart button
    document.getElementById('addToCartBtn').addEventListener('click', addToCart);

    // Buy now button
    document.getElementById('buyNowBtn').addEventListener('click', buyNow);

    // Wishlist button
    document.getElementById('wishlistBtn').addEventListener('click', toggleWishlist);

    // Update cart and wishlist counts
    updateCartCount();
    updateWishlistCount();
});