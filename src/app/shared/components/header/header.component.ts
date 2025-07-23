import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Notification {
  id: number;
  message: string;
  type: 'alert' | 'info' | 'success';
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  unreadCount = 2;
  showUserMenu = false;
  showNotifications = false;

  notifications: Notification[] = [
    {
      id: 1,
      message: 'Temperature alert: Greenhouse 1 above optimal range',
      type: 'alert',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      message: 'Coriander growth phase: Ready for harvest',
      type: 'success',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      message: 'Water level low in Bell Pepper section',
      type: 'info',
      time: '2 hours ago',
      read: true
    },
    {
      id: 4,
      message: 'System update available',
      type: 'info',
      time: '1 day ago',
      read: true
    }
  ];

  userProfile = {
    name: 'John Farmer',
    avatar: 'assets/images/avatar.png'
  };

  constructor() { }

  ngOnInit(): void {
    this.updateUnreadCount();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) {
      this.showNotifications = false;
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.showUserMenu = false;
    }
  }

  markAsRead(notification: Notification): void {
    notification.read = true;
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => notification.read = true);
    this.updateUnreadCount();
  }

  private updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  logout(): void {
    // Implement logout logic
    console.log('Logging out...');
  }
}