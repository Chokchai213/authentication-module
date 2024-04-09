const express = require("express");
const router = express.Router();
const mongoController = require("../controllers/mongoController");

router.post(
    "/createuser_provider=:provider",
    mongoController.createNewUserWithProvider
);

router.post("/upsert_monthly", mongoController.upsertUserMonthlyData);

router.get("/userdata_dashboard", mongoController.getUserDataDashboard);

router.get("/userdata=:uid", mongoController.getUserDataIncomeExpense);

router.get("/funds", mongoController.getFunds);

router.post("/save_tax_goal", mongoController.saveTaxGoal);

router.get("/get_growthrate", mongoController.getGrowthRate);

router.post("/upsert_multiple", mongoController.upsertUserMultipleMonthlyData);

router.post("/delete_monthly", mongoController.deleteUserMonthData);

router.get("/usergoal=:uid", mongoController.getUserGoal);

router.get("/userassets=:uid", mongoController.getUserAsset);

router.post(
    "/change_goal_percentage",
    mongoController.changeMultipleGoalPercentage
);

router.get("/get_user_asset", mongoController.getUserAssetGoalBased);

router.get("/get_user_goal", mongoController.getUserGoalGoalBased);

router.post("/stop_goal", mongoController.stopGoal);

router.post("/delete_goal", mongoController.deleteGoal);

router.get("/get_user_risk_profile", mongoController.getUserRiskProfile);

router.post("/create_user_risk_profile", mongoController.createUserRiskProfile);

router.get("/get_master_data", mongoController.getMasterDataByName);

router.post("/create_new_normal_goal", mongoController.upsertGoal);

router.get("/get_goal_by_obj_id", mongoController.getUserGoalByObjId);

router.get("/get_user_net_summary", mongoController.getUserNetSummary);

router.post(
    "/get_and_calculate_fund_growth",
    mongoController.getAndCalculateFundGrowth
);

router.get("/get_nav", mongoController.getFundsDailyNav);

router.post("/insert_asset", mongoController.insertUserBoughtAsset);

router.get("/get_user_asset_by_goal_id", mongoController.getUserAssetByGoalId);

router.post("/get_goal_asset_lastest_price", mongoController.getGoalAssetLastestNav);

router.post("/update_goal_status_flag", mongoController.updateGoalStatusFlag);

router.post('/save_reduction_field', mongoController.saveReductionField);

router.post('/get_user_tax', mongoController.getUserTax);

module.exports = router;
