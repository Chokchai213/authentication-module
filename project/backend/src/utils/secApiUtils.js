
require('dotenv').config({ path: '../.env' });
const axios = require('axios'); 

const secAPIFundDailyInfoHeader = {
    "Ocp-Apim-Subscription-Key": process.env.FUND_DAILY_INFO_API_KEY,
};

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.getFundsLastestNav = async (req, res) => {
    const proj_id = req.header("proj_id");
    // console.time('alltime')
    try {
        let found = false;
        let count = 0;
        while (!found) {
            const today = new Date();
            const nav_date = formatDate(
                new Date(today.getFullYear(), today.getMonth(), today.getDate() - count)
            );
            count++;
            const response = await axios.get(
                `https://api.sec.or.th/FundDailyInfo/${proj_id}/dailynav/${nav_date}`,
                {
                    headers: secAPIFundDailyInfoHeader,
                }
            );
            // console.time('timecheck')
            await sleep(30);
            // console.timeEnd('timecheck')
            if (response.status === 200) {
                // console.timeEnd('alltime')
                res.status(200).json(response.data);
                found = true
            }
            if (count < -30) {
                throw new Error("Data Not Found more than 30 days")
            }
        }
    } catch (err) {
        console.log("err :: ", err);
        res.status(401).json({err});
    }
}