const { callBackService } = require("../services/callback.service");

exports.callBackController = async (req, res) => {
  try {
    const result = await callBackService(req);
    // console.log("txnResult--->>", result);

    if (!(result == 0)) {
      res.json({
        status: 1,
        message: "Success",
        data: result.message,
      });
    } else {
      res.json({
        status: 1,
        message: "Error",
        errorMessage: result.message,
      });
    }
  } catch (error) {
    console.log(
      "Error in callBack Error catch  controller",
      JSON.stringify(error)
    );
    res.json({
      status: 1,
      message: "Error!!!",
    });
  }
};
