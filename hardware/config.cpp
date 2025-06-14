#ifndef CONFIG_H
#define CONFIG_H

// WiFi credentials
const char* WIFI_SSID = "your_wifi_ssid";
const char* WIFI_PASSWORD = "your_wifi_password";

// API Endpoint (Your Render backend URL)
const String API_ENDPOINT = "https://your-render-backend.onrender.com";

// Simulated pin numbers
#define FAN_PIN 23
#define LIGHT_PIN 22
#define AC_PIN 21

#endif