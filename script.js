document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    let cart = [];
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartModal = document.querySelector('.cart-modal');
    const cartButtons = document.querySelectorAll('.cart-icon a');
    const closeCartButton = document.querySelector('.close-cart');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    // Load cart from localStorage
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCartCount();
    }

    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }
            
            updateCart();
            showCartNotification(name);
        });
    });

    // Update cart count
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = count;
    }

    // Update cart display
    function updateCart() {
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update count
        updateCartCount();
        
        // Update cart items display
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <span>${item.name} x${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });
        
        cartTotal.textContent = total.toFixed(2);
        
        // Initialize PayPal button
        if (total > 0) {
            initPayPalButton(total);
        } else {
            document.getElementById('paypal-button-container').innerHTML = '';
        }
    }

    // Show cart notification
    function showCartNotification(itemName) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = `${itemName} added to cart!`;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--mustard-gold)';
        notification.style.color = 'var(--oxford-blue)';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        notification.style.zIndex = '3000';
        notification.style.animation = 'fadeIn 0.3s';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Cart modal functionality
    cartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            cartModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    closeCartButton.addEventListener('click', function() {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Initialize PayPal button
    function initPayPalButton(total) {
        document.getElementById('paypal-button-container').innerHTML = '';
        
        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: total.toFixed(2)
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    alert('Transaction completed by ' + details.payer.name.given_name);
                    // Clear cart after successful payment
                    cart = [];
                    updateCart();
                    // In a real app, you would redirect to a download page or send the resources
                });
            },
            onError: function(err) {
                console.error(err);
                alert('An error occurred with the PayPal payment. Please try again.');
            }
        }).render('#paypal-button-container');
    }

    // Initial cart update
    updateCart();
});