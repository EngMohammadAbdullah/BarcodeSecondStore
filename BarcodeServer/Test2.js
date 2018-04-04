const util = require('util');
const setImmediatePromise = util.promisify(setImmediate);



setTimeoutPromise(2000, 'foobar').then((value) => {
    // value === 'foobar' (passing values is optional)
    // This is executed after about 40 milliseconds.
    console.log("fff")
});