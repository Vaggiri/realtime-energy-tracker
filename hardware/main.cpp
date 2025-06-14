#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "config.h"
#include "wifi_manager.h"
#include "firebase_manager.h"

// Simulated device states
bool fanState = false;
bool lightState = false;
bool acState = false;

// Simulated sensor values
float fanCurrent = 0.0;
float lightCurrent = 0.0;
float acCurrent = 0.0;
const float voltage = 230.0; // Standard voltage

unsigned long lastDataSendTime = 0;
const long dataSendInterval = 5000; // 5 seconds

void setup() {
  Serial.begin(115200);
  connectToWiFi();
  initFirebase();
  
  // Setup simulated pins
  pinMode(FAN_PIN, OUTPUT);
  pinMode(LIGHT_PIN, OUTPUT);
  pinMode(AC_PIN, OUTPUT);
  
  digitalWrite(FAN_PIN, LOW);
  digitalWrite(LIGHT_PIN, LOW);
  digitalWrite(AC_PIN, LOW);
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    reconnectWiFi();
  }

  // Update simulated sensor readings
  updateSimulatedReadings();
  
  // Send data to backend periodically
  if (millis() - lastDataSendTime >= dataSendInterval) {
    sendEnergyData();
    lastDataSendTime = millis();
  }
  
  // Check for control commands
  getDeviceStates();
  
  delay(100);
}

void updateSimulatedReadings() {
  // Simulate current fluctuations based on device state
  fanCurrent = fanState ? random(50, 100) / 100.0 : 0.0;
  lightCurrent = lightState ? random(10, 30) / 100.0 : 0.0;
  acCurrent = acState ? random(300, 500) / 100.0 : 0.0;
}

void sendEnergyData() {
  DynamicJsonDocument doc(1024);
  
  // Calculate power and energy
  float fanPower = voltage * fanCurrent;
  float lightPower = voltage * lightCurrent;
  float acPower = voltage * acCurrent;
  
  doc["fan"] = {
    {"current", fanCurrent},
    {"power", fanPower},
    {"state", fanState}
  };
  
  doc["light"] = {
    {"current", lightCurrent},
    {"power", lightPower},
    {"state", lightState}
  };
  
  doc["ac"] = {
    {"current", acCurrent},
    {"power", acPower},
    {"state", acState}
  };
  
  String jsonData;
  serializeJson(doc, jsonData);
  
  HTTPClient http;
  http.begin(API_ENDPOINT + "/energy-data");
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.POST(jsonData);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Data sent successfully: " + response);
  } else {
    Serial.print("Error sending data: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}

void getDeviceStates() {
  HTTPClient http;
  http.begin(API_ENDPOINT + "/control-status");
  
  int httpResponseCode = http.GET();
  
  if (httpResponseCode > 0) {
    String payload = http.getString();
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    
    bool newFanState = doc["fan"];
    bool newLightState = doc["light"];
    bool newAcState = doc["ac"];
    
    if (newFanState != fanState) {
      fanState = newFanState;
      digitalWrite(FAN_PIN, fanState ? HIGH : LOW);
      Serial.println("Fan state changed to: " + String(fanState ? "ON" : "OFF"));
    }
    
    if (newLightState != lightState) {
      lightState = newLightState;
      digitalWrite(LIGHT_PIN, lightState ? HIGH : LOW);
      Serial.println("Light state changed to: " + String(lightState ? "ON" : "OFF"));
    }
    
    if (newAcState != acState) {
      acState = newAcState;
      digitalWrite(AC_PIN, acState ? HIGH : LOW);
      Serial.println("AC state changed to: " + String(acState ? "ON" : "OFF"));
    }
  } else {
    Serial.print("Error getting control states: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}