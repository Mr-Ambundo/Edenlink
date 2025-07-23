import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLandingPage = true;
  showSidebar = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Set initial values based on current route
    this.updateRouteState(this.router.url);

    // Subscribe to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateRouteState(event.url);
    });
  }

  private updateRouteState(url: string) {
    this.isLandingPage = url === '/';
    this.showSidebar = !this.isLandingPage && url !== '/login' && url !== '/register';
    console.log('Route changed:', { url, isLandingPage: this.isLandingPage, showSidebar: this.showSidebar });
  }
}