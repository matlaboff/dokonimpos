// Firebase SDK Variables
let auth = null;
let db = null;
let initializeApp, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut;
let getFirestore, collection, doc, setDoc, onSnapshot, deleteDoc, getDocs, writeBatch;

// Application State
let state = {
    shopId: localStorage.getItem('pos_shop_id') || 'SHOP-DEMO',
    shopName: localStorage.getItem('pos_shop_name') || 'Mening Do\'konim',
    homeTitle: localStorage.getItem('pos_home_title') || 'Bosh sahifa ko\'rsatkichlari',
    apkUrl: localStorage.getItem('pos_apk_url') || '',
    exeUrl: localStorage.getItem('pos_exe_url') || '',
    usdRate: parseFloat(localStorage.getItem('pos_usd_rate')) || 12800,
    shopPhone: localStorage.getItem('pos_shop_phone') || '',
    shopAddress: localStorage.getItem('pos_shop_address') || '',
    receiptFooter: localStorage.getItem('pos_receipt_footer') || 'Xaridingiz uchun rahmat!',
    paperWidth: localStorage.getItem('pos_paper_width') || '80',
    autoPrint: localStorage.getItem('pos_auto_print') === '1',
    printerName: localStorage.getItem('pos_printer_name') || '',
    soundOn: localStorage.getItem('pos_sound') !== '0',
    email: localStorage.getItem('pos_email') || '',
    pass: localStorage.getItem('pos_pass') || '',
    currentUser: null,
    products: [],
    customers: [],
    sales: [],
    expenses: [],
    debtPayments: [],
    suppliers: [],
    stockIncome: [],
    shifts: [],
    shiftRequired: localStorage.getItem('pos_shift_required') === '1',
    categories: ['Telefon', 'Aksessuar'],
    cart: []
};

let realtimeUnsubscribes = [];
let DOM = {};

function initDOMHandles() {
    DOM = {
        shopNameDisplay: document.getElementById('shop-name-display'),
        homeTitleDisplay: document.getElementById('home-title-display'),
        usdRateDisplay: document.getElementById('usd-rate-display'),
        syncStatus: document.getElementById('sync-status'),
        loginBtn: document.getElementById('login-btn'),

        statTodaySales: document.getElementById('stat-today-sales'),
        statTodayProfit: document.getElementById('stat-today-profit'),
        statCash: document.getElementById('stat-cash'),
        statExpensesSub: document.getElementById('stat-expenses-sub'),
        statStockValue: document.getElementById('stat-stock-value'),
        statStockCount: document.getElementById('stat-stock-count'),
        statTotalDebt: document.getElementById('stat-total-debt'),
        statDebtorsCount: document.getElementById('stat-debtors-count'),

        lowStockContainer: document.getElementById('low-stock-container'),
        debtorsContainer: document.getElementById('debtors-list-container'),
        recentSalesContainer: document.getElementById('recent-sales-container'),

        posProductsGrid: document.getElementById('pos-products-grid'),
        posSearchInput: document.getElementById('pos-search-input'),
        posCategoryFilter: document.getElementById('pos-category-filter'),
        cartBadgeCount: document.getElementById('cart-badge-count'),
        cartItemsList: document.getElementById('cart-items-list'),
        cartDiscountInput: document.getElementById('cart-discount-input'),
        cartTotalDisplay: document.getElementById('cart-total-display'),
        cartUsdTotalDisplay: document.getElementById('cart-usd-total-display'),
        cartCustomerSelect: document.getElementById('cart-customer-select'),
        cartPaymentSelect: document.getElementById('cart-payment-select'),
        cartPaidInput: document.getElementById('cart-paid-input'),
        cartDebtWarning: document.getElementById('cart-debt-warning'),
        cartRemainingDebt: document.getElementById('cart-remaining-debt'),
        cartDebtLabel: document.getElementById('cart-debt-label'),
        cameraScanBtn: document.getElementById('camera-scan-btn'),
        scannerModal: document.getElementById('scanner-modal'),
        scannerVideo: document.getElementById('scanner-video'),
        scannerCloseBtn: document.getElementById('scanner-close-btn'),
        settingShopPhone: document.getElementById('setting-shop-phone'),
        settingShopAddress: document.getElementById('setting-shop-address'),
        settingReceiptFooter: document.getElementById('setting-receipt-footer'),
        settingPaperWidth: document.getElementById('setting-paper-width'),
        settingAutoPrint: document.getElementById('setting-auto-print'),
        settingSound: document.getElementById('setting-sound'),
        settingShiftRequired: document.getElementById('setting-shift-required'),
        settingPrinter: document.getElementById('setting-printer'),
        printerSelectWrap: document.getElementById('printer-select-wrap'),
        testPrintBtn: document.getElementById('test-print-btn'),
        printReceiptBtn: document.getElementById('print-receipt-btn'),
        adminLoginModal: document.getElementById('admin-login-modal'),
        adminLoginInput: document.getElementById('admin-login-input'),
        adminLoginBtn: document.getElementById('admin-login-btn'),
        adminLoginCancelBtn: document.getElementById('admin-login-cancel-btn'),
        adminLoginError: document.getElementById('admin-login-error'),
        adminPasswordStatus: document.getElementById('admin-password-status'),
        adminCurrentPasswordInput: document.getElementById('admin-current-password'),
        adminNewPasswordInput: document.getElementById('admin-new-password'),
        adminConfirmPasswordInput: document.getElementById('admin-confirm-password'),
        adminSetPasswordBtn: document.getElementById('admin-set-password-btn'),
        adminRemovePasswordBtn: document.getElementById('admin-remove-password-btn'),
        adminLogoutBtn: document.getElementById('admin-logout-btn'),
        resetDataBtn: document.getElementById('reset-data-btn'),
        resetModal: document.getElementById('reset-modal'),
        resetBackupCheck: document.getElementById('reset-backup-check'),
        resetCloudCheck: document.getElementById('reset-cloud-check'),
        resetCloudRow: document.getElementById('reset-cloud-row'),
        resetCloudNote: document.getElementById('reset-cloud-note'),
        resetCounts: document.getElementById('reset-counts'),
        resetConfirmInput: document.getElementById('reset-confirm-input'),
        resetConfirmBtn: document.getElementById('reset-confirm-btn'),
        salesSearchInput: document.getElementById('sales-search-input'),
        salesDateFilter: document.getElementById('sales-date-filter'),
        salesCountLabel: document.getElementById('sales-count-label'),
        salesPaymentFilter: document.getElementById('sales-payment-filter'),
        salesShowReturned: document.getElementById('sales-show-returned'),
        manageSuppliersBtn: document.getElementById('manage-suppliers-btn'),
        suppliersModal: document.getElementById('suppliers-modal'),
        suppliersListContainer: document.getElementById('suppliers-list-container'),
        supplierEditOriginal: document.getElementById('supplier-edit-original'),
        supplierNameInput: document.getElementById('supplier-name-input'),
        supplierPhoneInput: document.getElementById('supplier-phone-input'),
        saveSupplierBtn: document.getElementById('save-supplier-btn'),
        cancelSupplierEditBtn: document.getElementById('cancel-supplier-edit-btn'),
        prodSupplierSelect: document.getElementById('prod-supplier-select'),
        prodMinSell: document.getElementById('prod-min-sell'),
        prodMinSell: document.getElementById('prod-min-sell'),
        printBarcodeModalBtn: document.getElementById('print-barcode-modal-btn'),
        labelModal: document.getElementById('label-modal'),
        labelPreview: document.getElementById('label-preview'),
        labelCopies: document.getElementById('label-copies'),
        labelShowPrice: document.getElementById('label-show-price'),
        labelShowShop: document.getElementById('label-show-shop'),
        labelPrintBtn: document.getElementById('label-print-btn'),
        settingApkUrl: document.getElementById('setting-apk-url'),
        settingExeUrl: document.getElementById('setting-exe-url'),
        btnDownloadApkAction: document.getElementById('btn-download-apk-action'),
        btnDownloadExeAction: document.getElementById('btn-download-exe-action'),
        navDownloadApk: document.getElementById('nav-download-apk'),
        navDownloadExe: document.getElementById('nav-download-exe'),
        checkoutSubmitBtn: document.getElementById('checkout-submit-btn'),
        clearCartBtn: document.getElementById('clear-cart-btn'),
        quickSaleBtn: document.getElementById('quick-sale-btn'),

        productsTableBody: document.getElementById('products-table-body'),
        productsSearchInput: document.getElementById('products-search-input'),
        productsCatFilter: document.getElementById('products-cat-filter'),
        addProductBtn: document.getElementById('add-product-btn'),
        manageCatalogsBtn: document.getElementById('manage-catalogs-btn'),

        salesTableBody: document.getElementById('sales-table-body'),
        expensesTableBody: document.getElementById('expenses-table-body'),
        addExpenseBtn: document.getElementById('add-expense-btn'),
        tabSalesHistoryBtn: document.getElementById('tab-sales-history-btn'),
        tabExpensesListBtn: document.getElementById('tab-expenses-list-btn'),
        salesHistoryPanel: document.getElementById('sales-history-panel'),
        expensesListPanel: document.getElementById('expenses-list-panel'),

        customersTableBody: document.getElementById('customers-table-body'),
        addCustomerBtn: document.getElementById('add-customer-btn'),
        filterAllCustBtn: document.getElementById('filter-all-cust-btn'),
        filterDebtorsBtn: document.getElementById('filter-debtors-btn'),

        reportsMobileContainer: document.getElementById('reports-mobile-container'),

        settingShopName: document.getElementById('setting-shop-name'),
        settingHomeTitle: document.getElementById('setting-home-title'),
        settingUsdRate: document.getElementById('setting-usd-rate'),
        settingShopId: document.getElementById('setting-shop-id'),
        settingEmail: document.getElementById('setting-email'),
        settingPass: document.getElementById('setting-pass'),
        saveSettingsBtn: document.getElementById('save-settings-btn'),
        connectFirebaseBtn: document.getElementById('connect-firebase-btn'),

        productModal: document.getElementById('product-modal'),
        productModalTitle: document.getElementById('product-modal-title'),
        saveProductSubmit: document.getElementById('save-product-submit'),
        prodId: document.getElementById('prod-id'),
        prodName: document.getElementById('prod-name'),
        prodCode: document.getElementById('prod-code'),
        prodImei: document.getElementById('prod-imei'),
        prodCatSelect: document.getElementById('prod-cat-select'),
        prodBuy: document.getElementById('prod-buy'),
        prodSell: document.getElementById('prod-sell'),
        prodQty: document.getElementById('prod-qty'),
        prodMin: document.getElementById('prod-min'),
        genSkuBtn: document.getElementById('gen-sku-btn'),

        customerModal: document.getElementById('customer-modal'),
        customerModalTitle: document.getElementById('customer-modal-title'),
        custIdInput: document.getElementById('cust-id-input'),
        custNameInput: document.getElementById('cust-name-input'),
        custPhoneInput: document.getElementById('cust-phone-input'),
        saveCustomerSubmit: document.getElementById('save-customer-submit'),

        payDebtModal: document.getElementById('pay-debt-modal'),
        debtCustId: document.getElementById('debt-cust-id'),
        debtCustName: document.getElementById('debt-cust-name'),
        debtCustTotal: document.getElementById('debt-cust-total'),
        debtPayAmount: document.getElementById('debt-pay-amount'),
        submitPayDebtBtn: document.getElementById('submit-pay-debt-btn'),

        quickSaleModal: document.getElementById('quick-sale-modal'),
        quickSaleName: document.getElementById('quick-sale-name'),
        quickSaleAmount: document.getElementById('quick-sale-amount'),
        submitQuickSaleBtn: document.getElementById('submit-quick-sale-btn'),

        catalogModal: document.getElementById('catalog-modal'),
        newCatalogInput: document.getElementById('new-catalog-input'),
        addCatalogSubmit: document.getElementById('add-catalog-submit'),
        catalogListContainer: document.getElementById('catalog-list-container'),

        expenseModal: document.getElementById('expense-modal'),
        expenseNoteInput: document.getElementById('expense-note-input'),
        expenseAmountInput: document.getElementById('expense-amount-input'),
        submitExpenseBtn: document.getElementById('submit-expense-btn'),

        receiptModal: document.getElementById('receipt-modal'),
        receiptPaper: document.getElementById('receipt-paper')
    };
}

// INITIALIZATION
window.addEventListener('DOMContentLoaded', async () => {
    initDOMHandles();
    injectReceiptStyle();
    loadPrinterList();
    setupEventListeners();
    await initStorage();
    updateUIHeader();
    renderAll();
    if (migratedCount > 0) showToast(`Ma'lumotlar yangi katta xotiraga ko'chirildi (${migratedCount} ta yozuv)`);
    initFirebaseSDK();
});

// TOAST NOTIFICATION HELPER
window.showToast = function(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'error' ? 'fa-circle-xmark' : (type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-check');
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHtml(msg)}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
};

// LOCAL DATE-TIME HELPER (Fixes UTC timezone bug)
function getLocalDateTime() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().replace('T', ' ').substring(0, 19);
}

async function initFirebaseSDK() {
    try {
        const appMod = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
        const authMod = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
        const fsMod = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

        initializeApp = appMod.initializeApp;
        getAuth = authMod.getAuth;
        signInWithEmailAndPassword = authMod.signInWithEmailAndPassword;
        createUserWithEmailAndPassword = authMod.createUserWithEmailAndPassword;
        onAuthStateChanged = authMod.onAuthStateChanged;
        signOut = authMod.signOut;

        getFirestore = fsMod.getFirestore;
        collection = fsMod.collection;
        doc = fsMod.doc;
        setDoc = fsMod.setDoc;
        onSnapshot = fsMod.onSnapshot;
        deleteDoc = fsMod.deleteDoc;
        getDocs = fsMod.getDocs;
        writeBatch = fsMod.writeBatch;

        const firebaseConfig = {
            apiKey: "AIzaSyDiAXFyy13bZYgfKloz_oxkDPvOt127IuY",
            authDomain: "billzoffline.firebaseapp.com",
            projectId: "billzoffline",
            storageBucket: "billzoffline.firebasestorage.app",
            messagingSenderId: "807863574364",
            appId: "1:807863574364:web:dokonimpos"
        };

        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);

        onAuthStateChanged(auth, (user) => {
            if (user) {
                state.currentUser = user;
                if (DOM.syncStatus) {
                    DOM.syncStatus.className = 'status-indicator online';
                    DOM.syncStatus.innerHTML = '<i class="fa-solid fa-circle"></i> Bulut ulangan';
                }
                if (DOM.loginBtn) {
                    DOM.loginBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Chiqish';
                }
                setupRealtimeListeners();
            } else {
                state.currentUser = null;
                if (DOM.syncStatus) {
                    DOM.syncStatus.className = 'status-indicator offline';
                    DOM.syncStatus.innerHTML = '<i class="fa-solid fa-circle"></i> Oflayn';
                }
                if (DOM.loginBtn) {
                    DOM.loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';
                }
            }
        });

        if (state.email && state.pass) {
            connectFirebase(state.email, state.pass, true);
        }
    } catch (e) {
        console.warn("Firebase SDK offline mode:", e);
    }
}

function updateUIHeader() {
    if (DOM.shopNameDisplay) DOM.shopNameDisplay.textContent = state.shopName;
    if (DOM.homeTitleDisplay) DOM.homeTitleDisplay.innerHTML = `<i class="fa-solid fa-gauge-high"></i> ${escapeHtml(state.homeTitle)}`;
    if (DOM.usdRateDisplay) DOM.usdRateDisplay.textContent = formatMoney(state.usdRate).replace(' so\'m', '');
    if (DOM.settingShopName) DOM.settingShopName.value = state.shopName;
    if (DOM.settingHomeTitle) DOM.settingHomeTitle.value = state.homeTitle;
    if (DOM.settingUsdRate) DOM.settingUsdRate.value = state.usdRate;
    if (DOM.settingShopPhone) DOM.settingShopPhone.value = state.shopPhone;
    if (DOM.settingShopAddress) DOM.settingShopAddress.value = state.shopAddress;
    if (DOM.settingReceiptFooter) DOM.settingReceiptFooter.value = state.receiptFooter;
    if (DOM.settingPaperWidth) DOM.settingPaperWidth.value = state.paperWidth;
    if (DOM.settingAutoPrint) DOM.settingAutoPrint.checked = state.autoPrint;
    if (DOM.settingSound) DOM.settingSound.checked = state.soundOn;
    if (DOM.settingShiftRequired) DOM.settingShiftRequired.checked = state.shiftRequired;
    if (DOM.settingApkUrl) DOM.settingApkUrl.value = state.apkUrl;
    if (DOM.settingExeUrl) DOM.settingExeUrl.value = state.exeUrl;
    if (DOM.settingShopId) DOM.settingShopId.value = state.shopId;
    if (DOM.settingEmail) DOM.settingEmail.value = state.email;
    if (DOM.settingPass) DOM.settingPass.value = state.pass;
}

function setupEventListeners() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.target));
    });

    document.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    if (DOM.scannerCloseBtn) DOM.scannerCloseBtn.addEventListener('click', stopCameraScan);
    if (DOM.cameraScanBtn) DOM.cameraScanBtn.addEventListener('click', startCameraScan);
    if (DOM.printReceiptBtn) DOM.printReceiptBtn.addEventListener('click', () => printReceipt());
    if (DOM.testPrintBtn) DOM.testPrintBtn.addEventListener('click', printTestReceipt);
    setupScanner();
    setupProFeatures();
    setupListFilters();
    setupResetFeature();
    setupAdminAuth();
    setupStockIncome();
    setupShifts();

    // Barcode Scanner & Search Input
    if (DOM.posSearchInput) {
        let searchTimer = null;
        DOM.posSearchInput.addEventListener('input', () => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(renderPOSProducts, 60);
        });
        DOM.posSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleScan(DOM.posSearchInput.value, { fromInput: true });
            }
        });
    }

    if (DOM.posCategoryFilter) DOM.posCategoryFilter.addEventListener('change', () => { renderPOSProducts(); DOM.posCategoryFilter.blur(); });
    if (DOM.cartCustomerSelect) DOM.cartCustomerSelect.addEventListener('change', () => DOM.cartCustomerSelect.blur());
    if (DOM.productsSearchInput) DOM.productsSearchInput.addEventListener('input', renderProductsTable);
    if (DOM.productsCatFilter) DOM.productsCatFilter.addEventListener('change', renderProductsTable);

    if (DOM.cartDiscountInput) DOM.cartDiscountInput.addEventListener('input', () => updateCartSummary(true));
    if (DOM.cartPaidInput) DOM.cartPaidInput.addEventListener('input', () => updateCartSummary(false));

    if (DOM.cartPaymentSelect) {
        DOM.cartPaymentSelect.addEventListener('change', () => {
            const method = DOM.cartPaymentSelect.value;
            const total = Math.max(0, getCartSubtotal() - (parseFloat(DOM.cartDiscountInput.value) || 0));
            DOM.cartPaidInput.value = method === 'Qarz' ? 0 : total;
            updateCartSummary(false);
            DOM.cartPaymentSelect.blur();
        });
    }

    if (DOM.checkoutSubmitBtn) DOM.checkoutSubmitBtn.addEventListener('click', handleCheckout);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'F9' && document.getElementById('pos-section').classList.contains('active')) {
            e.preventDefault();
            handleCheckout();
        }
    });

    if (DOM.clearCartBtn) {
        DOM.clearCartBtn.addEventListener('click', () => {
            state.cart = [];
            if (DOM.cartDiscountInput) DOM.cartDiscountInput.value = 0;
            renderCart(true);
            focusScanInput();
        });
    }

    // Quick Sale
    if (DOM.quickSaleBtn) {
        DOM.quickSaleBtn.addEventListener('click', () => {
            DOM.quickSaleName.value = 'Tezkor sotuv';
            DOM.quickSaleAmount.value = '';
            DOM.quickSaleModal.classList.add('active');
            DOM.quickSaleAmount.focus();
        });
    }
    if (DOM.submitQuickSaleBtn) DOM.submitQuickSaleBtn.addEventListener('click', handleQuickSaleSubmit);

    // Products & Catalogs
    if (DOM.addProductBtn) DOM.addProductBtn.addEventListener('click', () => openProductModal());
    if (DOM.genSkuBtn) {
        DOM.genSkuBtn.addEventListener('click', () => {
            DOM.prodCode.value = generateUniqueSKU();
        });
    }
    if (DOM.saveProductSubmit) DOM.saveProductSubmit.addEventListener('click', handleSaveProduct);
    if (DOM.manageCatalogsBtn) {
        DOM.manageCatalogsBtn.addEventListener('click', () => {
            renderCatalogModalList();
            DOM.catalogModal.classList.add('active');
        });
    }
    if (DOM.addCatalogSubmit) DOM.addCatalogSubmit.addEventListener('click', handleAddCatalog);

    // Sales & Expenses Tabs
    if (DOM.tabSalesHistoryBtn) {
        DOM.tabSalesHistoryBtn.addEventListener('click', () => {
            DOM.tabSalesHistoryBtn.classList.add('active');
            DOM.tabExpensesListBtn.classList.remove('active');
            DOM.salesHistoryPanel.style.display = 'block';
            DOM.expensesListPanel.style.display = 'none';
        });
    }
    if (DOM.tabExpensesListBtn) {
        DOM.tabExpensesListBtn.addEventListener('click', () => {
            DOM.tabExpensesListBtn.classList.add('active');
            DOM.tabSalesHistoryBtn.classList.remove('active');
            DOM.expensesListPanel.style.display = 'block';
            DOM.salesHistoryPanel.style.display = 'none';
        });
    }
    if (DOM.addExpenseBtn) {
        DOM.addExpenseBtn.addEventListener('click', () => {
            DOM.expenseNoteInput.value = '';
            DOM.expenseAmountInput.value = '';
            DOM.expenseModal.classList.add('active');
        });
    }
    if (DOM.submitExpenseBtn) DOM.submitExpenseBtn.addEventListener('click', handleSaveExpense);

    // Customers
    if (DOM.addCustomerBtn) DOM.addCustomerBtn.addEventListener('click', () => openCustomerModal());
    if (DOM.saveCustomerSubmit) DOM.saveCustomerSubmit.addEventListener('click', handleSaveCustomer);
    if (DOM.filterAllCustBtn) {
        DOM.filterAllCustBtn.addEventListener('click', () => {
            DOM.filterAllCustBtn.classList.add('active');
            DOM.filterDebtorsBtn.classList.remove('active');
            renderCustomersTable(false);
        });
    }
    if (DOM.filterDebtorsBtn) {
        DOM.filterDebtorsBtn.addEventListener('click', () => {
            DOM.filterDebtorsBtn.classList.add('active');
            DOM.filterAllCustBtn.classList.remove('active');
            renderCustomersTable(true);
        });
    }
    if (DOM.submitPayDebtBtn) DOM.submitPayDebtBtn.addEventListener('click', handleSubmitPayDebt);

    // Settings
    if (DOM.saveSettingsBtn) {
        DOM.saveSettingsBtn.addEventListener('click', () => {
            state.shopName = DOM.settingShopName.value.trim() || 'DO\'KONIM POS';
            state.homeTitle = DOM.settingHomeTitle.value.trim() || 'Bosh sahifa';
            state.usdRate = parseFloat(DOM.settingUsdRate.value) || 12800;
            localStorage.setItem('pos_shop_name', state.shopName);
            localStorage.setItem('pos_home_title', state.homeTitle);
            localStorage.setItem('pos_usd_rate', state.usdRate);

            const apk = DOM.settingApkUrl ? DOM.settingApkUrl.value.trim() : state.apkUrl;
            const exe = DOM.settingExeUrl ? DOM.settingExeUrl.value.trim() : state.exeUrl;
            if ((apk && !isValidHttpUrl(apk)) || (exe && !isValidHttpUrl(exe))) {
                showToast('Yuklash havolasi http:// yoki https:// bilan boshlanishi kerak!', 'error');
                return;
            }
            state.apkUrl = apk;
            state.exeUrl = exe;
            localStorage.setItem('pos_apk_url', apk);
            localStorage.setItem('pos_exe_url', exe);

            state.shopPhone = DOM.settingShopPhone.value.trim();
            state.shopAddress = DOM.settingShopAddress.value.trim();
            state.receiptFooter = DOM.settingReceiptFooter.value.trim();
            state.paperWidth = DOM.settingPaperWidth.value === '58' ? '58' : '80';
            state.autoPrint = DOM.settingAutoPrint.checked;
            state.soundOn = DOM.settingSound.checked;
            if (DOM.settingShiftRequired) {
                state.shiftRequired = DOM.settingShiftRequired.checked;
                localStorage.setItem('pos_shift_required', state.shiftRequired ? '1' : '0');
            }
            if (DOM.settingPrinter) {
                state.printerName = DOM.settingPrinter.value;
                localStorage.setItem('pos_printer_name', state.printerName);
            }
            localStorage.setItem('pos_shop_phone', state.shopPhone);
            localStorage.setItem('pos_shop_address', state.shopAddress);
            localStorage.setItem('pos_receipt_footer', state.receiptFooter);
            localStorage.setItem('pos_paper_width', state.paperWidth);
            localStorage.setItem('pos_auto_print', state.autoPrint ? '1' : '0');
            localStorage.setItem('pos_sound', state.soundOn ? '1' : '0');
            updateUIHeader();
            renderAll();
            showToast('Sozlamalar muvaffaqiyatli saqlandi!');
        });
    }

    if (DOM.connectFirebaseBtn) {
        DOM.connectFirebaseBtn.addEventListener('click', () => {
            state.shopId = DOM.settingShopId.value.trim() || 'SHOP-DEMO';
            state.email = DOM.settingEmail.value.trim();
            state.pass = DOM.settingPass.value.trim();
            localStorage.setItem('pos_shop_id', state.shopId);
            localStorage.setItem('pos_email', state.email);
            localStorage.setItem('pos_pass', state.pass);
            connectFirebase(state.email, state.pass, false);
        });
    }

    if (DOM.loginBtn) {
        DOM.loginBtn.addEventListener('click', () => {
            if (state.currentUser && signOut && auth) {
                logoutFromCloud();
                showToast('Bulut tizimidan chiqildi. Mahalliy ma\'lumotlar saqlanib qoldi.', 'warning');
            } else {
                switchTab('settings-section');
            }
        });
    }
}

window.switchTab = function(targetId) {
    document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.target === targetId);
    });
    document.querySelectorAll('.app-section').forEach(s => {
        s.classList.toggle('active', s.id === targetId);
    });
    if (targetId === 'pos-section') focusScanInput();
    if (targetId === 'settings-section') { refreshStorageInfo(); updateAdminUI(); }
    if (targetId === 'products-section') renderStockIncomeTable();
    if (targetId === 'shifts-section') renderShiftSection();
};

// FIREBASE REALTIME SYNC
function connectFirebase(email, pass, silent = false) {
    if (!email || !pass || !auth || !signInWithEmailAndPassword) {
        if (!silent) showToast('Email va parolni kiriting!', 'error');
        return;
    }
    signInWithEmailAndPassword(auth, email, pass)
        .then(() => {
            setupRealtimeListeners();
            if (!silent) showToast('Firebase bulutiga muvaffaqiyatli ulanindi!');
        })
        .catch(err => {
            if (err.code === 'auth/user-not-found') {
                createUserWithEmailAndPassword(auth, email, pass)
                    .then(() => {
                        setupRealtimeListeners();
                        showToast('Yangi bulut akkaunt yaratildi va ulanindi!');
                    })
                    .catch(e => showToast(firebaseErrorMessage(e), 'error'));
            } else if (!silent || err.code === 'auth/unauthorized-domain') {
                showToast(firebaseErrorMessage(err), 'error');
            }
        });
}

function setupRealtimeListeners() {
    if (!state.shopId || !db || !collection || !onSnapshot) return;

    realtimeUnsubscribes.forEach(unsub => { try { unsub(); } catch (e) {} });
    realtimeUnsubscribes = [];
    const firstSnapDone = {};

    const collections = ['products', 'customers', 'sales', 'debt_payments', 'categories', 'expenses', 'suppliers', 'stock_income', 'shifts'];
    collections.forEach(colName => {
        const colRef = collection(db, 'shops', state.shopId, colName);
        const unsub = onSnapshot(colRef, (snapshot) => {
            const list = [];
            snapshot.forEach(docSnap => {
                list.push({ id: docSnap.id, ...docSnap.data() });
            });
            if (colName === 'products') state.products = list;
            if (colName === 'customers') state.customers = list;
            if (colName === 'sales') state.sales = list;
            if (colName === 'debt_payments') state.debtPayments = list;
            if (colName === 'expenses') state.expenses = list;
            if (colName === 'suppliers') state.suppliers = list;
            if (colName === 'stock_income') state.stockIncome = list;
            if (colName === 'shifts') state.shifts = list;
            if (colName === 'categories') {
                state.categories = Array.from(new Set(['Telefon', 'Aksessuar', ...list.map(c => c.name || c.id)]));
            }
            persistSnapshot(colName, snapshot, list, !firstSnapDone[colName]);
            firstSnapDone[colName] = true;
            renderAll();
        });
        realtimeUnsubscribes.push(unsub);
    });
}

// LOCAL DATA STORAGE
function loadLocalData() {
    try {
        state.products = JSON.parse(localStorage.getItem('pos_data_products')) || [];
        state.customers = JSON.parse(localStorage.getItem('pos_data_customers')) || [];
        state.sales = JSON.parse(localStorage.getItem('pos_data_sales')) || [];
        state.debtPayments = JSON.parse(localStorage.getItem('pos_data_debt_payments')) || [];
        state.expenses = JSON.parse(localStorage.getItem('pos_data_expenses')) || [];
        state.categories = JSON.parse(localStorage.getItem('pos_data_categories')) || ['Telefon', 'Aksessuar'];
        state.suppliers = JSON.parse(localStorage.getItem('pos_data_suppliers')) || [];
        state.stockIncome = JSON.parse(localStorage.getItem('pos_data_stock_income')) || [];
        state.shifts = JSON.parse(localStorage.getItem('pos_data_shifts')) || [];
    } catch (e) {}
}

// RENDER ALL UI

function handleStockIncome(productId, qty, buyPrice, note) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;
    const q = Math.max(0, parseInt(qty)||0);
    if (q <= 0) { showToast('Miqdorni kiriting!','error'); return; }
    const bp = parseFloat(buyPrice);
    const now = getLocalDateTime();
    const entry = {
        id: 'INC-'+Math.random().toString(36).substring(2,10).toUpperCase(),
        product_id: productId, product_name: prod.name,
        qty: q, buy_price: isNaN(bp) ? (parseFloat(prod.buy)||0) : bp,
        note: String(note||'').trim(), created: now
    };
    prod.qty = (parseInt(prod.qty)||0) + q;
    if (!isNaN(bp) && bp > 0) prod.buy = bp;
    prod.updated = now;
    state.stockIncome.push(entry);
    syncDoc('products', prod.id, prod);
    persistDoc('stock_income', entry.id, entry);
    if (db && setDoc && doc) setDoc(doc(db,'shops',state.shopId,'stock_income',entry.id),entry,{merge:true}).catch(()=>{});
    renderProductsTable(); renderStockIncomeTable();
    showToast(`${prod.name}: +${q} dona qabul qilindi`);
}

function renderStockIncomeTable() {
    const el = document.getElementById('stock-income-table-body');
    if (!el) return;
    const list = state.stockIncome.slice().sort(cmpCreatedDesc).slice(0, 200);
    if (!list.length) { el.innerHTML='<tr><td colspan="6" class="text-center">Kirimlar yo\'q</td></tr>'; return; }
    el.innerHTML = list.map(e => `<tr>
        <td>${escapeHtml(e.created||'')}</td>
        <td><strong>${escapeHtml(e.product_name||'')}</strong></td>
        <td class="text-success"><strong>+${e.qty} dona</strong></td>
        <td>${formatMoney(e.buy_price)}</td>
        <td>${formatMoney((e.buy_price||0)*e.qty)}</td>
        <td>${escapeHtml(e.note||'')}</td>
    </tr>`).join('');
}

window.openStockIncomeModal = function(productId) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;
    document.getElementById('si-product-name').textContent = prod.name;
    document.getElementById('si-product-id').value = productId;
    document.getElementById('si-qty').value = '';
    document.getElementById('si-buy-price').value = prod.buy || '';
    document.getElementById('si-note').value = '';
    document.getElementById('stock-income-modal').classList.add('active');
    setTimeout(() => document.getElementById('si-qty')?.focus(), 50);
};

function setupStockIncome() {
    const btn = document.getElementById('si-save-btn');
    if (btn) btn.addEventListener('click', () => {
        const pid  = document.getElementById('si-product-id').value;
        const qty  = document.getElementById('si-qty').value;
        const bp   = document.getElementById('si-buy-price').value;
        const note = document.getElementById('si-note').value;
        handleStockIncome(pid, qty, bp, note);
        const hasErr = document.querySelector('.toast') && document.querySelector('.toast').style.background?.includes('red');
        setTimeout(() => { const m=document.getElementById('stock-income-modal'); if(m&&m.classList.contains('active') && state.stockIncome.find(e=>e.product_id===pid)){m.classList.remove('active');} }, 100);
    });
    ['si-qty','si-buy-price','si-note'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('keydown', e => { if(e.key==='Enter') document.getElementById('si-save-btn')?.click(); });
    });
}

function renderAll() {
    renderShiftChip();
    if ($id('shifts-section') && $id('shifts-section').classList.contains('active')) renderShiftSection();
    updateSupplierDropdowns();
    updateCategoryDropdowns();
    renderStats();
    renderPOSProducts();
    renderCart();
    renderProductsTable();
    renderSalesAndExpenses();
    renderCustomersTable(DOM.filterDebtorsBtn && DOM.filterDebtorsBtn.classList.contains('active'));
    renderMobileReports();
}

// STATS & DASHBOARD
function renderStats() {
    const todayStr = getLocalDateTime().substring(0, 10);
    const activeSales = state.sales.filter(s => s.returned !== 1);

    const todaySalesList = activeSales.filter(s => s.created && s.created.substring(0, 10) === todayStr);
    const todaySales = todaySalesList.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0);
    const todayProfit = todaySalesList.reduce((sum, s) => sum + (parseFloat(s.profit) || 0), 0);

    // Accurate Cash Calculation: Paid amounts from sales + Debt payments - Expenses
    const totalPaidFromSales = activeSales.reduce((sum, s) => {
        const total = parseFloat(s.total) || 0;
        const paid = s.paid !== undefined ? parseFloat(s.paid) : (s.payment === 'Qarz' ? 0 : total);
        return sum + Math.min(total, Math.max(0, paid));
    }, 0);

    const totalDebtCollected = state.debtPayments.reduce((sum, dp) => sum + (parseFloat(dp.amount) || 0), 0);
    const totalExpenses = state.expenses.reduce((sum, ex) => sum + (parseFloat(ex.amount) || 0), 0);
    const netCash = totalPaidFromSales + totalDebtCollected - totalExpenses;

    const stockValue = state.products.reduce((sum, p) => sum + ((parseFloat(p.buy) || 0) * Math.max(0, parseInt(p.qty) || 0)), 0);
    const debtors = getDebtorsList();
    const totalDebt = debtors.reduce((sum, d) => sum + d.debt, 0);

    updateAdminUI(); // maxfiy kartalar ko'rsatish/yashirish
    if (DOM.statTodaySales) DOM.statTodaySales.textContent = formatMoney(todaySales);
    if (DOM.statTodayProfit) DOM.statTodayProfit.textContent = `Sof foyda: ${formatMoney(todayProfit)}`;
    if (DOM.statCash) DOM.statCash.textContent = formatMoney(netCash);
    if (DOM.statExpensesSub) DOM.statExpensesSub.textContent = `Xarajatlar: ${formatMoney(totalExpenses)}`;
    if (DOM.statStockValue) DOM.statStockValue.textContent = formatMoney(stockValue);
    if (DOM.statStockCount) DOM.statStockCount.textContent = `Jami: ${state.products.length} xil mahsulot`;
    if (DOM.statTotalDebt) DOM.statTotalDebt.textContent = formatMoney(totalDebt);
    if (DOM.statDebtorsCount) DOM.statDebtorsCount.textContent = `Qarzdorlar: ${debtors.length} ta`;

    // Low Stock List
    const lowStock = state.products.filter(p => (parseInt(p.qty) || 0) <= minStock(p));
    if (DOM.lowStockContainer) {
        if (lowStock.length === 0) {
            DOM.lowStockContainer.innerHTML = '<p class="empty-msg">Barcha mahsulotlar yetarli.</p>';
        } else {
            DOM.lowStockContainer.innerHTML = lowStock.slice(0, 6).map(p => `
                <div class="cart-row">
                    <div>
                        <strong>${escapeHtml(p.name)}</strong>
                        <div style="font-size:12px; color:var(--gray-600);">Min: ${minStock(p)} dona</div>
                    </div>
                    <span class="badge" style="background:var(--danger-light); color:var(--danger);">${p.qty} dona qoldi</span>
                </div>
            `).join('');
        }
    }

    // Debtors List
    if (DOM.debtorsContainer) {
        if (debtors.length === 0) {
            DOM.debtorsContainer.innerHTML = '<p class="empty-msg">Qarzdorlar mavjud emas.</p>';
        } else {
            DOM.debtorsContainer.innerHTML = debtors.slice(0, 5).map(d => `
                <div class="cart-row">
                    <div>
                        <strong>${escapeHtml(d.customer.name)}</strong>
                        <div style="font-size:12px; color:var(--gray-600);">${escapeHtml(d.customer.phone || '')}</div>
                    </div>
                    <strong class="text-danger">${formatMoney(d.debt)}</strong>
                </div>
            `).join('');
        }
    }

    // Recent Sales
    const recent = latestSales(activeSales, 5);
    if (DOM.recentSalesContainer) {
        if (recent.length === 0) {
            DOM.recentSalesContainer.innerHTML = '<p class="empty-msg">Hozircha sotuvlar yo\'q.</p>';
        } else {
            DOM.recentSalesContainer.innerHTML = recent.map(s => `
                <div class="cart-row">
                    <div>
                        <strong>${escapeHtml(s.name || 'Sotuv')}</strong>
                        <div style="font-size:12px; color:var(--gray-600);">${s.created || ''} • <span class="badge">${escapeHtml(s.payment || 'Naqd')}</span></div>
                    </div>
                    <strong class="text-success">${formatMoney(s.total)}</strong>
                </div>
            `).join('');
        }
    }
}

// POS KASSA
function renderPOSProducts() {
    if (!DOM.posProductsGrid) return;
    const query = DOM.posSearchInput ? DOM.posSearchInput.value.toLowerCase().trim() : '';
    const cat = DOM.posCategoryFilter ? DOM.posCategoryFilter.value : '';

    const filtered = state.products.filter(p => {
        const matchesQuery = !query ||
            (p.name && p.name.toLowerCase().includes(query)) ||
            (p.code && p.code.toLowerCase().includes(query)) ||
            (p.supplier_name && p.supplier_name.toLowerCase().includes(query)) ||
            (p.imei && p.imei.toLowerCase().includes(query));
        const matchesCat = !cat || p.cat === cat;
        return matchesQuery && matchesCat;
    }).sort(byName);

    if (filtered.length === 0) {
        DOM.posProductsGrid.innerHTML = '<p class="empty-msg">Mahsulot topilmadi.</p>';
        return;
    }

    DOM.posProductsGrid.innerHTML = filtered.map(p => {
        const outOfStock = (parseInt(p.qty) || 0) <= 0;
        return `
            <div class="product-item-card ${outOfStock ? 'out-of-stock' : ''}" onclick="addToCart('${p.id}')">
                <div>
                    <div class="product-item-title">${escapeHtml(p.name)}</div>
                    <div class="product-item-sub">SKU: ${escapeHtml(p.code || '-')} • Qoldiq: <strong>${p.qty}</strong> dona</div>
                    ${p.imei ? `<div style="font-size:11px; color:var(--success); font-weight:700;">IMEI: ${escapeHtml(p.imei)}</div>` : ''}
                </div>
                <div class="product-item-price">${formatMoney(p.sell)}</div>
            </div>
        `;
    }).join('');
}

window.addToCart = function(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return false;

    const availQty = parseInt(product.qty) || 0;
    const existing = state.cart.find(item => item.product.id === productId);

    if (existing) {
        if (existing.qty < availQty) {
            existing.qty++;
        } else {
            showToast(`Omborda faqat ${availQty} dona mavjud!`, 'warning');
            return false;
        }
    } else {
        if (availQty > 0) {
            state.cart.push({ product: product, qty: 1 });
        } else {
            showToast('Ushbu mahsulot omborda tugagan!', 'error');
            return false;
        }
    }
    renderCart(true);
    focusScanInput();
    return true;
};

function renderCart(resetPaid = true) {
    if (!DOM.cartItemsList) return;
    const totalCount = state.cart.reduce((s, i) => s + i.qty, 0);
    if (DOM.cartBadgeCount) DOM.cartBadgeCount.textContent = totalCount;

    if (state.cart.length === 0) {
        DOM.cartItemsList.innerHTML = '<p class="empty-msg">Savat bo\'sh. Chap tomondan mahsulot tanlang.</p>';
    } else {
        DOM.cartItemsList.innerHTML = state.cart.map((item, index) => `
            <div class="cart-row">
                <div style="flex:1;">
                    <strong>${escapeHtml(item.product.name)}</strong>
                    <div style="font-size:12px; color:var(--gray-600);">${formatMoney(item.product.sell)} × ${item.qty} = <strong>${formatMoney(item.product.sell * item.qty)}</strong></div>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                    <button class="cart-qty-btn" onclick="updateCartQty(${index}, -1)">-</button>
                    <span style="font-weight:700; min-width:18px; text-align:center;">${item.qty}</span>
                    <button class="cart-qty-btn" onclick="updateCartQty(${index}, 1)">+</button>
                    <button class="btn btn-xs btn-danger" onclick="removeFromCart(${index})">&times;</button>
                </div>
            </div>
        `).join('');
    }
    updateCartSummary(resetPaid);
}

window.updateCartQty = function(index, delta) {
    const item = state.cart[index];
    if (!item) return;

    if (delta > 0 && !String(item.product.id).startsWith('QUICK-')) {
        const dbProd = state.products.find(p => p.id === item.product.id);
        const maxStock = dbProd ? (parseInt(dbProd.qty) || 0) : item.product.qty;
        if (item.qty + delta > maxStock) {
            showToast(`Omborda faqat ${maxStock} dona bor!`, 'warning');
            return;
        }
    }

    item.qty += delta;
    if (item.qty <= 0) {
        state.cart.splice(index, 1);
    }
    renderCart(true);
};

window.removeFromCart = function(index) {
    state.cart.splice(index, 1);
    renderCart(true);
};

function getCartSubtotal() {
    return state.cart.reduce((sum, item) => sum + (parseFloat(item.product.sell) || 0) * item.qty, 0);
}

function updateCartSummary(resetPaid = false) {
    const subtotal = getCartSubtotal();
    let discount = parseFloat(DOM.cartDiscountInput ? DOM.cartDiscountInput.value : 0) || 0;
    if (discount < 0) { discount = 0; if (DOM.cartDiscountInput) DOM.cartDiscountInput.value = 0; }
    if (discount > subtotal) { discount = subtotal; if (DOM.cartDiscountInput) DOM.cartDiscountInput.value = subtotal; }
    const total = Math.max(0, subtotal - discount);
    const usdTotal = state.usdRate > 0 ? total / state.usdRate : 0;

    if (DOM.cartTotalDisplay) DOM.cartTotalDisplay.textContent = formatMoney(total);
    if (DOM.cartUsdTotalDisplay) DOM.cartUsdTotalDisplay.textContent = `$${usdTotal.toFixed(2)}`;

    if (resetPaid && DOM.cartPaymentSelect && DOM.cartPaidInput) {
        DOM.cartPaidInput.value = DOM.cartPaymentSelect.value === 'Qarz' ? 0 : total;
    }

    const paid = getPaidAmount(total);
    const remainingDebt = Math.max(0, total - paid);
    const change = Math.max(0, paid - total);
    if (DOM.cartDebtWarning && DOM.cartRemainingDebt) {
        const method = DOM.cartPaymentSelect ? DOM.cartPaymentSelect.value : 'Naqd';
        if (state.cart.length > 0 && remainingDebt > 0) {
            DOM.cartDebtWarning.style.display = 'block';
            DOM.cartDebtWarning.classList.remove('change');
            if (DOM.cartDebtLabel) DOM.cartDebtLabel.textContent = 'Qolgan qarz:';
            DOM.cartRemainingDebt.textContent = formatMoney(remainingDebt);
        } else if (state.cart.length > 0 && change > 0 && method !== 'Qarz') {
            DOM.cartDebtWarning.style.display = 'block';
            DOM.cartDebtWarning.classList.add('change');
            if (DOM.cartDebtLabel) DOM.cartDebtLabel.textContent = 'Qaytim:';
            DOM.cartRemainingDebt.textContent = formatMoney(change);
        } else {
            DOM.cartDebtWarning.style.display = 'none';
        }
    }
}

// Bo'sh "To'langan" maydoni = to'liq to'langan deb hisoblanadi
function getPaidAmount(total) {
    const raw = DOM.cartPaidInput ? String(DOM.cartPaidInput.value).trim() : '';
    if (raw === '') return total;
    return Math.max(0, parseFloat(raw) || 0);
}

function handleCheckout() {
    if (state.cart.length === 0) {
        showToast('Savat bo\'sh!', 'warning');
        return;
    }

    const activeShift = getOpenShift();
    if (state.shiftRequired && !activeShift) {
        showToast('Sotuv uchun avval smenani oching!', 'error');
        openShiftOpenModal();
        return;
    }

    const customerId = DOM.cartCustomerSelect ? DOM.cartCustomerSelect.value : '';
    const paymentMethod = DOM.cartPaymentSelect ? DOM.cartPaymentSelect.value : 'Naqd';
    let discount = parseFloat(DOM.cartDiscountInput ? DOM.cartDiscountInput.value : 0) || 0;
    const subtotal = getCartSubtotal();
    if (discount < 0) discount = 0;
    if (discount > subtotal) discount = subtotal;
    const total = Math.max(0, subtotal - discount);
    const paid = getPaidAmount(total);

    const zeroItem = state.cart.find(i => !(parseFloat(i.product.sell)>0) && !String(i.product.id).startsWith('QUICK-'));
    if (zeroItem) { showToast(`"${zeroItem.product.name}" narxi 0 — avval narxni belgilang!`,'error'); return; }
    const lowItem = state.cart.find(i => { const mp=parseFloat(i.product.minSellPrice)||0; return mp>0 && (parseFloat(i.product.sell)||0)<mp; });
    if (lowItem) { showToast(`"${lowItem.product.name}" minimal narxi ${formatMoney(lowItem.product.minSellPrice)} so'm!`,'error'); return; }

    if ((paymentMethod === 'Qarz' || paid < total) && !customerId) {
        showToast('To\'liq to\'lanmagan yoki nasiya savdo uchun mijozni tanlang!', 'error');
        return;
    }

    const custObj = state.customers.find(c => c.id === customerId);
    const customerName = custObj ? custObj.name : 'Naqd mijoz';

    const saleId = 'SALE-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const now = getLocalDateTime();
    const totalCost = state.cart.reduce((sum, i) => sum + (parseFloat(i.product.buy) || 0) * i.qty, 0);

    const itemsSnapshot = state.cart.map(i => ({
        product_id: i.product.id,
        name: i.product.name,
        imei: i.product.imei || '',
        qty: i.qty,
        sell: parseFloat(i.product.sell) || 0,
        buy: parseFloat(i.product.buy) || 0
    }));

    const newSale = {
        sale_item_id: saleId,
        id: saleId,
        name: state.cart.map(i => `${i.product.name} (×${i.qty})`).join(', '),
        items: itemsSnapshot,
        total: total,
        profit: total - totalCost,
        created: now,
        customer_id: customerId,
        customer_name: customerName,
        payment: paid < total && paymentMethod !== 'Qarz' ? 'Aralash/Qarz' : paymentMethod,
        method: paymentMethod,
        shift_id: activeShift ? activeShift.id : '',
        discount: discount,
        paid: Math.min(total, Math.max(0, paid)),
        received: paid,
        returned: 0,
        updated: now
    };

    // Deduct Stock
    state.cart.forEach(item => {
        const prod = state.products.find(p => p.id === item.product.id);
        if (prod && !String(prod.id).startsWith('QUICK-')) {
            prod.qty = Math.max(0, (parseInt(prod.qty) || 0) - item.qty);
            prod.updated = now;
            syncDoc('products', prod.id, prod);
        }
    });

    state.sales.push(newSale);
    syncDoc('sales', saleId, newSale);

    showReceipt(newSale);
    showToast('Sotuv muvaffaqiyatli yakunlandi!');
    if (state.autoPrint) printReceipt(newSale);

    state.cart = [];
    if (DOM.cartDiscountInput) DOM.cartDiscountInput.value = 0;
    if (DOM.cartCustomerSelect) DOM.cartCustomerSelect.value = '';
    if (DOM.cartPaymentSelect) DOM.cartPaymentSelect.value = 'Naqd';
    renderAll();
}

function handleQuickSaleSubmit() {
    const name = DOM.quickSaleName.value.trim() || 'Tezkor sotuv';
    const amount = parseFloat(DOM.quickSaleAmount.value);
    if (!amount || amount <= 0) {
        showToast('Summani to\'g\'ri kiriting!', 'error');
        return;
    }

    state.cart.push({
        product: {
            id: 'QUICK-' + Date.now(),
            name: name,
            sell: amount,
            buy: 0,
            qty: 9999
        },
        qty: 1
    });

    DOM.quickSaleModal.classList.remove('active');
    renderCart(true);
    showToast('Savatga qo\'shildi');
}

// PRODUCTS TABLE
function renderProductsTable() {
    if (!DOM.productsTableBody) return;
    const query = DOM.productsSearchInput ? DOM.productsSearchInput.value.toLowerCase().trim() : '';
    const cat = DOM.productsCatFilter ? DOM.productsCatFilter.value : '';

    const filtered = state.products.filter(p => {
        const matchQ = !query ||
            (p.name && p.name.toLowerCase().includes(query)) ||
            (p.code && p.code.toLowerCase().includes(query)) ||
            (p.supplier_name && p.supplier_name.toLowerCase().includes(query)) ||
            (p.imei && p.imei.toLowerCase().includes(query));
        const matchCat = !cat || p.cat === cat;
        return matchQ && matchCat;
    }).sort(byName);

    if (filtered.length === 0) {
        DOM.productsTableBody.innerHTML = '<tr><td colspan="8" class="text-center">Mahsulotlar topilmadi.</td></tr>';
        return;
    }

    DOM.productsTableBody.innerHTML = filtered.map(p => {
        const isLow = (parseInt(p.qty) || 0) <= minStock(p);
        return `
            <tr>
                <td><strong>${escapeHtml(p.name)}</strong>${p.supplier_name ? `<br><small class="text-success"><i class="fa-solid fa-truck"></i> ${escapeHtml(p.supplier_name)}</small>` : ''}</td>
                <td>${escapeHtml(p.code || '-')}</td>
                <td>${p.imei ? `<span class="badge" style="background:var(--success-light); color:var(--success);">${escapeHtml(p.imei)}</span>` : '-'}</td>
                <td>${escapeHtml(p.cat || 'Umumiy')}</td>
                <td>${formatMoney(p.buy)}</td>
                <td><strong class="text-primary">${formatMoney(p.sell)}</strong></td>
                <td><strong class="${isLow ? 'text-danger' : ''}">${p.qty} dona</strong></td>
                <td>
                    <button class="btn btn-xs btn-outline green-btn" title="Omborga kirim" onclick="openStockIncomeModal('${p.id}')"><i class="fa-solid fa-arrow-down"></i></button>
                    <button class="btn btn-xs btn-outline blue-btn" title="Barcode yorlig'i" onclick="openProductLabel('${p.id}')"><i class="fa-solid fa-barcode"></i></button>
                    <button class="btn btn-xs btn-secondary" onclick="openProductModal('${p.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-xs btn-danger" onclick="deleteProduct('${p.id}')"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

window.openProductModal = function(prodId = null) {
    if (!DOM.productModal) return;
    DOM.prodId.value = prodId || '';
    updateSupplierDropdowns();
    if (prodId) {
        const p = state.products.find(item => item.id === prodId);
        if (p) {
            DOM.productModalTitle.textContent = 'Mahsulotni tahrirlash';
            DOM.prodName.value = p.name || '';
            DOM.prodCode.value = p.code || '';
            DOM.prodImei.value = p.imei || '';
            DOM.prodCatSelect.value = p.cat || '';
            if (DOM.prodSupplierSelect) DOM.prodSupplierSelect.value = p.supplier_name || '';
            if (DOM.prodMinSell) DOM.prodMinSell.value = p.minSellPrice || '';
            DOM.prodBuy.value = p.buy || 0;
            DOM.prodSell.value = p.sell || 0;
            DOM.prodQty.value = p.qty || 0;
            DOM.prodMin.value = minStock(p);
        }
    } else {
        DOM.productModalTitle.textContent = 'Yangi mahsulot';
        DOM.prodName.value = '';
        DOM.prodCode.value = generateUniqueSKU();
        DOM.prodImei.value = '';
        DOM.prodCatSelect.value = '';
        if (DOM.prodSupplierSelect) DOM.prodSupplierSelect.value = '';
        if (DOM.prodMinSell) DOM.prodMinSell.value = '';
        DOM.prodBuy.value = '';
        DOM.prodSell.value = '';
        DOM.prodQty.value = 1;
        DOM.prodMin.value = 2;
    }
    DOM.productModal.classList.add('active');
};

function handleSaveProduct() {
    const name = DOM.prodName.value.trim();
    const sell = parseFloat(DOM.prodSell.value) || 0;
    if (!name || sell <= 0) {
        showToast('Mahsulot nomi va sotuv narxini kiriting!', 'error');
        return;
    }

    const id = DOM.prodId.value || 'PROD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const now = getLocalDateTime();

    // Bir xil shtrix-kod / IMEI ikki mahsulotda bo'lsa, skaner adashadi
    const codeVal = DOM.prodCode.value.trim();
    const imeiVal = DOM.prodImei.value.trim();
    const dup = state.products.find(p => p.id !== id && (
        (codeVal && normCode(p.code) === normCode(codeVal)) ||
        (imeiVal && normCode(p.imei) === normCode(imeiVal))
    ));
    if (dup) {
        showToast(`Bu shtrix-kod/IMEI "${dup.name}" mahsulotida allaqachon bor!`, 'error');
        return;
    }
    const minVal = parseInt(DOM.prodMin.value);
    const minSellVal = parseFloat(DOM.prodMinSell ? DOM.prodMinSell.value : 0) || 0;

    const productObj = {
        id: id,
        name: name,
        code: DOM.prodCode.value.trim(),
        imei: DOM.prodImei.value.trim(),
        cat: DOM.prodCatSelect.value || 'Umumiy',
        supplier_name: DOM.prodSupplierSelect ? DOM.prodSupplierSelect.value : '',
        buy: parseFloat(DOM.prodBuy.value) || 0,
        sell: sell,
        qty: parseInt(DOM.prodQty.value) || 0,
        min: isNaN(minVal) ? 2 : minVal,
        minSellPrice: minSellVal,
        minSellPrice: minSellVal,
        minSellPrice: minSellVal,
        updated: now
    };

    const idx = state.products.findIndex(p => p.id === id);
    if (idx >= 0) {
        state.products[idx] = productObj;
    } else {
        state.products.push(productObj);
    }

    syncDoc('products', id, productObj);
    DOM.productModal.classList.remove('active');
    renderAll();
    showToast('Mahsulot saqlandi!');
}

window.deleteProduct = function(id) {
    if (!confirm('Ushbu mahsulotni o\'chirishni tasdiqlaysizmi?')) return;
    state.products = state.products.filter(p => p.id !== id);
    deleteSyncDoc('products', id);
    renderAll();
    showToast('Mahsulot o\'chirildi', 'warning');
};

// CATALOGS MANAGEMENT
function renderCatalogModalList() {
    if (!DOM.catalogListContainer) return;
    DOM.catalogListContainer.innerHTML = state.categories.map(c => `
        <div class="cart-row">
            <strong>${escapeHtml(c)}</strong>
            <button class="btn btn-xs btn-danger" data-cat="${escapeHtml(c)}" onclick="deleteCatalog(this.dataset.cat)"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
}

function handleAddCatalog() {
    const catName = DOM.newCatalogInput.value.trim();
    if (!catName) return;
    if (!state.categories.includes(catName)) {
        state.categories.push(catName);
        syncDoc('categories', catName, { name: catName });
        DOM.newCatalogInput.value = '';
        renderCatalogModalList();
        updateCategoryDropdowns();
        showToast('Kategoriya qo\'shildi');
    }
}

window.deleteCatalog = function(catName) {
    state.categories = state.categories.filter(c => c !== catName);
    deleteSyncDoc('categories', catName);
    renderCatalogModalList();
    updateCategoryDropdowns();
};

function updateCategoryDropdowns() {
    const opts = state.categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
    const filterHtml = '<option value="">Barcha kataloglar</option>' + opts;
    const fill = (el, html) => {
        if (!el) return;
        const prev = el.value;
        el.innerHTML = html;
        if (prev && state.categories.includes(prev)) el.value = prev;
    };
    fill(DOM.posCategoryFilter, filterHtml);
    fill(DOM.productsCatFilter, filterHtml);
    fill(DOM.prodCatSelect, '<option value="">Kategoriya tanlang</option>' + opts);
}

// SALES HISTORY, RETURNS & EXPENSES
window.reprintReceipt = function(saleId) {
    const sale = state.sales.find(s => s.id === saleId);
    if (sale) showReceipt(sale);
};

window.returnSale = function(saleId) {
    if (!confirm('Ushbu sotuvni bekor qilib, mahsulotlarni omborga qaytarishni (Vozvrat) tasdiqlaysizmi?')) return;
    const sale = state.sales.find(s => s.id === saleId);
    if (!sale || sale.returned === 1) return;

    const retNow = getLocalDateTime();
    sale.returned = 1;
    sale.returned_at = retNow;
    sale.updated = retNow;
    if (Array.isArray(sale.items) && sale.items.length > 0) {
        sale.items.forEach(item => {
            if (!item.product_id) return;
            const prod = state.products.find(p => p.id === item.product_id);
            if (prod && !String(prod.id).startsWith('QUICK-')) {
                prod.qty = (parseInt(prod.qty)||0) + Math.max(0, parseInt(item.qty)||0);
                prod.updated = retNow;
                syncDoc('products', prod.id, prod);
            }
        });
    }

    syncDoc('sales', sale.id, sale);
    renderAll();
    showToast('Sotuv qaytarildi va qoldiq tiklandi!', 'warning');
};

function handleSaveExpense() {
    const note = DOM.expenseNoteInput.value.trim();
    const amount = parseFloat(DOM.expenseAmountInput.value) || 0;
    if (!note || amount <= 0) {
        showToast('Xarajat sababi va summasini kiriting!', 'error');
        return;
    }

    const id = 'EXP-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const now = getLocalDateTime();
    const expObj = { id, note, amount, created: now };

    state.expenses.push(expObj);
    syncDoc('expenses', id, expObj);
    DOM.expenseModal.classList.remove('active');
    renderAll();
    showToast('Xarajat kiritildi');
}

window.deleteExpense = function(id) {
    if (!confirm('Xarajatni o\'chirasizmi?')) return;
    state.expenses = state.expenses.filter(e => e.id !== id);
    deleteSyncDoc('expenses', id);
    renderAll();
};

// CUSTOMERS TABLE & DEBT
function renderCustomersTable(debtorsOnly = false) {
    if (!DOM.customersTableBody) return;
    const debtMap = buildDebtMap();
    const list = state.customers.map(c => ({
        customer: c,
        debt: calculateCustomerDebt(c, debtMap)
    })).filter(item => !debtorsOnly || item.debt > 0)
      .sort((a, b) => byName(a.customer, b.customer));

    if (list.length === 0) {
        DOM.customersTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Mijozlar topilmadi.</td></tr>';
    } else {
        DOM.customersTableBody.innerHTML = list.map(item => `
            <tr>
                <td><strong>${escapeHtml(item.customer.name)}</strong></td>
                <td>${escapeHtml(item.customer.phone || '-')}</td>
                <td><strong class="${item.debt > 0 ? 'text-danger' : 'text-success'}">${formatMoney(item.debt)}</strong></td>
                <td>
                    ${item.debt > 0 ? `<button class="btn btn-xs btn-success" onclick="openPayDebtModal('${item.customer.id}')"><i class="fa-solid fa-hand-holding-dollar"></i> To'lov</button>` : '<span class="badge">Qarzi yo\'q</span>'}
                    <button class="btn btn-xs btn-secondary" onclick="openCustomerModal('${item.customer.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-xs btn-danger" onclick="deleteCustomer('${item.customer.id}')"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    if (DOM.cartCustomerSelect) {
        const currentVal = DOM.cartCustomerSelect.value;
        DOM.cartCustomerSelect.innerHTML = '<option value="">Naqd mijoz</option>' + state.customers.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)} ${c.phone ? '(' + escapeHtml(c.phone) + ')' : ''}</option>`).join('');
        DOM.cartCustomerSelect.value = currentVal;
    }
}

window.openCustomerModal = function(custId = null) {
    if (!DOM.customerModal) return;
    DOM.custIdInput.value = custId || '';
    if (custId) {
        const c = state.customers.find(x => x.id === custId);
        if (c) {
            DOM.customerModalTitle.textContent = 'Mijozni tahrirlash';
            DOM.custNameInput.value = c.name || '';
            DOM.custPhoneInput.value = c.phone || '';
        }
    } else {
        DOM.customerModalTitle.textContent = 'Yangi mijoz qo\'shish';
        DOM.custNameInput.value = '';
        DOM.custPhoneInput.value = '+998 ';
    }
    DOM.customerModal.classList.add('active');
};

function handleSaveCustomer() {
    const name = DOM.custNameInput.value.trim();
    const phone = DOM.custPhoneInput.value.trim();
    if (!name) {
        showToast('Mijoz ismini kiriting!', 'error');
        return;
    }

    const id = DOM.custIdInput.value || 'CUST-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const now = getLocalDateTime();
    const custObj = { id, name, phone, updated: now };

    const idx = state.customers.findIndex(c => c.id === id);
    if (idx >= 0) {
        state.customers[idx] = custObj;
    } else {
        state.customers.push(custObj);
    }

    syncDoc('customers', id, custObj);
    DOM.customerModal.classList.remove('active');
    renderAll();
    if (DOM.cartCustomerSelect) DOM.cartCustomerSelect.value = id;
    showToast('Mijoz saqlandi!');
}

window.deleteCustomer = function(id) {
    const cust = state.customers.find(c => c.id === id);
    if (cust && calculateCustomerDebt(cust) > 0) {
        showToast('Mijozda to\'lanmagan qarz bor! Avval qarzni yoping.', 'error');
        return;
    }
    if (!confirm('Mijozni o\'chirishni tasdiqlaysizmi?')) return;
    state.customers = state.customers.filter(c => c.id !== id);
    deleteSyncDoc('customers', id);
    renderAll();
};

window.openPayDebtModal = function(custId) {
    const cust = state.customers.find(c => c.id === custId);
    if (!cust) return;
    const debt = calculateCustomerDebt(cust);

    DOM.debtCustId.value = cust.id;
    DOM.debtCustName.textContent = cust.name;
    DOM.debtCustTotal.textContent = formatMoney(debt);
    DOM.debtPayAmount.value = debt;
    DOM.payDebtModal.classList.add('active');
};

function handleSubmitPayDebt() {
    const custId = DOM.debtCustId.value;
    const amount = parseFloat(DOM.debtPayAmount.value) || 0;
    if (amount <= 0) {
        showToast('To\'lov summasini kiriting!', 'error');
        return;
    }

    const id = 'DEBT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const now = getLocalDateTime();

    const paymentObj = {
        id: id,
        customer_id: custId,
        amount: amount,
        created: now,
        updated: now
    };

    state.debtPayments.push(paymentObj);
    syncDoc('debt_payments', id, paymentObj);

    DOM.payDebtModal.classList.remove('active');
    renderAll();
    showToast('Qarz to\'lovi qabul qilindi!');
}

// MOBILE REPORTS RENDERER
function renderMobileReports() {
    if (!DOM.reportsMobileContainer) return;
    const activeSales = state.sales.filter(s => s.returned !== 1);
    const totalRev = activeSales.reduce((s, x) => s + (parseFloat(x.total) || 0), 0);
    const totalProf = activeSales.reduce((s, x) => s + (parseFloat(x.profit) || 0), 0);
    const totalExp = state.expenses.reduce((s, x) => s + (parseFloat(x.amount) || 0), 0);

    DOM.reportsMobileContainer.innerHTML = `
        <div class="stats-grid">
            <div class="card card-body">
                <span class="stat-label">Umumiy savdo aylanmasi</span>
                <h3 class="text-primary">${formatMoney(totalRev)}</h3>
            </div>
            <div class="card card-body">
                <span class="stat-label">Umumiy yalpi foyda</span>
                <h3 class="text-success">${formatMoney(totalProf)}</h3>
            </div>
            <div class="card card-body">
                <span class="stat-label">Jami xarajatlar</span>
                <h3 class="text-danger">${formatMoney(totalExp)}</h3>
            </div>
            <div class="card card-body">
                <span class="stat-label">Sof qolgan foyda</span>
                <h3 class="text-success">${formatMoney(totalProf - totalExp)}</h3>
            </div>
        </div>
    `;
}

// ====================================================================
// BARCODE SKANER (USB skaner + kamera)
// ====================================================================
let audioCtx = null;
function beep(ok = true) {
    if (!state.soundOn) return;
    try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.value = ok ? 1800 : 280;
        gain.gain.value = 0.05;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + (ok ? 0.08 : 0.3));
    } catch (e) { /* ovoz ishlamasa ham muammo emas */ }
}

function normCode(s) {
    return String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f]/g, '').trim().toLowerCase();
}

function stripLeadingZeros(s) {
    return /^\d+$/.test(s) ? s.replace(/^0+/, '') : s;
}

function findProductByCode(raw) {
    const q = normCode(raw);
    if (!q) return null;
    let m = state.products.find(p => normCode(p.code) === q || normCode(p.imei) === q || normCode(p.id) === q);
    if (m) return m;
    // EAN-13 / UPC-A farqi (oldidagi nollar) uchun
    if (/^\d{6,}$/.test(q)) {
        const qz = stripLeadingZeros(q);
        m = state.products.find(p =>
            (p.code && stripLeadingZeros(normCode(p.code)) === qz) ||
            (p.imei && stripLeadingZeros(normCode(p.imei)) === qz));
    }
    return m || null;
}

function isPOSActive() {
    const sec = document.getElementById('pos-section');
    return !!sec && sec.classList.contains('active');
}

function anyModalActive() {
    return !!document.querySelector('.modal.active');
}

function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function focusScanInput() {
    if (!DOM.posSearchInput || !isPOSActive() || anyModalActive() || isTouchDevice()) return;
    DOM.posSearchInput.focus();
}

// Skanerdan (yoki qo'lda) kelgan kodni qayta ishlash
let _lastScanCode = '';
let _lastScanTime = 0;
const SCAN_DEBOUNCE_MS = 120;

function handleScan(raw, opts = {}) {
    const code = String(raw == null ? '' : raw).replace(/[\u0000-\u001f\u007f]/g, '').trim();
    if (!code) return false;
    if (!opts.fromCamera && !opts.fromInput) {
        const _n = Date.now();
        if (code === _lastScanCode && _n - _lastScanTime < SCAN_DEBOUNCE_MS) return false;
        _lastScanCode = code; _lastScanTime = _n;
    }

    const addAndReport = (product) => {
        const added = addToCart(product.id);
        beep(added);
        if (added && opts.fromCamera) showToast(`${product.name} — savatga qo'shildi`);
        if (opts.fromInput && DOM.posSearchInput) {
            DOM.posSearchInput.value = '';
            renderPOSProducts();
        }
        return added;
    };

    const exact = findProductByCode(code);
    if (exact) return addAndReport(exact);

    // Nomi bo'yicha yozilgan bo'lsa: bitta natija bo'lsa, o'shani qo'shamiz
    if (opts.fromInput) {
        const q = code.toLowerCase();
        const partial = state.products.filter(p => (p.name || '').toLowerCase().includes(q));
        if (partial.length === 1) return addAndReport(partial[0]);
        if (partial.length > 1) {
            showToast(`${partial.length} ta mahsulot topildi — keraklisini tanlang`, 'warning');
            return false;
        }
    }

    beep(false);
    showToast(`Shtrix-kod bo'yicha mahsulot topilmadi: ${code}`, 'error');
    if (opts.fromInput && DOM.posSearchInput) DOM.posSearchInput.select();
    return false;
}

function closeAllModals() {
    stopCameraScan();
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    focusScanInput();
}

function setupScanner() {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const lm = document.getElementById('label-modal');
            if (lm && lm.classList.contains('active')) lm.classList.remove('active');
            else if (anyModalActive()) closeAllModals();
            return;
        }
        // Kassa ochiq, kursor hech qayerda bo'lmasa — skaner kodi yo'qolmasligi uchun
        // qidiruv maydoniga o'tkazamiz (birinchi belgi ham shu maydonga tushadi).
        if (!isPOSActive() || anyModalActive() || !DOM.posSearchInput) return;
        if (e.ctrlKey || e.altKey || e.metaKey || e.key.length !== 1) return;
        const t = e.target;
        const tag = (t && t.tagName) || '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
        DOM.posSearchInput.focus();
    });

    // Sahifaga qaytilganda ham skanerga tayyor turish
    window.addEventListener('focus', () => setTimeout(focusScanInput, 50));
}

let camStream = null;
let camTimer = null;
let camLast = { code: '', t: 0 };

async function startCameraScan() {
    if (!('BarcodeDetector' in window)) {
        showToast('Bu brauzer kamera orqali skanerlashni qo\'llamaydi (Chrome / Android tavsiya etiladi). USB skaner ishlayveradi.', 'warning');
        return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast('Kamera faqat HTTPS (xavfsiz) ulanishda ishlaydi.', 'error');
        return;
    }
    try {
        camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        DOM.scannerVideo.srcObject = camStream;
        DOM.scannerModal.classList.add('active');
        await DOM.scannerVideo.play();
        const detector = new BarcodeDetector();
        camTimer = setInterval(async () => {
            try {
                const found = await detector.detect(DOM.scannerVideo);
                if (!found.length) return;
                const code = found[0].rawValue;
                const now = Date.now();
                if (code !== camLast.code || now - camLast.t > 2000) {
                    camLast = { code, t: now };
                    handleScan(code, { fromCamera: true });
                }
            } catch (e) { /* keyingi kadrda qayta uriniladi */ }
        }, 250);
    } catch (e) {
        stopCameraScan();
        showToast('Kameraga ruxsat berilmadi yoki kamera topilmadi.', 'error');
    }
}

function stopCameraScan() {
    if (camTimer) { clearInterval(camTimer); camTimer = null; }
    if (camStream) { camStream.getTracks().forEach(t => t.stop()); camStream = null; }
    if (DOM.scannerVideo) DOM.scannerVideo.srcObject = null;
    if (DOM.scannerModal) DOM.scannerModal.classList.remove('active');
}

// ====================================================================
// CHEK — Xprinter XP-80T (80 mm) uchun
// ====================================================================
let currentReceiptSale = null;

const RECEIPT_CSS = `
.rc, .rc * { box-sizing: border-box; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; color: #000; margin: 0; padding: 0; }
.rc { width: var(--w, 72mm); margin: 0 auto; padding: 2mm 1.5mm 8mm; font-size: var(--fs, 12.5px); line-height: 1.35; background: #fff; text-align: left; }
.rc .c { text-align: center; }
.rc .shop { font-size: calc(var(--fs, 12.5px) * 1.6); font-weight: 800; letter-spacing: .5px; text-transform: uppercase; line-height: 1.15; word-break: break-word; }
.rc .sub { font-size: calc(var(--fs, 12.5px) * .92); margin-top: 2px; }
.rc .hr { border: 0; border-top: 1px dashed #000; margin: 6px 0; height: 0; }
.rc .hr.solid { border-top: 1px solid #000; }
.rc .hr.dbl { border-top: 3px double #000; }
.rc .title { text-align: center; font-weight: 800; letter-spacing: 2px; font-size: calc(var(--fs, 12.5px) * 1.05); }
.rc .row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
.rc .row > :first-child { flex: 1 1 auto; min-width: 0; }
.rc .row > b { white-space: nowrap; font-weight: 800; }
.rc .meta .row { font-size: calc(var(--fs, 12.5px) * .95); margin: 1px 0; }
.rc .meta .row > span:last-child { text-align: right; word-break: break-word; font-weight: 700; }
.rc .it { margin: 5px 0; }
.rc .it .nm { font-weight: 700; word-break: break-word; }
.rc .it .imei { font-size: calc(var(--fs, 12.5px) * .88); }
.rc .it .ln { display: flex; justify-content: space-between; gap: 8px; margin-top: 1px; }
.rc .it .ln b { white-space: nowrap; }
.rc .sum .row { margin: 2px 0; }
.rc .total { border: 2px solid #000; padding: 5px 7px; margin: 7px 0 4px; display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: calc(var(--fs, 12.5px) * 1.35); font-weight: 800; }
.rc .total span:last-child { white-space: nowrap; }
.rc .usd { text-align: right; font-size: calc(var(--fs, 12.5px) * .9); }
.rc .debt { border: 2px dashed #000; padding: 4px 7px; margin: 6px 0 2px; display: flex; justify-content: space-between; gap: 8px; font-weight: 800; font-size: calc(var(--fs, 12.5px) * 1.1); text-transform: uppercase; }
.rc .stamp { text-align: center; border: 2px solid #000; padding: 3px; margin: 6px 0; font-weight: 800; letter-spacing: 2px; }
.rc .thanks { text-align: center; font-weight: 800; margin-top: 8px; font-size: calc(var(--fs, 12.5px) * 1.1); word-break: break-word; }
.rc .small { text-align: center; font-size: calc(var(--fs, 12.5px) * .85); margin-top: 3px; }
.rc .sig { margin-top: 16px; border-top: 1px solid #000; padding-top: 2px; text-align: center; font-size: calc(var(--fs, 12.5px) * .85); }
`;

function injectReceiptStyle() {
    if (document.getElementById('receipt-style')) return;
    const st = document.createElement('style');
    st.id = 'receipt-style';
    st.textContent = RECEIPT_CSS + (typeof LABEL_CSS === 'string' ? LABEL_CSS : '');
    document.head.appendChild(st);
}

function paperConfig() {
    // 80 mm qog'ozda printerning bosiladigan kengligi ~72 mm (576 nuqta); 58 mm da ~48 mm
    return state.paperWidth === '58'
        ? { w: '48mm', fs: '11px' }
        : { w: '72mm', fs: '12.5px' };
}

function fmtNum(v) {
    return Math.round(parseFloat(v) || 0).toLocaleString('en-US').replace(/,/g, ' ');
}

function fmtReceiptDate(str) {
    const m = String(str || '').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
    return m ? `${m[3]}.${m[2]}.${m[1]} ${m[4]}:${m[5]}` : String(str || '');
}

function buildReceiptHTML(sale) {
    const n = v => parseFloat(v) || 0;
    const total = n(sale.total);
    const discount = n(sale.discount);
    const paid = sale.paid !== undefined ? n(sale.paid) : (sale.payment === 'Qarz' ? 0 : total);
    const received = sale.received !== undefined ? n(sale.received) : paid;
    const debt = Math.max(0, total - paid);
    const change = received > total && sale.payment !== 'Qarz' ? received - total : 0;

    const items = Array.isArray(sale.items) && sale.items.length ? sale.items : null;
    const itemsHtml = items
        ? items.map((it, i) => {
            const qty = n(it.qty), sell = n(it.sell);
            return `<div class="it">
                <div class="nm">${i + 1}. ${escapeHtml(it.name)}</div>
                ${it.imei ? `<div class="imei">IMEI: ${escapeHtml(it.imei)}</div>` : ''}
                <div class="ln"><span>${fmtNum(qty)} × ${fmtNum(sell)}</span><b>${fmtNum(qty * sell)}</b></div>
            </div>`;
        }).join('')
        : `<div class="it"><div class="nm">${escapeHtml(sale.name || 'Sotuv')}</div></div>`;

    const subtotal = items ? items.reduce((s, it) => s + n(it.qty) * n(it.sell), 0) : total + discount;
    const usd = state.usdRate > 0 ? total / state.usdRate : 0;
    const footerLines = String(state.receiptFooter || '').split('\n').map(l => l.trim()).filter(Boolean);

    return `
        <div class="c">
            <div class="shop">${escapeHtml(state.shopName)}</div>
            ${state.shopAddress ? `<div class="sub">${escapeHtml(state.shopAddress)}</div>` : ''}
            ${state.shopPhone ? `<div class="sub">Tel: ${escapeHtml(state.shopPhone)}</div>` : ''}
        </div>
        <div class="hr dbl"></div>
        <div class="title">SAVDO CHEKI</div>
        ${sale.returned === 1 ? '<div class="stamp">QAYTARILGAN</div>' : ''}
        <div class="hr"></div>
        <div class="meta">
            <div class="row"><span>Chek №:</span><span>${escapeHtml(sale.id || '')}</span></div>
            <div class="row"><span>Sana:</span><span>${escapeHtml(fmtReceiptDate(sale.created))}</span></div>
            <div class="row"><span>Mijoz:</span><span>${escapeHtml(sale.customer_name || 'Naqd mijoz')}</span></div>
        </div>
        <div class="hr solid"></div>
        ${itemsHtml}
        <div class="hr solid"></div>
        <div class="sum">
            ${discount > 0 ? `
            <div class="row"><span>Mahsulotlar summasi:</span><span>${fmtNum(subtotal)}</span></div>
            <div class="row"><span>Chegirma:</span><span>-${fmtNum(discount)}</span></div>` : ''}
        </div>
        <div class="total"><span>JAMI:</span><span>${fmtNum(total)} so'm</span></div>
        <div class="usd">≈ $${usd.toFixed(2)}</div>
        <div class="hr"></div>
        <div class="sum">
            <div class="row"><span>To'lov turi:</span><b>${escapeHtml(sale.payment || 'Naqd')}</b></div>
            <div class="row"><span>To'landi:</span><b>${fmtNum(paid)} so'm</b></div>
            ${change > 0 ? `<div class="row"><span>Qaytim:</span><b>${fmtNum(change)} so'm</b></div>` : ''}
        </div>
        ${debt > 0 ? `<div class="debt"><span>Qarz qoldi:</span><span>${fmtNum(debt)} so'm</span></div>` : ''}
        <div class="hr dbl"></div>
        ${footerLines.map((l, i) => i === 0 ? `<div class="thanks">${escapeHtml(l)}</div>` : `<div class="small">${escapeHtml(l)}</div>`).join('')}
    `;
}

function receiptWrapperHTML(sale) {
    const cfg = paperConfig();
    return `<div class="rc" style="--w:${cfg.w}; --fs:${cfg.fs};">${buildReceiptHTML(sale)}</div>`;
}

function showReceipt(sale) {
    currentReceiptSale = sale;
    if (DOM.receiptPaper) DOM.receiptPaper.innerHTML = receiptWrapperHTML(sale);
    if (DOM.receiptModal) DOM.receiptModal.classList.add('active');
}

// Faqat chekning o'zini chop etadi (butun sahifani emas) — yashirin iframe orqali
// Desktop (.exe) versiyada printerlar ro'yxatini olish
async function loadPrinterList() {
    if (!(window.electronAPI && window.electronAPI.getPrinters) || !DOM.settingPrinter) return;
    try {
        const list = await window.electronAPI.getPrinters();
        DOM.settingPrinter.innerHTML = '<option value="">Standart printer</option>' +
            list.map(p => `<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)}${p.isDefault ? ' (standart)' : ''}</option>`).join('');
        DOM.settingPrinter.value = state.printerName;
        if (DOM.printerSelectWrap) DOM.printerSelectWrap.style.display = 'flex';
    } catch (e) { /* oddiy brauzer rejimiga qaytamiz */ }
}

// Har qanday hujjatni (chek, yorliq) faqat o'zini chop etadi — butun sahifani emas
// isLabel: true bo'lsa 30×40mm qog'oz o'lchami ishlatiladi, false bo'lsa chek (80mm yoki 58mm rulon)
function printDocument(bodyHtml, title, isLabel) {
    const receiptWidthMm = state.paperWidth === '58' ? 58 : 80;
    // @page: chek uchun rulon (balandlik auto), barcode uchun qattiq 30×40mm
    const pageRule = isLabel
        ? '@page { margin: 0; size: 40mm 30mm; }'
        : `@page { margin: 0; size: ${receiptWidthMm}mm auto; }`;

    const html = `<!DOCTYPE html><html lang="uz"><head><meta charset="UTF-8">
<title>${escapeHtml(title || 'Chop etish')}</title>
<style>
${pageRule}
html, body { margin: 0; padding: 0; background: #fff; }
${RECEIPT_CSS}
${LABEL_CSS}
</style></head><body>${bodyHtml}</body></html>`;

    // Desktop (.exe): oynasiz, to'g'ridan-to'g'ri tanlangan printerga
    if (window.electronAPI && window.electronAPI.printHtml) {
        const widthMm  = isLabel ? 30 : receiptWidthMm;
        const heightMm = isLabel ? 40 : undefined;
        window.electronAPI.printHtml({
            html,
            printerName: state.printerName,
            widthMm,
            heightMm,
            isLabel
        }).then(r => {
            if (!r || !r.success) showToast('Chop etilmadi: ' + ((r && r.reason) || 'printerni tekshiring'), 'error');
        }).catch(() => showToast('Printerga ulanib bo\'lmadi', 'error'));
        return;
    }

    // Brauzer: yashirin iframe — onload'da print() (font/SVG yuklanib bo'lganida)
    const old = document.getElementById('print-frame');
    if (old) old.remove();
    const frame = document.createElement('iframe');
    frame.id = 'print-frame';
    frame.setAttribute('aria-hidden', 'true');
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0;pointer-events:none;';
    document.body.appendChild(frame);

    frame.onload = () => {
        try {
            frame.contentWindow.focus();
            frame.contentWindow.print();
        } catch (e) {
            showToast('Chop etishda xatolik yuz berdi', 'error');
        }
        setTimeout(() => { if (frame.parentNode) frame.remove(); }, 90000);
    };

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    frame.src = URL.createObjectURL(blob);
}

function printReceipt(sale) {
    sale = sale || currentReceiptSale;
    if (!sale) {
        showToast('Chop etish uchun chek yo\'q', 'warning');
        return;
    }
    printDocument(receiptWrapperHTML(sale), 'Chek ' + (sale.id || ''), false);
}

function printTestReceipt() {
    const now = getLocalDateTime();
    const demo = {
        id: 'TEST-0001',
        created: now,
        customer_name: 'Sinov mijoz',
        items: [
            { name: 'Samsung Galaxy A15 128GB', imei: '356938035643809', qty: 1, sell: 2450000 },
            { name: 'Himoya oynasi (Premium)', qty: 2, sell: 35000 }
        ],
        discount: 20000,
        total: 2500000,
        payment: 'Aralash/Qarz',
        paid: 2000000,
        received: 2000000
    };
    showReceipt(demo);
    printReceipt(demo);
}

// EXPORT & BACKUP TOOLS
window.exportSalesCSV = function() {
    if (state.sales.length === 0) {
        showToast('Eksport qilish uchun sotuvlar yo\'q!', 'warning');
        return;
    }
    const headers = ['ID', 'Sana', 'Mahsulotlar', 'Mijoz', 'Tolov turi', 'Jami summa', 'Tolandi', 'Sof Foyda', 'Holati'];
    const rows = state.sales.map(s => [
        s.id,
        s.created,
        `"${(s.name || '').replace(/"/g, '""')}"`,
        `"${(s.customer_name || '').replace(/"/g, '""')}"`,
        s.payment,
        s.total,
        s.paid !== undefined ? s.paid : s.total,
        s.profit || 0,
        s.returned === 1 ? 'Qaytarilgan' : 'Faol'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Savdolar_${getLocalDateTime().substring(0, 10)}.csv`;
    a.click();
    showToast('Excel (CSV) fayl yuklab olindi!');
};

window.backupDatabase = function() {
    const backup = {
        shopName: state.shopName,
        usdRate: state.usdRate,
        products: state.products,
        customers: state.customers,
        sales: state.sales,
        expenses: state.expenses,
        debtPayments: state.debtPayments,
        categories: state.categories,
        suppliers: state.suppliers,
        stockIncome: state.stockIncome,
        shifts: state.shifts,
        exportedAt: getLocalDateTime()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `DokonimPOS_Backup_${getLocalDateTime().substring(0, 10)}.json`;
    a.click();
    showToast('Zaxira nusxa yuklab olindi!');
};

window.restoreDatabase = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.products) state.products = data.products;
            if (data.customers) state.customers = data.customers;
            if (data.sales) state.sales = data.sales;
            if (data.expenses) state.expenses = data.expenses;
            if (data.debtPayments) state.debtPayments = data.debtPayments;
            if (data.categories) state.categories = data.categories;
            if (data.suppliers) state.suppliers = data.suppliers;
            if (data.stockIncome) state.stockIncome = data.stockIncome;
            if (data.shifts) state.shifts = data.shifts;
            if (data.shopName) { state.shopName = data.shopName; localStorage.setItem('pos_shop_name', state.shopName); }
            saveLocalData();
            syncAllToCloud();
            updateUIHeader();
            renderAll();
            showToast('Ma\'lumotlar bazasi muvaffaqiyatli tiklandi!');
        } catch (err) {
            showToast('Noto\'g\'ri JSON fayl!', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
};

function syncAllToCloud() {
    if (!(state.currentUser && state.shopId && db && setDoc && doc)) return;
    const put = (col, id, data) => setDoc(doc(db, 'shops', state.shopId, col, String(id)), data, { merge: true }).catch(() => {});
    state.products.forEach(x => x && x.id && put('products', x.id, x));
    state.customers.forEach(x => x && x.id && put('customers', x.id, x));
    state.sales.forEach(x => x && x.id && put('sales', x.id, x));
    state.expenses.forEach(x => x && x.id && put('expenses', x.id, x));
    state.debtPayments.forEach(x => x && x.id && put('debt_payments', x.id, x));
    state.suppliers.forEach(x => x && x.id && put('suppliers', x.id, x));
    state.stockIncome.forEach(x => x && x.id && put('stock_income', x.id, x));
    state.shifts.forEach(x => x && x.id && put('shifts', x.id, x));
    state.categories.forEach(c => put('categories', c, { name: c }));
}

// SYNC HELPERS
function syncDoc(collectionName, id, data) {
    persistDoc(collectionName, id, data);
    if (state.currentUser && state.shopId && db && setDoc && doc) {
        setDoc(doc(db, 'shops', state.shopId, collectionName, String(id)), data, { merge: true }).catch(() => {});
    }
}

function deleteSyncDoc(collectionName, id) {
    persistDelete(collectionName, id);
    if (state.currentUser && state.shopId && db && deleteDoc && doc) {
        deleteDoc(doc(db, 'shops', state.shopId, collectionName, String(id))).catch(() => {});
    }
}

// HELPERS
function formatMoney(amount) {
    return Math.round(parseFloat(amount) || 0).toLocaleString('en-US').replace(/,/g, ' ') + ' so\'m';
}

function escapeHtml(str) {
    return (str || '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function minStock(p) {
    const m = parseInt(p && p.min);
    return isNaN(m) ? 2 : m;
}

// ====================================================================
// TA'MINOTCHILAR (Suppliers)
// ====================================================================
function supplierNameList() {
    const names = new Set();
    state.suppliers.forEach(s => { if (s && s.name) names.add(s.name); });
    state.products.forEach(p => { if (p && p.supplier_name) names.add(p.supplier_name); });
    return Array.from(names).sort((a, b) => a.localeCompare(b));
}

function updateSupplierDropdowns() {
    if (!DOM.prodSupplierSelect) return;
    const prev = DOM.prodSupplierSelect.value;
    DOM.prodSupplierSelect.innerHTML = '<option value="">Ta\'minotchi tanlang (ixtiyoriy)</option>' +
        supplierNameList().map(n => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join('');
    if (prev) DOM.prodSupplierSelect.value = prev;
}

// Ta'minotchi bo'yicha: ombor qoldig'i + haqiqiy sotuvlardan sotilgan soni, tushum va foyda
function getSupplierStats(name) {
    const prods = state.products.filter(p => p.supplier_name === name);
    const ids = new Set(prods.map(p => p.id));
    let stockQty = 0, stockValue = 0;
    prods.forEach(p => {
        const q = Math.max(0, parseInt(p.qty) || 0);
        stockQty += q;
        stockValue += q * (parseFloat(p.buy) || 0);
    });
    let soldQty = 0, revenue = 0, profit = 0;
    state.sales.forEach(sale => {
        if (sale.returned === 1 || !Array.isArray(sale.items)) return;
        sale.items.forEach(it => {
            if (!ids.has(it.product_id)) return;
            const q = parseFloat(it.qty) || 0;
            const sell = parseFloat(it.sell) || 0;
            const buy = parseFloat(it.buy) || 0;
            soldQty += q;
            revenue += q * sell;
            profit += q * (sell - buy);
        });
    });
    return { count: prods.length, stockQty, stockValue, soldQty, revenue, profit };
}

function renderSuppliersList() {
    if (!DOM.suppliersListContainer) return;
    const names = supplierNameList();
    if (names.length === 0) {
        DOM.suppliersListContainer.innerHTML = '<p class="empty-msg">Ta\'minotchilar kiritilmagan.</p>';
        return;
    }
    DOM.suppliersListContainer.innerHTML = names.map(name => {
        const sup = state.suppliers.find(s => s.name === name);
        const st = getSupplierStats(name);
        return `
        <div class="supplier-card">
            <div class="supplier-head">
                <div><strong><i class="fa-solid fa-truck-field"></i> ${escapeHtml(name)}</strong>${sup && sup.phone ? ` <small>${escapeHtml(sup.phone)}</small>` : ''}</div>
                <div>
                    <button class="btn btn-xs btn-secondary" data-name="${escapeHtml(name)}" onclick="editSupplier(this.dataset.name)"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-xs btn-danger" data-name="${escapeHtml(name)}" onclick="deleteSupplier(this.dataset.name)"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <div class="supplier-stats">
                <div><span>Mahsulot turi</span><b>${st.count} xil</b></div>
                <div><span>Ombordagi qoldiq</span><b>${st.stockQty} dona</b></div>
                <div><span>Qoldiq (tan narxda)</span><b>${formatMoney(st.stockValue)}</b></div>
                <div><span>Sotilgan</span><b>${st.soldQty} dona</b></div>
                <div><span>Tushum</span><b>${formatMoney(st.revenue)}</b></div>
                <div><span>Foyda</span><b class="text-success">${formatMoney(st.profit)}</b></div>
            </div>
        </div>`;
    }).join('');
}

function resetSupplierForm() {
    if (DOM.supplierEditOriginal) DOM.supplierEditOriginal.value = '';
    if (DOM.supplierNameInput) DOM.supplierNameInput.value = '';
    if (DOM.supplierPhoneInput) DOM.supplierPhoneInput.value = '';
    if (DOM.saveSupplierBtn) DOM.saveSupplierBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Qo\'shish';
    if (DOM.cancelSupplierEditBtn) DOM.cancelSupplierEditBtn.style.display = 'none';
}

window.editSupplier = function(name) {
    const sup = state.suppliers.find(s => s.name === name);
    DOM.supplierEditOriginal.value = name;
    DOM.supplierNameInput.value = name;
    DOM.supplierPhoneInput.value = sup ? (sup.phone || '') : '';
    DOM.saveSupplierBtn.innerHTML = '<i class="fa-solid fa-check"></i> Saqlash';
    DOM.cancelSupplierEditBtn.style.display = 'inline-flex';
    DOM.supplierNameInput.focus();
};

function handleSaveSupplier() {
    const name = DOM.supplierNameInput.value.trim();
    const phone = DOM.supplierPhoneInput.value.trim();
    const original = DOM.supplierEditOriginal.value;
    if (!name) {
        showToast('Ta\'minotchi nomini kiriting!', 'error');
        return;
    }
    const dupe = supplierNameList().find(n => n.toLowerCase() === name.toLowerCase() && n !== original);
    if (dupe) {
        showToast('Bunday ta\'minotchi allaqachon mavjud!', 'error');
        return;
    }

    const now = getLocalDateTime();
    let sup = original ? state.suppliers.find(s => s.name === original) : null;
    if (sup) {
        sup.name = name;
        sup.phone = phone;
        sup.updated = now;
    } else {
        sup = { id: 'SUP-' + Math.random().toString(36).substring(2, 10).toUpperCase(), name, phone, updated: now };
        state.suppliers.push(sup);
    }

    // Nomi o'zgarsa, mahsulotlardagi belgi ham yangilanadi
    if (original && original !== name) {
        state.products.forEach(p => {
            if (p.supplier_name === original) {
                p.supplier_name = name;
                p.updated = now;
                syncDoc('products', p.id, p);
            }
        });
    }

    syncDoc('suppliers', sup.id, sup);
    showToast(original ? 'Ta\'minotchi yangilandi' : 'Ta\'minotchi qo\'shildi');
    resetSupplierForm();
    updateSupplierDropdowns();
    renderSuppliersList();
    renderProductsTable();
}

window.deleteSupplier = function(name) {
    const prods = state.products.filter(p => p.supplier_name === name);
    const msg = prods.length
        ? `"${name}" o'chirilsa, ${prods.length} ta mahsulotdan ta'minotchi belgisi olib tashlanadi. Davom etasizmi?`
        : `"${name}" ta'minotchisini o'chirishni tasdiqlaysizmi?`;
    if (!confirm(msg)) return;

    const now = getLocalDateTime();
    prods.forEach(p => {
        p.supplier_name = '';
        p.updated = now;
        syncDoc('products', p.id, p);
    });
    const sup = state.suppliers.find(s => s.name === name);
    if (sup) {
        state.suppliers = state.suppliers.filter(s => s !== sup);
        deleteSyncDoc('suppliers', sup.id);
    }
    resetSupplierForm();
    updateSupplierDropdowns();
    renderSuppliersList();
    renderProductsTable();
    showToast('Ta\'minotchi o\'chirildi', 'warning');
};

// ====================================================================
// DASTURNI YUKLAB OLISH HAVOLALARI (APK / EXE)
// ====================================================================
function isValidHttpUrl(str) {
    try {
        const u = new URL(String(str).trim());
        return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (e) {
        return false;
    }
}

function openDownloadLink(kind) {
    const isApk = kind === 'apk';
    const url = isApk ? state.apkUrl : state.exeUrl;
    if (!isValidHttpUrl(url)) {
        showToast(`${isApk ? 'Android .APK' : 'Windows .EXE'} yuklash havolasi kiritilmagan. Sozlamalarda kiriting.`, 'warning');
        switchTab('settings-section');
        const input = isApk ? DOM.settingApkUrl : DOM.settingExeUrl;
        if (input) setTimeout(() => input.focus(), 50);
        return;
    }
    window.open(url.trim(), '_blank', 'noopener');
}

// ====================================================================
// SKU / BARCODE GENERATORLAR
// ====================================================================
function codeExists(code) {
    const c = normCode(code);
    return state.products.some(p => normCode(p.code) === c || normCode(p.imei) === c);
}

function generateUniqueSKU() {
    let code;
    do {
        code = 'SKU-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (codeExists(code));
    return code;
}

function ean13CheckDigit(d12) {
    let sum = 0;
    for (let i = 0; i < 12; i++) sum += parseInt(d12[i]) * (i % 2 === 0 ? 1 : 3);
    return (10 - (sum % 10)) % 10;
}

// Do'kon ichki foydalanishi uchun to'g'ri EAN-13 (prefiks "2"), kontrol raqami bilan
function generateInternalEAN13() {
    let code;
    do {
        let body = '2';
        for (let i = 0; i < 11; i++) body += Math.floor(Math.random() * 10);
        code = body + ean13CheckDigit(body);
    } while (codeExists(code));
    return code;
}

// ====================================================================
// CODE 128 (B to'plami) — haqiqiy skanerlanadigan shtrix-kod (SVG)
// ====================================================================
const CODE128_PATTERNS = [
    '212222','222122','222221','121223','121322','131222','122213','122312','132212','221213',
    '221312','231212','112232','122132','122231','113222','123122','123221','223211','221132',
    '221231','213212','223112','312131','311222','321122','321221','312212','322112','322211',
    '212123','212321','232121','111323','131123','131321','112313','132113','132311','211313',
    '231113','231311','112133','112331','132131','113123','113321','133121','313121','211331',
    '231131','213113','213311','213131','311123','311321','331121','312113','312311','332111',
    '314111','221411','431111','111224','111422','121124','121421','141122','141221','112214',
    '112412','122114','122411','142112','142211','241211','221114','413111','241112','134111',
    '111242','121142','121241','114212','124112','124211','411212','421112','421211','212141',
    '214121','412121','111143','111341','131141','114113','114311','411113','411311','113141',
    '114131','311141','411131','211412','211214','211232','2331112'
];

function code128Pattern(text) {
    const codes = [104]; // Start B
    let sum = 104;
    for (let i = 0; i < text.length; i++) {
        const c = text.charCodeAt(i);
        if (c < 32 || c > 126) return null; // faqat lotin harflari, raqamlar, belgilar
        const v = c - 32;
        codes.push(v);
        sum += v * (i + 1);
    }
    codes.push(sum % 103);
    codes.push(106); // Stop
    return codes.map(c => CODE128_PATTERNS[c]).join('');
}

// Printerning har bir moduli butun nuqtaga (203 dpi: 8 nuqta/mm) to'g'ri keladi — chiziqlar aniq chiqadi
function code128SVG(text, heightMm, maxDots) {
    const pat = code128Pattern(text);
    if (!pat) return '';
    const quiet = 10;
    const modules = pat.split('').reduce((s, d) => s + parseInt(d), 0) + quiet * 2;
    let x = quiet;
    let bars = '';
    for (let i = 0; i < pat.length; i++) {
        const w = parseInt(pat[i]);
        if (i % 2 === 0) bars += `<rect x="${x}" y="0" width="${w}" height="1"/>`;
        x += w;
    }
    // width/height CSS orqali beriladi (.lb-svg svg qoidasidan) — rasm o'lchami chiqmasiga yo'l qo'ymaydi
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${modules} 1" preserveAspectRatio="none" shape-rendering="crispEdges" fill="#000">${bars}</svg>`;
}

// ====================================================================
// BARCODE YORLIG'I (ETIKETKA)
// ====================================================================
const LABEL_CSS = `
.lb, .lb * { box-sizing: border-box; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; color: #000; margin: 0; padding: 0; }
.lb {
    width: 38mm;               /* 40mm - 1mm har tomondan bosilmaydigan chegara */
    height: 28mm;
    padding: 0.5mm 1mm;
    text-align: center;
    background: #fff;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    page-break-after: always;
}
.lb:last-child { page-break-after: avoid; }
.lb .lb-shop { font-size: 6px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; line-height: 1.1; flex-shrink: 0; }
.lb .lb-name { font-size: 7.5px; font-weight: 800; line-height: 1.15; word-break: break-word; flex-shrink: 0; max-height: 10mm; overflow: hidden; }
.lb .lb-svg  { flex: 1 1 auto; display: flex; align-items: center; justify-content: center; width: 100%; min-height: 0; }
.lb .lb-svg svg { max-width: 36mm; max-height: 10mm; width: 36mm; height: 10mm; }
.lb .lb-code  { font-size: 6px; font-weight: 700; letter-spacing: 1px; word-break: break-all; flex-shrink: 0; }
.lb .lb-price { font-size: 9px; font-weight: 800; flex-shrink: 0; }
.lb .lb-warn  { font-size: 6px; font-weight: 700; flex-shrink: 0; }
`;

let labelData = null;

function buildLabelHTML(d) {
    // 30×40 mm yorliq: Code128 barcode 26×13mm SVG (viewBox="0 0 W 1", CSS bilan o'lcham beriladi)
    const showShop  = !DOM.labelShowShop  || DOM.labelShowShop.checked;
    const showPrice = (!DOM.labelShowPrice || DOM.labelShowPrice.checked) && d.price > 0;
    // 28mm × 8px/mm ≈ 224 dot; barcode eni 28mm ga moslashtiriladi
    const svg = code128SVG(d.code, 10, 304);
    const svgBlock = svg
        ? `<div class="lb-svg">${svg}</div>`
        : `<div class="lb-warn">Kodda lotin bo'lmagan belgi — barcode bo'lmadi</div>`;
    return `<div class="lb">
        ${showShop  ? `<div class="lb-shop">${escapeHtml(state.shopName)}</div>` : ''}
        <div class="lb-name">${escapeHtml(d.name)}</div>
        ${svgBlock}
        <div class="lb-code">${escapeHtml(d.code)}</div>
        ${showPrice ? `<div class="lb-price">${fmtNum(d.price)} so'm</div>` : ''}
    </div>`;
}

function renderLabelPreview() {
    if (!labelData || !DOM.labelPreview) return;
    DOM.labelPreview.innerHTML = buildLabelHTML(labelData);
}

function showLabelModal(data, copies) {
    labelData = data;
    if (DOM.labelCopies) DOM.labelCopies.value = Math.min(200, Math.max(1, copies || 1));
    renderLabelPreview();
    DOM.labelModal.classList.add('active');
}

// Mahsulot oynasidagi (hali saqlanmagan bo'lishi mumkin) ma'lumotlar bo'yicha
function openLabelFromForm() {
    let code = DOM.prodCode.value.trim();
    if (!code) {
        code = generateInternalEAN13();
        DOM.prodCode.value = code;
    }
    showLabelModal({
        name: DOM.prodName.value.trim() || 'Mahsulot',
        code,
        price: parseFloat(DOM.prodSell.value) || 0
    }, 1);
}

// Ombor jadvalidagi tayyor mahsulot bo'yicha (nusxa soni = ombordagi qoldiq)
window.openProductLabel = function(id) {
    const p = state.products.find(x => x.id === id);
    if (!p) return;
    if (!p.code) {
        p.code = generateInternalEAN13();
        p.updated = getLocalDateTime();
        syncDoc('products', p.id, p);
        renderProductsTable();
        showToast('Mahsulotga yangi shtrix-kod berildi: ' + p.code);
    }
    showLabelModal({ name: p.name, code: p.code, price: parseFloat(p.sell) || 0 }, parseInt(p.qty) || 1);
};

function printLabels() {
    if (!labelData) return;
    const copies = Math.min(200, Math.max(1, parseInt(DOM.labelCopies.value) || 1));
    const one = buildLabelHTML(labelData);
    printDocument(Array(copies).fill(one).join(''), 'Barcode ' + labelData.code, true);
}

// ====================================================================
// PRO IMKONIYATLAR: hodisalar (ta'minotchilar, havolalar, tezkor tugmalar, yorliq)
// ====================================================================
function setupProFeatures() {
    // Ta'minotchilar
    if (DOM.manageSuppliersBtn) {
        DOM.manageSuppliersBtn.addEventListener('click', () => {
            resetSupplierForm();
            renderSuppliersList();
            DOM.suppliersModal.classList.add('active');
        });
    }
    if (DOM.saveSupplierBtn) DOM.saveSupplierBtn.addEventListener('click', handleSaveSupplier);
    if (DOM.cancelSupplierEditBtn) DOM.cancelSupplierEditBtn.addEventListener('click', resetSupplierForm);
    [DOM.supplierNameInput, DOM.supplierPhoneInput].forEach(inp => {
        if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') handleSaveSupplier(); });
    });

    // Yuklab olish havolalari
    if (DOM.navDownloadApk) DOM.navDownloadApk.addEventListener('click', () => openDownloadLink('apk'));
    if (DOM.navDownloadExe) DOM.navDownloadExe.addEventListener('click', () => openDownloadLink('exe'));
    if (DOM.btnDownloadApkAction) DOM.btnDownloadApkAction.addEventListener('click', () => openDownloadLink('apk'));
    if (DOM.btnDownloadExeAction) DOM.btnDownloadExeAction.addEventListener('click', () => openDownloadLink('exe'));
    // .exe ichida ishlayotgan bo'lsa, "EXE yuklash" tugmasi keraksiz
    if (window.electronAPI && DOM.navDownloadExe) DOM.navDownloadExe.style.display = 'none';

    // Barcode yorlig'i
    if (DOM.printBarcodeModalBtn) DOM.printBarcodeModalBtn.addEventListener('click', openLabelFromForm);
    if (DOM.labelPrintBtn) DOM.labelPrintBtn.addEventListener('click', printLabels);
    [DOM.labelShowPrice, DOM.labelShowShop].forEach(cb => { if (cb) cb.addEventListener('change', renderLabelPreview); });
    document.querySelectorAll('.label-close').forEach(b => b.addEventListener('click', () => DOM.labelModal.classList.remove('active')));

    // Tezkor tugmalar: F1 tezkor sotuv, F2 sotuvni yakunlash, F3 qidiruv
    window.addEventListener('keydown', (e) => {
        if (!/^F[123]$/.test(e.key) || anyModalActive()) return;
        e.preventDefault();
        if (e.key === 'F1') {
            switchTab('pos-section');
            if (DOM.quickSaleBtn) DOM.quickSaleBtn.click();
        } else if (e.key === 'F2') {
            if (isPOSActive()) {
                handleCheckout();
            } else {
                switchTab('pos-section');
                showToast('Kassaga o\'tildi. Sotuvni yakunlash uchun F2 ni qayta bosing.', 'warning');
            }
        } else if (e.key === 'F3') {
            switchTab('pos-section');
            if (DOM.posSearchInput) { DOM.posSearchInput.focus(); DOM.posSearchInput.select(); }
        }
    });
}

// Firebase xatolarini tushunarli tilga o'giradi
function firebaseErrorMessage(err) {
    switch (err && err.code) {
        case 'auth/unauthorized-domain':
            return `Bu domen (${location.hostname || 'fayl'}) Firebase'da ruxsat etilmagan. Firebase Console → Authentication → Settings → Authorized domains ga qo'shing.`;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Firebase paroli noto\'g\'ri! Telefonda ishlatgan parolingizni kiriting.';
        case 'auth/email-already-in-use':
            return 'Bu email allaqachon ro\'yxatdan o\'tgan. Parolni tekshiring.';
        case 'auth/invalid-email':
            return 'Email manzili noto\'g\'ri yozilgan.';
        case 'auth/too-many-requests':
            return 'Juda ko\'p urinish. Birozdan keyin qayta urinib ko\'ring.';
        case 'auth/network-request-failed':
            return 'Internet bilan aloqa yo\'q. Oflayn rejimda ishlashda davom etishingiz mumkin.';
        default:
            return 'Ulanishda xatolik: ' + ((err && (err.message || err.code)) || 'noma\'lum');
    }
}

// ====================================================================
// SAQLASH: IndexedDB (katta hajm) + localStorage'dan avtomatik ko'chirish
// ====================================================================
const DB_NAME = 'dokonim_pos';
const DB_VERSION = 2;
const DB_COLLECTIONS = ['products', 'customers', 'sales', 'debt_payments', 'expenses', 'categories', 'suppliers', 'stock_income', 'shifts'];
let idb = null;
let storageMode = 'indexeddb'; // IndexedDB ochilmasa: 'localstorage' (zaxira rejim)
let storageWarned = false;
let writeChain = Promise.resolve();
let legacyTimer = null;
let migratedCount = 0;

function idbOpen() {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) { reject(new Error('IndexedDB qo\'llab-quvvatlanmaydi')); return; }
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
            const d = req.result;
            DB_COLLECTIONS.forEach(n => { if (!d.objectStoreNames.contains(n)) d.createObjectStore(n, { keyPath: 'id' }); });
            if (!d.objectStoreNames.contains('meta')) d.createObjectStore('meta');
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
        req.onblocked = () => reject(new Error('IndexedDB band'));
    });
}

// Bitta tranzaksiya: hammasi yoki hech narsa (yarim yozilib qolmaydi)
function idbRun(stores, mode, work) {
    return new Promise((resolve, reject) => {
        const tx = idb.transaction(stores, mode);
        let result;
        try { result = work(tx); } catch (e) { try { tx.abort(); } catch (_) {} reject(e); return; }
        tx.oncomplete = () => resolve(result);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error || new Error('Saqlash bekor qilindi'));
    });
}

function idbGetAll(store) {
    return new Promise((resolve, reject) => {
        const r = idb.transaction(store, 'readonly').objectStore(store).getAll();
        r.onsuccess = () => resolve(r.result || []);
        r.onerror = () => reject(r.error);
    });
}

function idbCount(store) {
    return new Promise((resolve, reject) => {
        const r = idb.transaction(store, 'readonly').objectStore(store).count();
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
    });
}

function idbMetaGet(key) {
    return new Promise((resolve, reject) => {
        const r = idb.transaction('meta', 'readonly').objectStore('meta').get(key);
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
    });
}

function idbMetaSet(key, value) {
    return idbRun(['meta'], 'readwrite', tx => { tx.objectStore('meta').put(value, key); });
}

// Kategoriya oddiy matn: {id, name} ko'rinishida saqlanadi. id yo'q yozuv tashlab yuboriladi
function toRecord(col, item) {
    if (col === 'categories') {
        const name = typeof item === 'string' ? item : (item && (item.name || item.id));
        return name ? { id: String(name), name: String(name) } : null;
    }
    if (!item || item.id === undefined || item.id === null || item.id === '') return null;
    return item;
}

function stateList(col) {
    switch (col) {
        case 'products': return state.products;
        case 'customers': return state.customers;
        case 'sales': return state.sales;
        case 'debt_payments': return state.debtPayments;
        case 'expenses': return state.expenses;
        case 'categories': return state.categories;
        case 'suppliers': return state.suppliers;
        case 'stock_income': return state.stockIncome;
        case 'shifts': return state.shifts;
        default: return [];
    }
}

function reportStorageError(e) {
    console.error('Saqlash xatosi:', e);
    if (storageWarned) return;
    storageWarned = true;
    const full = e && e.name === 'QuotaExceededError';
    showToast(full
        ? 'Kompyuter xotirasi to\'lgan! Zaxira nusxa oling va joy bo\'shating.'
        : 'Ma\'lumotni saqlashda xatolik! Zaxira nusxa olib qo\'ying.', 'error');
    setTimeout(() => { storageWarned = false; }, 60000);
}

// Yozuvlar navbat bilan bajariladi (tartib buzilmaydi), xatolik sotuvni to'xtatmaydi
function queueWrite(work) {
    writeChain = writeChain.then(work).catch(reportStorageError);
    return writeChain;
}

// Faqat o'zgargan bitta hujjatni yozish — butun bazani qayta yozish kerak emas
function persistDoc(col, id, data) {
    if (!idb) { legacySaveSoon(); return; }
    const rec = toRecord(col, col === 'categories' ? id : Object.assign({}, data, { id }));
    if (!rec) return;
    queueWrite(() => idbRun([col], 'readwrite', tx => { tx.objectStore(col).put(rec); }));
}

function persistDelete(col, id) {
    if (!idb) { legacySaveSoon(); return; }
    queueWrite(() => idbRun([col], 'readwrite', tx => {
        const st = tx.objectStore(col);
        st.delete(id);
        if (/^\d+$/.test(String(id))) st.delete(Number(id));
    }));
}

function persistReplaceAll(col, items) {
    if (!idb) { legacySaveSoon(); return; }
    queueWrite(() => idbRun([col], 'readwrite', tx => {
        const st = tx.objectStore(col);
        st.clear();
        (items || []).forEach(it => { const rec = toRecord(col, it); if (rec) st.put(rec); });
    }));
}

function persistAll() {
    DB_COLLECTIONS.forEach(col => persistReplaceAll(col, stateList(col)));
}

// Eski nom (zaxiradan tiklashda ishlatiladi)
function saveLocalData() { persistAll(); }

// Bulutdan kelgan o'zgarishlar: birinchisi — to'liq nusxa, keyingilari — faqat o'zgarganlari
function persistSnapshot(col, snapshot, list, isFirst) {
    if (!idb) { legacySaveSoon(); return; }
    if (isFirst) { persistReplaceAll(col, list); return; }
    snapshot.docChanges().forEach(ch => {
        if (ch.type === 'removed') persistDelete(col, ch.doc.id);
        else persistDoc(col, ch.doc.id, ch.doc.data());
    });
}

// Zaxira rejim (IndexedDB ochilmasa): eski usul, lekin xatolik ushlanadi
function legacySaveSoon() {
    clearTimeout(legacyTimer);
    legacyTimer = setTimeout(() => {
        try {
            localStorage.setItem('pos_data_products', JSON.stringify(state.products));
            localStorage.setItem('pos_data_customers', JSON.stringify(state.customers));
            localStorage.setItem('pos_data_sales', JSON.stringify(state.sales));
            localStorage.setItem('pos_data_debt_payments', JSON.stringify(state.debtPayments));
            localStorage.setItem('pos_data_expenses', JSON.stringify(state.expenses));
            localStorage.setItem('pos_data_categories', JSON.stringify(state.categories));
            localStorage.setItem('pos_data_suppliers', JSON.stringify(state.suppliers));
            localStorage.setItem('pos_data_stock_income', JSON.stringify(state.stockIncome));
            localStorage.setItem('pos_data_shifts', JSON.stringify(state.shifts));
        } catch (e) { reportStorageError(e); }
    }, 300);
}

// Eski localStorage ma'lumotlarini IndexedDB ga ko'chiradi. Nusxa tekshirilgandan keyingina eskisi o'chadi.
async function migrateFromLocalStorage() {
    if (await idbMetaGet('migrated')) return;
    const legacy = {};
    let total = 0;
    DB_COLLECTIONS.forEach(col => {
        try {
            const arr = JSON.parse(localStorage.getItem('pos_data_' + col));
            if (Array.isArray(arr) && arr.length) {
                const recs = arr.map(x => toRecord(col, x)).filter(Boolean);
                if (recs.length) { legacy[col] = recs; total += recs.length; }
            }
        } catch (e) { /* buzilgan eski yozuv — o'tkazib yuboriladi */ }
    });
    const cols = Object.keys(legacy);
    if (cols.length) {
        await idbRun(cols, 'readwrite', tx => {
            cols.forEach(col => { const st = tx.objectStore(col); legacy[col].forEach(r => st.put(r)); });
        });
        for (const col of cols) {
            const expected = new Set(legacy[col].map(r => String(r.id))).size;
            if ((await idbCount(col)) < expected) throw new Error('Ko\'chirish tekshiruvi o\'tmadi: ' + col);
        }
    }
    await idbMetaSet('migrated', { at: new Date().toISOString(), records: total });
    DB_COLLECTIONS.forEach(col => { try { localStorage.removeItem('pos_data_' + col); } catch (e) {} });
    migratedCount = total;
}

async function initStorage() {
    try {
        idb = await idbOpen();
        await migrateFromLocalStorage();
        const [products, customers, sales, debtPayments, expenses, categories, suppliers, stockIncome, shifts] =
            await Promise.all(DB_COLLECTIONS.map(idbGetAll));
        state.products = products;
        state.customers = customers;
        state.sales = sales;
        state.debtPayments = debtPayments;
        state.expenses = expenses;
        state.suppliers = suppliers;
        state.stockIncome = stockIncome;
        state.shifts = shifts;
        state.categories = categories.length ? categories.map(c => c.name || c.id) : ['Telefon', 'Aksessuar'];
        storageMode = 'indexeddb';
        // Brauzerdan ma'lumotni o'zboshimchalik bilan o'chirmaslikni so'raymiz
        if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
    } catch (e) {
        console.warn('IndexedDB ishlamadi, zaxira rejimga o\'tildi:', e);
        idb = null;
        storageMode = 'localstorage';
        loadLocalData();
        setTimeout(() => showToast('Katta xotira (IndexedDB) ochilmadi — zaxira rejimda ishlayapti. Zaxira nusxani tez-tez oling.', 'warning'), 500);
    }
}

async function refreshStorageInfo() {
    const el = document.getElementById('storage-info');
    if (!el) return;
    let used = '—', persisted = '—';
    try {
        if (navigator.storage && navigator.storage.estimate) {
            const e = await navigator.storage.estimate();
            used = `${((e.usage || 0) / 1048576).toFixed(1)} MB (ajratilgan: ~${((e.quota || 0) / 1073741824).toFixed(1)} GB)`;
        }
        if (navigator.storage && navigator.storage.persisted) {
            persisted = (await navigator.storage.persisted()) ? 'Ha, brauzer o\'chirmaydi' : 'Yo\'q (oddiy rejim)';
        }
    } catch (e) { /* ma'lumot olinmadi */ }
    const modeText = storageMode === 'indexeddb' ? 'IndexedDB (katta hajm)' : 'Zaxira rejim (localStorage, kichik hajm)';
    el.innerHTML = `
        <div class="storage-row"><span>Saqlash turi</span><b>${modeText}</b></div>
        <div class="storage-row"><span>Ishlatilgan joy</span><b>${used}</b></div>
        <div class="storage-row"><span>Doimiy saqlash</span><b>${persisted}</b></div>
        <div class="storage-row"><span>Mahsulotlar</span><b>${state.products.length} ta</b></div>
        <div class="storage-row"><span>Sotuvlar</span><b>${state.sales.length} ta</b></div>
        <div class="storage-row"><span>Mijozlar</span><b>${state.customers.length} ta</b></div>`;
}

// ====================================================================
// TEZLIK: qarz hisobi (bir o'tishda), tartiblash, savdo tarixini sahifalash
// ====================================================================
const nameCollator = new Intl.Collator(undefined, { sensitivity: 'base', numeric: true });
function byName(a, b) { return nameCollator.compare(String(a.name || ''), String(b.name || '')); }

// Barcha mijozlar qarzi bitta o'tishda: avval har mijoz uchun barcha sotuvlar qayta ko'rilardi
function buildDebtMap() {
    const byId = new Map(), byCustName = new Map(), paid = new Map();
    for (const s of state.sales) {
        if (s.returned === 1) continue;
        const total = parseFloat(s.total) || 0;
        const fallback = s.payment === 'Qarz' ? 0 : total;
        let p = (s.paid !== undefined && s.paid !== null && s.paid !== '') ? parseFloat(s.paid) : fallback;
        if (isNaN(p)) p = fallback;
        const debt = Math.max(0, total - p);
        if (debt <= 0) continue;
        if (s.customer_id) byId.set(s.customer_id, (byId.get(s.customer_id) || 0) + debt);
        else if (s.customer_name) byCustName.set(s.customer_name, (byCustName.get(s.customer_name) || 0) + debt);
    }
    for (const dp of state.debtPayments) {
        paid.set(dp.customer_id, (paid.get(dp.customer_id) || 0) + (parseFloat(dp.amount) || 0));
    }
    return { byId, byCustName, paid };
}

function calculateCustomerDebt(cust, map) {
    if (!cust) return 0;
    const m = map || buildDebtMap();
    const salesDebt = (m.byId.get(cust.id) || 0) + (m.byCustName.get(cust.name) || 0);
    const payments = (m.paid.get(cust.id) || 0) + (cust.name !== cust.id ? (m.paid.get(cust.name) || 0) : 0);
    return Math.max(0, salesDebt - payments);
}

function getDebtorsList() {
    const map = buildDebtMap();
    return state.customers
        .map(c => ({ customer: c, debt: calculateCustomerDebt(c, map) }))
        .filter(d => d.debt > 0)
        .sort((a, b) => b.debt - a.debt);
}

// Oxirgi n ta sotuv — butun ro'yxatni tartiblamasdan
function latestSales(list, n) {
    const top = [];
    for (const s of list) {
        const c = s.created || '';
        if (top.length < n || c > (top[top.length - 1].created || '')) {
            top.push(s);
            top.sort((a, b) => ((b.created || '') > (a.created || '') ? 1 : ((b.created || '') < (a.created || '') ? -1 : 0)));
            if (top.length > n) top.pop();
        }
    }
    return top;
}

const LIST_PAGE = 100;
let salesLimit = LIST_PAGE;
let expensesLimit = LIST_PAGE;

function cmpCreatedDesc(a, b) {
    const x = a.created || '', y = b.created || '';
    return y > x ? 1 : (y < x ? -1 : 0);
}

function renderSalesAndExpenses() {
    if (DOM.salesTableBody) {
        const q = DOM.salesSearchInput ? DOM.salesSearchInput.value.toLowerCase().trim() : '';
        const day = DOM.salesDateFilter ? DOM.salesDateFilter.value : '';
        const payF = DOM.salesPaymentFilter ? DOM.salesPaymentFilter.value : '';
        const showRet = DOM.salesShowReturned ? DOM.salesShowReturned.checked : true;
        let list = state.sales;
        if (q || day || payF || !showRet) {
            list = list.filter(s => {
                if (!showRet && s.returned === 1) return false;
                if (day && !(s.created || '').startsWith(day)) return false;
                if (payF && (s.payment || '') !== payF) return false;
                if (!q) return true;
                return (s.name || '').toLowerCase().includes(q) ||
                    (s.customer_name || '').toLowerCase().includes(q) ||
                    String(s.id || '').toLowerCase().includes(q) ||
                    (s.payment || '').toLowerCase().includes(q) ||
                    (s.created || '').includes(q);
            });
        }
        const sorted = list.slice().sort(cmpCreatedDesc);
        const shown = sorted.slice(0, salesLimit);
        if (DOM.salesCountLabel) DOM.salesCountLabel.textContent = `Jami: ${sorted.length} ta${(q || day) ? ' (filtr)' : ''}`;

        if (sorted.length === 0) {
            DOM.salesTableBody.innerHTML = `<tr><td colspan="8" class="text-center">${(q || day) ? 'Hech narsa topilmadi.' : 'Sotuvlar tarixi bo\'sh.'}</td></tr>`;
        } else {
            DOM.salesTableBody.innerHTML = shown.map(s => {
                const isReturned = s.returned === 1;
                const paid = s.paid !== undefined ? s.paid : s.total;
                return `
                    <tr style="${isReturned ? 'opacity:0.5; text-decoration:line-through;' : ''}">
                        <td>${escapeHtml(s.created || '-')}</td>
                        <td><strong>${escapeHtml(s.name || 'Sotuv')}</strong></td>
                        <td>${escapeHtml(s.customer_name || 'Naqd mijoz')}</td>
                        <td><span class="badge">${escapeHtml(s.payment || 'Naqd')}</span></td>
                        <td><strong>${formatMoney(s.total)}</strong></td>
                        <td class="${paid < s.total ? 'text-danger' : 'text-success'}">${formatMoney(paid)}</td>
                        <td>${isReturned ? '<span class="badge" style="background:var(--danger-light);color:var(--danger);">Qaytarilgan</span>' : '<span class="badge">Faol</span>'}</td>
                        <td>
                            <button class="btn btn-xs btn-secondary" onclick="reprintReceipt('${s.id}')" title="Chek"><i class="fa-solid fa-print"></i></button>
                            ${!isReturned ? `<button class="btn btn-xs btn-danger" onclick="returnSale('${s.id}')" title="Vozvrat (Qaytarish)"><i class="fa-solid fa-rotate-left"></i></button>` : ''}
                        </td>
                    </tr>
                `;
            }).join('') + (sorted.length > shown.length
                ? `<tr><td colspan="8" class="text-center"><button class="btn btn-secondary btn-sm" onclick="showMoreSales()">Yana ${LIST_PAGE} ta ko'rsatish (${shown.length} / ${sorted.length})</button></td></tr>`
                : '');
        }
    }

    if (DOM.expensesTableBody) {
        const sortedExp = state.expenses.slice().sort(cmpCreatedDesc);
        const shownExp = sortedExp.slice(0, expensesLimit);
        if (sortedExp.length === 0) {
            DOM.expensesTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Xarajatlar kiritilmagan.</td></tr>';
        } else {
            DOM.expensesTableBody.innerHTML = shownExp.map(ex => `
                <tr>
                    <td>${escapeHtml(ex.created || '-')}</td>
                    <td><strong>${escapeHtml(ex.note)}</strong></td>
                    <td class="text-danger"><strong>-${formatMoney(ex.amount)}</strong></td>
                    <td>
                        <button class="btn btn-xs btn-danger" onclick="deleteExpense('${ex.id}')"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('') + (sortedExp.length > shownExp.length
                ? `<tr><td colspan="4" class="text-center"><button class="btn btn-secondary btn-sm" onclick="showMoreExpenses()">Yana ${LIST_PAGE} ta ko'rsatish (${shownExp.length} / ${sortedExp.length})</button></td></tr>`
                : '');
        }
    }
}

window.showMoreSales = function() { salesLimit += LIST_PAGE; renderSalesAndExpenses(); };
window.showMoreExpenses = function() { expensesLimit += LIST_PAGE; renderSalesAndExpenses(); };

function setupListFilters() {
    let t = null;
    const onChange = () => {
        clearTimeout(t);
        t = setTimeout(() => { salesLimit = LIST_PAGE; renderSalesAndExpenses(); }, 150);
    };
    if (DOM.salesSearchInput) DOM.salesSearchInput.addEventListener('input', onChange);
    if (DOM.salesDateFilter)    DOM.salesDateFilter.addEventListener('change', onChange);
    if (DOM.salesPaymentFilter) DOM.salesPaymentFilter.addEventListener('change', onChange);
    if (DOM.salesShowReturned)  DOM.salesShowReturned.addEventListener('change', onChange);
}

// ====================================================================
// 0 DAN BOSHLASH (barcha ma'lumotlarni tozalash) va xavfsiz chiqish
// ====================================================================
const RESET_WORD = 'TOZALASH';
const CLOUD_COLLECTIONS = ['products', 'customers', 'sales', 'debt_payments', 'categories', 'expenses', 'suppliers', 'stock_income', 'shifts'];

function stopRealtimeListeners() {
    realtimeUnsubscribes.forEach(unsub => { try { unsub(); } catch (e) {} });
    realtimeUnsubscribes = [];
}

// "Chiqish": bulutdan uzadi, parolni unutadi (aks holda dastur qayta ochilganda o'zi ulanib, ma'lumotni qaytaradi)
function logoutFromCloud() {
    stopRealtimeListeners();
    if (state.currentUser && signOut && auth) signOut(auth);
    state.pass = '';
    localStorage.removeItem('pos_pass');
    if (DOM.settingPass) DOM.settingPass.value = '';
}

async function deleteCloudData() {
    for (const col of CLOUD_COLLECTIONS) {
        const snap = await getDocs(collection(db, 'shops', state.shopId, col));
        let batch = writeBatch(db);
        let n = 0;
        for (const d of snap.docs) {
            batch.delete(d.ref);
            n++;
            if (n === 400) { await batch.commit(); batch = writeBatch(db); n = 0; }
        }
        if (n > 0) await batch.commit();
    }
}

function openResetModal() {
    const loggedIn = !!(state.currentUser && state.shopId && db && getDocs && writeBatch);
    DOM.resetConfirmInput.value = '';
    DOM.resetConfirmBtn.disabled = true;
    DOM.resetBackupCheck.checked = true;
    DOM.resetCloudCheck.checked = false;
    DOM.resetCloudRow.style.display = loggedIn ? 'block' : 'none';
    DOM.resetCloudNote.style.display = loggedIn ? 'block' : 'none';
    DOM.resetCounts.textContent =
        `Hozir: ${state.products.length} ta mahsulot, ${state.sales.length} ta sotuv, ${state.customers.length} ta mijoz.`;
    DOM.resetModal.classList.add('active');
    setTimeout(() => DOM.resetConfirmInput.focus(), 50);
}

async function resetAllData() {
    if (DOM.resetConfirmInput.value.trim().toUpperCase() !== RESET_WORD) return;
    const wantCloud = DOM.resetCloudCheck.checked && !!state.currentUser;
    const wasLoggedIn = !!state.currentUser;
    DOM.resetConfirmBtn.disabled = true;
    DOM.resetConfirmBtn.textContent = 'Tozalanmoqda...';
    try {
        if (DOM.resetBackupCheck.checked) backupDatabase();

        stopRealtimeListeners();
        if (wantCloud) await deleteCloudData();

        state.products = [];
        state.customers = [];
        state.sales = [];
        state.debtPayments = [];
        state.expenses = [];
        state.suppliers = [];
        state.stockIncome = [];
        state.shifts = [];
        state.categories = ['Telefon', 'Aksessuar'];
        state.cart = [];
        salesLimit = LIST_PAGE;
        expensesLimit = LIST_PAGE;
        persistAll();
        await writeChain;

        if (wasLoggedIn && !wantCloud) {
            // Bulutda ma'lumot qolgan: ulanib tursa, hammasi qaytib keladi
            logoutFromCloud();
        } else if (wasLoggedIn) {
            setupRealtimeListeners();
        }

        if (DOM.salesSearchInput)   DOM.salesSearchInput.value = '';
        if (DOM.salesDateFilter)    DOM.salesDateFilter.value = '';
        if (DOM.salesPaymentFilter) DOM.salesPaymentFilter.value = '';
        if (DOM.salesShowReturned)  DOM.salesShowReturned.checked = true;
        if (DOM.posSearchInput) DOM.posSearchInput.value = '';
        DOM.resetModal.classList.remove('active');
        renderAll();
        refreshStorageInfo();
        showToast(wantCloud ? 'Mahalliy va bulutdagi ma\'lumotlar tozalandi. 0 dan boshlashingiz mumkin!' : 'Ma\'lumotlar tozalandi. 0 dan boshlashingiz mumkin!');
    } catch (e) {
        console.error(e);
        showToast('Tozalashda xatolik: ' + (e && e.message ? e.message : e), 'error');
        if (wasLoggedIn && wantCloud) setupRealtimeListeners();
    } finally {
        DOM.resetConfirmBtn.textContent = 'Hammasini o\'chirish';
        DOM.resetConfirmBtn.disabled = DOM.resetConfirmInput.value.trim().toUpperCase() !== RESET_WORD;
    }
}

function setupResetFeature() {
    if (DOM.resetDataBtn) DOM.resetDataBtn.addEventListener('click', openResetModal);
    if (DOM.resetConfirmInput) {
        DOM.resetConfirmInput.addEventListener('input', () => {
            DOM.resetConfirmBtn.disabled = DOM.resetConfirmInput.value.trim().toUpperCase() !== RESET_WORD;
        });
        DOM.resetConfirmInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !DOM.resetConfirmBtn.disabled) resetAllData(); });
    }
    if (DOM.resetConfirmBtn) DOM.resetConfirmBtn.addEventListener('click', resetAllData);
}
// ====================================================================
// ADMIN PAROL TIZIMI
// ====================================================================
// Parol SHA-256 hash sifatida saqlanadi (to'g'ridan-to'g'ri parol saqlanmaydi).
// Sessiya 8 soat amal qiladi — sahifa yopilsa ham token saqlanib qoladi.

const ADMIN_SESSION_KEY  = 'pos_admin_session';
const ADMIN_HASH_KEY     = 'pos_admin_hash';
const ADMIN_SESSION_TTL  = 8 * 60 * 60 * 1000; // 8 soat (ms)
const ADMIN_SALT         = 'dokonim_pos_v1_';   // brute-force dan himoya

async function sha256hex(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getAdminHash()    { return localStorage.getItem(ADMIN_HASH_KEY) || ''; }
function isAdminEnabled()  { return !!getAdminHash(); }

function isAdminLoggedIn() {
    try {
        const raw = localStorage.getItem(ADMIN_SESSION_KEY);
        if (!raw) return false;
        const { token, exp } = JSON.parse(raw);
        if (Date.now() > exp) { localStorage.removeItem(ADMIN_SESSION_KEY); return false; }
        return token === 'ok';
    } catch (e) { return false; }
}

function setAdminSession() {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ token: 'ok', exp: Date.now() + ADMIN_SESSION_TTL }));
}

function clearAdminSession() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
}

// Admin paroli o'rnatilgan bo'lsa va sessiya yo'q bo'lsa — kirish talab etiladi
function requireAdmin(onSuccess) {
    if (!isAdminEnabled()) { onSuccess(); return; }
    if (isAdminLoggedIn()) { onSuccess(); return; }
    openAdminLoginModal(onSuccess);
}

function openAdminLoginModal(onSuccess) {
    if (DOM.adminLoginInput)  DOM.adminLoginInput.value = '';
    if (DOM.adminLoginError)  DOM.adminLoginError.style.display = 'none';
    if (DOM.adminLoginModal)  DOM.adminLoginModal.classList.add('active');
    DOM._adminLoginCallback = onSuccess;
    setTimeout(() => { if (DOM.adminLoginInput) DOM.adminLoginInput.focus(); }, 60);
}

async function handleAdminLogin() {
    const val = DOM.adminLoginInput ? DOM.adminLoginInput.value : '';
    if (!val) return;
    const hash = await sha256hex(ADMIN_SALT + val);
    if (hash !== getAdminHash()) {
        if (DOM.adminLoginError) { DOM.adminLoginError.style.display = 'block'; }
        if (DOM.adminLoginInput) { DOM.adminLoginInput.value = ''; DOM.adminLoginInput.focus(); }
        return;
    }
    setAdminSession();
    if (DOM.adminLoginModal) DOM.adminLoginModal.classList.remove('active');
    if (typeof DOM._adminLoginCallback === 'function') {
        DOM._adminLoginCallback();
        DOM._adminLoginCallback = null;
    }
}

function setupAdminAuth() {
    // Login modal tugmalari
    if (DOM.adminLoginBtn)    DOM.adminLoginBtn.addEventListener('click', handleAdminLogin);
    if (DOM.adminLoginInput)  DOM.adminLoginInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleAdminLogin(); });
    if (DOM.adminLoginCancelBtn) DOM.adminLoginCancelBtn.addEventListener('click', () => {
        if (DOM.adminLoginModal) DOM.adminLoginModal.classList.remove('active');
        DOM._adminLoginCallback = null;
    });

    // Parol o'rnatish / o'zgartirish
    if (DOM.adminSetPasswordBtn) DOM.adminSetPasswordBtn.addEventListener('click', setAdminPassword);
    if (DOM.adminRemovePasswordBtn) DOM.adminRemovePasswordBtn.addEventListener('click', removeAdminPassword);
    if (DOM.adminLogoutBtn) DOM.adminLogoutBtn.addEventListener('click', () => {
        clearAdminSession();
        updateAdminUI();
        showToast('Admin sessiyadan chiqildi', 'warning');
    });

    // Nav tugmalar: sozlamalar va bosh sahifa
    const settingsNavBtn = document.querySelector('[data-target="settings-section"]');
    if (settingsNavBtn) {
        settingsNavBtn.addEventListener('click', e => {
            e.stopImmediatePropagation();
            requireAdmin(() => switchTab('settings-section'));
        }, true);
    }

    updateAdminUI();
}

function updateAdminUI() {
    const enabled = isAdminEnabled();
    const loggedIn = isAdminLoggedIn();
    if (DOM.adminPasswordStatus) {
        DOM.adminPasswordStatus.textContent = enabled
            ? (loggedIn ? 'Admin paroli o\'rnatilgan — siz kirdinigiz (sessiya 8 soat)' : 'Admin paroli o\'rnatilgan')
            : 'Admin paroli o\'rnatilmagan — hamma sozlamalarni ko\'ra oladi';
        DOM.adminPasswordStatus.className = 'hint-text ' + (enabled ? 'text-success' : 'text-danger');
    }
    if (DOM.adminRemovePasswordBtn) DOM.adminRemovePasswordBtn.style.display = enabled ? 'inline-flex' : 'none';
    if (DOM.adminLogoutBtn) DOM.adminLogoutBtn.style.display = (enabled && loggedIn) ? 'inline-flex' : 'none';

    // Bosh sahifadagi maxfiy kartalar
    const protectedCards = document.querySelectorAll('.admin-protected');
    protectedCards.forEach(el => {
        el.style.display = (!enabled || loggedIn) ? '' : 'none';
    });
}

async function setAdminPassword() {
    const newPass = DOM.adminNewPasswordInput ? DOM.adminNewPasswordInput.value.trim() : '';
    const confirmPass = DOM.adminConfirmPasswordInput ? DOM.adminConfirmPasswordInput.value.trim() : '';
    if (!newPass) { showToast('Yangi parolni kiriting!', 'error'); return; }
    if (newPass.length < 4) { showToast('Parol kamida 4 ta belgi bo\'lishi kerak!', 'error'); return; }
    if (newPass !== confirmPass) { showToast('Parollar mos kelmadi!', 'error'); return; }
    if (isAdminEnabled()) {
        const currentVal = DOM.adminCurrentPasswordInput ? DOM.adminCurrentPasswordInput.value : '';
        if (!currentVal) { showToast('Avvalgi parolni ham kiriting!', 'error'); return; }
        const currentHash = await sha256hex(ADMIN_SALT + currentVal);
        if (currentHash !== getAdminHash()) { showToast('Avvalgi parol noto\'g\'ri!', 'error'); return; }
    }
    const hash = await sha256hex(ADMIN_SALT + newPass);
    localStorage.setItem(ADMIN_HASH_KEY, hash);
    setAdminSession();
    if (DOM.adminNewPasswordInput)     DOM.adminNewPasswordInput.value = '';
    if (DOM.adminConfirmPasswordInput) DOM.adminConfirmPasswordInput.value = '';
    if (DOM.adminCurrentPasswordInput) DOM.adminCurrentPasswordInput.value = '';
    updateAdminUI();
    showToast('Admin paroli o\'rnatildi! Sessiya 8 soat davom etadi.');
}

async function removeAdminPassword() {
    if (!isAdminEnabled()) return;
    const val = prompt('Admin parolini o\'chirish uchun hozirgi parolni kiriting:');
    if (!val) return;
    const hash = await sha256hex(ADMIN_SALT + val);
    if (hash !== getAdminHash()) { showToast('Parol noto\'g\'ri!', 'error'); return; }
    localStorage.removeItem(ADMIN_HASH_KEY);
    clearAdminSession();
    updateAdminUI();
    showToast('Admin paroli o\'chirildi. Endi hamma sozlamalarni ko\'ra oladi.', 'warning');
}

// ====================================================================
// SMENA (kassa smenasi): ochish, yopish, Z-hisobot
// ====================================================================
const $id = (id) => document.getElementById(id);
const numv = (v) => parseFloat(v) || 0;
let currentShiftReportId = null;

function getOpenShift() {
    const open = state.shifts.filter(s => s && s.status === 'open');
    if (!open.length) return null;
    return open.sort((a, b) => ((b.opened || '') > (a.opened || '') ? 1 : -1))[0];
}

// Admin paroli yoqilgan bo'lsa, summalarni faqat admin ko'radi
function canSeeMoney() { return !isAdminEnabled() || isAdminLoggedIn(); }

function shiftNumber(shift) {
    const sorted = state.shifts.slice().sort((a, b) => ((a.opened || '') > (b.opened || '') ? 1 : -1));
    return sorted.findIndex(s => s.id === shift.id) + 1;
}

function parseLocalDT(str) {
    const d = new Date(String(str || '').replace(' ', 'T'));
    return isNaN(d.getTime()) ? null : d;
}

function fmtDuration(fromStr, toStr) {
    const a = parseLocalDT(fromStr);
    const b = toStr ? parseLocalDT(toStr) : new Date();
    if (!a || !b) return '';
    const mins = Math.max(0, Math.round((b - a) / 60000));
    const h = Math.floor(mins / 60), m = mins % 60;
    return h > 0 ? `${h} soat ${m} daqiqa` : `${m} daqiqa`;
}

// To'lov turini aniqlash: yangi sotuvlarda `method` bor, eskilarida faqat `payment` yorlig'i
function saleMethodKey(s) {
    const m = String(s.method || s.payment || 'Naqd');
    if (m === 'Karta') return 'card';
    if (m.startsWith('Dollar')) return 'usd';
    if (m === 'Aralash' || m === 'Aralash/Qarz') return 'mixed';
    return 'cash'; // Naqd va Qarz (qisman to'langan qismi naqd deb hisoblanadi)
}

function salePaidAmount(s) {
    const total = numv(s.total);
    if (s.paid !== undefined && s.paid !== null && s.paid !== '') return Math.min(total, Math.max(0, numv(s.paid)));
    return s.payment === 'Qarz' ? 0 : total;
}

// Smena vaqt oralig'idagi hamma harakat: sotuv, qaytarish, xarajat, qarz to'lovi
function computeShiftSummary(shift) {
    const from = shift.opened || '';
    const to = shift.closed || '9999-12-31 23:59:59';
    const inRange = (t) => !!t && t >= from && t <= to;
    const r = {
        salesCount: 0, grossTotal: 0, discountTotal: 0,
        cash: 0, card: 0, usd: 0, mixed: 0, creditGiven: 0,
        returnsCount: 0, returnsTotal: 0, cashRefunds: 0,
        expensesCount: 0, expensesTotal: 0,
        debtPayCount: 0, debtPayTotal: 0
    };
    for (const s of state.sales) {
        if (inRange(s.created)) {
            const total = numv(s.total), paid = salePaidAmount(s);
            r.salesCount++;
            r.grossTotal += total;
            r.discountTotal += numv(s.discount);
            r[saleMethodKey(s)] += paid;
            r.creditGiven += Math.max(0, total - paid);
        }
        if (s.returned === 1 && inRange(s.returned_at || s.updated)) {
            r.returnsCount++;
            r.returnsTotal += numv(s.total);
            if (saleMethodKey(s) !== 'card') r.cashRefunds += salePaidAmount(s); // karta qaytimi kassadan chiqmaydi
        }
    }
    for (const e of state.expenses) {
        if (inRange(e.created)) { r.expensesCount++; r.expensesTotal += numv(e.amount); }
    }
    for (const d of state.debtPayments) {
        if (inRange(d.created)) { r.debtPayCount++; r.debtPayTotal += numv(d.amount); }
    }
    r.cashIn = r.cash + r.usd + r.mixed;
    r.expectedCash = numv(shift.opening_cash) + r.cashIn + r.debtPayTotal - r.expensesTotal - r.cashRefunds;
    return r;
}

function openShiftNow(cashier, openingCash) {
    if (getOpenShift()) { showToast('Smena allaqachon ochiq!', 'warning'); return null; }
    const now = getLocalDateTime();
    const shift = {
        id: 'SHIFT-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        status: 'open',
        cashier: String(cashier || '').trim(),
        opened: now, closed: '',
        opening_cash: Math.max(0, numv(openingCash)),
        counted_cash: null, expected_cash: null, difference: null,
        summary: null, note: '', updated: now
    };
    state.shifts.push(shift);
    syncDoc('shifts', shift.id, shift);
    return shift;
}

function closeShiftNow(countedCash, note) {
    const shift = getOpenShift();
    if (!shift) return null;
    const now = getLocalDateTime();
    shift.closed = now;
    const sum = computeShiftSummary(shift);
    shift.status = 'closed';
    shift.summary = sum;
    shift.expected_cash = sum.expectedCash;
    shift.counted_cash = Math.max(0, numv(countedCash));
    shift.difference = shift.counted_cash - sum.expectedCash;
    shift.note = String(note || '').trim();
    shift.updated = now;
    syncDoc('shifts', shift.id, shift);
    return shift;
}

// ---------- Z / X hisobot (chek ko'rinishida) ----------
function diffText(d) {
    const v = Math.round(d);
    if (v === 0) return '0 (teng)';
    return v > 0 ? `+${fmtNum(v)} (ortiqcha)` : `-${fmtNum(-v)} (kam)`;
}

function buildShiftReportHTML(shift) {
    const closed = shift.status === 'closed';
    const sum = closed && shift.summary ? shift.summary : computeShiftSummary(shift);
    const row = (label, val) => `<div class="row"><span>${label}</span><b>${val}</b></div>`;
    const money = (v) => `${fmtNum(v)} so'm`;
    const footerLines = [];
    return `
        <div class="c">
            <div class="shop">${escapeHtml(state.shopName)}</div>
            ${state.shopPhone ? `<div class="sub">Tel: ${escapeHtml(state.shopPhone)}</div>` : ''}
        </div>
        <div class="hr dbl"></div>
        <div class="title">SMENA HISOBOTI</div>
        <div class="c sub">${closed ? '(Z — smena yopildi)' : '(X — oraliq, smena ochiq)'}</div>
        <div class="hr"></div>
        <div class="meta">
            <div class="row"><span>Smena №:</span><span>${shiftNumber(shift)}</span></div>
            <div class="row"><span>Kassir:</span><span>${escapeHtml(shift.cashier || '—')}</span></div>
            <div class="row"><span>Ochildi:</span><span>${escapeHtml(fmtReceiptDate(shift.opened))}</span></div>
            <div class="row"><span>${closed ? 'Yopildi:' : 'Hozir:'}</span><span>${escapeHtml(fmtReceiptDate(closed ? shift.closed : getLocalDateTime()))}</span></div>
            <div class="row"><span>Davomiyligi:</span><span>${escapeHtml(fmtDuration(shift.opened, closed ? shift.closed : ''))}</span></div>
        </div>
        <div class="hr solid"></div>
        <div class="sum">
            ${row('Sotuvlar soni:', sum.salesCount + ' ta')}
            ${row('Sotuv summasi:', money(sum.grossTotal))}
            ${sum.discountTotal > 0 ? row('Shundan chegirma:', money(sum.discountTotal)) : ''}
        </div>
        <div class="hr"></div>
        <div class="title" style="letter-spacing:1px;">TO'LOV TURLARI</div>
        <div class="sum">
            ${row('Naqd:', money(sum.cash))}
            ${row('Karta:', money(sum.card))}
            ${sum.usd > 0 ? row('Dollar (so\'m ekv.):', money(sum.usd)) : ''}
            ${sum.mixed > 0 ? row('Aralash (naqdga qo\'shildi):', money(sum.mixed)) : ''}
            ${row('Nasiyaga berildi:', money(sum.creditGiven))}
        </div>
        <div class="hr"></div>
        <div class="sum">
            ${row('Qaytarishlar (' + sum.returnsCount + ' ta):', '-' + money(sum.returnsTotal))}
            ${row('Xarajatlar (' + sum.expensesCount + ' ta):', '-' + money(sum.expensesTotal))}
            ${row('Qarz to\'lovlari (' + sum.debtPayCount + ' ta):', '+' + money(sum.debtPayTotal))}
        </div>
        <div class="hr solid"></div>
        <div class="title" style="letter-spacing:1px;">NAQD PUL (KASSA)</div>
        <div class="sum">
            ${row('Boshlang\'ich naqd:', money(shift.opening_cash))}
            ${row('Kassada bo\'lishi kerak:', money(sum.expectedCash))}
            ${closed ? row('Sanab chiqilgan:', money(shift.counted_cash)) : ''}
        </div>
        ${closed ? `<div class="total"><span>FARQ:</span><span>${diffText(shift.difference)}</span></div>` : ''}
        ${shift.note ? `<div class="small" style="text-align:left;margin-top:6px;">Izoh: ${escapeHtml(shift.note)}</div>` : ''}
        <div class="hr dbl"></div>
        <div class="sig">Kassir imzosi</div>
        <div class="sig">Qabul qildi (egasi / admin)</div>
    `;
}

function shiftReportWrapper(shift) {
    const cfg = paperConfig();
    return `<div class="rc" style="--w:${cfg.w}; --fs:${cfg.fs};">${buildShiftReportHTML(shift)}</div>`;
}

function showShiftReport(shiftId) {
    const shift = state.shifts.find(s => s.id === shiftId);
    if (!shift) return;
    currentShiftReportId = shiftId;
    $id('shift-report-paper').innerHTML = shiftReportWrapper(shift);
    $id('shift-report-modal').classList.add('active');
}

function printShiftReport(shiftId) {
    const shift = state.shifts.find(s => s.id === (shiftId || currentShiftReportId));
    if (!shift) return;
    printDocument(shiftReportWrapper(shift), 'Smena ' + shiftNumber(shift), false);
}

window.viewShiftReport = function(id) { showShiftReport(id); };

// ---------- Ekranni chizish ----------
function renderShiftChip() {
    const chip = $id('shift-chip');
    if (!chip) return;
    const open = getOpenShift();
    chip.classList.toggle('open', !!open);
    chip.classList.toggle('closed', !open);
    $id('shift-chip-text').textContent = open
        ? `Smena ochiq${open.cashier ? ': ' + open.cashier : ''}`
        : 'Smena yopiq';
}

function renderShiftSection() {
    const card = $id('shift-status-card');
    if (!card) return;
    const open = getOpenShift();
    if (!open) {
        card.innerHTML = `
            <div class="shift-state closed"><i class="fa-solid fa-lock"></i> Smena yopiq</div>
            <p class="hint-text">${state.shiftRequired
                ? 'Sotuv qilish uchun avval smenani oching.'
                : 'Smena ochish ixtiyoriy: ochsangiz, kun oxirida kassa hisobotini olasiz.'}</p>
            <button class="btn btn-primary btn-lg" onclick="openShiftOpenModal()"><i class="fa-solid fa-lock-open"></i> Smenani ochish</button>`;
    } else {
        const long = (Date.now() - (parseLocalDT(open.opened) || new Date()).getTime()) > 24 * 3600 * 1000;
        card.innerHTML = `
            <div class="shift-state open"><i class="fa-solid fa-lock-open"></i> Smena №${shiftNumber(open)} ochiq</div>
            <div class="shift-meta">
                <div><span>Kassir</span><b>${escapeHtml(open.cashier || '—')}</b></div>
                <div><span>Ochilgan</span><b>${escapeHtml(fmtReceiptDate(open.opened))}</b></div>
                <div><span>Davomiyligi</span><b>${escapeHtml(fmtDuration(open.opened, ''))}</b></div>
                <div><span>Boshlang'ich naqd</span><b>${fmtNum(open.opening_cash)} so'm</b></div>
            </div>
            ${long ? '<p class="hint-text text-danger"><i class="fa-solid fa-triangle-exclamation"></i> Smena 24 soatdan ortiq ochiq. Kunlik hisobot uchun uni yopib, yangisini oching.</p>' : ''}
            <div class="shift-actions">
                <button class="btn btn-danger btn-lg" onclick="openShiftCloseModal()"><i class="fa-solid fa-lock"></i> Smenani yopish</button>
            </div>`;
    }

    // Jonli ko'rsatkichlar (admin-protected)
    const live = $id('shift-live-body');
    if (live) {
        if (!open) {
            live.innerHTML = '<p class="hint-text">Smena ochilganda bu yerda ko\'rsatkichlar paydo bo\'ladi.</p>';
        } else {
            const s = computeShiftSummary(open);
            const cell = (label, val, cls) => `<div class="shift-cell"><span>${label}</span><b class="${cls || ''}">${val}</b></div>`;
            live.innerHTML = `
                <div class="shift-grid">
                    ${cell('Sotuvlar', s.salesCount + ' ta')}
                    ${cell('Sotuv summasi', fmtNum(s.grossTotal) + ' so\'m')}
                    ${cell('Naqd', fmtNum(s.cash + s.usd + s.mixed) + ' so\'m')}
                    ${cell('Karta', fmtNum(s.card) + ' so\'m')}
                    ${cell('Nasiyaga', fmtNum(s.creditGiven) + ' so\'m')}
                    ${cell('Qaytarishlar', '-' + fmtNum(s.returnsTotal) + ' so\'m', 'text-danger')}
                    ${cell('Xarajatlar', '-' + fmtNum(s.expensesTotal) + ' so\'m', 'text-danger')}
                    ${cell('Qarz to\'lovlari', '+' + fmtNum(s.debtPayTotal) + ' so\'m', 'text-success')}
                    ${cell('Kassada bo\'lishi kerak', fmtNum(s.expectedCash) + ' so\'m', 'shift-expected')}
                </div>
                <button class="btn btn-secondary" onclick="showShiftReport('${open.id}')"><i class="fa-solid fa-file-lines"></i> Oraliq hisobot (X)</button>`;
        }
    }

    // Tarix (admin-protected)
    const body = $id('shift-history-body');
    if (body) {
        const closed = state.shifts.filter(s => s.status === 'closed')
            .sort((a, b) => ((b.opened || '') > (a.opened || '') ? 1 : -1)).slice(0, 100);
        if (!closed.length) {
            body.innerHTML = '<tr><td colspan="9" class="text-center">Yopilgan smenalar yo\'q</td></tr>';
        } else {
            body.innerHTML = closed.map(s => {
                const sum = s.summary || {};
                const d = numv(s.difference);
                const cls = Math.round(d) === 0 ? 'text-success' : (d < 0 ? 'text-danger' : 'shift-over');
                return `<tr>
                    <td><strong>№${shiftNumber(s)}</strong></td>
                    <td>${escapeHtml(s.cashier || '—')}</td>
                    <td>${escapeHtml(fmtReceiptDate(s.opened))}</td>
                    <td>${escapeHtml(fmtReceiptDate(s.closed))}</td>
                    <td>${fmtNum(sum.grossTotal)}</td>
                    <td>${fmtNum(s.expected_cash)}</td>
                    <td>${fmtNum(s.counted_cash)}</td>
                    <td class="${cls}"><strong>${diffText(d)}</strong></td>
                    <td><button class="btn btn-xs btn-secondary" title="Hisobot" onclick="viewShiftReport('${s.id}')"><i class="fa-solid fa-print"></i></button></td>
                </tr>`;
            }).join('');
        }
    }
    updateAdminUI();
}

// ---------- Oynalar ----------
window.openShiftOpenModal = function() {
    if (getOpenShift()) { showToast('Smena allaqachon ochiq!', 'warning'); return; }
    // Oldingi smena yopilgan naqd pulni taklif qilamiz
    const prev = state.shifts.filter(s => s.status === 'closed')
        .sort((a, b) => ((b.closed || '') > (a.closed || '') ? 1 : -1))[0];
    $id('shift-open-cashier').value = (prev && prev.cashier) || '';
    $id('shift-open-cash').value = prev ? Math.round(numv(prev.counted_cash)) : '';
    $id('shift-open-hint').textContent = prev ? 'Oldingi smena yopilganda sanalgan naqd pul qo\'yildi.' : '';
    $id('shift-open-modal').classList.add('active');
    setTimeout(() => $id('shift-open-cashier').focus(), 50);
};

function updateShiftCloseDiff() {
    const open = getOpenShift();
    const box = $id('shift-diff-box');
    if (!open || !box || !canSeeMoney()) return;
    const raw = $id('shift-close-counted').value;
    if (raw === '') { box.textContent = 'Sanab chiqilgan summani kiriting'; box.className = 'shift-diff'; return; }
    const exp = computeShiftSummary(open).expectedCash;
    const d = numv(raw) - exp;
    box.textContent = 'Farq: ' + diffText(d);
    box.className = 'shift-diff ' + (Math.round(d) === 0 ? 'ok' : (d < 0 ? 'bad' : 'over'));
}

window.openShiftCloseModal = function() {
    const open = getOpenShift();
    if (!open) { showToast('Ochiq smena yo\'q', 'warning'); return; }
    const see = canSeeMoney();
    const sum = computeShiftSummary(open);
    $id('shift-close-summary').style.display = see ? 'block' : 'none';
    $id('shift-diff-box').style.display = see ? 'block' : 'none';
    $id('shift-close-blind').style.display = see ? 'none' : 'block';
    if (see) {
        const line = (l, v) => `<div class="storage-row"><span>${l}</span><b>${v}</b></div>`;
        $id('shift-close-summary').innerHTML =
            line('Sotuvlar', `${sum.salesCount} ta — ${fmtNum(sum.grossTotal)} so'm`) +
            line('Boshlang\'ich naqd', fmtNum(open.opening_cash) + ' so\'m') +
            line('Naqd tushum', fmtNum(sum.cashIn) + ' so\'m') +
            line('Qarz to\'lovlari', '+' + fmtNum(sum.debtPayTotal) + ' so\'m') +
            line('Xarajatlar', '-' + fmtNum(sum.expensesTotal) + ' so\'m') +
            line('Naqd qaytarishlar', '-' + fmtNum(sum.cashRefunds) + ' so\'m') +
            line('<strong>Kassada bo\'lishi kerak</strong>', `<strong>${fmtNum(sum.expectedCash)} so'm</strong>`);
    }
    $id('shift-close-counted').value = '';
    $id('shift-close-note').value = '';
    $id('shift-close-print').checked = true;
    updateShiftCloseDiff();
    $id('shift-close-modal').classList.add('active');
    setTimeout(() => $id('shift-close-counted').focus(), 50);
};

function setupShifts() {
    $id('shift-chip')?.addEventListener('click', () => switchTab('shifts-section'));

    $id('shift-open-confirm')?.addEventListener('click', () => {
        const cash = $id('shift-open-cash').value;
        if (cash === '' || numv(cash) < 0) { showToast('Boshlang\'ich naqd summani kiriting (0 ham bo\'ladi)', 'error'); return; }
        const shift = openShiftNow($id('shift-open-cashier').value, cash);
        if (!shift) return;
        $id('shift-open-modal').classList.remove('active');
        renderShiftChip();
        renderShiftSection();
        showToast(`Smena №${shiftNumber(shift)} ochildi`);
        focusScanInput();
    });
    $id('shift-open-cash')?.addEventListener('keydown', e => { if (e.key === 'Enter') $id('shift-open-confirm').click(); });

    $id('shift-close-counted')?.addEventListener('input', updateShiftCloseDiff);
    $id('shift-close-counted')?.addEventListener('keydown', e => { if (e.key === 'Enter') $id('shift-close-confirm').click(); });
    $id('shift-close-confirm')?.addEventListener('click', () => {
        const counted = $id('shift-close-counted').value;
        if (counted === '' || numv(counted) < 0) { showToast('Kassadagi naqd pulni sanab, summani kiriting', 'error'); return; }
        const wantPrint = $id('shift-close-print').checked;
        const see = canSeeMoney();
        const shift = closeShiftNow(counted, $id('shift-close-note').value);
        if (!shift) return;
        $id('shift-close-modal').classList.remove('active');
        renderShiftChip();
        renderShiftSection();
        showToast(`Smena №${shiftNumber(shift)} yopildi`);
        if (see) showShiftReport(shift.id);          // admin: ekranda ko'radi
        else if (wantPrint) printShiftReport(shift.id); // kassir: hisobot egasi uchun chop etiladi
    });

    $id('shift-report-print-btn')?.addEventListener('click', () => printShiftReport());
    document.querySelectorAll('.shift-modal-close').forEach(b => b.addEventListener('click', () => b.closest('.modal').classList.remove('active')));
}
