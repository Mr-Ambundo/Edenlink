export default class LandingPage {
  private features = [
    {
      title: 'Microclimate AI',
      description: 'Advanced AI technology monitors and adjusts your farm environment for optimal growing conditions.',
      icon: '🧠'
    },
    {
      title: 'Real-Time Monitoring',
      description: 'Track temperature, humidity, light, and other vital metrics with precision sensors.',
      icon: '📊'
    },
    {
      title: 'Crop Roadmap',
      description: 'Get personalized growth plans and timelines for your specific crops.',
      icon: '🌱'
    },
    {
      title: 'Smart Tips',
      description: 'Receive AI-generated recommendations based on your farm\'s unique conditions.',
      icon: '💡'
    }
  ]

  private testimonials = [
    {
      quote: "Eden Link transformed my small farm into a high-yield operation. The AI recommendations are spot-on!",
      author: "Maria Johnson",
      role: "Urban Farmer"
    },
    {
      quote: "The real-time monitoring saved my crops during a heat wave. I received alerts and adjustments before damage occurred.",
      author: "David Chen",
      role: "Community Garden Manager"
    },
    {
      quote: "As a first-time grower, the training modules and crop roadmaps gave me the confidence to succeed.",
      author: "Aisha Mohammed",
      role: "Home Gardener"
    }
  ]

  private currentTestimonialIndex = 0

  render(): HTMLElement {
    const container = document.createElement('div')
    container.className = 'min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50'
    
    container.innerHTML = `
      <!-- Header -->
      <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center space-x-4">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
              <span class="text-xl font-bold text-gray-900">Eden Link</span>
            </div>
            <button data-route="/dashboard" class="btn-primary">Get Started</button>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-8">
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Precision Hydroponic Farming for a 
                <span class="text-primary-600">Sustainable Future</span>
              </h1>
              <p class="text-xl text-gray-600 leading-relaxed">
                Transform your hydroponic operations with AI-powered insights and real-time monitoring
              </p>
              <div class="flex flex-col sm:flex-row gap-4">
                <button data-route="/dashboard" class="btn-primary btn-lg">Get Started</button>
                <button class="btn-outline btn-lg" onclick="this.scrollToFeatures()">Learn More</button>
              </div>
            </div>
            <div class="relative">
              <img src="/src/assets/images/front.jpeg" alt="Smart Farm" class="rounded-2xl shadow-2xl w-full h-auto">
              <div class="absolute inset-0 bg-gradient-to-t from-primary-600/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- What is Eden Link Section -->
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-4xl mx-auto">
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">What is Eden Link?</h2>
            <p class="text-lg text-gray-600 mb-12 leading-relaxed">
              Eden Link is an AI-powered monitoring and management platform specifically designed for hydroponic farming systems. 
              Our platform integrates with your existing hydroponic setup to collect real-time data, analyze growing conditions, 
              and provide actionable insights to optimize your crop yields.
            </p>
            
            <div class="mb-12">
              <h3 class="text-xl font-semibold text-primary-600 mb-8">Compatible with all hydroponic systems:</h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-8">
                <div class="text-center">
                  <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">💧</div>
                  <span class="font-medium text-gray-900">NFT</span>
                </div>
                <div class="text-center">
                  <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">🌊</div>
                  <span class="font-medium text-gray-900">DWC</span>
                </div>
                <div class="text-center">
                  <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">💦</div>
                  <span class="font-medium text-gray-900">Drip</span>
                </div>
                <div class="text-center">
                  <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">🪴</div>
                  <span class="font-medium text-gray-900">Media-Based</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose Eden Link?</h2>
          </div>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            ${this.features.map(feature => `
              <div class="card hover:shadow-lg transition-shadow duration-300">
                <div class="card-body text-center">
                  <div class="text-4xl mb-4">${feature.icon}</div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-3">${feature.title}</h3>
                  <p class="text-gray-600">${feature.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="py-20 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Our Farmers Say</h2>
          </div>
          
          <div class="relative">
            <div id="testimonial-container" class="card">
              <div class="card-body text-center py-12">
                <div id="testimonial-content">
                  <!-- Testimonial content will be inserted here -->
                </div>
              </div>
            </div>
            
            <div class="flex justify-center mt-8 space-x-2">
              ${this.testimonials.map((_, index) => `
                <button class="w-3 h-3 rounded-full transition-colors duration-200 ${index === 0 ? 'bg-primary-600' : 'bg-gray-300'}" 
                        onclick="this.setTestimonial(${index})" data-testimonial="${index}"></button>
              `).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 bg-primary-600 text-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Farm?</h2>
          <p class="text-xl mb-8 opacity-90">Join thousands of farmers who are already using Eden Link to improve their yields</p>
          <button data-route="/dashboard" class="bg-white text-primary-600 hover:bg-gray-100 btn btn-lg font-semibold">
            Start Now
          </button>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-4 gap-8">
            <div>
              <div class="flex items-center space-x-2 mb-4">
                <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
                <span class="text-xl font-bold">Eden Link</span>
              </div>
              <p class="text-gray-400">Smart farming solutions for a sustainable future</p>
            </div>
            
            <div>
              <h3 class="font-semibold mb-4">Quick Links</h3>
              <div class="space-y-2">
                <a href="#" data-route="/dashboard" class="block text-gray-400 hover:text-white transition-colors">Dashboard</a>
                <a href="#" data-route="/my-farm" class="block text-gray-400 hover:text-white transition-colors">My Farm</a>
                <a href="#" data-route="/ai-tips" class="block text-gray-400 hover:text-white transition-colors">AI Tips</a>
              </div>
            </div>
            
            <div>
              <h3 class="font-semibold mb-4">Support</h3>
              <div class="space-y-2">
                <a href="#" data-route="/training" class="block text-gray-400 hover:text-white transition-colors">Training</a>
                <a href="#" data-route="/partnerships" class="block text-gray-400 hover:text-white transition-colors">Partnerships</a>
                <a href="mailto:support@edenlink.com" class="block text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            
            <div>
              <h3 class="font-semibold mb-4">Connect</h3>
              <p class="text-gray-400 mb-4">Stay updated with our latest news</p>
              <div class="flex space-x-4">
                <a href="#" class="text-gray-400 hover:text-white transition-colors">📘</a>
                <a href="#" class="text-gray-400 hover:text-white transition-colors">🐦</a>
                <a href="#" class="text-gray-400 hover:text-white transition-colors">💼</a>
              </div>
            </div>
          </div>
          
          <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; ${new Date().getFullYear()} Eden Link. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `

    return container
  }

  mounted() {
    this.updateTestimonial()
    this.startTestimonialRotation()
    this.setupEventListeners()
  }

  private updateTestimonial() {
    const content = document.getElementById('testimonial-content')
    const dots = document.querySelectorAll('[data-testimonial]')
    
    if (content) {
      const testimonial = this.testimonials[this.currentTestimonialIndex]
      content.innerHTML = `
        <blockquote class="text-xl italic text-gray-600 mb-6">
          "${testimonial.quote}"
        </blockquote>
        <div>
          <div class="font-semibold text-gray-900">${testimonial.author}</div>
          <div class="text-gray-500">${testimonial.role}</div>
        </div>
      `
    }

    // Update dots
    dots.forEach((dot, index) => {
      if (index === this.currentTestimonialIndex) {
        dot.classList.remove('bg-gray-300')
        dot.classList.add('bg-primary-600')
      } else {
        dot.classList.remove('bg-primary-600')
        dot.classList.add('bg-gray-300')
      }
    })
  }

  private startTestimonialRotation() {
    setInterval(() => {
      this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length
      this.updateTestimonial()
    }, 5000)
  }

  private setupEventListeners() {
    // Testimonial dots
    document.querySelectorAll('[data-testimonial]').forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.currentTestimonialIndex = index
        this.updateTestimonial()
      })
    })

    // Smooth scroll for learn more
    const learnMoreBtn = document.querySelector('[onclick="this.scrollToFeatures()"]')
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener('click', () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }
}