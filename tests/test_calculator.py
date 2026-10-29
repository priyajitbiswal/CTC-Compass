"""
Tests for CTC Compass India Calculation Engine & Comparators
"""

import unittest
from engine.calculator import calculate_new_regime_tax_2026, deconstruct_ctc, calculate_old_regime_tax
from engine.comparator import compare_two_offers
from engine.government import calculate_government_salary, compare_tech_vs_sarkari


class TestTaxAndCalculator(unittest.TestCase):

    def test_spec_vector_12_lakhs(self):
        res = calculate_new_regime_tax_2026(1200000)
        self.assertEqual(res["standard_deduction"], 75000)
        self.assertEqual(res["taxable_income"], 1125000)
        self.assertEqual(res["slab_tax"], 52500)
        self.assertEqual(res["rebate"], 52500)
        self.assertEqual(res["total_annual_tax"], 0)

    def test_spec_vector_13_lakhs(self):
        res = calculate_new_regime_tax_2026(1300000)
        self.assertEqual(res["standard_deduction"], 75000)
        self.assertEqual(res["taxable_income"], 1225000)
        self.assertEqual(res["slab_tax"], 63750)
        self.assertEqual(res["tax_before_cess"], 25000)
        self.assertEqual(res["cess"], 1000)
        self.assertEqual(res["total_annual_tax"], 26000)

    def test_spec_vector_15_lakhs(self):
        res = calculate_new_regime_tax_2026(1500000)
        self.assertEqual(res["standard_deduction"], 75000)
        self.assertEqual(res["taxable_income"], 1425000)
        self.assertEqual(res["slab_tax"], 93750)
        self.assertEqual(res["rebate"], 0)
        self.assertEqual(res["cess"], 3750)
        self.assertEqual(res["total_annual_tax"], 97500)

    def test_zero_tax_inflection_point(self):
        res = calculate_new_regime_tax_2026(1275000)
        self.assertEqual(res["taxable_income"], 1200000)
        self.assertEqual(res["total_annual_tax"], 0)

    def test_ctc_deconstruction_realistic_values(self):
        res = deconstruct_ctc(annual_ctc=1200000, basic_pct=40, variable_pct=10)
        self.assertGreater(res["monthly_pay_slip"]["monthly_fixed_in_hand"], 0)
        self.assertGreater(res["annual_cash_summary"]["year1_net_in_hand"], 0)
        self.assertGreater(res["metrics"]["cash_realization_rate_pct"], 70)

    def test_offer_clash_comparator(self):
        offer_a = {"name": "Startup Alpha", "ctc": 1800000, "variable_pct": 20, "joining_bonus": 200000}
        offer_b = {"name": "MNC Beta", "ctc": 1500000, "variable_pct": 5, "joining_bonus": 0}
        comp = compare_two_offers(offer_a, offer_b)
        self.assertIn("recommended_winner", comp["comparison"])
        self.assertIn("verdict", comp["comparison"])

    def test_government_salary_level_7(self):
        res = calculate_government_salary(pay_level="Level 7", da_rate_pct=50, city_tier="X")
        self.assertEqual(res["monthly_pay_slip"]["basic_pay"], 44900)
        self.assertGreater(res["monthly_pay_slip"]["net_in_hand_monthly"], 50000)
        self.assertGreater(res["annual_summary"]["total_economic_value_annual"], 800000)

    def test_tech_vs_sarkari_duel(self):
        duel = compare_tech_vs_sarkari(tech_ctc=1000000, govt_pay_level="Level 7", city_tier="X")
        self.assertIn("verdict", duel)
        self.assertIn("in_hand_difference_monthly", duel["verdict"])


if __name__ == "__main__":
    unittest.main()
