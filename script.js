// Global state
let state = {
    products: [
        {
            id: 1,
            name: 'EcoFlex Smart Sneakers',
            price: 129.99,
            image: 'https://i.postimg.cc/8CmBZH5N/shoes.webp'
        },
        {
            id: 2,
            name: 'Tech-Wear Jacket',
            price: 199.99,
            image: 'https://i.postimg.cc/Xqmwr12c/clothing.webp'
        },
        {
            id: 3,
            name: 'Smart Accessories Pack',
            price: 89.99,
            image: 'https://i.postimg.cc/MHv7KJYp/access.webp'
        }
    ],
    cart: [],
    currentPage: 1,
    itemsPerPage: 8,
    filters: {
        category: 'all',
        priceRange: 'all',
        searchQuery: ''
    }
};

// Render products with pagination
function renderProducts() {
    const filteredProducts = filterProducts();
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    const productsContainer = document.querySelector('.best-seller');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = `
            <div class="best-p1" data-product-id="${product.id}" data-aos="fade-up">
                <img src="${product.image}" alt="${product.name}">
                <div class="best-p1-txt">
                    <div class="name-of-p">
                        <p>${product.name}</p>
                    </div>
                    <div class="rating">
                        <i class='bx bxs-star'></i>
                        <i class='bx bxs-star'></i>
                        <i class='bx bxs-star'></i>
                        <i class='bx bxs-star'></i>
                        <i class='bx bxs-star-half'></i>
                    </div>
                    <div class="price">
                        <span class="new-price">$${product.price}</span>
                        <div class="colors">
                            <i class='bx bxs-circle eco-green'></i>
                            <i class='bx bxs-circle ocean-blue'></i>
                            <i class='bx bxs-circle recycled-grey'></i>
                        </div>
                    </div>
                    <div class="buy-now">
                        <button onclick="addToCart(${product.id})">
                            ADD TO CART
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productCard;
    });
    
    renderPagination(filteredProducts.length);
    initializeProductAnimations();
}

// Filter products
function filterProducts() {
    return state.products.filter(product => {
        const matchesCategory = state.filters.category === 'all' || product.category === state.filters.category;
        const matchesSearch = product.name.toLowerCase().includes(state.filters.searchQuery.toLowerCase());
        const matchesPriceRange = filterByPriceRange(product.price);
        return matchesCategory && matchesSearch && matchesPriceRange;
    });
}

// Price range filter
function filterByPriceRange(price) {
    switch(state.filters.priceRange) {
        case 'under-50': return price < 50;
        case '50-100': return price >= 50 && price <= 100;
        case 'over-100': return price > 100;
        default: return true;
    }
}

// Render pagination
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / state.itemsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    const pagination = `
        <div class="pagination-controls">
            <button ${state.currentPage === 1 ? 'disabled' : ''} class="prev-page">Previous</button>
            <span class="page-info">${state.currentPage} of ${totalPages}</span>
            <button ${state.currentPage === totalPages ? 'disabled' : ''} class="next-page">Next</button>
        </div>
    `;
    paginationContainer.innerHTML = pagination;
    
    document.addEventListener('click', function(e) {
        if (e.target.matches('.prev-page')) {
            if (state.currentPage > 1) {
                state.currentPage--;
                renderProducts();
            }
        } else if (e.target.matches('.next-page')) {
            const totalPages = Math.ceil(filterProducts().length / state.itemsPerPage);
            if (state.currentPage < totalPages) {
                state.currentPage++;
                renderProducts();
            }
        }
    });
}

// Initialize product animations
function initializeProductAnimations() {
    const products = document.querySelectorAll('.best-p1');
    products.forEach((product, i) => {
        product.classList.add('animate__animated')
            .style.animationDelay = i * 0.2 + 's';
        product.addEventListener('mouseover', function() {
            product.classList.add('animate__pulse');
        });
        product.addEventListener('mouseout', function() {
            product.classList.remove('animate__pulse');
        });
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            state.filters.searchQuery = searchInput.value;
            state.currentPage = 1;
            renderProducts();
        }, 300));
    }
    
    // Filters
    const categoryFilter = document.querySelector('.category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            state.filters.category = categoryFilter.value;
            state.currentPage = 1;
            renderProducts();
        });
    }
    
    const priceFilter = document.querySelector('.price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', function() {
            state.filters.priceRange = priceFilter.value;
            state.currentPage = 1;
            renderProducts();
        });
    }
    
    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.matches('.buy-now button')) {
            const productId = e.target.closest('.best-p1').dataset.productId;
            addToCart(productId);
        }
    });
}

// Add to cart function
function addToCart(productId) {
    const product = state.products.find(p => p.id === parseInt(productId));
    if (product) {
        state.cart.push(product);
        updateCartCount();
    }
}

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = state.cart.length;
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize everything when document is ready
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    initializeEventListeners();
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true
        });
    }
});

// Smooth scrolling
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.hash !== '') {
        e.preventDefault();
        const hash = e.target.hash;
        document.querySelector(hash).scrollIntoView({
            behavior: 'smooth'
        });
    }
});

// Mobile menu
document.addEventListener('click', function(e) {
    if (e.target.matches('.menu-items a')) {
        const checkbox = document.getElementById('checkbox');
        if (checkbox) {
            checkbox.checked = false;
        }
    }
});

// Initialize AOS
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        offset: 150,
        once: true
    });
});

// Check authentication status
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userMenu = document.getElementById('userMenu');
    const authButtons = document.getElementById('authButtons');
    const welcomeUser = document.getElementById('welcomeUser');

    if (user) {
        userMenu.style.display = 'flex';
        authButtons.style.display = 'none';
        welcomeUser.textContent = `Welcome, ${user.name}!`;
    } else {
        userMenu.style.display = 'none';
        authButtons.style.display = 'flex';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'signin.html';
}

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.getElementById('toastContainer').appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Show loading state
function showLoading(element) {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    element.appendChild(spinner);
    return spinner;
}

function hideLoading(spinner) {
    spinner.remove();
}

// Cart functionality
function updateCart(action) {
    const cartCount = document.querySelector('.cart-count');
    let count = parseInt(cartCount.textContent || '0');
    
    if (action === 'add') {
        count++;
        showToast('Item added to cart!', 'success');
    } else if (action === 'remove' && count > 0) {
        count--;
        showToast('Item removed from cart!', 'success');
    }
    
    cartCount.textContent = count;
}

// Initialize everything when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication
    checkAuth();

    // Initialize smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Initialize search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const spinner = showLoading(searchInput.parentElement);
                setTimeout(() => {
                    hideLoading(spinner);
                    showToast('Search results updated!', 'success');
                }, 1000);
            }, 500);
        });
    }
});