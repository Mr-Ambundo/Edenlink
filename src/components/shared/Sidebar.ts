export class Sidebar {
  private isCollapsed = false
  private isMobileOpen = false
  private currentRoute = '/'

  private navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/my-farm', icon: '🌱', label: 'My Farm' },
    { path: '/crop-roadmap', icon: '🗺️', label: 'Crop Roadmap' },
    { path: '/ai-tips', icon: '🤖', label: 'AI Tips' },
    { path: '/logistics', icon: '🚛', label: 'Logistics' },
    { path: '/training', icon: '🎓', label: 'Training' },
    { path: '/partnerships', icon: '🤝', label: 'Partnerships' },
    { path: '/settings', icon: '⚙️', label: 'Settings' }
  ]

  render(): HTMLElement {
    const container = document.createElement('div')
    container.className = 'sidebar-container'
    
    container.innerHTML = `
      <!-- Mobile Toggle Button -->
      <button id="mobile-toggle" class="mobile-toggle">
        <i class="fas fa-bars"></i>
      </button>

      <!-- Sidebar Overlay for Mobile -->
      <div id="sidebar-overlay" class="sidebar-overlay"></div>

      <!-- Sidebar -->
      <div id="sidebar" class="sidebar ${this.isCollapsed ? 'collapsed' : ''}">
        <!-- Sidebar Header -->
        <div class="sidebar-header">
          <div class="logo">
            <div class="logo-icon">E</div>
            <span class="logo-text ${this.isCollapsed ? 'hidden' : ''}">Eden Link</span>
          </div>
          <button id="collapse-toggle" class="collapse-toggle">
            <i class="fas ${this.isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}"></i>
          </button>
        </div>

        <!-- User Profile -->
        <div class="user-profile ${this.isCollapsed ? 'collapsed' : ''}">
          <div class="avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="profile-info ${this.isCollapsed ? 'hidden' : ''}">
            <div class="profile-name">John Farmer</div>
            <div class="profile-role">Farm Owner</div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
          <ul class="nav-list">
            ${this.navItems.map(item => `
              <li class="nav-item ${this.currentRoute === item.path ? 'active' : ''} ${this.isCollapsed ? 'collapsed' : ''}" 
                  data-route="${item.path}">
                <div class="nav-icon">${item.icon}</div>
                <span class="nav-label ${this.isCollapsed ? 'hidden' : ''}">${item.label}</span>
              </li>
            `).join('')}
          </ul>
        </nav>

        <!-- Sidebar Footer -->
        <div class="sidebar-footer ${this.isCollapsed ? 'collapsed' : ''}">
          <div class="system-status">
            <div class="status-indicator online"></div>
            <span class="status-text ${this.isCollapsed ? 'hidden' : ''}">System Online</span>
          </div>
        </div>
      </div>

      <style>
        .sidebar-container {
          position: relative;
          z-index: 1000;
        }

        .mobile-toggle {
          display: none;
          position: fixed;
          top: 12px;
          left: 12px;
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #006d5b, #008e73);
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          z-index: 1002;
          box-shadow: 0 4px 12px rgba(0, 109, 91, 0.3);
          transition: all 0.3s ease;
        }

        .mobile-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 109, 91, 0.4);
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          backdrop-filter: blur(4px);
        }

        .sidebar-overlay.show {
          display: block;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          height: 100vh;
          background: linear-gradient(180deg, #ffffff 0%, #f8fffe 100%);
          border-right: 1px solid #e5e7eb;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1001;
          overflow: hidden;
        }

        .sidebar.collapsed {
          width: 80px;
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid #f1f5f9;
          position: relative;
          background: linear-gradient(135deg, #006d5b, #008e73);
          color: white;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
          color: white;
          flex-shrink: 0;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: white;
          transition: opacity 0.3s ease;
        }

        .logo-text.hidden {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }

        .collapse-toggle {
          position: absolute;
          right: -16px;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          background: white;
          border: none;
          border-radius: 50%;
          color: #006d5b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .collapse-toggle:hover {
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .user-profile {
          padding: 20px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .user-profile.collapsed {
          justify-content: center;
          padding: 20px 10px;
        }

        .avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #8d90bb, #a8b1d4);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          flex-shrink: 0;
        }

        .profile-info {
          flex: 1;
          min-width: 0;
          transition: opacity 0.3s ease;
        }

        .profile-info.hidden {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }

        .profile-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 16px;
          margin-bottom: 2px;
        }

        .profile-role {
          color: #6b7280;
          font-size: 14px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 12px 0;
          overflow-y: auto;
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 20px;
          margin: 4px 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #6b7280;
          font-weight: 500;
          position: relative;
        }

        .nav-item.collapsed {
          justify-content: center;
          padding: 12px;
          margin: 4px 16px;
        }

        .nav-item:hover {
          background: linear-gradient(135deg, rgba(0, 109, 91, 0.1), rgba(0, 142, 115, 0.05));
          color: #006d5b;
          transform: translateX(4px);
        }

        .nav-item.active {
          background: linear-gradient(135deg, #006d5b, #008e73);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 109, 91, 0.3);
        }

        .nav-item.active:hover {
          transform: translateX(0);
        }

        .nav-icon {
          font-size: 20px;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
        }

        .nav-label {
          font-size: 15px;
          transition: opacity 0.3s ease;
        }

        .nav-label.hidden {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid #f1f5f9;
          transition: all 0.3s ease;
        }

        .sidebar-footer.collapsed {
          padding: 20px 10px;
        }

        .system-status {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #f8fffe;
          border-radius: 8px;
          border: 1px solid #e5f3f1;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .status-indicator.online {
          background: #10b981;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
          animation: pulse 2s infinite;
        }

        .status-text {
          font-size: 14px;
          color: #059669;
          font-weight: 500;
          transition: opacity 0.3s ease;
        }

        .status-text.hidden {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Mobile Responsive */
        @media (max-width: 1024px) {
          .mobile-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.mobile-open {
            transform: translateX(0);
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            max-width: 320px;
          }
        }
      </style>
    `

    return container
  }

  mounted(): void {
    this.updateCurrentRoute()
    this.setupEventListeners()
    this.setupRouteListener()
  }

  private setupEventListeners(): void {
    // Mobile toggle
    const mobileToggle = document.getElementById('mobile-toggle')
    mobileToggle?.addEventListener('click', () => this.toggleMobile())

    // Sidebar overlay
    const overlay = document.getElementById('sidebar-overlay')
    overlay?.addEventListener('click', () => this.closeMobile())

    // Collapse toggle
    const collapseToggle = document.getElementById('collapse-toggle')
    collapseToggle?.addEventListener('click', () => this.toggleCollapse())

    // Navigation items
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const navItem = target.closest('.nav-item') as HTMLElement
      
      if (navItem) {
        const route = navItem.getAttribute('data-route')
        if (route) {
          this.navigateTo(route)
        }
      }
    })

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && this.isMobileOpen) {
        this.closeMobile()
      }
    })
  }

  private setupRouteListener(): void {
    // Listen for route changes
    window.addEventListener('popstate', () => {
      this.updateCurrentRoute()
    })
  }

  private updateCurrentRoute(): void {
    this.currentRoute = window.location.pathname
    this.updateActiveNavItem()
  }

  private updateActiveNavItem(): void {
    const navItems = document.querySelectorAll('.nav-item')
    navItems.forEach(item => {
      const route = item.getAttribute('data-route')
      if (route === this.currentRoute) {
        item.classList.add('active')
      } else {
        item.classList.remove('active')
      }
    })
  }

  private navigateTo(path: string): void {
    // Use the global router if available
    if ((window as any).router) {
      (window as any).router.navigate(path)
    } else {
      // Fallback navigation
      history.pushState(null, '', path)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
    
    // Close mobile sidebar after navigation
    if (this.isMobileOpen) {
      this.closeMobile()
    }
  }

  private toggleMobile(): void {
    this.isMobileOpen = !this.isMobileOpen
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('sidebar-overlay')
    
    if (sidebar) {
      if (this.isMobileOpen) {
        sidebar.classList.add('mobile-open')
      } else {
        sidebar.classList.remove('mobile-open')
      }
    }
    
    if (overlay) {
      if (this.isMobileOpen) {
        overlay.classList.add('show')
      } else {
        overlay.classList.remove('show')
      }
    }

    // Prevent body scroll when mobile sidebar is open
    document.body.style.overflow = this.isMobileOpen ? 'hidden' : ''
  }

  private closeMobile(): void {
    this.isMobileOpen = false
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('sidebar-overlay')
    
    sidebar?.classList.remove('mobile-open')
    overlay?.classList.remove('show')
    document.body.style.overflow = ''
  }

  private toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed
    const sidebar = document.getElementById('sidebar')
    const collapseIcon = document.querySelector('#collapse-toggle i')
    const hiddenElements = document.querySelectorAll('.sidebar .hidden, .sidebar .logo-text, .sidebar .profile-info, .sidebar .nav-label, .sidebar .status-text')
    
    if (sidebar) {
      if (this.isCollapsed) {
        sidebar.classList.add('collapsed')
      } else {
        sidebar.classList.remove('collapsed')
      }
    }

    // Update collapse icon
    if (collapseIcon) {
      collapseIcon.className = this.isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'
    }

    // Toggle hidden class on text elements
    hiddenElements.forEach(el => {
      if (this.isCollapsed) {
        el.classList.add('hidden')
      } else {
        el.classList.remove('hidden')
      }
    })

    // Update nav items collapsed state
    const navItems = document.querySelectorAll('.nav-item')
    navItems.forEach(item => {
      if (this.isCollapsed) {
        item.classList.add('collapsed')
      } else {
        item.classList.remove('collapsed')
      }
    })

    // Update profile collapsed state
    const profile = document.querySelector('.user-profile')
    if (profile) {
      if (this.isCollapsed) {
        profile.classList.add('collapsed')
      } else {
        profile.classList.remove('collapsed')
      }
    }

    // Update footer collapsed state
    const footer = document.querySelector('.sidebar-footer')
    if (footer) {
      if (this.isCollapsed) {
        footer.classList.add('collapsed')
      } else {
        footer.classList.remove('collapsed')
      }
    }

    // Dispatch event for layout adjustments
    window.dispatchEvent(new CustomEvent('sidebarToggle', { 
      detail: { collapsed: this.isCollapsed } 
    }))
  }

  // Public method to update active route
  setActiveRoute(route: string): void {
    this.currentRoute = route
    this.updateActiveNavItem()
  }

  // Public method to get collapsed state
  isCollapsedState(): boolean {
    return this.isCollapsed
  }
}