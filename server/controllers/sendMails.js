const nodemailer = require("nodemailer")
const express = require("express")
const sendMails = express.Router()
const Admin = require("../models/admin")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "atsapp23@gmail.com",
        pass: "espgvmcnayykcgbd"
    }
})


///sending mail when applicant added .
sendMails.post("/add/send/:name/:role", async (req, res) => {

    const { name, role } = req.params
    const data = await Admin.find({ role: "Hiring Manager" }, { email: 1, _id: 0 })
    const emails = await data.map(admin => {
        return admin.email
    })
    const mailOptions = {
        from: "ATS-App <tirumalarowthuv@gmail.com>",
        to: emails,
        subject: `New applicant ${name} added(Applicant-Tracking-System).`,
        html: `
        <p>Hi,</p>
    <p>I hope this email finds you well.</p>
    <p>I'm writing to let you know that a new applicant - ${name} has been added. The applicant is applying for the role of ${role}.</p>
    <p>Thanks,</p>
    <p>HR team.</p>
  `
    }
    transporter.sendMail(mailOptions, async (err, info) => {
        if (err) {
            res.send(err.message)
        } else {
            res.send("Email sent to Hiring Manager successfully." + info.response)
        }
    })
})
//send mail when applicant status changed.
sendMails.post("/change/:changeby/:name/:text", async (req, res) => {
    const { name, text, changeby } = req.params
    const data = await Admin.findOne({ name: name })
    if (data) {
        const mailOptions = {
            from: "ATS-App <tirumalarowthuv@gmail.com>",
            to: data.email,
            subject: `Applicant ${text} status changed(Applicant-Tracking-System).`,
            text: `Hi,I am writing this mail to inform you that the status of ${text} has been changed by ${changeby} and also assigned you as the new owner of ${text}.So please reach out.`
        }
        transporter.sendMail(mailOptions, async (err, info) => {
            if (err) {
                res.send(err.message)
            } else {
                res.send("Email sent successfully " + info.response)
            }
        })
    } else {
        res.status(404).send("Email not found")
    }


})
//Send mail when applicant status is Online assessment test

sendMails.post("/send/:name/:email", async (req, res) => {
    const { email, name } = req.params
    const mailOptions = {
        from: "ATS-App <tirumalarowthuv@gmail.com>",
        to: email,
        subject: `Online Assessment Test Link.`,
        html: `
        <p>Hi ${name}</p>
        <p>Congratulations on making it to the next round of our hiring process!</p>
        <p>We are impressed by your candidature and would like to invite you for a Online Assessment Test.</p>
        <p>Please follow below process to complete Online Assessment Test .</p>
        <p style="font-weight: bold;">Test Link:</p>
        <button style="padding:8px 16px;background-color:#90EE90;border-radius:10px"><a style="text-decoration:underline" href="http://13.234.48.54/">Click here</a></button>
        <p>Please select candidate and then login with the following email id: ${email}</p>
        <p>All the best</p>
        <p>Please feel free to contact us if you have any questions or doubts</p>
        <p>Thanks & Regards</p>
        <p>Hr Team.</p>
        `
    }
    transporter.sendMail(mailOptions, async (err, info) => {
        if (err) {
            res.send(err.message)
        } else {
            res.send("Email sent successfully " + info.response)
        }
    })

})
module.exports = sendMails
