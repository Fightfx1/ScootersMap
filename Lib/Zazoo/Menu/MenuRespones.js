function MenuHear(Bot)
{
    Bot.on('postback:menu', (payload, chat) => {
        Bot.SendMenu(payload.sender.id); // Sending to the user that ask the menu.
    });
    
    Bot.on('postback:Menu', (payload, chat) => {
        Bot.SendMenu(payload.sender.id); // Sending to the user that ask the menu.
    });

    Bot.on('postback:Premium', (payload, chat) => {
        Bot.sendTemplate(payload.sender.id,{
            template_type: 'button',
            text: Messenge,
            buttons:[
                {
                    "title":"Premium",
                    "type":"web_url",
                    "url": this.WebHook,
                    "webview_height_ratio": "compact",
                    "messenger_extensions": true,
                    "webview_share_button" : "hide"
                },
                {type: 'postback', title: 'Menu', payload: 'menu'}

            ]
        })
    });

    Bot.on('postback:Find Scooter', (payload,chat) =>{
        chat.conversation((convo) => {
            convo.sendTypingIndicator(300).then(() => require('./FindScooter/Find_Scooter.js').FindScooter(convo,Bot)); // send typing indicator 300ms + Findscooter file
        });   
    })
    
    Bot.on('postback:Find scooter to charge', (payload,chat) =>{
        chat.conversation((convo) => {
            convo.sendTypingIndicator(300).then(() => require('./FindScooter/FindScooterForCharge.js').FindScooter(convo,Bot)); // send typing indicator 300ms + Findscooter file
        });   
    })
    
    Bot.on('postback:Find scooter to ride', (payload,chat) =>{
        chat.conversation((convo) => {
            convo.sendTypingIndicator(300).then(() => require('./FindScooter/FindScooterForRide.js').FindScooter(convo,Bot)); // send typing indicator 300ms + Findscooter file
        });   
    })

    Bot.on('postback:Get Started', (payload, chat) => { // First time that the user talking with the bot.
       
        let KnownUsers = new new require('../KnownUsers/KnownUsers.js').KnownUsers();
        if(KnownUsers.Known(payload.sender.id))
        {
            chat.say({
                text: "What do you need help with?",
                quickReplies: ['Find Scooter', 'Scooter Alerts','Premium']
            });
        }
        else
        {
            let NewClient = require('../New_Client/NewClient.js')
            chat.conversation((convo) => {
                convo.sendTypingIndicator(200).then(() => NewClient.NewClient(convo));
            });
        }
        
    });

    Bot.on('postback:Scooter Alerts', (payload,chat) =>{
        let AlertsMenu = require('./AlertsMenu.js');
        
        
        let AlertsUsers = new new require('../Alerts/AlertsUsers.js').AlertsUsers()
        if(AlertsUsers.Known(payload.sender.id))
        {
            chat.conversation((convo) => {
                convo.sendTypingIndicator(300).then(() => AlertsMenu.Menu(payload,chat,convo));
            });  
        }
        else
        {
            let AlertsMeet = require('../Alerts/AlertsMeet.js')
            chat.conversation((convo) =>{
                convo.sendTypingIndicator(300).then(() => AlertsMeet.FirstTime(convo))
            })
        }
     
    }) // For Preimum Users.

    Bot.on('postback:My Account', (payload,chat) =>{
        
        require('./MyAccount.js').MyAcoount(payload,chat);
    })

    Bot.on('postback:Add Operators', (payload,chat) => {

        require('./MyAccount.js').AddOperators(chat,payload);
    })
    
    Bot.on('postback:Add bird', (payload,chat) => {

        chat.conversation((convo) =>{
            convo.sendTypingIndicator(300).then(() => require('./AddBird.js').AddBird(convo))
        })
    })
    Bot.on('postback:Add Lime', (payload,chat) => {
        chat.conversation((convo) =>{
            convo.sendTypingIndicator(300).then(() => require('./AddLime.js').AddLime(convo))
        })
    })
}

module.exports.MenuRespones = MenuHear;