// Simple SPA navigation
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");

navLinks.forEach(btn => {
    btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");

        navLinks.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        sections.forEach(sec => {
            sec.classList.toggle("visible", sec.id === targetId);
        });
    });
});

// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Registration logic
const registerForm = document.getElementById("registerForm");
const registerMsg = document.getElementById("registerMessage");
const regRole = document.getElementById("regRole");
const customerExtra = document.getElementById("customerExtra");

regRole.addEventListener("change", () => {
    if (regRole.value === "customer") {
        customerExtra.classList.remove("hidden");
    } else {
        customerExtra.classList.add("hidden");
    }
});

function getStoredUsers() {
    return JSON.parse(localStorage.getItem("autofix_users") || "[]");
}
function saveUsers(users) {
    localStorage.setItem("autofix_users", JSON.stringify(users));
}

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    registerMsg.textContent = "";
    registerMsg.className = "form-message";

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const phone = document.getElementById("regPhone").value.trim();
    const role = regRole.value;
    const pass = document.getElementById("regPassword").value;
    const confirm = document.getElementById("regConfirm").value;
    const carModel = document.getElementById("regCarModel").value.trim();
    const plate = document.getElementById("regPlate").value.trim();

    if (pass !== confirm) {
        registerMsg.textContent = "Passwords do not match.";
        registerMsg.classList.add("error");
        return;
    }

    const users = getStoredUsers();
    if (users.some(u => u.email === email)) {
        registerMsg.textContent = "Email already registered.";
        registerMsg.classList.add("error");
        return;
    }

    const newUser = { name, email, phone, role, pass, carModel, plate };
    users.push(newUser);
    saveUsers(users);

    registerMsg.textContent = "Account created successfully. You can login now.";
    registerMsg.classList.add("success");
    registerForm.reset();
    customerExtra.classList.add("hidden");
});

// Login / logout
const loginForm = document.getElementById("loginForm");
const loginMsg = document.getElementById("loginMessage");
const loggedUserBox = document.getElementById("loggedUserBox");
const loggedUserName = document.getElementById("loggedUserName");
const loggedUserRole = document.getElementById("loggedUserRole");
const logoutBtn = document.getElementById("logoutBtn");

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem("autofix_current_user", JSON.stringify(user));
    } else {
        localStorage.removeItem("autofix_current_user");
    }
    refreshCurrentUserUI();
}

function getCurrentUser() {
    const str = localStorage.getItem("autofix_current_user");
    return str ? JSON.parse(str) : null;
}

function refreshCurrentUserUI() {
    const user = getCurrentUser();
    if (user) {
        loggedUserName.textContent = user.name;
        loggedUserRole.textContent = user.role;
        loggedUserBox.classList.remove("hidden");
    } else {
        loggedUserBox.classList.add("hidden");
    }
}
refreshCurrentUserUI();

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    loginMsg.textContent = "";
    loginMsg.className = "form-message";

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const pass = document.getElementById("loginPassword").value;

    const users = getStoredUsers();
    const user = users.find(u => u.email === email && u.pass === pass);

    if (!user) {
        loginMsg.textContent = "Invalid email or password.";
        loginMsg.classList.add("error");
        return;
    }

    setCurrentUser(user);
    loginMsg.textContent = "Logged in successfully.";
    loginMsg.classList.add("success");
    loginForm.reset();
});

logoutBtn.addEventListener("click", () => {
    setCurrentUser(null);
});

// Service orders
const serviceForm = document.getElementById("serviceForm");
const serviceMsg = document.getElementById("serviceMessage");
const ordersTableBody = document.querySelector("#ordersTable tbody");

function getOrders() {
    return JSON.parse(localStorage.getItem("autofix_orders") || "[]");
}
function saveOrders(orders) {
    localStorage.setItem("autofix_orders", JSON.stringify(orders));
}

function renderOrders() {
    const orders = getOrders();
    ordersTableBody.innerHTML = "";
    orders.forEach((o, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${o.customerName}</td>
          <td>${o.carModel}</td>
          <td>${o.plate}</td>
          <td>${o.serviceType}</td>
          <td>${o.status}</td>
          <td>${o.date}</td>
        `;
        ordersTableBody.appendChild(tr);
    });

    // Finance demo
    const estRevenue = orders.length * 150;
    document.getElementById("totalOrders").textContent = orders.length;
    document.getElementById("estimatedRevenue").textContent = `$${estRevenue}`;
}
renderOrders();

serviceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    serviceMsg.textContent = "";
    serviceMsg.className = "form-message";

    const order = {
        customerName: document.getElementById("srvCustomerName").value.trim(),
        carModel: document.getElementById("srvCarModel").value.trim(),
        plate: document.getElementById("srvPlate").value.trim(),
        serviceType: document.getElementById("srvType").value,
        date: document.getElementById("srvDate").value,
        status: document.getElementById("srvStatus").value,
        notes: document.getElementById("srvNotes").value.trim(),
        createdBy: getCurrentUser()?.email || "guest"
    };

    const orders = getOrders();
    orders.push(order);
    saveOrders(orders);

    serviceMsg.textContent = "Repair order saved.";
    serviceMsg.classList.add("success");
    serviceForm.reset();
    renderOrders();
});

// Simple inventory demo data
const inventoryList = document.getElementById("inventoryList");
const demoInventory = [
    { part: "Oil Filter", qty: 24 },
    { part: "Brake Pads", qty: 10 },
    { part: "Spark Plugs", qty: 40 },
    { part: "Engine Oil 5W-30", qty: 60 },
    { part: "Battery 12V", qty: 6 }
];

function renderInventory() {
    inventoryList.innerHTML = "";
    demoInventory.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${item.part}</span>
          <span>${item.qty} pcs</span>
        `;
        inventoryList.appendChild(li);
    });
}
renderInventory();
