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
        self.assertGreaterEqual(data["total_companies"], 50)
        self.assertGreaterEqual(data["total_gov_profiles"], 15)

    def test_companies_search(self):
        r = self.client.get("/api/companies?q=google")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertGreaterEqual(data["count"], 1)
        self.assertIn("Google", data["companies"][0]["company_name"])

    def test_company_details(self):
        r = self.client.get("/api/companies/TECH_GOOGLE")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertEqual(data["company_id"], "TECH_GOOGLE")
        self.assertIn("Google India", data["company_name"])

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
            "tech_ctc": 1500000,
            "post_id": "GOV_IAS_SDM",
            "city_tier": "X"
        }
        r = self.client.post("/api/govt-compare", json=payload)
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("private_tech", data)
        self.assertIn("public_sector", data)
        self.assertIn("verdict", data)


if __name__ == "__main__":
    unittest.main()
