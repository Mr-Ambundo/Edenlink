// user.model.ts
export interface User {
    id: string;
    displayName: string;
    email: string;
    photoURL?: string;
    role: 'farmer' | 'admin' | 'trainer' | 'partner';
    createdAt: Date;
    lastLogin?: Date;
    preferences: UserPreferences;
    farms: Farm[];
    completedTraining: string[]; // Array of training IDs
  }
  
  export interface UserPreferences {
    notificationsEnabled: boolean;
    emailAlerts: boolean;
    pushNotifications: boolean;
    temperatureUnit: 'celsius' | 'fahrenheit';
    theme: 'light' | 'dark' | 'system';
    language: string;
    dashboardLayout?: string;
  }
  
  export interface Farm {
    id: string;
    name: string;
    location: string;
    size: number;
    sizeUnit: string;
    farmType: string[]; // ['Hydroponic', 'Indoor', 'Vertical']
    created: Date;
    zones: Zone[];
  }
  
  export interface Zone {
    id: string;
    name: string;
    size: number;
    sizeUnit: string;
    cropTypes: string[];
    sensorIds: string[];
    active: boolean;
  }