const { insertToDb } = require("../dbModel/cassandra.Model");
const { checkFeature } = require("../helpers/checkFeature.helper");
const { getUniqueId } = require("../helpers/generateId.helpers");

exports.txnService = async (req) => {
  let fetureCheckResponse = await checkFeature(req.user_id, 67).catch(
    (error) => {
      console.log(`CATCH BLOCK ERROR ===>`, error);
      // console.log("The request Id is--->>", req.user_id);
      console.log(
        `${req.user_id}:- Could not fetch feature the given user_id:-`,
        JSON.stringify(error)
      );
      return {
        status: 1,
        message: "Could not fetch feature for the given user ID.",
      };
    }
  );

  const userFeature = fetureCheckResponse.data[0].features;

  if (userFeature.find((el) => el == 67)) {
    try {
      let txnId = await getUniqueId();
      console.log(txnId, "<-The Uid");
      const insertObject = {
        txnId: txnId.uniqueid,
        status: "INITIATED",
        sub_status: "0",
        status_desc: "transaction Initiated",
        userName: req.user,
        user_id: req.user_id,
      };

      try {
        console.log("Insertion operation start");
        const dbInsertionSuccess = await insertToDb(insertObject);
        console.log("Final success", dbInsertionSuccess);
        console.log(
          `${insertObject.txnId} Data inserted successfully:-`,
          JSON.stringify(dbInsertionSuccess)
        );

        let data = {
          utmMedium: "ISERVEU",
          utmSource: req.user_id,
          utmCampaign: insertObject.txnId,
        };

        return { status: 0, message: data };
      } catch (error) {
        console.log(
          `${insertObject.txnId} Insertion error:-`,
          JSON.stringify(error)
        );
        return {
          status: 1,
          message: "Insertion Error",
        };
      }
    } catch (error) {
      console.log(`Error in unique id generation`, JSON.stringify(error));
      throw error;
    }
  } else {
    console.log(`${req.user_id}:- Feature not present!`);
    return { status: 1, message: "Feature not present for the user." };
  }
};
