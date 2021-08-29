const test = "Susmit Singh";

function hello (test) {
    console.log("hello" + test);
}

function wrapper (fn) {
    return function (test) {
        hello(test).catch(e=>console.log(e));
    }
}