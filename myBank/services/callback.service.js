const { updateData } = require("../dbModel/cassandra.Model");
const crypto = require("crypto");

exports.callBackService = async (data) => {
  try {
    const str = JSON.stringify(data.body);
    const secret = "edd@ge@et@";
    const hash = crypto.createHmac("sha256", secret).update(str).digest("hex");
    console.log("hash->", hash);
    //The Hmac hash is generated same for same req.body
    if (hash == data.headers.hmac) {
      const updateObj = {
        status: "INPROGRESS",
        sub_status: "0",
        status_description: "account_opening_pending",
        kycstatus: data.body.kycstatus,
        accountcreatedstatus:
          data.body.accountcreatedstatus == "Yes" ? true : false,
        transaction_id: data.body.utmCampaign,
      };
      try {
        console.log("y");
        const dbUpdate = await updateData(updateObj);

        console.log(
          `${updateObj.transaction_id}, Stored the data received successfully:-`,
          dbUpdate
        );

        return {
          status: 0,
          message: "Stored data received in callback",
        };
      } catch (error) {
        console.log(
          `${updateObj.transaction_id} Unable to store data in Db which is recevied in callback`
        );
        return {
          status: -1, 
          message:
            "**Unable to store data in Db which is recevied in callback**",
        };
      }
    } else {
      console.log("given hmac doesnot match");
    }
  } catch (error) {
    return { status: -1, message: `try again after sometime!!!` };
  }
};
