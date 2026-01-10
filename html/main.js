document.addEventListener('DOMContentLoaded', () => {
    const addCartButtons = document.querySelectorAll('.add-cart-btn');
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');

    // --- SHARED HELPER ---
    const getActiveUser = () => localStorage.getItem('currentUser');

    // --- ADD TO CART LOGIC ---
    addCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const user = getActiveUser();
            if (!user) {
                alert("Please login to add items to your bag!");
                window.location.href = '/login';
                return;
            }

            const card = e.target.closest('.product-card');
            const product = {
                id: card.getAttribute('data-id'),
                name: card.getAttribute('data-name'),
                price: card.getAttribute('data-price'),
                image: card.querySelector('img').src,
                quantity: 1
            };

            const cartKey = `${user}_cart`;
            let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push(product);
            }

            localStorage.setItem(cartKey, JSON.stringify(cart));
            alert(`${product.name} added to your bag!`);
        });
    });

    // --- WISHLIST LOGIC ---
    wishlistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const user = getActiveUser();
            if (!user) {
                alert("Please login to save items to your wishlist!");
                window.location.href = '/login';
                return;
            }

            const card = e.target.closest('.product-card');
            const product = {
                id: card.getAttribute('data-id'),
                name: card.getAttribute('data-name'),
                price: card.getAttribute('data-price'),
                image: card.querySelector('img').src
            };

            const wishlistKey = `${user}_wishlist`;
            let wishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];

            // Check if item is already in wishlist
            if (!wishlist.some(item => item.id === product.id)) {
                wishlist.push(product);
                localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
                alert("Added to your wishlist!");
            } else {
                alert("Item is already in your wishlist.");
            }
        });
    });
});