export interface Sensor {
  id: string | number;
    type: string; // temperature, humidity, light, ec, ph, co2, o2name: string; 
    name: string; 
    value: string | number;
    unit: string; 
    icon?: string; // Optional icon property

    status: 'normal' | 'warning' | 'alert';
    location?: string;
    lastUpdated?: Date;
    batteryLevel?: number;
    connectionStatus?: 'connected' | 'disconnected';
    minThreshold?: number;
    maxThreshold?: number;
  }
  
  export interface SensorReading {
    sensorId: string;
    value: number;
    timestamp: Date;
    status: 'normal' | 'warning' | 'alert';
  }
  
  export interface SensorGroup {
    location: string;
    sensors: Sensor[];
  }
  
  export interface SensorHistoryRequest {
    sensorId: string;
    startDate: Date;
    endDate: Date;
    interval: 'hour' | 'day' | 'week';
  }

  export interface SensorReading {
    sensorType: string;
    value: number;
    unit: string;
    minThreshold?: number; // Optional property
    maxThreshold?: number; // Optional property
  }
