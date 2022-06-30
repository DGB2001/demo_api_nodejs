const db = require("../models");
const File = db.files;
const Op = db.Sequelize.Op;
const upload = require("../middleware/upload");
const path = require("path");
const fs = require("fs");

const multipleUpload = async (req, res) => {
  try {
    await upload(req, res);
    console.log(req.files);
    if (!req.files) {
      return res
        .status(400)
        .send({ message: "Please upload at least 1 file!" });
    } else {
      for (index = 0; index < req.files.length; ++index) {
        const file = {
          name: path.basename(req.files[index].path),
        };
        // Save file in the database
        File.create(file);
      }
      res.status(200).send({
        message: "Uploaded the file successfully",
      });
    }
  } catch (error) {
    console.log(error);
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).send({ message: "Too many files to upload" });
    }
    res.status(500).send({
      message: "Could not upload the file",
    });
  }
};

// Retrieve all File from the database.
const findAll = (req, res) => {
  File.findAll({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving files.",
      });
    });
};

// Find a single File with name
const findOne = (req, res) => {
  const fileName = req.params.name;
  File.findOne({ where: { name: fileName } })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find File with name=${fileName}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving files.",
      });
    });
};

// Update a File by the id in the request
const update = (req, res) => {
  const id = req.params.id;
  const name = req.params.name;
  File.findByPk(id).then((data) => {
    if (data) {
      fs.rename(
        __basedir + "/resources/uploads/" + `${data.name}`,
        __basedir + "/resources/uploads/" + `${name}`,
        (err) => {
          if (err)
            res.send({
              message: err.message || `Error rename file in directory`,
            });
        }
      );
      File.update({ name: name }, { where: { id: id } })
        .then((result) => {
          if (result == 1) {
            res.send({
              message: "Files was updated successfully.",
            });
          } else {
            res.send({
              message: `Cannot update File with id=${id}`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Error updating File with id=" + id,
          });
        });
    } else {
      res.send({
        message: `The file has id=${id} does not exist`,
      });
    }
  });
};

// Delete File
const softDelete = (req, res) => {
  const id = req.params.id;
  File.destroy({
    where: { id: id },
  })
    .then((result) => {
      if (result == 1) {
        res.send({
          message: "File was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete File with id=${id}. Maybe File was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete File with id=" + id,
      });
    });
};

const permanentlyDelete = (req, res) => {
  const id = req.params.id;
  File.findByPk(id).then((data) => {
    if (data) {
      // Delete file in directory
      fs.unlink(__basedir + "/resources/uploads/" + `${data.name}`, (err) => {
        if (err)
          res.send({
            message: err.message || `Error delete file in directory`,
          });
      });
      // Delete file in database
      File.destroy({
        where: { id: id },
        force: true,
      })
        .then((num) => {
          if (num == 1) {
            res.send({
              message: "File was deleted permanently!",
            });
          } else {
            res.send({
              message: `Cannot delete File with id=${id}. Maybe File was not found!`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Could not delete File with id=" + id,
          });
        });
    } else {
      res.send({
        message: `The file has id=${id} does not exist`,
      });
    }
  });
};

module.exports = {
  multipleUpload: multipleUpload,
  findAll: findAll,
  findOne: findOne,
  update,
  softDelete,
  permanentlyDelete,
};
