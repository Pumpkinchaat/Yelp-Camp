const bcrypt = require("bcrypt");

let passhold , res;

const hashPassword = async (pass , saltRound) => {
    passhold = await bcrypt.hash(pass , saltRound);
};

const passCompare = async (plainPass , hash) => {
    res = await bcrypt.compare(plainPass , hash);
}

async function runner () {
    await hashPassword("susmit" , 12);
    await passCompare("susmit" , passhold);
    if (res) console.log("its a match");
    else console.log("access denied");
}

runner();