import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SystemSettings {
  notifications: {
    emailAlerts: boolean;
    pushNotifications: boolean;
    smsAlerts: boolean;
  };
  dataManagement: {
    dataRetentionPeriod: number;
    autoBackup: boolean;
    backupFrequency: string;
  };
}

interface MonitoringSettings {
  sensorPollingInterval: number;
  thresholds: {
    temperature: { min: number; max: number; };
    humidity: { min: number; max: number; };
    light: { min: number; max: number; };
    ec: { min: number; max: number; };
    ph: { min: number; max: number; };
  };
}

interface SystemVersion {
  current: string;
  latest: string;
  updateAvailable: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  systemSettings: SystemSettings = {
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      smsAlerts: false
    },
    dataManagement: {
      dataRetentionPeriod: 90,
      autoBackup: true,
      backupFrequency: 'weekly'
    }
  };

  monitoringSettings: MonitoringSettings = {
    sensorPollingInterval: 30,
    thresholds: {
      temperature: { min: 20, max: 30 },
      humidity: { min: 40, max: 70 },
      light: { min: 2000, max: 6000 },
      ec: { min: 1.0, max: 2.5 },
      ph: { min: 5.5, max: 6.5 }
    }
  };

  systemVersion: SystemVersion = {
    current: '1.0.0',
    latest: '1.0.1',
    updateAvailable: true
  };

  backupFrequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  constructor() { }

  ngOnInit(): void {
    // In a real application, these settings would be loaded from a service
    this.loadSettings();
  }

  saveSettings(): void {
    // In a real application, this would save to a backend service
    console.log('Saving settings:', {
      system: this.systemSettings,
      monitoring: this.monitoringSettings
    });
    // Mock successful save
    alert('Settings saved successfully!');
  }

  backupSystem(): void {
    // Mock backup process
    console.log('Initiating system backup...');
    setTimeout(() => {
      alert('System backup completed successfully!');
    }, 2000);
  }

  restoreFromBackup(): void {
    // Mock restore process
    if (confirm('Are you sure you want to restore from the last backup? This will override current settings.')) {
      console.log('Initiating system restore...');
      setTimeout(() => {
        alert('System restored successfully!');
        this.loadSettings(); // Reload settings after restore
      }, 2000);
    }
  }

  checkForUpdates(): void {
    // Mock update check
    console.log('Checking for updates...');
    setTimeout(() => {
      this.systemVersion = {
        ...this.systemVersion,
        updateAvailable: true,
        latest: '1.0.2'
      };
      alert('New update available: v1.0.2');
    }, 1500);
  }

  private loadSettings(): void {
    // In a real application, this would load from a service
    // For now, we'll use the default values set in the properties
    console.log('Loading settings...');
  }
}
