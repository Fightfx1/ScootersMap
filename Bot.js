const Zazoo = require('./Lib/Zazoo/Bot/Zazoo.js').Zazoo
const fs = require('fs');

const Bot = new Zazoo({
    accessToken: 'EAAGkHO1TLCwBABjUr0wOVzp7jXaADwSzUyJAaidpyFW26dXolFqOGvDqIKk2GYdMQLWlZBOcI9yyV2QpJIQezhVpbTjeqpdaBsGsp5RnXYij1jiNZCcyVKjDosZBJkRuJ14PuaFE3whazNkvEZCQXevt8g5LOyMiIvBGJWiqTgZDZD', 
    verifyToken: 'T_gT!c2CYr+NdG%6v!BR', // choose what ever you want
    appSecret: 'ca89304fb6b5b942bd7734aa33aec3fa', // app secret from facebook developer
    Url: "https://a44f1270.ngrok.io/" // Domain That the bot running on him
})


Bot.on('message',(payload, chat) => { // Every Time That the bot get any message he print her
    const text = payload.sender.id; // take the text from the request
    console.log("User Said: " + text) // print the text
});

Bot.hear(['Menu'], (payload,chat) => {
    
    if(new new require('./Lib/Zazoo/KnownUsers/KnownUsers.js').KnownUsers().Known(payload.sender.id)) // Chack if that is new user that chatting with as
    {
        Bot.SendMenu(payload.sender.id) // Send the menu to the user that asked for.
    }
    else
    {
        // The user That ask for the menu is not register user.
        // send him to get started.

        chat.say({
            text:'Plz Go To "Get Started" before you start to use.',
            quickReplies: ['Get Started']
        });  
    }
});

function StartAlerts()
{
    require('./Lib/Zazoo/Alerts/AlertsBirds.js').StartBirdAlerts(Bot)
}

setInterval(StartAlerts,1200000)




require('./Lib/Zazoo/Menu/MenuRespones.js').MenuRespones(Bot); // Bot starting hear to menu command.



Bot.PremiumWebSite() // starting bot website.

Bot.StartMapService() // Starting map service




Bot.start(3000) // The Bot starting command.






module.exports.Bot = Bot;