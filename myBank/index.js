const express = require("express");
const app = require("./server/app");

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`myBank is running on PORT:- ${port}`); 
});
