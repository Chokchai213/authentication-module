require("dotenv").config({ path: "../.env" });
const client = require("../utils/mongoUtils");
const firebaseAuth = require("../controllers/firebaseAuth");
const { ObjectId } = require("mongodb");
// Database Name
const dbName = "dev";

exports.createNewUser = async (user) => {
    const db = client.db(dbName);
    const collection = db.collection("users");
    try {
        query = { uid: user.uid };
        var findResult = await collection.findOne(query);
        if (findResult) {
            console.log("User already existed");
        } else {
            obj = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                provider: "none",
            };
            var insertResult = await collection.insertOne(obj);
            console.log(insertResult);
        }
        await createUserNetSummary(user.uid)
    } catch (error) {
        console.log("Error occured in mongoController.createNewUser: ", error);
    }
};

exports.createNewUserWithProvider = async (req, res) => {
    const userData = req.body.userData.user;
    const idToken = req.body.userData._tokenResponse.idToken;
    const provider = req.params.provider;
    const db = client.db(dbName);
    const collection = db.collection("users");
    try {
        const isVerify = await firebaseAuth.verifyIdToken(idToken, userData.uid);
        if (isVerify) {
            switch (provider) {
                case "google":
                    obj = {
                        uid: userData.uid,
                        email: userData.email,
                        displayName: userData.displayName,
                        provider: provider,
                    };
                    let query = { uid: userData.uid };
                    var findResult = await collection.findOne(query);
                    if (findResult) {
                        await collection.findOneAndReplace(query, obj, {
                            returnNewDocument: true,
                        });
                    } else {
                        await collection.insertOne(obj);
                    }
                    break;
                default:
                    throw new Error("Unknown Provider");
            }
            await createUserNetSummary(userData.uid);
            res.status(200).json({ userData });
        } else {
            throw new Error("unauthorized access");
        }
    } catch (error) {
        console.log(
            "Error occured in mongoController.createNewUserWithProvider: ",
            error
        );
        res.status(401).json({ message: error });
    }
};

async function createUserNetSummary(userId){
    const db = client.db(dbName);
    const collection = db.collection("usernetsummary");
    const netSummaryFindResult = await collection.findOne({userId : userId});
    if(!netSummaryFindResult){
        await collection.insertOne({
            userId : userId,
            netIncome : 0,
            netExpense : 0,
            netIncomeExpense : 0,
            netBoughtAsset : 0,
            netSoldAsset : 0,
            netWealth : 0,
        });
    }
}

exports.getUserDataIncomeExpense = async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection("income_expense");
    try {
        query = { userId: req.params.uid, year: "2024" };
        var findResult = await collection.find(query).toArray();
        res.json(findResult);
    } catch (error) {
        console.log(
            "Error occured in exports.getUserDataIncomeExpense: ",
            error
        );
        res.status(401).json({ message: error });
    }
};

exports.getFunds = async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection("funds");

    try {
        var findResult = await collection
            .find()
            .toArray();
        res.json(findResult);
    } catch (error) {
        console.log("Error occured in exports.getFunds: ", error);
        res.status(401).json({ message: error });
    }
};

exports.saveTaxGoal = async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection("goal");

    //เอาไว้หา UserId
    const filter = {};

    const updateDoc = {
        userId: req.body.userId,
        Name: req.body.Name,
        Funds: req.body.Funds,
        Percentage: req.body.Percentage,
        CreatedDate: new Date().toLocaleDateString("en-GB").split(" ")[0],
        isActive: true
    };
    //const options = { upsert: true };

    try {
        await collection.insertOne(updateDoc);
    } catch (error) {
        console.log("Error occured in exports.saveTaxGoal: ", error);
        res.status(401).json({ message: error });
    }
};

exports.getGrowthRate = async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection("funds");

    try {
        const query = {};
        const options = {
            _id: 0,
            growthrat_lastmonth: 1,
        };
        var findResult = await collection.find(query).project(options).toArray();
        res.status(200).json({ findResult });
    } catch (error) {
        console.log("Error occured in exports.getGrowthRate: ", error);
        res.status(401).json({ message: error });
    }
};

exports.upsertUserMonthlyData = async (req, res) => {
    const upsertData = req.body.upsertData;
    const userToken = req.header("Authorization");
    const userId = req.header("UserId");
    const db = client.db(dbName);
    const collection = db.collection("income_expense");
    try {
        const isVerify = await firebaseAuth.verifyIdToken(
            userToken,
            userId
        );
        if (isVerify) {
            console.log("upsertData :: ", upsertData);
            query = { userId: userId, date: upsertData.currentDate };
            await collection.updateOne(
                query,
                {
                    $set: {
                        userId: userId,
                        date: upsertData.currentDate,
                        incomeData: upsertData.incomeData,
                        expenseData: upsertData.expenseData,
                        investmentData: upsertData.investmentData,
                        year: upsertData.currentDate.split("-")[0],
                        month: parseInt(upsertData.currentDate.split("-")[1]).toString(),
                    },
                },
                { upsert: true }
            );
            await updateUserDiffIncomeExpense(userId)
            res.status(200).json({ upsertData });
        } else {
            throw new Error("unauthorized access");
        }
    } catch (error) {
        console.log(
            "Error occured in mongoController.upsertUserMonthlyData: ",
            error
        );
        res.status(401).json({ message: error });
    }
};

exports.upsertUserMultipleMonthlyData = async (req, res) => {
    const upsertData = req.body.upsertData;
    const userToken = req.header("Authorization");
    const userId = req.header("UserId");
    const db = client.db(dbName);
    const collection = db.collection("income_expense");
    try {
        const isVerify = await firebaseAuth.verifyIdToken(userToken, userId);
        if (isVerify) {
            await Promise.all(
                upsertData.map(async (data) => {
                    let query = { userId: data.user.userId, date: data.currentDate };
                    await collection.updateOne(
                        query,
                        {
                            $set: {
                                userId: data.user.userId,
                                date: data.currentDate,
                                incomeData: data.incomeData,
                                expenseData: data.expenseData,
                                investmentData: data.investmentData,
                                year: data.currentDate.split("-")[0],
                                month: parseInt(data.currentDate.split("-")[1]).toString(),
                            },
                        },
                        { upsert: true }
                    );
                })
            );
            await updateUserDiffIncomeExpense(userId)
            res.status(200).json({ upsertData });
        } else {
            throw new Error("unauthorized access");
        }
    } catch (error) {
        console.log(
            "Error occured in mongoController.upsertUserMultipleMonthlyData: ",
            error
        );
        res.status(401).json({ message: error });
    }
};

async function updateUserDiffIncomeExpense (uid) {
    const db = client.db(dbName);
    const collectionIncomeExpense = db.collection("income_expense");
    const collectionUserNetSummary = db.collection("usernetsummary");
    const netSummaryFindResult = await collectionUserNetSummary.findOne({userId : uid});
    if(netSummaryFindResult){
        const totalIncomeExpense = await collectionIncomeExpense.find({userId : uid}).toArray();
        let tmpTotalIncome = 0;
        let tmpTotalExpense = 0;
        totalIncomeExpense.forEach((data) => {
            data.expenseData.forEach(expense => {
                tmpTotalExpense += parseFloat(expense.amount);
            })
            data.incomeData.forEach(income => {
                tmpTotalIncome += parseFloat(income.amount);
            })
        })
        netSummaryFindResult.netIncome = tmpTotalIncome;
        netSummaryFindResult.netExpense = tmpTotalExpense;
        netSummaryFindResult.netIncomeExpense = (netSummaryFindResult.netIncome - netSummaryFindResult.netExpense);
        netSummaryFindResult.netWealth = netSummaryFindResult.netIncomeExpense - netSummaryFindResult.netBoughtAsset + netSummaryFindResult.netSoldAsset
        await collectionUserNetSummary.updateOne({userId : uid},  {
            $set: netSummaryFindResult,
        },
        { upsert: true });
    }
}

exports.getUserDataDashboard = async (req, res) => {
    const userId = req.header("userId");
    const userToken = req.header("Authorization");
    const queryYear = req.header("year");
    const db = client.db(dbName);
    const collection = db.collection("income_expense");
    try {
        let query = { userId: userId };
        if (queryYear) {
            query.year = queryYear;
        }
        const queryResult = await collection.find(query).toArray();
        res.status(200).json({ queryResult });
    } catch (error) {
        console.log(
            "Error occured in mongoController.getUserDataDashboard: ",
            error
        );
        res.status(401).json({ message: error });
    }
};

exports.deleteUserMonthData = async (req, res) => {
    const year = req.body.year;
    const month = req.body.month;
    const userToken = req.header("Authorization");
    const userId = req.header("UserId");
    const db = client.db(dbName);
    const collection = db.collection("income_expense");
    try {
        const isVerify = await firebaseAuth.verifyIdToken(userToken, userId);
        if (isVerify) {
            let query = { year: year, month: month, userId: userId };
            const queryResult = await collection.deleteOne(query);
            await updateUserDiffIncomeExpense(userId)
            res.status(200).json({ message: "delete success" });
        } else {
            throw new Error("unauthorized access");
        }
    } catch (error) {
        console.log(
            "Error occured in mongoController.deleteUserMonthData: ",
            error
        );
        res.status(401).json({ message: error });
    }
};

exports.getUserGoal = async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection("goal");
    try {
        query = { userId: req.params.uid };
        var findResult = await collection.find(query).toArray();
        res.json(findResult);
    } catch (error) {
        console.log("Error occured in exports.getUserGoal: ", error);
        res.status(401).json({ message: error });
    }
};

exports.getUserAsset = async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection("assets");

    try {
        query = { userId: req.params.uid };
        var findResult = await collection.find(query).project({ Funds: 1 }).toArray();
        res.json(findResult);
    } catch (error) {
        console.log("Error occured in exports.getUserAsset: ", error);
        res.status(401).json({ message: error });
    }
};

exports.changeMultipleGoalPercentage = async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection("goal");
    const userToken = req.header("Authorization");
    const userId = req.header("UserId");
    try {
        const isVerify = await firebaseAuth.verifyIdToken(userToken, userId);
        if (isVerify) {
            await Promise.all(
                req.body.goal.map(async (data) => {
                    const query = { userId: data.userId, Name: data.Name };
                    await collection.updateOne(
                        query,
                        {
                            $set: {
                                Percentage: data.Percentage,
                            },
                        },
                        { upsert: true }
                    );
                })
            );
            res.status(200);
        }
    } catch (err) {
        console.log("Error occured in mongoController.changeMultipleGoalPercentage: ", err);
        res.status(401).json({ message: err });
    }
};

exports.getUserGoalGoalBased = async (req, res) => {
    const userId = req.header("userId");
    const userToken = req.header("Authorization");
    const queryYear = req.header("year");
    const db = client.db(dbName);
    const collection = db.collection("goal");
    try {
        let query = { userId: userId };
        if (queryYear) {
            query.year = queryYear;
        }
        const queryResult = await collection.find(query).toArray();
        res.status(200).json({ queryResult });
    } catch (error) {
        console.log(
            "Error occured in mongoController.getUserGoalGoalBased: ",
            error
        );
        res.status(401).json({ message: error });
    }
}

exports.getUserAssetGoalBased = async (req, res) => {
    const userId = req.header("userId");
    const userToken = req.header("Authorization");
    const queryYear = req.header("year");
    const db = client.db(dbName);
    const collection = db.collection("assets");
    try {
        let query = { userId: userId };
        if (queryYear) {
            query.year = queryYear;
        }
        const queryResult = await collection.find(query).toArray();
        res.status(200).json({ queryResult });
    } catch (error) {
        console.log(
            "Error occured in mongoController.getUserAssetGoalBased: ",
            error
        );
        res.status(401).json({ message: error });
    }
}
exports.stopGoal = async (req, res) => {
    const db = client.db(dbName);
    const collectionGoal = db.collection("goal");
    const userToken = req.header("Authorization");
    const userId = req.header("UserId");
    try {
        const isVerify = await firebaseAuth.verifyIdToken(userToken, userId);
        if (isVerify) {
            const queryGoal = {
                userId: userId,
                Name: req.body.Name
            };
            const isActive = await collectionGoal.find(queryGoal).project({ isActive: 1, Name: 1 }).toArray()
            //console.log(isActive[0].isActive)
            if (isActive[0].isActive == true || isActive[0].isActive == undefined) { await collectionGoal.updateOne(queryGoal, { $set: { isActive: false } }) }
            else if (isActive[0].isActive == false) { await collectionGoal.updateOne(queryGoal, { $set: { isActive: true } }) };
            //await collectionGoal.updateOne(queryGoal, { $set: { isActive: false } })
            res.status(200);
        }
    } catch (err) {
        console.log("Error occured in mongoController.stopGoal: ", err);
        res.status(401).json({ message: err });
    }
};

exports.deleteGoal = async (req, res) => {
    const db = client.db(dbName);
    const collectionAsset = db.collection("assets");
    const collectionGoal = db.collection("goal");
    const userToken = req.header("Authorization");
    const userId = req.header("UserId");
    try {
        const isVerify = await firebaseAuth.verifyIdToken(userToken, userId);
        if (isVerify) {
            const queryAsset = {
                userId: userId,
                goalObjId: req.body.goalId
            };
            // await collection.find(query).toArray().then(x => console.log(x))
            await collectionAsset.updateMany(queryAsset, { $unset: { goalObjId: '' } })

            const queryGoal = {
                userId: userId,
                Name: req.body.Name
            };
            await collectionGoal.deleteOne(queryGoal)


            res.status(200);
        }
    } catch (err) {
        console.log("Error occured in mongoController.deleteGoal: ", err);
        res.status(401).json({ message: err });
    }
}

exports.getUserRiskProfile = async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection("risk_profile");
    const userToken = req.header("Authorization");
    const userId = req.header("UserId");
    try {
        const isVerify = await firebaseAuth.verifyIdToken(userToken, userId);
        if (isVerify) {
            query = { uid: userId };
            var findResult = await collection.findOne(query);
            res.status(200).json({ findResult });
        }
    } catch (err) {
        console.log("Error occured in mongoController.getUserRiskProfile: ", err);
        res.status(401).json({ message: err });
    }
}

exports.createUserRiskProfile = async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection("risk_profile");
    const userToken = req.header("Authorization");
    const userId = req.header("UserId");
    const userRiskProfile = req.body.risk_profile;
    try {
        const isVerify = await firebaseAuth.verifyIdToken(userToken, userId);
        if (isVerify) {
            query = { uid: userId };
            const updateResult = await collection.updateOne(
                query,
                {
                    $set: {
                        uid: userId,
                        riskProfile: userRiskProfile
                    },
                },
                { upsert: true }
            );
            res.status(200).json({ updateResult });
        }
    } catch (err) {
        console.log("Error occured in mongoController.createUserRiskProfile: ", err);
        res.status(401).json({ message: err });
    }
}

exports.getMasterDataByName = async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection("master_data");
    const name = req.header("Name");
    try {
        query = { name: name };
        const queryResult = await collection.findOne(
            query
        );
        res.status(200).json({ queryResult });
    } catch (err) {
        console.log("Error occured in mongoController.createUserRiskProfile: ", err);
        res.status(401).json({ message: err });
    }
}

exports.upsertGoal = async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection("goal");
    const goalData = req.body.goalData;
    const userToken = req.header("Authorization");
    const userId = req.header("UserId");
    const goalObjId = req.body.goalObjId;
    try {
        const isVerify = await firebaseAuth.verifyIdToken(userToken, userId);
        if (isVerify) {
            if (goalObjId || goalData._id) {
                //code to edit existing goal
                goalData.type = "normal"
                let id = goalObjId ? new ObjectId(goalObjId) : new ObjectId(goalData._id)
                let query = { _id: id }
                delete goalData._id
                await collection.updateOne(
                    query,
                    {
                        $set:
                            goalData
                        ,
                    },
                    { upsert: true }
                );
            } else {
                goalData.type = "normal"
                let query = { userId: userId, Name: goalData.Name };
                await collection.updateOne(
                    query,
                    {
                        $set:
                            goalData
                        ,
                    },
                    { upsert: true }
                );
            }
            res.status(200).json({ message: "SUCCESS" });
        }
    } catch (err) {
        console.log("Error occured in mongoController.upsertGoal: ", err);
        res.status(401).json({ message: err });
    }
}

exports.getUserGoalByObjId = async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection("goal");
    const userToken = req.header("Authorization");
    const userId = req.header("UserId");
    try {
        const isVerify = await firebaseAuth.verifyIdToken(userToken, userId);
        if (isVerify) {
            let query = { _id: new ObjectId(req.header("GoalObjId")) };
            const findResult = await collection.findOne(query);
            res.status(200).json(findResult);
        }
    } catch (err) {
        console.log("Error occured in mongoController.getUserGoalByObjId: ", err);
        res.status(401).json({ message: err });
    }
}

exports.getUserNetSummary = async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection("usernetsummary");
    const userToken = req.header("Authorization");
    const userId = req.header("UserId");
    try {
        const isVerify = await firebaseAuth.verifyIdToken(userToken, userId);
        if (isVerify) {
            let query = { userId: userId };
            const findResult = await collection.findOne(query);
            res.status(200).json(findResult);
        }
    } catch (err) {
        console.log("Error occured in mongoController.getUserGoalByObjId: ", err);
        res.status(401).json({ message: err });
    }
}