import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  animations: [
    trigger('slideAnimation', [
      transition('* => *', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class LandingComponent implements OnInit {
  hydroponicSystems = [
    {
      name: 'NFT',
      icon: '💧'
    },
    {
      name: 'DWC',
      icon: '🌊'
    },
    {
      name: 'Drip',
      icon: '💦'
    },
    {
      name: 'Media-Based',
      icon: '🪴'
    }
  ];

  features = [
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
  ];
  
  testimonials = [
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
  ];
  
  currentTestimonialIndex = 0;
  
  constructor(private router: Router) { }
  
  ngOnInit(): void {
    // Start testimonial rotation
    setInterval(() => {
      this.rotateTestimonials();
    }, 5000);
  }
  
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  
  learnMore() {
    const featuresSection = document.querySelector('.features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  }
  
  rotateTestimonials() {
    this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
  }
}