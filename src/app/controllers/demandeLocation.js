const DemandeLocation = require("../models/DemandeLocation");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

var nodemailer = require("nodemailer");
var emailModel = require("../models/Mail");
var smtpTransport = require("nodemailer-smtp-transport");

router.post("/add", authMiddleware, (req, res) => {

    var demandeLocation = new DemandeLocation({
        userId: req.user._id,
        idImmobilier: req.body.idImmobilier,
        idAgent: req.body.idAgent,
        region: req.body.region,
        surface: req.body.surface,
        prix: req.body.prix,
        categorie: req.body.categorie,

    });

    demandeLocation
        .save()
        .then(demandeLocation => {
            res.send(demandeLocation);
        })
        .catch(err => {
            res.json(err);
        });
});



router.post("/sendEmail", function(req, res) {

    var transporter = nodemailer.createTransport(
        smtpTransport({
            service: "gmail",
            host: "smtp.googlemail.com",
            port: 465,
            auth: {
                user: "bienImmo2020@gmail.com",
                pass: "366795nounou"
            },
            secure: false,
            tls: { rejectUnauthorized: false },
            debug: true
        })
    );

    const mailOptions = {

        from: "bienImmo2020@gmail.com",
        to: "bienImmo2020@gmail.com",
        subject: "demande Location",
        html: "from : " + req.body.email + "<br>" + "nom : " + req.body.nom + "<br>" + "tel : " + req.body.tel +
            "<br>" + "Message : " + req.body.message + "<br>" + "Cordialement"
    };

    //sending the email 
    console.log("req.body")

    console.log(req.body)
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("email envoye" + info);
            res.send(info);
        }
    });
});

module.exports = router;