const {checkFeatureId,fetchUserFeatureByID,} = require("../dbModel/cassandra.Model");

exports.checkFeature = async (user_id, featureId) => {
  try {
    let response = await checkFeatureId(featureId);

    console.log(`RESPONSE ===>`, response.is_active);

    if (response.is_active == 1) {
      // console.log(`INTO IS ACTIVE == 1`);
      let userFeatureResult = await fetchUserFeatureByID(user_id).catch(
        (err) => {
          console.log(
            `Error in fetching for the given user_id`,
            JSON.stringify(err)
          );
          return {
            status: 1,
            message:
              "Error in fetching for the given user_id, Please Contact Admin",
          };
        }
      );

      if (userFeatureResult?.status == -1) {
        console.log(`Error in fetching feature for the given feature id`);
        return {
          status: 1,
          message: "Unable to fetch feature for the given user id",
        };
      } else {
        return userFeatureResult;
      }
    } else {
      console.log(
        `${featureId} Oh!! Feature is not enabled. Please enable the feature of given feature_id`
      );
      return {
        status: 1,
        message:
          "Oh!! Feature is not enabled. Please enable the feature of given feature_id",
      };
    }
  } catch (error) {
    console.log("New log in checkFeatureId:-");
    console.log(`${featureId}:- check feature error`, err);
    return {
      status: 1,
      message: "Error while checking feature",
    };
  }
};
