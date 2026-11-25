"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Document              ║
║  EX-D02: สร้าง README.md                                 ║
║                                              ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   โปรเจค weather-cli ที่สร้างไว้ใน EX-AG01 ยังไม่มี README
   ให้ Copilot ช่วยสร้าง README ที่สมบูรณ์

📋 TASK:
   1. ถาม: @workspace สร้าง README.md ที่ครบถ้วนสำหรับ project นี้
   2. ต้องมี: Description, Installation, Usage, Examples, Contributing
   3. เพิ่ม badges: Python version, License, Status

💬 SUGGESTED PROMPT:
   "@workspace สร้าง README.md สำหรับ weather-cli project ที่มี:
    - Project description และ features
    - Installation steps
    - Usage examples พร้อม output
    - Environment variables ที่ต้องตั้ง
    - Contributing guidelines
    - License section
    เพิ่ม shields.io badges ด้วย"

📄 README TEMPLATE ที่ดี:
"""

README_TEMPLATE = """
# 🌤 Weather CLI

![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen.svg)

Get current weather information from the command line.

## ✨ Features

- 🌡️ Real-time temperature (Celsius)
- 💧 Humidity percentage
- ☁️ Weather condition description
- 🌍 Support for any city worldwide

## 📦 Installation

```bash
# 1. Clone the repo
git clone https://github.com/yourname/weather-cli.git
cd weather-cli

# 2. Install dependencies
pip install -r requirements.txt

# 3. Setup API key
cp .env.example .env
# Edit .env and add your OpenWeatherMap API key
```

## 🔑 Getting an API Key

1. Sign up at https://openweathermap.org/
2. Go to API Keys section
3. Copy your key to `.env` file

## 🚀 Usage

```bash
python weather.py <city_name>

# Examples:
python weather.py Bangkok
python weather.py "New York"
python weather.py London
```

## 📤 Sample Output

```
🌍 Bangkok, TH
──────────────────────────────
🌡  Temperature : 32.4°C (feels like 37.1°C)
💧 Humidity    : 78%
☁️  Condition   : Scattered clouds
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/add-forecast`)
3. Commit your changes
4. Open a Pull Request

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
"""

# ─── TODO: ให้ Copilot generate README จาก @workspace context ────────────────

# เมื่อมี project จริง ให้ใช้ prompt นี้:
# @workspace Create a comprehensive README.md for this project
# Include all the standard sections, examples, and shields.io badges

print("📝 README Template:")
print(README_TEMPLATE)
print("\n💡 TIP: ใช้ @workspace ให้ Copilot อ่านโค้ดจริงก่อนสร้าง README")
print("        จะได้ accurate instructions และ examples")
