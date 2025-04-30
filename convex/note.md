## ESP-32 Implementation

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";
const char\* apiEndpoint = "https://outgoing-crow-589.convex.site/api/pooltables/k5786ghkqqe1505grf0g674a1578sjgf";

void setup() {
Serial.begin(115200);
WiFi.begin(ssid, password);

while (WiFi.status() != WL_CONNECTED) {
delay(1000);
Serial.println("Connecting to WiFi...");
}
Serial.println("Connected to WiFi");
}

void loop() {
if (WiFi.status() == WL_CONNECTED) {
HTTPClient http;
http.begin(apiEndpoint);

    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      String payload = http.getString();

      // Parse JSON response
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, payload);

      // Access your data
      bool isActive = doc["isActive"];
      Serial.print("Pool table is active: ");
      Serial.println(isActive);
    }

    http.end();

}

// Poll every 5 seconds
delay(5000);
}
