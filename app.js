const crypto = require("crypto")


const a = 2134354343
const b = 564747545

console.log(new Date().getTime().toString().slice(0, 10))

setTimeout(() => {
    console.log(new Date().getTime().toString().slice(0, 10))
    console.log("Fourth Timer expired");
}, 5000);

setTimeout(() => {
    console.log(new Date().getTime().toString().slice(0, 10))
    console.log("First Timer expired");
}, 4000);

crypto.pbkdf2("password", "salt", 100000, 64, "sha512", (err, derivedKey) => {
    if (err) throw err;
    console.log("Key generated successfully");
});

setTimeout(() => {
    
    console.log(new Date().getTime().toString().slice(0, 10))
    console.log("Second Timer expired");
}, 3000);

setTimeout(() => {
    console.log(new Date().getTime().toString().slice(0, 10))
    console.log("Third Timer expired");
}, 0);

function multiple(a,b){
    return a * b
}

console.log("Result = " + multiple(a,b))