import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentRoute: string = '';
  isMobileSidebarOpen: boolean = false;
  isCollapsed: boolean = false;
  
  navItems = [
    { path: '/dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
    { path: '/my-farm', icon: 'fa-leaf', label: 'My Farm' },
    { path: '/crop-roadmap', icon: 'fa-map', label: 'Crop Roadmap' },
    { path: '/ai-tips', icon: 'fa-robot', label: 'AI Tips' },
    { path: '/logistics', icon: 'fa-truck', label: 'Logistics' },
    { path: '/training', icon: 'fa-graduation-cap', label: 'Training' },
    { path: '/partnerships', icon: 'fa-handshake', label: 'Partnerships' },
    { path: '/settings', icon: 'fa-cog', label: 'Settings' }
  ];
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });

    // Set initial route
    this.currentRoute = this.router.url;
  }
  
  navigateTo(path: string): void {
    this.router.navigate([path]);
    if (window.innerWidth <= 992) {
      this.toggleMobileSidebar();
    }
  }
  
  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
    document.body.style.overflow = this.isMobileSidebarOpen ? 'hidden' : '';
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    // Dispatch an event to notify the layout about the sidebar state change
    window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { collapsed: this.isCollapsed } }));
  }
}