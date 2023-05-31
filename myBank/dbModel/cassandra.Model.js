const { cassandraClient } = require("../config/cassandra.config");

exports.insertToDb = async (insertObject) => {
  try {
    const { txnId, userName, user_id, status, status_desc, sub_status } = insertObject;

    let updateQuery = `UPDATE myBank SET user_id='${user_id}', user_name='${userName}',status='${status}',status_description='${status_desc}', sub_status='${sub_status}' WHERE transaction_id='${txnId}'`;
    console.log("Update Query", updateQuery);
    const result = await cassandraClient.execute(updateQuery);

    return result.rows;
  } catch (error) {
    console.log(`Error in Data insertion `);
    throw error;
  }

  // return new Promise((resolve, reject) => {
  //   let insertUserDetails = `UPDATE myBank SET user_id='${user_id}', user_name='${user_name}',status='${status}',status_description='${status_description}', sub_status='${sub_status}' WHERE transaction_id='${transaction_id}'`;

  //   cassandraClient
  //     .execute(insertUserDetails)
  //     .then((result) => {
  //       if (result) {
  //         (result) => {
  //           console.log("result", result);
  //           resolve(result.rows);
  //         };
  //       } else {
  //         console.log("not hitting the if part");
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       reject({ error: "catch part error in cassandra model.js" });
  //     });
  // });
};

exports.fetchUser = (user_name) => {
  return new Promise((resolve, reject) => {
    let fetch = `SELECT * FROM user_properties WHERE user_name='${user_name}' ALLOW FILTERING`;

    cassandraClient
      .execute(fetch)
      .then((result) => {
        resolve(result.rows);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.updateData = (data) => {
  const {
    txn_id,
    status,
    sub_status,
    kycstatus,
    status_description,
    accountcreatedstatus,
  } = data;

  return new Promise((resolve, reject) => {
    let updateQuery = `UPDATE myBank SET status='${status}', sub_status='${sub_status}',kycstatus='${kycstatus}', status_description='${status_description}',accountcreatedstatus=${accountcreatedstatus}  WHERE transaction_id='${txn_id}'`;

    console.log("updateQuery in moodel", updateQuery);
    cassandraClient
      .execute(updateQuery)
      .then((result) => {
        resolve(result.rows);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.checkFeatureId = async (featureId) => {
  try {
    const checkFeatureQuery = `SELECT is_active FROM pob_feature WHERE feature_id=${featureId} ALLOW FILTERING`;

    console.log("Checking the Query Log:-->", checkFeatureQuery);
    const result = await cassandraClient.execute(checkFeatureQuery);
    return result.rows[0];
  } catch (error) {
    console.log("Error from checkFeatureId Model");
    throw error;
  }
};

exports.fetchUserFeatureByID = async (user_id) => {
  try {
    let fetchUserFeatureByQuery =
      "SELECT * FROM user_feature_new WHERE user_id =" +
      user_id +
      "  ALLOW FILTERING";
    console.log("fetchUserFeatureByQuery-->>", fetchUserFeatureByQuery);
    console.log("Reached at fetchUserFeatureId");
    const result = await cassandraClient.execute(fetchUserFeatureByQuery);

    if (result.rows.length > 0) {
      console.log(`${user_id}:-> feature founded for the given UserId`);
      let resData = result.rows;
      return { status: 0, data: resData };
    } else {
      console.log(`No User feature found with this userId-${user_id}`);
      return { status: 1, message: "No user Feature found with Given UserId" };
    }
  } catch (error) {
    console.log("Fetch user  by userId  error", JSON.stringify(error));
    throw error;
  }
};
