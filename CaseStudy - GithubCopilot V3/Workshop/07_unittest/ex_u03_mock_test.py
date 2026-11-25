"""
╔══════════════════════════════════════════════════════════╗
║  GitHub Copilot Workshop — หัวข้อ: Unit Test             ║
║  EX-U03: Mock External API Call                          ║
║                                             ║
╚══════════════════════════════════════════════════════════╝

📌 SCENARIO:
   เขียน test สำหรับ function ที่เรียก external API
   โดยไม่ต้องโทรจริง (fast, reliable, no API key needed)

📋 TASK:
   1. ถาม Copilot: "เขียน test โดย mock requests.get"
   2. Test: success (200), not found (404), server error (500), timeout
   3. ใช้ unittest.mock.patch เป็น decorator และ context manager
   4. ตรวจสอบว่า mock ถูกเรียกด้วย correct arguments

💬 SUGGESTED PROMPT:
   "เขียน pytest tests สำหรับ UserService ที่:
    - Mock requests.get ด้วย unittest.mock.patch
    - Test success case, HTTP errors (404, 500), timeout
    - Verify mock ถูกเรียกด้วย correct URL และ parameters
    - ใช้ fixture สำหรับ mock setup ซ้ำๆ"

📦 INSTALL: pip install pytest requests
🏃 RUN:     pytest ex_u03_mock_test.py -v -s
"""

import requests
from typing import Optional
from dataclasses import dataclass


# ─── Source Under Test ────────────────────────────────────────────────────────

@dataclass
class User:
    id: int
    name: str
    email: str
    username: str


class UserService:
    """Service for fetching user data from external API."""

    BASE_URL = "https://jsonplaceholder.typicode.com"

    def __init__(self, timeout: int = 5):
        self.timeout = timeout

    def get_user(self, user_id: int) -> User:
        """Fetch a user by ID.

        Args:
            user_id: Positive integer user identifier.

        Returns:
            User dataclass with id, name, email, username.

        Raises:
            ValueError: If user_id is not positive.
            requests.exceptions.HTTPError: If user not found (404) or server error.
            requests.exceptions.Timeout: If request exceeds timeout.
        """
        if user_id <= 0:
            raise ValueError(f"user_id must be positive, got {user_id}")

        response = requests.get(
            f"{self.BASE_URL}/users/{user_id}",
            timeout=self.timeout,
        )
        response.raise_for_status()
        data = response.json()
        return User(
            id=data["id"],
            name=data["name"],
            email=data["email"],
            username=data["username"],
        )

    def get_users(self, limit: int = 10) -> list[User]:
        """Fetch multiple users.

        Args:
            limit: Max number of users to return (1-100).

        Returns:
            List of User objects.
        """
        response = requests.get(
            f"{self.BASE_URL}/users",
            params={"_limit": limit},
            timeout=self.timeout,
        )
        response.raise_for_status()
        return [
            User(id=u["id"], name=u["name"],
                 email=u["email"], username=u["username"])
            for u in response.json()
        ]


# ─── TODO: เขียน Tests ด้านล่าง ───────────────────────────────────────────────

import pytest
from unittest.mock import patch, MagicMock, call


@pytest.fixture
def service():
    """Create UserService instance for testing."""
    return UserService(timeout=5)


@pytest.fixture
def mock_user_data():
    """Sample user data matching JSONPlaceholder response."""
    return {
        "id": 1,
        "name": "Leanne Graham",
        "email": "Sincere@april.biz",
        "username": "Bret",
    }


class TestGetUser:
    """Tests for UserService.get_user()"""

    def test_success(self, service, mock_user_data):
        # TODO: mock requests.get ให้ return mock_user_data
        # assert result.name == "Leanne Graham"
        pass

    def test_invalid_user_id_raises(self, service):
        # TODO: ไม่ต้อง mock — ควร raise ValueError ก่อนเรียก API
        pass

    def test_user_not_found_raises(self, service):
        # TODO: mock raise HTTPError 404
        pass

    def test_server_error_raises(self, service):
        # TODO: mock raise HTTPError 500
        pass

    def test_timeout_raises(self, service):
        # TODO: mock raise Timeout
        pass

    def test_called_with_correct_url(self, service, mock_user_data):
        # TODO: verify mock ถูกเรียกด้วย URL ที่ถูกต้อง
        pass


class TestGetUsers:
    """Tests for UserService.get_users()"""

    def test_returns_list_of_users(self, service):
        # TODO: mock return list ของ users
        pass

    def test_limit_parameter_passed(self, service):
        # TODO: verify limit ถูกส่งใน params
        pass


# ─── เฉลย ──────────────────────────────────────────────────────────────────────

class TestGetUserAnswers:
    """Complete answer for reference."""

    @pytest.fixture(autouse=True)
    def setup(self):
        self.service = UserService(timeout=5)
        self.sample = {
            "id": 1,
            "name": "Leanne Graham",
            "email": "Sincere@april.biz",
            "username": "Bret",
        }

    # ── Success ──────────────────────────────────────────
    def test_success(self):
        mock_resp = MagicMock()
        mock_resp.json.return_value = self.sample

        with patch("ex_u03_mock_test.requests.get", return_value=mock_resp):
            user = self.service.get_user(1)

        assert user.name == "Leanne Graham"
        assert user.email == "Sincere@april.biz"
        assert user.id == 1

    # ── Validation ───────────────────────────────────────
    def test_invalid_id_raises_before_api_call(self):
        with patch("ex_u03_mock_test.requests.get") as mock_get:
            with pytest.raises(ValueError, match="positive"):
                self.service.get_user(0)
            mock_get.assert_not_called()  # ← API ไม่ควรถูกเรียก

    def test_negative_id_raises(self):
        with pytest.raises(ValueError):
            self.service.get_user(-1)

    # ── HTTP Errors ───────────────────────────────────────
    def test_not_found_raises_http_error(self):
        mock_resp = MagicMock()
        mock_resp.raise_for_status.side_effect = (
            requests.exceptions.HTTPError("404 Not Found")
        )
        with patch("ex_u03_mock_test.requests.get", return_value=mock_resp):
            with pytest.raises(requests.exceptions.HTTPError):
                self.service.get_user(999)

    def test_server_error_raises(self):
        mock_resp = MagicMock()
        mock_resp.raise_for_status.side_effect = (
            requests.exceptions.HTTPError("500 Internal Server Error")
        )
        with patch("ex_u03_mock_test.requests.get", return_value=mock_resp):
            with pytest.raises(requests.exceptions.HTTPError):
                self.service.get_user(1)

    # ── Timeout ───────────────────────────────────────────
    def test_timeout_raises(self):
        with patch(
            "ex_u03_mock_test.requests.get",
            side_effect=requests.exceptions.Timeout("Request timed out"),
        ):
            with pytest.raises(requests.exceptions.Timeout):
                self.service.get_user(1)

    # ── Verify Call Args ──────────────────────────────────
    def test_called_with_correct_url(self):
        mock_resp = MagicMock()
        mock_resp.json.return_value = self.sample

        with patch("ex_u03_mock_test.requests.get", return_value=mock_resp) as mock_get:
            self.service.get_user(42)

        # ตรวจสอบว่าเรียก URL ที่ถูกต้อง
        mock_get.assert_called_once_with(
            "https://jsonplaceholder.typicode.com/users/42",
            timeout=5,
        )

    # ── get_users ─────────────────────────────────────────
    def test_get_users_returns_list(self):
        mock_resp = MagicMock()
        mock_resp.json.return_value = [self.sample, {**self.sample, "id": 2}]

        with patch("ex_u03_mock_test.requests.get", return_value=mock_resp):
            users = self.service.get_users(limit=2)

        assert len(users) == 2
        assert all(isinstance(u, User) for u in users)

    def test_get_users_passes_limit_param(self):
        mock_resp = MagicMock()
        mock_resp.json.return_value = []

        with patch("ex_u03_mock_test.requests.get", return_value=mock_resp) as mock_get:
            self.service.get_users(limit=5)

        # ตรวจสอบ params ที่ส่งไป
        _, kwargs = mock_get.call_args
        assert kwargs["params"] == {"_limit": 5}


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
