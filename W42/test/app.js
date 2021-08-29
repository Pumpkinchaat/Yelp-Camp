const express = require("express");
const app = express();

function test1() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      const num = Math.trunc(Math.random() * 100);
      if (num >= 70) res("This is resolved");
      else rej(`This is rejected ${num}`);
    }, 2000);
  });
}

function test2() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      const num = Math.floor(Math.random() * 3) + 1;
      if (num === 0) res("lmao");
      else if (num === 1) rej(num);
      else if (num === 2) rej(num);
      else if (num === 3) rej(num);
      else rej("Bruh");
    }, 1000);
  });
}

app.get("/", (req, res) => {
  res.send("This is homepage goto /dogs");
});

app.get("/dogs", (req, res, next) => {
  throw new Error("Bruh idk what happened");
});

app.get("/cats", (req, res, next) => {
  throw new Error("This is an error lmao");
});

app.get("/cats" , (req , res,  next) => {
    console.log("niggfwgaloremrigeworubveourbvheoruvheourvheourvheorvheoruvheouv");
    next();
})

app.listen(3000, () => {
  console.log("PORT 3000 :)");
});
