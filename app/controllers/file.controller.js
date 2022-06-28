const db = require("../models");
const upload = require("../middleware/upload");
const Op = db.Sequelize.Op;

// Create and Save a new File
exports.create = (req, res) => {};
// Retrieve all File from the database.
exports.findAll = (req, res) => {};
// Find a single File with an id
exports.findOne = (req, res) => {};
// Update a File by the id in the request
exports.update = (req, res) => {};
// Delete a File with the specified id in the request
exports.delete = (req, res) => {};
// Delete all File from the database.
exports.deleteAll = (req, res) => {};

const multipleUpload = async (req, res) => {
  try {
    await upload(req, res);
    console.log(req.files);
    if (!req.files) {
      return res
        .status(400)
        .send({ message: "Please upload at least 1 file!" });
    }
    res.status(200).send({
      message: "Uploaded the file successfully ",
    });
  } catch (error) {
    console.log(error);
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).send({ message: "Too many files to upload" });
    }
    res.status(500).send({
      message: `Could not upload the file: ${req.files.originalname}. ${err}`,
    });
  }
};

module.exports = {
  multipleUpload: multipleUpload,
};
