function renderSidebar() {
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    sidebar.innerHTML = `
        <div class="sidebar-brand">
            <img src="/assets/logo.svg" alt="Energy Monitor Logo">
            <h2>Energy Monitor</h2>
        </div>
        <nav class="sidebar-nav">
            <ul>
                <li class="active">
                    <a href="#">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>Dashboard</span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <i class="fas fa-chart-line"></i>
                        <span>Analytics</span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <i class="fas fa-bolt"></i>
                        <span>Devices</span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <i class="fas fa-history"></i>
                        <span>History</span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <i class="fas fa-cog"></i>
                        <span>Settings</span>
                    </a>
                </li>
            </ul>
        </nav>
        <div class="sidebar-footer">
            <div class="system-status">
                <div class="status-indicator online"></div>
                <span>System Online</span>
            </div>
            <button class="logout-btn">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </button>
        </div>
    `;
    
    document.getElementById('app').prepend(sidebar);
    
    // Add styles for sidebar
    const style = document.createElement('style');
    style.textContent = `
        .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: var(--sidebar-width);
            height: 100vh;
            background-color: #ffffff;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
            z-index: 100;
            transition: transform var(--transition-speed);
            display: flex;
            flex-direction: column;
        }
        
        .sidebar-brand {
            padding: 1.5rem;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .sidebar-brand img {
            width: 32px;
            height: 32px;
            margin-right: 12px;
        }
        
        .sidebar-brand h2 {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0;
            color: #1a1a1a;
        }
        
        .sidebar-nav {
            flex: 1;
            padding: 1rem 0;
            overflow-y: auto;
        }
        
        .sidebar-nav ul {
            list-style: none;
        }
        
        .sidebar-nav li a {
            display: flex;
            align-items: center;
            padding: 0.75rem 1.5rem;
            color: #666;
            text-decoration: none;
            transition: all 0.2s;
        }
        
        .sidebar-nav li a:hover {
            background-color: #f5f7fa;
            color: #4361ee;
        }
        
        .sidebar-nav li.active a {
            background-color: rgba(67, 97, 238, 0.1);
            color: #4361ee;
            border-left: 3px solid #4361ee;
        }
        
        .sidebar-nav li i {
            width: 24px;
            margin-right: 12px;
            text-align: center;
        }
        
        .sidebar-footer {
            padding: 1rem;
            border-top: 1px solid #f0f0f0;
        }
        
        .system-status {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            color: #666;
        }
        
        .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        .status-indicator.online {
            background-color: #4CAF50;
        }
        
        .logout-btn {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 0.5rem 1rem;
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            transition: all 0.2s;
            border-radius: 4px;
        }
        
        .logout-btn:hover {
            background-color: #f5f7fa;
            color: #f44336;
        }
        
        .logout-btn i {
            margin-right: 8px;
        }
        
        /* Collapsed state */
        .sidebar-collapsed {
            margin-left: 0;
        }
    `;
    document.head.appendChild(style);
}

// Initialize sidebar
renderSidebar();