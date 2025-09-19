// Core Types
export interface User {
  id: string
  name: string
  email: string
  role: 'farmer' | 'admin' | 'trainer' | 'partner'
  avatar?: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  emailAlerts: boolean
  pushNotifications: boolean
  temperatureUnit: 'celsius' | 'fahrenheit'
  language: string
}

// Sensor Types
export interface Sensor {
  id: string
  name: string
  type: 'temperature' | 'humidity' | 'light' | 'ec' | 'ph' | 'co2'
  value: number
  unit: string
  status: 'normal' | 'warning' | 'alert'
  location?: string
  lastUpdated: Date
  minThreshold?: number
  maxThreshold?: number
}

export interface SensorReading {
  sensorId: string
  timestamp: Date
  value: number
  status: 'normal' | 'warning' | 'alert'
}

// Crop Types
export interface Crop {
  id: string
  name: string
  scientificName: string
  category: string
  imageUrl: string
  plantedDate: Date
  expectedHarvestDate: Date
  currentStage: CropStage
  health: number
  status: 'active' | 'harvested' | 'failed'
  notes?: string
  aiSuggestion?: string
}

export interface CropStage {
  id: string
  name: string
  order: number
  description: string
  startDate: Date
  endDate?: Date
  isCompleted: boolean
  requiredActions: string[]
}

export interface CropCycle {
  id: string
  cropName: string
  startDate: Date
  currentStage: number
  status: 'active' | 'completed' | 'cancelled'
  stages: CropCycleStage[]
  progress: number
}

export interface CropCycleStage {
  name: string
  description: string
  startWeek: number
  endWeek: number
  tasks: Task[]
  completed: boolean
}

export interface Task {
  description: string
  completed: boolean
}

// AI Types
export interface AiTip {
  id: string
  title: string
  content: string
  category: 'climate' | 'health' | 'general'
  priority: 'low' | 'medium' | 'high'
  timestamp: Date
  saved?: boolean
  recommendation?: string
  source?: string
}

export interface AiRecommendation {
  id: string
  message: string
  priority: 'low' | 'medium' | 'high'
  category: 'climate' | 'irrigation' | 'nutrition' | 'pest' | 'general'
  timestamp: Date
  applied: boolean
}

// System Types
export interface SystemStatus {
  connectionStatus: 'connected' | 'disconnected' | 'unstable'
  powerStatus: 'on' | 'off' | 'backup'
  automationMode: 'auto' | 'manual'
  pumps: PumpStatus[]
  lastUpdated: Date
  status: 'operational' | 'maintenance' | 'error'
  message?: string
}

export interface PumpStatus {
  id: string
  name: string
  status: 'active' | 'inactive' | 'error'
  flowRate?: number
}

export interface NutrientLevel {
  id: string
  name: string
  level: number
  percentage: number
  unit: string
  status: 'normal' | 'low' | 'critical'
  lastUpdated: Date
}

export interface WaterLevel {
  current: number
  capacity: number
  percentage: number
  status: 'normal' | 'low' | 'critical'
  lastUpdated: Date
}

// Training Types
export interface TrainingModule {
  id: string
  title: string
  description: string
  duration: string
  progress: number
  completed: boolean
  lessons: TrainingLesson[]
}

export interface TrainingLesson {
  id: string
  title: string
  content: string
  duration: number
  completed: boolean
}

// Partnership Types
export interface Partner {
  id: string
  name: string
  type: string
  description: string
  logoUrl: string
  projectCount: number
  partnerSince: Date
}

export interface Opportunity {
  id: string
  title: string
  type: 'research' | 'technology' | 'distribution'
  description: string
  duration: string
  partnersNeeded: number
  deadline: Date
}

// Notification Types
export interface Notification {
  id: string
  message: string
  type: 'alert' | 'info' | 'success'
  time: string
  read: boolean
}

// Chart Types
export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string
  tension?: number
  fill?: boolean
  borderWidth?: number
}

// API Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface SocketEvent {
  type: string
  data: any
  timestamp: Date
}

// Route Types
export interface Route {
  path: string
  component: string
  title: string
  requiresAuth?: boolean
}

// Storage Types
export interface StorageData {
  user: User
  sensors: Sensor[]
  crops: Crop[]
  tips: AiTip[]
  settings: UserPreferences
  notifications: Notification[]
  trainingProgress: Record<string, number>
  systemStatus: SystemStatus
}