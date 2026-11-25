"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Plan                  ║
║  EX-P03: Design Pattern Selection                        ║
║                                             ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   ต้องสร้างระบบ notification ที่รองรับ:
   - Email notification
   - SMS notification
   - Push notification (mobile)
   - Line notification (bonus)

📋 TASK:
   1. ถาม Copilot ว่า Design Pattern ไหนเหมาะสม และเพราะอะไร
   2. ให้วาง plan สำหรับ extensible notification system
   3. ขอ skeleton code สำหรับ pattern ที่แนะนำ
   4. implement EmailChannel ให้สมบูรณ์

💬 SUGGESTED PROMPT:
   "ฉันต้องสร้างระบบ notification รองรับ Email, SMS, Push
    Design Pattern ไหนเหมาะสมที่สุด? อธิบาย trade-off
    และให้ skeleton code"
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional
import logging

logger = logging.getLogger(__name__)


# ─── Data Model ───────────────────────────────────────────────────────────────

@dataclass
class Message:
    subject: str
    body: str
    recipient: str
    priority: str = "normal"   # "low", "normal", "high", "urgent"


# ─── TODO: ให้ Copilot implement pattern ด้านล่าง ─────────────────────────────
# (Strategy Pattern + Composite / Observer Pattern)

class NotificationChannel(ABC):
    """Abstract base for all notification channels."""

    @abstractmethod
    def send(self, message: Message) -> bool:
        """Send notification. Returns True if successful."""
        ...

    @abstractmethod
    def is_available(self) -> bool:
        """Check if channel is currently available."""
        ...


# ─── TODO: implement แต่ละ channel ──────────────────────────────────────────

class EmailChannel(NotificationChannel):
    def __init__(self, smtp_host: str, from_addr: str):
        self.smtp_host = smtp_host
        self.from_addr = from_addr

    def send(self, message: Message) -> bool:
        # TODO: ให้ Copilot implement การส่ง email
        pass

    def is_available(self) -> bool:
        # TODO
        pass


class SMSChannel(NotificationChannel):
    # TODO: ให้ Copilot implement
    pass


class PushChannel(NotificationChannel):
    # TODO: ให้ Copilot implement
    pass


# ─── Notification Service ─────────────────────────────────────────────────────

class NotificationService:
    """Sends via multiple channels with fallback support."""

    def __init__(self, channels: list[NotificationChannel]):
        self.channels = channels

    def notify(self, message: Message) -> dict[str, bool]:
        """Send to all channels. Returns success status per channel."""
        results = {}
        for channel in self.channels:
            name = channel.__class__.__name__
            try:
                if channel.is_available():
                    results[name] = channel.send(message)
                else:
                    results[name] = False
                    logger.warning(f"{name} not available")
            except Exception as e:
                results[name] = False
                logger.error(f"{name} failed: {e}")
        return results

    def notify_with_fallback(self, message: Message) -> bool:
        """Try channels in order, return True on first success."""
        for channel in self.channels:
            if channel.is_available():
                if channel.send(message):
                    return True
        return False


# ─── เฉลย ──────────────────────────────────────────────────────────────────────
#
# PATTERN: Strategy Pattern + Composite
#
# ✅ BENEFITS:
#    - เพิ่ม channel ใหม่ได้โดยไม่แก้ existing code (Open/Closed Principle)
#    - Test แต่ละ channel แยกกันได้ง่าย
#    - Fallback strategy ทำได้ง่าย
#
# class EmailChannel(NotificationChannel):
#     def send(self, message: Message) -> bool:
#         print(f"📧 Email → {message.recipient}: {message.subject}")
#         # จริงๆ ใช้ smtplib หรือ sendgrid API
#         return True
#
#     def is_available(self) -> bool:
#         return True  # จริงๆ ping smtp server
#
# # Usage:
# service = NotificationService([
#     EmailChannel("smtp.example.com", "no-reply@example.com"),
#     SMSChannel(api_key="xxx"),
# ])
# msg = Message("Alert!", "Server down", "admin@example.com")
# results = service.notify(msg)


if __name__ == "__main__":
    # Demo ด้วย mock channels
    msg = Message(
        subject="🚨 Server Alert",
        body="CPU usage > 90%",
        recipient="ops@example.com",
        priority="urgent",
    )
    print(f"Message: {msg}")
    print("→ Implement channels แล้วทดสอบ!")
