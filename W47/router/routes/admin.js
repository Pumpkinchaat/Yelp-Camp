const { Router } = require("express");
const express = require("express");
const Route = express.Router();

Route.use((req , res , next) => {
    const {password} = req.query;
    if (password === "SecretCode") next();
    else res.send("Access Denied");
})

Route.get("/" , (req , res) => {
    res.send("Viewing all Docs");
});

Route.get("/:id" , (req , res) => {
    res.send("Viewing one Doc");
})

Route.get("/:id/edit" , (req , res) => {
    res.send("Editing one Doc");
})

module.exports = Route;