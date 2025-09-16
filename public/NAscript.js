

document.querySelectorAll('.cart-btn').forEach(button => {
    button.addEventListener('click', () => {
        showCartMessage();
    });
});

function showCartMessage() {
    const msg = document.getElementById('cart-message');
    msg.classList.add('show');

    setTimeout(() => {
        msg.classList.remove('show');
    }, 2000);
}