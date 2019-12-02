const OffreModel = require("../models/Offre");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: __dirname + "/uploads/images" });

//fs instance qui recuprer les fichier a chaque imag ajoutee sera enregistrer dans uploads
var fs = require("fs");

router.post("/add", upload.single("image"), function(req, res) {
  //*****************************
  //Upload Image
  var file = __dirname + "/uploads/" + req.file.originalname;
  fs.readFile(req.file.path, function(err, data) {
    fs.writeFile(file, data, function(err) {
      if (err) {
        console.error(err);
        var response = {
          message: "Sorry, file couldn't be uploaded.",
          filename: req.file.originalname
        };
      } else {
        response = {
          message: "File uploaded successfully",
          filename: req.file.originalname
        };
      }
    });
    var Offre = new OffreModel({
      titre: req.body.titre,
      image: req.file.originalname,
      desc_off: req.body.desc_off,
      date_expiration: req.body.date_expiration
    });
    Offre.save(function(err) {
      if (err) {
        res.send({ State: "Not Ok", msg: "error" + err });
      } else {
        res.send({ State: "Okay", msg: "Offre added" });
      }
    });
  });
});
router.get("/images/:image", function(req, res) {
  res.sendFile(__dirname + "/uploads/" + req.params.image);
});

router.get("/all", function(req, res) {
  OffreModel.find({}, function(errr, result) {
    res.send(result);
  });
});
router.delete("/remove/:id", function(req, res) {
  OffreModel.deleteOne({ _id: req.params.id }, function(err) {
    if (err) {
      res.send({ state: "not ok", msg: "err" + err });
    } else {
      res.send({ state: "ok", msg: "supp" });
    }
  });
});
//prolongation pour modifier peroide de l'offre
router.put("/update/:id", function(req, res) {
  OffreModel.updateOne(
    {
      id: req.params.id,
      titre: req.body.titre,
      image: req.body.image,
      date_expiration: req.body.date_expiration,
      desc_off: req.body.desc_off
    },
    function(err) {
      if (err) res.send({ sate: "not ok", msg: "error:" + err });
      else res.send({ sate: "ok", msg: "Offre updated" });
    }
  );
});
module.exports = router;
