"""
Integration tests for FastAPI endpoints
"""

import unittest
from fastapi.testclient import TestClient
from app import app


class TestAPIEndpoints(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_metadata_endpoint(self):
        r = self.client.get("/api/metadata")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("metadata", data)
        self.assertEqual(data["total_companies"], 150)

    def test_companies_search(self):
        r = self.client.get("/api/companies?q=google")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertGreaterEqual(data["count"], 1)
        self.assertIn("Google", data["companies"][0]["company_name"])

    def test_company_details(self):
        r = self.client.get("/api/companies/COMP001")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertEqual(data["company_id"], "COMP001")
        self.assertIn("Tata Consultancy Services", data["company_name"])

    def test_calculate_endpoint(self):
        payload = {
            "annual_ctc": 1200000,
            "basic_pct": 40,
            "variable_pct": 10,
            "joining_bonus": 50000
        }
        r = self.client.post("/api/calculate", json=payload)
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("monthly_pay_slip", data)
        self.assertIn("tax_calculation", data)

    def test_compare_endpoint(self):
        payload = {
            "offer_a": {"name": "Product Startup", "ctc": 2000000, "variable_pct": 20},
            "offer_b": {"name": "Global MNC", "ctc": 1600000, "variable_pct": 5}
        }
        r = self.client.post("/api/compare", json=payload)
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("comparison", data)
        self.assertIn("verdict", data["comparison"])

    def test_govt_compare_endpoint(self):
        payload = {
            "tech_ctc": 1200000,
            "govt_post_name": "Assistant Section Officer",
            "govt_pay_level": "Level 7",
            "city_tier": "X",
            "da_rate_pct": 50
        }
        r = self.client.post("/api/govt-compare", json=payload)
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("private_tech", data)
        self.assertIn("central_government", data)
        self.assertIn("verdict", data)


if __name__ == "__main__":
    unittest.main()
