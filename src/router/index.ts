import { Route } from '@types/index'

export class Router {
  private routes: Route[] = [
    { path: '/', component: 'landing', title: 'Eden Link - Smart Farming Platform' },
    { path: '/dashboard', component: 'dashboard', title: 'Dashboard - Eden Link', requiresAuth: true },
    { path: '/my-farm', component: 'my-farm', title: 'My Farm - Eden Link', requiresAuth: true },
    { path: '/crop-roadmap', component: 'crop-roadmap', title: 'Crop Roadmap - Eden Link', requiresAuth: true },
    { path: '/ai-tips', component: 'ai-tips', title: 'AI Tips - Eden Link', requiresAuth: true },
    { path: '/logistics', component: 'logistics', title: 'Logistics - Eden Link', requiresAuth: true },
    { path: '/training', component: 'training', title: 'Training - Eden Link', requiresAuth: true },
    { path: '/partnerships', component: 'partnerships', title: 'Partnerships - Eden Link', requiresAuth: true },
    { path: '/settings', component: 'settings', title: 'Settings - Eden Link', requiresAuth: true }
  ]

  private currentRoute: string = '/'
  private appContainer: HTMLElement | null = null

  init() {
    this.appContainer = document.getElementById('app')
    if (!this.appContainer) {
      throw new Error('App container not found')
    }

    // Handle initial route
    this.handleRoute()

    // Listen for navigation events
    window.addEventListener('popstate', () => this.handleRoute())
    
    // Handle navigation clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const link = target.closest('[data-route]') as HTMLElement
      if (link) {
        e.preventDefault()
        const route = link.getAttribute('data-route')
        if (route) {
          this.navigate(route)
        }
      }
    })
  }

  navigate(path: string) {
    if (path !== this.currentRoute) {
      this.currentRoute = path
      history.pushState(null, '', path)
      this.handleRoute()
    }
  }

  private async handleRoute() {
    const path = window.location.pathname
    const route = this.routes.find(r => r.path === path) || this.routes[0]
    
    // Update document title
    document.title = route.title

    // Check authentication if required
    if (route.requiresAuth && !this.isAuthenticated()) {
      this.navigate('/')
      return
    }

    // Load and render component
    await this.renderComponent(route.component)
  }

  private async renderComponent(componentName: string) {
    if (!this.appContainer) return

    try {
      // Dynamic import of component
      const module = await import(`../components/pages/${componentName}`)
      const Component = module.default || module[componentName]
      
      if (Component) {
        // Clear container
        this.appContainer.innerHTML = ''
        
        // Create and mount component
        const component = new Component()
        const element = component.render()
        this.appContainer.appendChild(element)
        
        // Call mounted lifecycle if available
        if (component.mounted) {
          component.mounted()
        }
      }
    } catch (error) {
      console.error(`Failed to load component: ${componentName}`, error)
      this.renderError()
    }
  }

  private renderError() {
    if (!this.appContainer) return
    
    this.appContainer.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p class="text-gray-600 mb-8">Page not found</p>
          <button data-route="/" class="btn-primary">Go Home</button>
        </div>
      </div>
    `
  }

  private isAuthenticated(): boolean {
    // For demo purposes, always return true
    // In real app, check auth token/session
    return true
  }

  getCurrentRoute(): string {
    return this.currentRoute
  }
}