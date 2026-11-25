"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Agent Mode            ║
║  EX-AG01: สร้างโปรเจคใหม่ทั้งหมดด้วย Agent             ║
║                                              ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   ใช้ Agent สร้าง Python CLI tool สำหรับดูสภาพอากาศ
   พร้อม structure ที่สมบูรณ์

📋 TASK:
   1. เปิด folder เปล่าใน VS Code
   2. เปิด Copilot Chat และเปลี่ยนเป็น Agent mode (ไอคอน ⚡)
   3. พิมพ์ prompt ด้านล่าง และดู Agent ทำงาน
   4. Agent ควรสร้างไฟล์ทั้งหมดให้อัตโนมัติ

🤖 AGENT PROMPT:
─────────────────────────────────────────────────────────
สร้าง Python CLI project ชื่อ weather-cli ที่:
- ดึงข้อมูลอากาศจาก OpenWeatherMap API
- รับ city name เป็น command line argument
- แสดง temperature, humidity, weather description
- มี requirements.txt (requests, python-dotenv)
- มี README.md พร้อม usage instructions
- มี .gitignore สำหรับ Python project
- มี .env.example แสดง API_KEY=your_key_here
─────────────────────────────────────────────────────────

💡 EXPECTED OUTPUT:
   weather-cli/
   ├── weather.py
   ├── requirements.txt
   ├── README.md
   ├── .gitignore
   └── .env.example
"""

# ─── ไฟล์นี้คือ weather.py ที่ Agent ควรสร้างให้ ─────────────────────────────
# (ใช้เป็น reference หรือเปรียบเทียบกับ output ของ Agent)

import sys
import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


def get_weather(city: str) -> dict:
    """Fetch weather data for a city."""
    if not API_KEY:
        raise ValueError("API_KEY not set. Copy .env.example to .env")

    response = requests.get(
        BASE_URL,
        params={"q": city, "appid": API_KEY, "units": "metric"},
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


def display_weather(data: dict) -> None:
    """Print weather information in a readable format."""
    city     = data["name"]
    country  = data["sys"]["country"]
    temp     = data["main"]["temp"]
    feels    = data["main"]["feels_like"]
    humidity = data["main"]["humidity"]
    desc     = data["weather"][0]["description"].capitalize()

    print(f"\n🌍 {city}, {country}")
    print(f"{'─' * 30}")
    print(f"🌡  Temperature : {temp:.1f}°C (feels like {feels:.1f}°C)")
    print(f"💧 Humidity    : {humidity}%")
    print(f"☁️  Condition   : {desc}")
    print()


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python weather.py <city_name>")
        print("Example: python weather.py Bangkok")
        sys.exit(1)

    city = " ".join(sys.argv[1:])
    try:
        data = get_weather(city)
        display_weather(data)
    except requests.exceptions.HTTPError as e:
        print(f"❌ City '{city}' not found. Check spelling.")
    except requests.exceptions.Timeout:
        print("❌ Request timed out. Check your connection.")
    except ValueError as e:
        print(f"❌ Config error: {e}")


if __name__ == "__main__":
    main()
