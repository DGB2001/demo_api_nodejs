const express = require("express");
const router = express.Router();
const files = require("../controllers/file.controller.js");

let routes = (app) => {
  router.post("/upload", files.multipleUpload);
  router.get("/files", files.findAll);
  router.get("/files/:name", files.findOne);
  router.put("/update-file/:id-:name", files.update);
  router.delete("/soft-delete/:id", files.softDelete);
  router.delete("/permanently-delete/:id", files.permanentlyDelete);
  app.use(router);
};

module.exports = routes;