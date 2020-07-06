var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var snoowrap = require('snoowrap');
var comments;
var officialComments;

var refreshTime = 2;

//Create Snoowrap requester with OAuth credentials
const r = new snoowrap({
  userAgent: 'Magic8Bot',
  clientId: auth.clientId,
  clientSecret: auth.clientSecret,
  refreshToken: auth.refreshToken
});

//gets listing of comments and posts
r.getUser(auth.target).getComments().fetchAll().then(raw => comments = raw );
r.getUser(auth.targetOff).getComments().fetchAll().then(raw => officialComments = raw );

//gets comments and posts every 2 hours after startup
setInterval(function(){
  r.getUser(auth.target).getComments().fetchAll().then(raw => comments = raw );
  r.getUser(auth.targetOff).getComments().fetchAll().then(raw => officialComments = raw );
}, refreshTime * 3600000);

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});


logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

//logs login
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

//on command reciept
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!' && channelID == "725930986503929898") {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            //spits out a random Laidlaw Comment
            case '8ball':
              bot.sendMessage({
                to: channelID,
                message: ">>> " + JSON.stringify(comments[Math.floor(Math.random() * comments.length)]['body']).replace(/\\n/g, "\n").slice(1, -1)
              })
              break;
         }//switch
     }//if
});
