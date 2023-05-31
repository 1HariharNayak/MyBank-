const { txnService } = require("../services/txn.Service");

exports.txnController = async (req, res) => {
  try {
    const txnResult = await txnService(req);
    console.log("txnResult======", txnResult);

    if (!(txnResult.status==0)) { 
      res.json({
        status: 1,
        message: "ERROR",
        error: txnResult.message,
      });
    } else {
      res.json({
        status: 0,
        message: "SUCCESS",
        txnResult: txnResult.message
      });
    }
  } catch (error) {
    console.log(`catch Error in txnController block`, JSON.stringify(error));
    res.json({
      status: 1,
      message: "ERROR!!!",
    });
  }
};
