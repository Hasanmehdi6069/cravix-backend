// =========================================================
// CRAVIX: THE MASTER JS ENGINE (UNBEATABLE DASHBOARD EDITION)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 🚀 THE MASTER CLOUD CONFIGURATION
    // Change this to your live Render/Railway URL when deploying!
    // =========================================================
    const API_BASE_URL = 'https://cravix-backend-1.onrender.com';
    
    // --- 1. PREMIUM THEME ENGINE ---
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const currentTheme = localStorage.getItem('cravix_theme') || 'light';
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.checked = true;
        }
        themeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('cravix_theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('cravix_theme', 'light');
            }
        });
    }

    // --- 2. GLOBAL CART BADGE ENGINE ---
    function updateGlobalCartBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        if (badges.length === 0) return;
        let cartMemory = JSON.parse(localStorage.getItem('cravixCart')) || [];
        let totalItems = 0;
        cartMemory.forEach(item => totalItems += item.qty);
        badges.forEach(badge => {
            if (totalItems > 0) {
                badge.innerText = totalItems;
                badge.style.display = 'flex';
            } else {
                badge.innerText = '0';
                badge.style.display = 'none';
            }
        });
    }
    updateGlobalCartBadge();


    // --- 3. IDENTITY GATEWAY ENGINE (Auth & Profile) ---
    
    // 1. Grab all the UI Elements
    const profileBtns = document.querySelectorAll('.profile-btn');
    const authModal = document.getElementById('auth-modal');
    const closeModal = document.querySelector('.close-modal');
    const mobileInput = document.getElementById('mobile-input');
    
    // NOTE: Make sure these IDs match the buttons in your index.html!
    const continueBtn = document.getElementById('continue-btn') || document.querySelector('.continue-btn'); 
    const verifyOtpBtn = document.getElementById('verify-otp-btn') || document.querySelector('.verify-otp-btn');
    const otpInputs = document.querySelectorAll('.otp-input');

    let isLoggedIn = localStorage.getItem('cravixLoggedIn') === 'true';

    // 2. Keep Profile Icon Green if already logged in
    if (isLoggedIn) {
        profileBtns.forEach(btn => { 
            btn.innerHTML = '🟢'; 
            btn.style.borderColor = '#28a745'; 
            btn.title = "Logged In"; 
        });
    }

   // 3. Open Modal / Dashboard Logic
    profileBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 🛡️ DYNAMIC VAULT CHECK: Always check the live memory right at the moment of the click!
            const isCurrentlyLoggedIn = localStorage.getItem('cravixLoggedIn') === 'true';

            if (!isCurrentlyLoggedIn) {
                // 🔴 User is logged out: Open the Login Modal
                if (authModal) {
                    authModal.classList.add('active-modal');
                } else {
                    console.error("🔴 Could not find id='auth-modal' in HTML!");
                }
                
                const step1 = document.querySelector('.auth-step-1');
                if (step1) step1.classList.add('active-step');
                
                const step2 = document.querySelector('.auth-step-2');
                if (step2) step2.classList.remove('active-step');
                
            } else {
                // 🟢 User is logged in: Teleport them to the Dashboard!
                window.location.href = 'Profile.html';
            }
        });
    });
    
    // 🟢 THE NATIVE VAULT ENGINE (Email & Password)
    const emailLoginBtn = document.getElementById('email-login-btn');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');

    if (emailLoginBtn) {
        emailLoginBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
                alert("Please enter both Email and Password.");
                return;
            }

            emailLoginBtn.innerText = "Authenticating...";

            try {
                // MAGIC STEP 1: Try to Log In
                const loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const loginData = await loginRes.json();

                if (loginData.success) {
                    // 🎉 Login Successful!
                    activateUserSession(loginData.user, loginData.token);
                } else {
                    // MAGIC STEP 2: If Login Fails, Try to Sign Up
                    const signupRes = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    const signupData = await signupRes.json();

                    if (signupData.success) {
                        // 🎉 Signup Successful!
                        alert("Welcome to Cravix! Account created.");
                        activateUserSession(signupData.user, signupData.token);
                    } else {
                        // ❌ Signup failed
                        alert("❌ Failed to create account.");
                    }
                }
            } catch (error) {
                console.error("Server offline:", error);
                alert("Server is offline. Turn on the Backend Engine!");
            } finally {
                emailLoginBtn.innerText = "Log In / Sign Up";
            }
        });
    }

    // 🟢 HELPER FUNCTION: Turns on the dashboard after success
    function activateUserSession(user, token) {
        const authModal = document.getElementById('auth-modal');
        if (authModal) authModal.classList.remove('active-modal');
        
        isLoggedIn = true;
        localStorage.setItem('cravixLoggedIn', 'true');
        localStorage.setItem('cravixUserId', user._id); 
        
        // 🛡️ SAVE THE CRYPTOGRAPHIC KEY
        if (token) {
            localStorage.setItem('cravixToken', token);
        }

        profileBtns.forEach(btn => { 
            btn.innerHTML = '🟢'; 
            btn.style.borderColor = '#28a745'; 
        });

        // Clear inputs for security
        emailInput.value = '';
        passwordInput.value = '';
    }

    // 🟢 STEP 3: THE ESCAPE HATCH (Logout Logic)
    const logoutBtn = document.getElementById('logoutBtn') || document.querySelector('.logout-link');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. Wipe the Vault keys from the browser's memory
            localStorage.removeItem('cravixLoggedIn');
            localStorage.removeItem('cravixUserId');
            
            // 2. Teleport the user back to the home page
            window.location.href = 'index.html';
        });
    }

    // --- 4. MEGA BANNER SLIDER ENGINE ---
    const megaSlides = document.querySelectorAll('.mega-slide');
    const megaDots = document.querySelectorAll('.m-dot');
    if (megaSlides.length > 0) {
        let currentMega = 0;
        let megaInterval;
        
        function showMegaSlide(index) {
            megaSlides.forEach(s => s.classList.remove('active-mega'));
            megaDots.forEach(d => d.classList.remove('active-dot'));
            currentMega = (index + megaSlides.length) % megaSlides.length;
            megaSlides[currentMega].classList.add('active-mega');
            megaDots[currentMega].classList.add('active-dot');
        }
        
        function startMegaShow() { 
            clearInterval(megaInterval);
            megaInterval = setInterval(() => { showMegaSlide(currentMega + 1); }, 5000); 
        }
        
        megaDots.forEach((dot, index) => {
            dot.addEventListener('click', () => { showMegaSlide(index); startMegaShow(); });
        });
        startMegaShow();
    }

    // --- 5. THE GLOBAL MENU & CART ADDER ENGINE ---
    function updateFloatingCartUI() {
        const floatingCart = document.getElementById('floatingCart');
        const floatItems = document.getElementById('floatCartItems');
        const floatPrice = document.getElementById('floatCartPrice');
        if (!floatingCart) return; 
        
        let cravixCart = JSON.parse(localStorage.getItem('cravixCart')) || [];
        let totalQty = 0; let totalPrice = 0;
        
        cravixCart.forEach(item => { totalQty += item.qty; totalPrice += (item.price * item.qty); });
        if (totalQty > 0) {
            floatingCart.classList.add('show-float');
            floatItems.innerText = `${totalQty} Item${totalQty > 1 ? 's' : ''}`;
            floatPrice.innerText = `₹${totalPrice}`;
        } else { floatingCart.classList.remove('show-float'); }
    }

    const menuItemsArea = document.querySelector('.menu-items-area');
    if (menuItemsArea) {
        function renderMenuItemButton(itemRow, itemName) {
            const imagePart = itemRow.querySelector('.item-image-part');
            const cartMemory = JSON.parse(localStorage.getItem('cravixCart')) || [];
            const existingItem = cartMemory.find(i => i.name === itemName);
            
            let btnWrapper = imagePart.querySelector('.item-btn-wrapper');
            if (!btnWrapper) {
                btnWrapper = document.createElement('div');
                btnWrapper.className = 'item-btn-wrapper';
                btnWrapper.style.cssText = 'position: absolute; bottom: -15px; width: 120px;';
                imagePart.appendChild(btnWrapper);
            }
            if (existingItem) {
                btnWrapper.innerHTML = `<div class="qty-selector menu-qty" style="display:flex; justify-content:space-between; width:100%; font-size:16px; background:var(--card-bg); border:1px solid var(--primary);"><span class="qty-minus" data-name="${itemName}" style="cursor:pointer; font-size:20px; color:var(--primary); font-weight:900;">-</span><span class="qty-num">${existingItem.qty}</span><span class="qty-plus" data-name="${itemName}" style="cursor:pointer; font-size:20px; color:var(--primary); font-weight:900;">+</span></div>`;
            } else {
                btnWrapper.innerHTML = `<button class="menu-add-btn" data-name="${itemName}" style="width:100%; background:var(--card-bg); color:#28a745; border:1px solid #28a745; border-radius:8px; font-weight:700; padding:10px 0; font-size:16px; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.1);">ADD +</button>`;
            }
            updateGlobalCartBadge();
        }

        menuItemsArea.addEventListener('click', (e) => {
            const t = e.target;
           if (t.classList.contains('menu-add-btn')) {
                const itemName = t.getAttribute('data-name');
                const card = t.closest('.menu-item-row');
                const priceText = card.querySelector('.item-price').innerText;
                const price = parseInt(priceText.replace('₹', ''));
                const isVeg = card.querySelector('.veg-badge').classList.contains('veg');
                
                // 🟢 THE FIX: Safely grab the Restaurant ID from the URL directly!
                const urlParams = new URLSearchParams(window.location.search);
                const safeRestId = urlParams.get('id') || 'burgerking';
                
                // Grab Name & Logo
                const restName = document.getElementById('dynamic-name').innerText;
                const restLogo = document.getElementById('dynamic-logo').src;
                
                // Securely save the restaurant memory
                localStorage.setItem('cravixCurrentRest', JSON.stringify({ id: safeRestId, name: restName, logo: restLogo }));

                // Add to Cart
                let cartMemory = JSON.parse(localStorage.getItem('cravixCart')) || [];
                cartMemory.push({ name: itemName, price: price, qty: 1, isVeg: isVeg });
                localStorage.setItem('cravixCart', JSON.stringify(cartMemory));
                
                renderMenuItemButton(card, itemName);
                updateFloatingCartUI();
            }
            else if (t.classList.contains('qty-plus')) {
                const itemName = t.getAttribute('data-name');
                let cartMemory = JSON.parse(localStorage.getItem('cravixCart')) || [];
                const item = cartMemory.find(i => i.name === itemName);
                if (item) item.qty++;
                localStorage.setItem('cravixCart', JSON.stringify(cartMemory));
                renderMenuItemButton(t.closest('.menu-item-row'), itemName);
                updateFloatingCartUI();
            }
            else if (t.classList.contains('qty-minus')) {
                const itemName = t.getAttribute('data-name');
                let cartMemory = JSON.parse(localStorage.getItem('cravixCart')) || [];
                const itemIdx = cartMemory.findIndex(i => i.name === itemName);
                if (itemIdx !== -1) {
                    if (cartMemory[itemIdx].qty > 1) cartMemory[itemIdx].qty--;
                    else cartMemory.splice(itemIdx, 1);
                    localStorage.setItem('cravixCart', JSON.stringify(cartMemory));
                    renderMenuItemButton(t.closest('.menu-item-row'), itemName);
                    updateFloatingCartUI();
                }
            }
        });
        updateFloatingCartUI();
    }

    // --- 6. CHECKOUT PAGE RENDER LOGIC ---
    const dynamicCartItems = document.getElementById('dynamicCartItems');
    if (dynamicCartItems) {
        function renderCheckoutCart() {
            let cartMemory = JSON.parse(localStorage.getItem('cravixCart')) || [];
            // 🟢 UPDATE CART HEADER WITH REAL RESTAURANT
            const currentRest = JSON.parse(localStorage.getItem('cravixCurrentRest')) || { name: 'Cravix Delivery', logo: '🍔', id: 'unknown' };
            const cartHeaderImg = document.querySelector('.restaurant-cart-header img');
            const cartHeaderTitle = document.querySelector('.restaurant-cart-header h3');
            if (cartHeaderImg && cartHeaderTitle) {
                cartHeaderImg.src = currentRest.logo;
                cartHeaderTitle.innerText = currentRest.name;
            }
            dynamicCartItems.innerHTML = ''; 
            let itemTotalMath = 0;

            const extras1 = document.querySelector('.cooking-instructions');
            const extras2 = document.querySelector('.cart-offers');
            const extras3 = document.querySelector('.bill-details');

            if (cartMemory.length === 0) {
                dynamicCartItems.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding: 30px; font-weight: 600;">Your cart is empty. Go grab some food!</p>`;
                document.getElementById('dynamicItemTotal').innerText = `₹0`;
                document.getElementById('dynamicGrandTotal').innerText = `₹0`;
                
                if(extras1) extras1.style.display = 'none';
                if(extras2) extras2.style.display = 'none';
                if(extras3) extras3.style.display = 'none';
                updateGlobalCartBadge(); 
                return;
            }

            if(extras1) extras1.style.display = 'block';
            if(extras2) extras2.style.display = 'flex';
            if(extras3) extras3.style.display = 'block';

            cartMemory.forEach((item, index) => {
                itemTotalMath += (item.price * item.qty);
                const vegClass = item.isVeg ? 'veg' : 'non-veg';
                const itemHTML = `
                    <div class="cart-item">
                        <div class="item-info"><span class="veg-badge ${vegClass}"></span><h4>${item.name}</h4><p>₹${item.price}</p></div>
                        <div class="qty-selector cart-qty"><span class="qty-minus" data-index="${index}">-</span><span class="qty-num">${item.qty}</span><span class="qty-plus" data-index="${index}">+</span></div>
                        <div class="item-total">₹${item.price * item.qty}</div>
                    </div>
                `;
                dynamicCartItems.insertAdjacentHTML('beforeend', itemHTML);
            });

            document.getElementById('dynamicItemTotal').innerText = `₹${itemTotalMath}`;
            document.getElementById('dynamicGrandTotal').innerText = `₹${itemTotalMath + 71}`;
            updateGlobalCartBadge(); 
        }
        renderCheckoutCart();

        dynamicCartItems.addEventListener('click', (e) => {
            const t = e.target;
            const idx = t.getAttribute('data-index');
            if (idx === null) return;
            let cartMemory = JSON.parse(localStorage.getItem('cravixCart')) || [];

            if (t.classList.contains('qty-plus')) {
                cartMemory[idx].qty++;
            } else if (t.classList.contains('qty-minus')) {
                if (cartMemory[idx].qty > 1) cartMemory[idx].qty--;
                else cartMemory.splice(idx, 1);
            }
            localStorage.setItem('cravixCart', JSON.stringify(cartMemory));
            renderCheckoutCart();
        });
    }
// 🟢 THE MASTER ORDER ENGINE (Connects Checkout to Backend)
    const confirmCodBtn = document.getElementById('confirmCodBtn');
    if (confirmCodBtn) {
        confirmCodBtn.addEventListener('click', async () => {
            // 1. Check if user is logged in
            const userId = localStorage.getItem('cravixUserId');
            if (!userId) {
                alert("Please log in from the home page first to place an order!");
                return;
            }

            // 2. Grab the cart
            let cartMemory = JSON.parse(localStorage.getItem('cravixCart')) || [];
            if (cartMemory.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            // 3. Calculate Final Amount
            let itemTotalMath = 0;
            cartMemory.forEach(item => itemTotalMath += (item.price * item.qty));
            const grandTotal = itemTotalMath + 71; // Adding delivery/taxes

            // 🟢 GET DYNAMIC RESTAURANT INFO (No more hardcoded Burger King!)
            const currentRest = JSON.parse(localStorage.getItem('cravixCurrentRest')) || { id: 'unknown', name: 'Cravix Delivery' };

            // 4. Build the Order Package
            const orderPayload = {
                userId: userId,
                restaurantId: currentRest.id,
                restaurantName: currentRest.name,
                items: cartMemory,
                totalAmount: grandTotal,
                paymentMethod: "COD"
            };

            try {
                confirmCodBtn.innerText = "Processing Order...";
                
                // 5. Get the Key out of memory
                const secureToken = localStorage.getItem('cravixToken');
                
                // 6. SHOOT IT TO THE BACKEND WITH THE KEY!
                const response = await fetch(`${API_BASE_URL}/api/orders/place`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${secureToken}` // 🟢 SHOWING THE KEY TO THE BOUNCER
                    },
                    body: JSON.stringify(orderPayload)
                });

                const result = await response.json();
                
                if (result.success) {
                    // 7. SUCCESS! Trigger the Cinematic Animation
                    localStorage.removeItem('cravixCart');

                    const successOverlay = document.getElementById('order-success-overlay');
                    if (successOverlay) {
                        successOverlay.style.display = 'flex';
                        setTimeout(() => {
                            window.location.href = 'order-status.html';
                        }, 2500);
                    } else {
                        window.location.href = 'order-status.html';
                    }
                } else {
                    alert("Order failed: " + result.message);
                    confirmCodBtn.innerText = "Confirm Order (COD)";
                }
            } catch (error) {
                console.error("🔴 Order Error:", error);
                alert("Server offline. Cannot place order.");
                confirmCodBtn.innerText = "Confirm Order (COD)";
            }
        });
    }
    // --- 7. ACCORDIONS & MODALS ---
    const paymentOptions = document.querySelectorAll('.payment-accordion');
    if (paymentOptions.length > 0) {
        paymentOptions.forEach(option => {
            const header = option.querySelector('.pay-header');
            const radio = option.querySelector('input[type="radio"]');
            header.addEventListener('click', () => {
                paymentOptions.forEach(opt => { opt.classList.remove('active-pay'); opt.querySelector('input[type="radio"]').checked = false; });
                option.classList.add('active-pay');
                radio.checked = true;
            });
        });
    }

    const addAddressBtn = document.querySelector('.add-new-address-btn');
    const addressModal = document.getElementById('addressModal');
    if (addAddressBtn && addressModal) {
        addAddressBtn.addEventListener('click', () => addressModal.classList.add('active-modal'));
        document.getElementById('closeAddressModal').addEventListener('click', () => addressModal.classList.remove('active-modal'));
        addressModal.addEventListener('click', (e) => { if (e.target === addressModal) addressModal.classList.remove('active-modal'); });
    }

    const profileNavLinks = document.querySelectorAll('.profile-nav a:not(.logout-link)');
    const profileTabs = document.querySelectorAll('.profile-tab-content');
    if (profileNavLinks.length > 0 && profileTabs.length > 0) {
        profileNavLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                profileNavLinks.forEach(l => l.classList.remove('active-nav'));
                link.classList.add('active-nav');
                profileTabs.forEach(tab => tab.style.display = 'none');
                profileTabs[index].style.display = 'block';
            });
        });
    }


    // --- 8. 🟢 THE UNBEATABLE DASHBOARD MENU ENGINE (API POWERED) ---
    const dynamicLogoEl = document.getElementById('dynamic-logo');
    if (dynamicLogoEl) {
        
        const urlParams = new URLSearchParams(window.location.search);
        let restId = urlParams.get('id');

        // Fallback if no ID is in the URL
        if (!restId) {
            restId = 'burgerking'; 
        }

        // 🟢 THE BRIDGE: Fetching data from your live Node.js Server!
        async function fetchRestaurantData() {
            try {
                const response = await fetch(`${API_BASE_URL}/api/restaurants/${restId}`);
                const result = await response.json();

                if (result.success) {
                    const data = result.data;
                    
                    // Injecting the Cloud Data into your HTML
                    dynamicLogoEl.src = data.logo;
                    document.getElementById('dynamic-name').innerText = data.name;
                    document.getElementById('dynamic-tags').innerText = data.tags;
                    document.getElementById('dynamic-rating').innerText = data.rating;
                    document.getElementById('dynamic-loc').innerText = data.loc;
                    document.querySelector('.rest-hero-bg').style.backgroundImage = `url('${data.bg}')`;
                    document.title = `${data.name} - Cravix Delivery`;

                    const sidebarUl = document.getElementById('dynamic-sidebar-links');
                    const menuAreaDiv = document.getElementById('dynamic-menu-area');
                    
                    if (sidebarUl && menuAreaDiv && data.menu) {
                        let sidebarHTML = '';
                        let fullMenuHTML = '';
                        let isFirstTab = true;
                        
                        for (const [categoryName, itemsArray] of Object.entries(data.menu)) {
                            const tabId = 'tab-' + categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                            const activeClass = isFirstTab ? 'active-cat' : '';
                            const displayStyle = isFirstTab ? 'block' : 'none'; 
                            
                            sidebarHTML += `<li class="${activeClass}"><a href="#" data-target="${tabId}">${categoryName} (${itemsArray.length})</a></li>`;
                            
                            fullMenuHTML += `<div id="${tabId}" class="menu-tab-content" style="display: ${displayStyle};">
                                                <h3 class="cat-heading">${categoryName}</h3>`;
                            
                            itemsArray.forEach(item => {
                                const vegClass = item.isVeg ? 'veg' : 'non-veg';
                                let cartMemory = JSON.parse(localStorage.getItem('cravixCart')) || [];
                                const existingItem = cartMemory.find(i => i.name === item.name);
                                
                                let buttonHTML = '';
                                if (existingItem) {
                                    buttonHTML = `<div class="qty-selector menu-qty" style="display:flex; justify-content:space-between; width:100%; font-size:16px; background:var(--card-bg); border:1px solid var(--primary);"><span class="qty-minus" data-name="${item.name}" style="cursor:pointer; font-size:20px; color:var(--primary); font-weight:900;">-</span><span class="qty-num">${existingItem.qty}</span><span class="qty-plus" data-name="${item.name}" style="cursor:pointer; font-size:20px; color:var(--primary); font-weight:900;">+</span></div>`;
                                } else {
                                    buttonHTML = `<button class="add-btn menu-add-btn" data-name="${item.name}" style="width: 100%; background:var(--card-bg); color:#28a745; border:1px solid #28a745; border-radius:8px; font-weight:700; padding:10px 0; font-size:16px; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.1);">ADD +</button>`;
                                }

                                fullMenuHTML += `
                                <div class="menu-item-row">
                                    <div class="item-text-part">
                                        <span class="veg-badge ${vegClass}"></span>
                                        <h4>${item.name}</h4>
                                        <p class="item-price">₹${item.price}</p>
                                        <p class="item-desc">${item.desc}</p>
                                    </div>
                                    <div class="item-image-part">
                                        <img src="${item.img}" alt="${item.name}">
                                        <div class="item-btn-wrapper" style="position: absolute; bottom: -15px; width: 120px;">
                                            ${buttonHTML}
                                        </div>
                                    </div>
                                </div>`;
                            });
                            
                            fullMenuHTML += `</div>`;
                            isFirstTab = false;
                        }
                        
                        sidebarUl.innerHTML = sidebarHTML;
                        menuAreaDiv.innerHTML = fullMenuHTML;

                        // TAB SWITCHING LOGIC
                        const menuLinks = sidebarUl.querySelectorAll('a');
                        const menuTabs = menuAreaDiv.querySelectorAll('.menu-tab-content');

                        menuLinks.forEach(link => {
                            link.addEventListener('click', (e) => {
                                e.preventDefault();
                                sidebarUl.querySelectorAll('li').forEach(li => li.classList.remove('active-cat'));
                                link.parentElement.classList.add('active-cat');
                                menuTabs.forEach(tab => tab.style.display = 'none');
                                const targetId = link.getAttribute('data-target');
                                const targetTab = document.getElementById(targetId);
                                if(targetTab) targetTab.style.display = 'block';
                            });
                        });
                    }
                } else {
                    console.error("Failed to load restaurant:", result.message);
                }
            } catch (error) {
                console.error("🔴 Cannot reach backend server:", error);
            }
        }

        // Ignite the fetch!
        fetchRestaurantData();
    }
});

// 🟢 BULLETPROOF CLOSE MODAL FIX
    const crossBtn = document.getElementById('closeAuthModal');
    const theModal = document.getElementById('auth-modal');

    if (crossBtn && theModal) {
        crossBtn.addEventListener('click', (e) => {
            e.preventDefault();
            theModal.classList.remove('active-modal'); // Hides the modal!
        });
    }

    // BONUS: Clicking the dark blurry background will also close it!
    if (theModal) {
        theModal.addEventListener('click', (e) => {
            if (e.target === theModal) {
                theModal.classList.remove('active-modal');
            }
        });
    }

    // 🟢 OTP AUTO-FOCUS ENGINE (The Premium Flow)
    const otpBoxes = document.querySelectorAll('.otp-box');
    
    otpBoxes.forEach((box, index) => {
        // 1. Move Forward when a number is typed
        box.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < otpBoxes.length - 1) {
                otpBoxes[index + 1].focus();
            }
        });

        // 2. Move Backward when Backspace is pressed
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                otpBoxes[index - 1].focus();
            }
        });
    });

// 🟢 THE GOOGLE LOGIN DECODER & BACKEND HANDSHAKE (Bulletproof Version)
    async function handleGoogleLogin(response) {
        console.log("🔥 Encrypted Token Received from Google!");
        
        // Decrypt Google's payload
        const responsePayload = JSON.parse(atob(response.credential.split('.')[1]));

        try {
            // 🚀 SHOOT THE GOOGLE DATA TO THE CRAVIX BACKEND!
            const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: responsePayload.email,
                    name: responsePayload.name
                })
            });

            const data = await res.json();

            if (data.success) {
                // 🎉 HANDSHAKE COMPLETE! Activate the dashboard manually
                
                // 1. Hide the Modal
                const authModal = document.getElementById('auth-modal');
                if (authModal) authModal.classList.remove('active-modal');

                // 2. Lock the Keys in the Browser Vault
                localStorage.setItem('cravixLoggedIn', 'true');
                localStorage.setItem('cravixUserId', data.user._id);
                localStorage.setItem('cravixToken', data.token);

                // 3. Turn the Profile Buttons Green!
                document.querySelectorAll('.profile-btn').forEach(btn => {
                    btn.innerHTML = '🟢';
                    btn.style.borderColor = '#28a745';
                });

                // 4. Welcome the CEO
                alert(`Welcome to Cravix, ${responsePayload.name}!`);
            } else {
                alert("Google Login Failed on Server.");
            }
        } catch (error) {
            console.error("🔴 Javascript/Network Error:", error);
            alert("System Error: Could not complete login. Check console!");
        }
    }

   // 🟢 OFFICIAL GOOGLE BUTTON RENDERER
    window.onload = function () {
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: "344499885413-9u9vq2gjhqrv6usr3vkuk2p4vs8g7fd0.apps.googleusercontent.com",
                callback: handleGoogleLogin
            });
            
            // This forces the official button to render perfectly inside our container
            google.accounts.id.renderButton(
                document.getElementById("google-btn-container"),
                { theme: "outline", size: "large", width: 340, text: "continue_with", shape: "rectangular" }  
            );
        } else {
            console.error("🔴 Google API failed to load. Check your internet connection and API key.");
        }
    };

    // 🟢 DYNAMIC ORDER HISTORY ENGINE
    const dynamicOrderHistory = document.getElementById('dynamicOrderHistory');
    if (dynamicOrderHistory) {
        async function fetchOrderHistory() {
            const userId = localStorage.getItem('cravixUserId');
            const token = localStorage.getItem('cravixToken');
            
            if (!userId || !token) {
                dynamicOrderHistory.innerHTML = "<p>Please log in to see your orders.</p>";
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/api/orders/history/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                
                if (data.success && data.orders.length > 0) {
                    let historyHTML = '';
                    data.orders.forEach(order => {
                        // Extract just the item names for the summary
                        const itemNames = order.items.map(i => i.name).join(', ');
                        
                        historyHTML += `
                        <div class="order-history-card">
                            <div class="order-header">
                                <div class="rest-info-mini">
                                    <div class="user-avatar" style="width: 45px; height: 45px; font-size: 16px; border-radius:10px;">🍽️</div>
                                    <div>
                                        <h4 style="margin-bottom: 2px;">${order.restaurantName}</h4>
                                        <p style="font-size: 12px;">Ordered on ${new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div class="order-status-badge delivered" style="color:#28a745; font-weight:800; background:rgba(40,167,69,0.1); padding: 5px 10px; border-radius: 6px;">✓ Success</div>
                            </div>
                            <div class="order-items-summary" style="margin-top: 15px;">
                                <p style="font-size: 13px; max-width: 70%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${itemNames}</p>
                                <h4 class="order-total-price">₹${order.totalAmount}</h4>
                            </div>
                        </div>`;
                    });
                    dynamicOrderHistory.innerHTML = historyHTML;
                } else {
                    dynamicOrderHistory.innerHTML = "<p style='padding: 20px; font-weight: 600;'>No past orders found. Time to grab some food!</p>";
                }
            } catch (err) {
                console.error("🔴 Error fetching orders:", err);
                dynamicOrderHistory.innerHTML = "<p>Failed to load orders. Server offline.</p>";
            }
        }
        fetchOrderHistory();
    }

    // --- 12. 🟢 THE GLOBAL TELEPORT SEARCH ENGINE ---
    
    // Part A: Intercept searches on ANY page and teleport to Search.html
    const globalSearchInputs = document.querySelectorAll('.ultra-search input');
    globalSearchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    window.location.href = `Search.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    });

    // Part B: The Cinematic Rendering Engine (Only runs on Search.html)
    const masterSearchInput = document.getElementById('masterSearchInput');
    if (masterSearchInput) {
        
        // 1. Grab the keyword from the URL when the page loads
        const urlParams = new URLSearchParams(window.location.search);
        const initialQuery = urlParams.get('q');
        if (initialQuery) {
            masterSearchInput.value = initialQuery;
            executeMegaSearch(initialQuery);
        }

        // 2. Allow live searching on the Search page itself
        let searchTimeout;
        masterSearchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                executeMegaSearch(e.target.value.trim());
            }, 400); // 400ms delay so it doesn't crash the server while typing
        });

        // 3. The API Fetcher & Cinematic Renderer
        async function executeMegaSearch(query) {
            const brandsDiv = document.getElementById('brands-results');
            const dishesDiv = document.getElementById('dishes-results');
            const brandsTitle = document.getElementById('brands-title');
            const dishesTitle = document.getElementById('dishes-title');
            const noResultsMsg = document.getElementById('no-results-msg');

            // Clear previous results
            brandsDiv.innerHTML = '';
            dishesDiv.innerHTML = '';
            brandsTitle.style.display = 'none';
            dishesTitle.style.display = 'none';
            noResultsMsg.style.display = 'none';

            if (!query) return;

            try {
                // Fetch ALL data from the Vault
                const res = await fetch(`${API_BASE_URL}/api/restaurants`);
                const result = await res.json();
                
                if (!result.success) throw new Error("API Failed");
                const allData = result.data;

                const q = query.toLowerCase();
                let matchedBrands = [];
                let matchedDishes = [];

                // ==========================================
                // 🛡️ INDESTRUCTIBLE SEARCH ALGORITHM
                // ==========================================
                allData.forEach(rest => {
                    try {
                        // Safely check name and tags
                        const restName = rest.name ? String(rest.name).toLowerCase() : "";
                        const restTags = rest.tags ? String(rest.tags).toLowerCase() : "";
                        
                        if (restName.includes(q) || restTags.includes(q)) {
                            matchedBrands.push(rest);
                        }

                        // Safely check if a menu actually exists!
                        if (rest.menu && typeof rest.menu === 'object') {
                            Object.values(rest.menu).forEach(categoryArray => {
                                if (Array.isArray(categoryArray)) {
                                    categoryArray.forEach(dish => {
                                        const dishName = dish.name ? String(dish.name).toLowerCase() : "";
                                        const dishDesc = dish.desc ? String(dish.desc).toLowerCase() : "";
                                        
                                        if (dishName.includes(q) || dishDesc.includes(q)) {
                                            const safeId = rest._id || rest.id || rest.idKey || 'unknown_rest';
                                            matchedDishes.push({ ...dish, restId: safeId, restName: rest.name });
                                        }
                                    });
                                }
                            });
                        }
                    } catch (error) {
                        console.warn("Skipped a corrupted restaurant in search.");
                    }
                });

                // Render Brands with Cinematic Stagger (Animation Delay)
                if (matchedBrands.length > 0) {
                    brandsTitle.style.display = 'block';
                    matchedBrands.forEach((rest, index) => {
                        const delay = index * 0.1; // 0.1s delay between each card
                        brandsDiv.innerHTML += `
                            <div class="rest-card search-anim-card" style="animation-delay: ${delay}s" onclick="window.location.href='Restaurant.html?id=${rest.idKey}'">
                                <img src="${rest.logo}" class="rest-img" alt="${rest.name}">
                                <div class="rest-details">
                                    <h4>${rest.name}</h4>
                                    <p class="rest-desc">${rest.tags}</p>
                                    <div class="rest-meta"><span class="star-rating">★ ${rest.rating}</span></div>
                                </div>
                            </div>
                        `;
                    });
                }

                // Render Dishes with Cinematic Stagger
                if (matchedDishes.length > 0) {
                    dishesTitle.style.display = 'block';
                    matchedDishes.forEach((dish, index) => {
                        const vegClass = dish.isVeg ? 'veg' : 'non-veg';
                        const delay = (index * 0.1) + 0.3; // Dishes fly in slightly after restaurants
                        dishesDiv.innerHTML += `
                            <div class="dish-card search-anim-card" style="animation-delay: ${delay}s" onclick="window.location.href='Restaurant.html?id=${dish.restId}'">
                                <div class="dish-img-wrapper">
                                    <img src="${dish.img}" alt="${dish.name}">
                                </div>
                                <div class="dish-info">
                                    <div class="title-row">
                                        <h3>${dish.name}</h3>
                                        <span class="veg-badge ${vegClass}"></span>
                                    </div>
                                    <h4 style="color: var(--primary); font-weight: 800; margin-bottom: 5px;">₹${dish.price}</h4>
                                    <p class="dish-restaurant">${dish.restName} • Click to order</p>
                                </div>
                            </div>
                        `;
                    });
                }

                if (matchedBrands.length === 0 && matchedDishes.length === 0) {
                    noResultsMsg.style.display = 'block';
                }

            } catch (err) {
                console.error("Search failed:", err);
            }
        }
    }

    // --- 13. 💳 THE LIVE PAYMENT GATEWAY ENGINE ---
    const cardNumberInput = document.getElementById('cardNumberInput');
    const cardExpiryInput = document.getElementById('cardExpiryInput');
    const cardCvvInput = document.getElementById('cardCvvInput');
    const securePayBtn = document.getElementById('securePayBtn');

    if (cardNumberInput && securePayBtn) {
        
        // 1. Auto-format Card Number (Adds spaces every 4 digits automatically!)
        cardNumberInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
            e.target.value = formatted;
        });

        // 2. Auto-format Expiry (Adds the / automatically!)
        cardExpiryInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length > 2) {
                val = val.substring(0, 2) + '/' + val.substring(2, 4);
            }
            e.target.value = val;
        });

        // 3. The Secure Payment Transaction
        securePayBtn.addEventListener('click', async () => {
            // Validate the inputs first
            if (cardNumberInput.value.length < 19 || cardExpiryInput.value.length < 5 || cardCvvInput.value.length < 3) {
                alert("Please enter valid Credit Card details!");
                return;
            }

            const userId = localStorage.getItem('cravixUserId');
            if (!userId) return alert("Please log in first!");

            let cartMemory = JSON.parse(localStorage.getItem('cravixCart')) || [];
            if (cartMemory.length === 0) return alert("Your cart is empty!");

            let itemTotalMath = 0;
            cartMemory.forEach(item => itemTotalMath += (item.price * item.qty));
            const grandTotal = itemTotalMath + 71;

            const currentRest = JSON.parse(localStorage.getItem('cravixCurrentRest')) || { id: 'unknown', name: 'Cravix Delivery' };

            const orderPayload = {
                userId: userId,
                restaurantId: currentRest.id,
                restaurantName: currentRest.name,
                items: cartMemory,
                totalAmount: grandTotal,
                paymentMethod: "Credit Card (Paid)" // 🟢 Marks it as officially paid!
            };

            try {
                // 🚀 UI Update: The Cinematic Processing State
                securePayBtn.innerHTML = '🔄 Contacting Bank...';
                securePayBtn.style.opacity = '0.7';
                securePayBtn.style.cursor = 'not-allowed';
                securePayBtn.disabled = true;

                // ⏳ Simulate a 2.5 second Bank Verification handshake
                await new Promise(resolve => setTimeout(resolve, 2500));

                securePayBtn.innerHTML = '✅ Payment Approved!';
                securePayBtn.style.background = '#28a745';

                const secureToken = localStorage.getItem('cravixToken');
                
                // 📡 Shoot the order to the Node.js Backend!
                const response = await fetch(`${API_BASE_URL}/api/orders/place`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${secureToken}` 
                    },
                    body: JSON.stringify(orderPayload)
                });

                const result = await response.json();
                
                if (result.success) {
                    localStorage.removeItem('cravixCart');
                    
                    const successOverlay = document.getElementById('order-success-overlay');
                    if (successOverlay) {
                        // Change the overlay text for a paid order!
                        successOverlay.querySelector('h2').innerText = "Payment Successful!";
                        successOverlay.querySelector('p').innerText = `₹${grandTotal} paid securely. Teleporting to radar...`;
                        
                        successOverlay.style.display = 'flex';
                        setTimeout(() => window.location.href = 'order-status.html', 2500);
                    } else {
                        window.location.href = 'order-status.html';
                    }
                } else {
                    alert("Order failed: " + result.message);
                    resetPayButton();
                }
            } catch (error) {
                console.error("🔴 Payment Error:", error);
                alert("Bank server offline. Transaction failed.");
                resetPayButton();
            }
        });

        function resetPayButton() {
            securePayBtn.innerHTML = 'Secure Pay';
            securePayBtn.style.opacity = '1';
            securePayBtn.style.cursor = 'pointer';
            securePayBtn.style.background = 'var(--primary)';
            securePayBtn.disabled = false;
        }
    }

    // --- 14. 👑 THE CEO DEPLOYMENT ENGINE ---
    const deployRestaurantBtn = document.getElementById('deployRestaurantBtn');

    if (deployRestaurantBtn) {
        deployRestaurantBtn.addEventListener('click', async () => {
            const name = document.getElementById('addName').value.trim();
            const tags = document.getElementById('addTags').value.trim();
            const rating = document.getElementById('addRating').value.trim();
            const loc = document.getElementById('addLoc').value.trim();
            const logo = document.getElementById('addLogo').value.trim();
            const bg = document.getElementById('addBg').value.trim();

            if (!name || !tags || !rating || !loc || !logo || !bg) {
                return alert("⚠️ CEO, all fields are required for deployment!");
            }

            // 🚀 We will automatically generate a highly realistic "Starter Menu" for the new restaurant!
            const dummyMenu = {
                "Chef's Specials": [
                    { name: `Signature ${name} Special`, price: 299, desc: `The dish that made ${name} famous globally.`, isVeg: false, img: bg },
                    { name: "Classic Veggie Delight", price: 199, desc: "A wholesome and healthy vegetarian masterpiece.", isVeg: true, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop" }
                ],
                "Beverages": [
                    { name: "Chilled Cola", price: 89, desc: "Perfectly chilled and refreshing.", isVeg: true, img: "https://m.media-amazon.com/images/I/71ry6WTpKdL._SL1500_.jpg" }
                ]
            };

            const newRestPayload = {
                name, tags, rating, loc, logo, bg, menu: dummyMenu
            };

            try {
                deployRestaurantBtn.innerHTML = "⏳ Injecting into Vault...";
                deployRestaurantBtn.disabled = true;

                const res = await fetch(`${API_BASE_URL}/api/restaurants/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newRestPayload)
                });

                const data = await res.json();

                if (data.success) {
                    deployRestaurantBtn.style.background = "#28a745";
                    deployRestaurantBtn.innerHTML = "✅ DEPLOYMENT SUCCESSFUL";
                    
                    setTimeout(() => {
                        alert("Restaurant successfully added! Teleporting to Home Page to view changes.");
                        window.location.href = "index.html"; // Teleport to see the magic
                    }, 1000);
                } else {
                    alert("Deployment Failed: " + data.message);
                    deployRestaurantBtn.innerHTML = "🚀 Deploy to Server";
                    deployRestaurantBtn.disabled = false;
                }
            } catch (error) {
                console.error("🔴 Connection Error:", error);
                alert("Server is offline! Boot up the backend.");
                deployRestaurantBtn.innerHTML = "🚀 Deploy to Server";
                deployRestaurantBtn.disabled = false;
            }
        });
    }

 // --- 15. ⚙️ THE BULLETPROOF USER SETTINGS ENGINE ---
    
    // 1. The Save Settings Logic
    const saveProfileBtns = document.querySelectorAll('#saveProfileBtn');
    saveProfileBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Stops the page from jumping
            
            const nameInput = document.getElementById('profileName');
            const phoneInput = document.getElementById('profilePhone');
            
            if (nameInput && phoneInput) {
                // Save to Vault
                localStorage.setItem('cravixUserName', nameInput.value.trim());
                localStorage.setItem('cravixUserPhone', phoneInput.value.trim());

                // 🟢 PREMIUM UPGRADE: Instantly update the Sidebar Badge!
                const badgeName = document.querySelector('.profile-sidebar h3');
                const badgePhone = document.querySelector('.profile-sidebar p');
                const badgeInitials = document.querySelector('.user-badge .avatar');
                
                if (badgeName) badgeName.innerText = nameInput.value.trim() || 'Elite Founder';
                if (badgePhone) badgePhone.innerText = phoneInput.value.trim() || '+91 98765 43210';
                if (badgeInitials && nameInput.value.trim()) {
                    // Grab first letters of first and last name (e.g. John Doe -> JD)
                    let initials = nameInput.value.trim().split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
                    badgeInitials.innerText = initials;
                }

                // Cinematic Success Button
                btn.innerText = "✅ Details Saved!";
                btn.style.background = "#20c997";
                
                setTimeout(() => { 
                    btn.innerText = "Save Changes"; 
                    btn.style.background = "#28a745";
                }, 2000);
            }
        });
    });

    // 2. The Update Address Logic
    const addressBtns = document.querySelectorAll('.add-new-address-btn');
    addressBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const newAddress = prompt("Enter your new delivery address:");
            if (newAddress && newAddress.trim() !== "") {
                // Save to Vault
                localStorage.setItem('cravixUserAddress', newAddress.trim());
                
                // Update text on screen
                const displayAddresses = document.querySelectorAll('#displayAddress');
                displayAddresses.forEach(display => {
                    display.innerText = newAddress.trim();
                });
            }
        });
    });


    // --- 16. 👤 THE PROFILE TABS ENGINE ---
    const profileNavItems = document.querySelectorAll('.profile-nav li');
    const profileTabContents = document.querySelectorAll('.profile-tab-content');

    if (profileNavItems.length > 0 && profileTabContents.length > 0) {
        profileNavItems.forEach((item, index) => {
            
            // 🛑 Special Logic for the Log Out Button (The last item)
            if (item.innerText.includes('Log Out')) {
                item.addEventListener('click', () => {
                    if (confirm("CEO, are you sure you want to log out of the command center?")) {
                        localStorage.removeItem('cravixToken');
                        localStorage.removeItem('cravixUserId');
                        window.location.href = 'index.html'; // Teleport back to home
                    }
                });
                return; // Stop here so it doesn't try to open a tab
            }

            // 🟢 Logic for normal tabs (Orders, Addresses, Settings)
            item.addEventListener('click', () => {
                
                // 1. Reset all buttons to default (Gray/Muted)
                profileNavItems.forEach(nav => {
                    if (!nav.innerText.includes('Log Out')) {
                        nav.classList.remove('active-nav');
                        nav.style.background = 'transparent';
                        nav.style.color = 'var(--text-muted)';
                    }
                });

                // 2. Light up the clicked button (Red/Primary)
                item.classList.add('active-nav');
                item.style.background = 'rgba(255, 107, 107, 0.1)';
                item.style.color = 'var(--primary)';

                // 3. Hide all the content screens
                profileTabContents.forEach(content => {
                    content.style.display = 'none';
                });

                // 4. Show the correct screen that matches the button clicked!
                if (profileTabContents[index]) {
                    profileTabContents[index].style.display = 'block';
                }
            });
        });
    }


    /* ==========================================
   🚪 TOP-TIER LOGOUT ENGINE
   ========================================== */
function handleLogout(event) {
    // Stop the link from jumping to the top of the page
    if (event) event.preventDefault(); 

    // The CEO confirmation
    const confirmLogout = confirm("CEO, are you sure you want to log out of the command center?");
    
    if (confirmLogout) {
        // 1. Nuke everything in the browser's memory
        localStorage.clear(); 
        sessionStorage.clear();

        // 2. Teleport back to the Home Page instantly
        window.location.href = 'index.html';
    }
}

/* ==========================================
   🌍 DYNAMIC HOMEPAGE BRANDS INJECTION (LIVE BACKEND)
   ========================================== */
/* ==========================================
   🌍 HYBRID BRAND INJECTION (Local + Live)
   ========================================== */
async function loadTopBrands() {
    const brandsContainer = document.querySelector('.restaurant-grid');
    if (!brandsContainer) return; 

    let allBrands = [];

    // 1. Pull from Local Admin Deployments FIRST (Instantly shows Taco Bell)
    const localRest = JSON.parse(localStorage.getItem('cravix_restaurants')) || [];
    allBrands = [...localRest];

    // 2. Try to pull from Live Backend securely
    try {
        const res = await fetch(`${API_BASE_URL}/api/restaurants`);
        const result = await res.json();
        if (result.success && result.data && result.data.length > 0) {
            allBrands = [...allBrands, ...result.data]; // Merge them!
        }
    } catch (error) {
        console.warn("Live backend offline. Loading local admin data only.");
    }

    // 3. Render EVERYTHING to the screen without crashing
    if (allBrands.length > 0) {
        brandsContainer.innerHTML = ''; // Clear old hardcoded brands
        // Reverse so the newest additions (Taco Bell) show up first!
        allBrands.reverse().forEach(rest => {
            try {
                const safeId = rest._id || rest.id || rest.idKey || 'burgerking';
                const logoImg = rest.logo || rest.logoUrl || 'https://via.placeholder.com/150'; 
                
                const restHTML = `
                    <div class="rest-card" onclick="window.location.href='Restaurant.html?id=${safeId}'">
                        <img src="${logoImg}" class="rest-img" alt="${rest.name || 'Restaurant'}">
                        <div class="rest-details">
                            <h4>${rest.name || 'New Brand'}</h4>
                            <p class="rest-desc">${rest.tags || rest.cuisine || 'Delicious Food'}</p>
                            <div class="rest-meta">
                                <span class="star-rating">★ ${rest.rating || '4.5'}</span>
                                <span class="dot">•</span>
                                <span>${rest.loc || rest.location || '30 MINS'}</span>
                            </div>
                        </div>
                    </div>
                `;
                brandsContainer.insertAdjacentHTML('beforeend', restHTML);
            } catch (err) {
                console.warn("Failed to render a brand card");
            }
        });
    }
}

// Run this when the homepage loads
document.addEventListener('DOMContentLoaded', loadTopBrands);