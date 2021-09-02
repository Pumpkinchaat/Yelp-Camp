const { Router } = require("express");
const express = require("express");
const Route = express.Router();

Route.get("/" , (req , res) => {
    res.send("Viewing all cats");
});

Route.get("/:id" , (req , res) => {
    res.send("Viewing one cat");
})

Route.get("/:id/edit" , (req , res) => {
    res.send("Editing one cat");
})

module.exports = Route;