const axios = require("axios");

exports.getUniqueId = async () => {
  const snowflakeUrl = "http://35.200.189.128:8082/snowflake/generateId";
  try {
    const result = await axios.get(snowflakeUrl);
    // console.log("Id generater called");
    // console.log(result);
    return result.data;
  } catch (error) {
    console.log("UniqueId generate error", error);
    throw error.message;
  }
};
