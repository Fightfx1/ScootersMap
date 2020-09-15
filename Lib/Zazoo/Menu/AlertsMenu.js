

const Menu = (payload,chat,convo) =>{
    let Known = new new require('../KnownUsers/KnownUsers.js').KnownUsers().Known(payload.sender.id)
    if(Known)
    {
        let Stutus = new new require('../Alerts/AlertsUsers.js').AlertsUsers().GetStatus(payload.sender.id)
        if(Stutus == "On"){Stutus="Turn alerts to OFF"}
        else if(Stutus == "Off"){Stutus="Turn alerts to ON"};
        convo.ask((convo) => {
            const buttons = [
                {type: 'postback', title: 'Change your location', payload: 'Change Location'},
                {type: 'postback', title: Stutus, payload: 'Change Stutus'},
                {type: 'postback', title: 'Menu', payload: 'Menu'}
            ];
            convo.sendButtonTemplate(`Menu`, buttons);
        }, (payload, convo, data) => {
            console.log(payload.postback.payload);
            if (payload.postback.payload === 'Change Location')
            {
                ChangeLocation(convo);
            }
            else if(payload.postback.payload === 'Change Stutus')
            {
                ChangeStutus(payload,convo);
            }
            else if(payload.postback.payload === 'Menu')
            {
                require('../../../Bot.js').Bot.SendMenu(payload.sender.id);
                convo.end();
            }
            else
            {
                convo.end();
            }
        });
    }
    else
    {
        chat.say({
            text:'Plz Go To "Get Started" before you start to use.',
            quickReplies: ['Get Started']
        });
    }
}

const ChangeStutus = (payload,convo) =>{
    let AlertsUsers = new new require('../Alerts/AlertsUsers.js').AlertsUsers()
    let Stutus = AlertsUsers.GetStatus(payload.sender.id);
    if(Stutus == "On")
    {
        AlertsUsers.UpdateStatus(payload.sender.id,"Off")
        convo.say({
            text: "Your alerts are now set to OFF",
            quickReplies: ['Menu']
        });
        convo.end();
    }
    else if(Stutus == "Off")
    {
        AlertsUsers.UpdateStatus(payload.sender.id,"On")
        convo.say({
            text: "Your alerts are now set to ON",
            quickReplies: ['Menu']
        });
        convo.end();
    }
}

const ChangeLocation = (convo) =>
{
    let AlertsUsers = new new require('../Alerts/AlertsUsers.js').AlertsUsers()
    convo.ask('Please share your location either by typing it or just using FB location service', (payload, convo, data) => {
        const text = payload.message.text;
        let ATC = new new require('../AdressToCord/ATC.js').AtoC()
        ATC.AdressToCoordinate(text).then(function(cord){
            
            if(cord != false)
            {
                AlertsUsers.UpdateUserLocation(payload.sender.id,cord.lat,cord.lng);
                convo.say({
                    text: "Your Location been Update",
                    quickReplies: ['Menu']
                });
            }
            else
            {
                if(convo.get('CountOfAdress') == '1')
                {
                    convo.say("We are still not able to find your process. Please use Facebook location service")
                    ChangeLocation(convo)
                }
                else
                {
                    convo.set('CountOfAdress','1');
                    ErrorWithAdress(convo)
                }
            }
        })
    },
    [
        {
            event: 'attachment',
            callback: (payload, convo) => {
                const LOC = payload.message.attachments[0].payload["coordinates"];
                AlertsUsers.UpdateUserLocation(payload.sender.id,LOC.lat,LOC.long);
                convo.say({
                    text: "Your Location been Update",
                    quickReplies: ['Menu']
                });
                convo.end();
            }
        }
    ]
    );
}

const ErrorWithAdress = (convo,Bot) => {
    convo.ask((convo) => {
        const buttons = [
            {type: 'postback', title: 'Yes', payload: 'Yes'},
            {type: 'postback', title: 'No', payload: 'No'}
        ];
        convo.sendButtonTemplate(`Zazoo could not find your address. Would you mind trying again ?`, buttons);
    }, (payload, convo, data) => {
        console.log(payload.postback.payload);
        if (payload.postback.payload === 'Yes')
        {
            ChangeLocation(convo)
        }
        else if(payload.postback.payload === 'No')
        {
            convo.say({
                text: "Return to the menu",
                quickReplies: ['Menu']
            });
            convo.end();
        }
        else
        {
            convo.end();
        }
    });
}


module.exports.Menu = Menu;