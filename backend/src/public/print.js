const helloWorld = require("./hello.js")

module.exports = function(name) {
  let say = helloWorld(name);
  console.log(say)
  return say
};
