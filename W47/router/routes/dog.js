const { Router } = require("express");
const express = require("express");
const Route = express.Router();

Route.get("/" , (req , res) => {
    res.send("Viewing all dogs");
});

Route.get("/:id" , (req , res) => {
    res.send("Viewing one dog");
})

Route.get("/:id/edit" , (req , res) => {
    res.send("Editing one dog");
})

module.exports = Route;