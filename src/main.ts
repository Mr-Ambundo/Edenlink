import './styles/main.css'
import { Router } from './router'
import { AppStore } from './stores/AppStore'
import { SocketService } from './services/SocketService'

class App {
  private router: Router
  private store: AppStore
  private socketService: SocketService

  constructor() {
    this.store = new AppStore()
    this.socketService = new SocketService()
    this.router = new Router()
    this.init()
  }

  private async init() {
    // Initialize socket connection for real-time features
    await this.socketService.connect()
    
    // Initialize router
    this.router.init()
    
    // Set up global error handling
    this.setupErrorHandling()
    
    // Initialize app state
    this.store.init()
    
    console.log('🌱 Eden Link initialized successfully!')
  }

  private setupErrorHandling() {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error)
    })

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
    })
  }
}

// Initialize the application
new App()