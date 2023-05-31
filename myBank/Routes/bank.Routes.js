const {validateJwtToken,userfetching}= require("../helpers/decodeToken.helper");
const { txnController } = require("../controller/txn.Controller");
const { callBackController } = require("../controller/callBack.controller");

const router = require("express").Router();
    
router.get("/transaction", validateJwtToken, userfetching, txnController);
router.post("/callBack", callBackController);
module.exports = router;
