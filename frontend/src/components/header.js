function renderHeader() {
    const header = document.createElement('header');
    header.className = 'dashboard-header';
    header.innerHTML = `
        <div class="header-left">
            <button class="menu-toggle" id="menuToggle">
                <i class="fas fa-bars"></i>
            </button>
            <h1>Energy Monitoring Dashboard</h1>
        </div>
        <div class="header-right">
            <div class="notification">
                <i class="fas fa-bell"></i>
                <span class="badge">3</span>
            </div>
            <div class="user-profile">
                <img src="/assets/images/avatar.png" alt="User Avatar">
                <span>Admin</span>
            </div>
        </div>
    `;
    
    document.querySelector('.main-content').prepend(header);
    
    // Add event listener for menu toggle
    const menuToggle = document.getElementById('menuToggle');
    menuToggle.addEventListener('click', toggleSidebar);
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('sidebar-collapsed');
}

// Initialize header
renderHeader();