// ===== HAMBURGER MENU =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ===== PAYMENT MODAL =====
const paymentModal = document.getElementById('paymentModal');
const closePaymentBtn = document.querySelector('.close-payment');
const paymentForm = document.getElementById('paymentForm');
const successModal = document.getElementById('successModal');
const successButton = document.querySelector('.success-button');

// Payment Modal Functions
function showPaymentModal() {
    paymentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
    paymentModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if (closePaymentBtn) {
    closePaymentBtn.addEventListener('click', closePaymentModal);
}

// Kart Numarası Formatlama
const cardNumberInput = paymentForm?.querySelector('input[placeholder="Kart Numarası (16 Haneli)"]');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) {
            value = value.slice(0, 16);
        }
        e.target.value = value;
    });
}

// Tarih Formatlama (AA/YY)
const expiryInput = paymentForm?.querySelector('input[placeholder="AA/YY"]');
if (expiryInput) {
    expiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });
}

// CVV Formatlama
const cvvInput = paymentForm?.querySelector('input[placeholder="CVV"]');
if (cvvInput) {
    cvvInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 3) {
            value = value.slice(0, 3);
        }
        e.target.value = value;
    });
}

// Payment Form Submission
if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Form validasyon
        const cardNumberValue = paymentForm.querySelector('input[placeholder="Kart Numarası (16 Haneli)"]').value;
        const cvvValue = paymentForm.querySelector('input[placeholder="CVV"]').value;
        const expiryValue = paymentForm.querySelector('input[placeholder="AA/YY"]').value;
        const nameInput = paymentForm.querySelector('input[placeholder="Ad Soyad"]').value;
        const emailInput = paymentForm.querySelector('input[placeholder="E-mail"]').value;

        // Ad Soyad Kontrolü
        if (!nameInput || nameInput.trim().length < 3) {
            alert('Lütfen geçerli bir ad soyad girin.');
            return;
        }

        // Email Kontrolü
        if (!emailInput.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            alert('Lütfen geçerli bir e-mail adresi girin.');
            return;
        }

        // Kart Numarası Kontrolü
        if (cardNumberValue.length !== 16 || !cardNumberValue.match(/^\d+$/)) {
            alert('Lütfen geçerli bir kart numarası girin (16 haneli).');
            return;
        }

        // CVV Kontrolü
        if (cvvValue.length !== 3) {
            alert('Lütfen geçerli bir CVV girin (3 haneli).');
            return;
        }

        // Tarih Kontrolü
        if (!/^\d{2}\/\d{2}$/.test(expiryValue)) {
            alert('Lütfen geçerli bir son kullanma tarihi girin (AA/YY).');
            return;
        }

        // Ödeme işle
        processPayment();
    });
}

function processPayment() {
    // Loading effect
    const submitBtn = document.querySelector('.submit-payment');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'İşleniyor...';
    submitBtn.disabled = true;

    // Simülasyon: 2 saniye bekle
    setTimeout(() => {
        completePayment();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function completePayment() {
    closePaymentModal();
    showSuccessModal();
}

function showSuccessModal() {
    let total = 0;
    cart.forEach(item => {
        const priceValue = parseInt(item.price.replace(/[^0-9]/g, ''));
        total += priceValue;
    });

    // Seçili ödeme yöntemi
    const paymentMethod = paymentForm.querySelector('input[name="payment"]:checked').value;
    let installmentInfo = '';
    
    if (paymentMethod === 'installment') {
        const installmentAmount = Math.round(total / 3);
        installmentInfo = `<div class="success-detail-item">
            <span>Taksit Planı:</span>
            <span>3 × ₺${installmentAmount.toLocaleString('tr-TR')}</span>
        </div>`;
    }

    const successDetails = document.getElementById('successDetails');
    successDetails.innerHTML = `
        <div class="success-detail-item">
            <span>Sipariş No:</span>
            <span>#${Math.floor(Math.random() * 900000) + 100000}</span>
        </div>
        <div class="success-detail-item">
            <span>Ürün Sayısı:</span>
            <span>${cart.length} adet</span>
        </div>
        <div class="success-detail-item">
            <span>Toplam Tutar:</span>
            <span>₺${total.toLocaleString('tr-TR')}</span>
        </div>
        ${installmentInfo}
        <div class="success-detail-item">
            <span>Ödeme Yöntemi:</span>
            <span>${paymentMethod === 'credit' ? 'Kredi Kartı' : paymentMethod === 'debit' ? 'Banka Kartı' : 'Taksit'}</span>
        </div>
        <div class="success-detail-item">
            <span>Durumu:</span>
            <span>Onaylandı ✓</span>
        </div>
    `;

    successModal.classList.add('active');
}

if (successButton) {
    successButton.addEventListener('click', () => {
        successModal.classList.remove('active');
        paymentForm.reset();
        document.body.style.overflow = 'auto';
        alert('Siparişiniz başarıyla tamamlandı. Teslimatı bekleyiniz.');
    });
}

// Close payment modal when clicking outside
paymentModal.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
        closePaymentModal();
    }
});

successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.gallery-item, .feature-card, .promo-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== NEWSLETTER FORM =====
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        alert(`Teşekkürler! ${email} adresine abone oldunuz.`);
        newsletterForm.reset();
    });
}

// ===== VIEW BUTTONS =====
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const productName = btn.closest('.gallery-item').querySelector('h3').textContent;
        alert(`${productName}\n\nDetay sayfası yakında açılacaktır.`);
    });
});

// ===== PAGE LOAD =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});
