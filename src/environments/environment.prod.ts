export const environment = {
    production: true,
    apiBaseUrl: '/api',
    wsUrl: 'wss://eden-link-api.yourcompany.com',
    version: '1.0.0',
    sensorPollingInterval: 60000, // 1 minute
    features: {
      aiChatbot: true,
      realTimeCharts: true,
      cropRoadmap: true,
      trainingModule: true
    },
    debugMode: false
  };