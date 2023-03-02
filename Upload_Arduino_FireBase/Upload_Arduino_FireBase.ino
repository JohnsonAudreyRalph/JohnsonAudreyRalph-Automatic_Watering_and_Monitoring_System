#include "Arduino.h"
#include <ESP8266WiFi.h>
#include "FirebaseESP8266.h"
#include "DHT.h"

#define DHTPIN 4             // Khai báo chân DHT22 là chân D2 trên esp8266
#define DHTTYPE DHT22        // Khai báo loại DHT sử dụng là DHT22

#define WIFI_SSID "TANG 2"
#define WIFI_PASSWORD "68686868"

#define FIREBASE_HOST "iot-plant-174a3-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "IviXf2ES24Ev7stjRCQVbbph5wdnvwcq6yVxQTOh"

FirebaseData firebaseData;
//WiFiClient client;

String path = "/";
FirebaseJson json;

int sensor_pin = A0; 
const int pump = 5;         // Khai báo chân của Relay là chân D1 của esp8266
const float threshold = 40;   // Khai báo ngưỡng độ ẩm để so sánh
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  Serial.println("Dang doc cam bien...");
  pinMode(pump, OUTPUT);
  dht.begin();

WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while(WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println(".");               
  }   
    
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
    
  if(!Firebase.beginStream(firebaseData, path))
  {
      Serial.println("REASON : " + firebaseData.errorReason());
      Serial.println();
  }     
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();  

  delay(2000);
  }

void loop() {

    float h = dht.readHumidity();           // Đọc độ ẩm trên DHT22
    float t = dht.readTemperature();        // Đọc nhiệt độ là °C trên DHT22
    float f = dht.readTemperature(true);    // Đọc nhiệt độ là °F trên DHT22

    if (isnan(h) || isnan(t) || isnan(f)) 
    {
      Serial.println(F("Loi khi doc module DHT22 !"));
      return;
    }

    float hif = dht.computeHeatIndex(f, h);         // Đọc chỉ số nhiệt độ trên DHT22
    float hic = dht.computeHeatIndex(t, h, false);

    Serial.print(F("Do am khong khi : "));
    Serial.print(h);
    Serial.print(F("%  Nhiet do : "));
    Serial.print(t);
    Serial.print(F("°C "));
    Serial.print(f);
    Serial.print(F("°F  Chi so nhiet do : "));
    Serial.print(hic);
    Serial.print(F("°C "));
    Serial.print(hif);
    Serial.println(F("°F "));
  
    Firebase.setFloat(firebaseData, path + "/Do_am_khong_khi", h);
    Firebase.setFloat(firebaseData, path + "/Nhiet_do(do_C)", t);

    float moisture_percentage;
    int sensor_analog;
    
    sensor_analog = analogRead(sensor_pin);
    moisture_percentage = ( 100 - ( (sensor_analog/1023.00) * 100 ) );

    Serial.print("Moisture Percentage = ");
    Serial.print(moisture_percentage);
    Serial.print("%\n\n");

    Firebase.setFloat(firebaseData, path + "/Do_am_dat", moisture_percentage);

    if (moisture_percentage < threshold)
    {
      Serial.println("Do am dat nho hon 40%");
      Firebase.setString(firebaseData, path + "/Thong_bao", "Độ ẩm đất thấp");

      while(moisture_percentage < 65)
      {
        digitalWrite(pump, HIGH);
        Serial.println("Bat may bom");
        Firebase.setString(firebaseData, path + "/Trang_thai_may_bom", "BẬT");
        delay(1000);

        digitalWrite(pump, LOW);
        Serial.println("Tat may bom");
        Firebase.setString(firebaseData, path + "/Trang_thai_may_bom", "TẮT");
        
        sensor_analog = analogRead(sensor_pin);
        moisture_percentage = ( 100 - ( (sensor_analog/1023.00) * 100 ) );
        Firebase.setFloat(firebaseData, path + "/Do_am_dat", moisture_percentage);
        delay(1000);
      }    
    }
    else
    {
      digitalWrite(pump, LOW);
      Serial.println("Tat may bom");
      Firebase.setString(firebaseData, path + "/Trang_thai_may_bom", "TẮT");
      Firebase.setString(firebaseData, path + "/Thong_bao", "Độ ẩm đất ổn định");
    }   
}