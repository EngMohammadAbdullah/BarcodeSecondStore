var alltypes = ["ccr", "cch", "mcp", "rrt", "lcp", "eer", "yyt", "upl"];
var allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var qrcode = {};
var centerDatabase = {};
var ProductsDictionary = {};
var socket = io.connect("http://192.168.0.154:3000");
var nowMoment = new moment();