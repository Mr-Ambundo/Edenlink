// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.

export const environment = {
    production: false,
    apiBaseUrl: 'http://localhost:3000/api',
    wsUrl: 'ws://localhost:3000',
    version: '1.0.0',
    sensorPollingInterval: 30000, // 30 seconds
    features: {
      aiChatbot: true,
      realTimeCharts: true,
      cropRoadmap: true,
      trainingModule: true
    },
    debugMode: true,
    aiApiUrl: 'http://your-ai-backend-url/api',
    openAiKey: 'AIzaSyAl4A4lIV2gboVvsXdhfn340s3CZ4P1NlU', // Store this securely
    aiModelEndpoints: {
      suggestions: '/ai/suggestions',
      predictions: '/ai/predictions',
      optimization: '/ai/optimization'
    }
  };
  