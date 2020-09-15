const Bird = require('../../../ScootersCompenys/birds/Bird.js').Bird;
const Lime = require('../../../ScootersCompenys/limes/limes.js').Lime;


const FindScooter = (convo, Bot) => {
    convo.ask((convo) => {
        const buttons = [
            {type: 'postback', title: 'Bird', payload: 'Bird'},
            {type: 'postback', title: 'Lime', payload: 'Lime'}
        ];
        convo.sendButtonTemplate(`What scooter service are you using ?`, buttons);
    }, (payload, convo, data) => {
        console.log(payload.postback.payload);
        if (payload.postback.payload === 'Bird')
        {
            if(new new require('../../../ScootersCompenys/birds/BirdUsers.js').BirdUsers().Know(payload.sender.id))
            {
                convo.set('operator','Bird'); // Upadate that the user looking for Bird
                
                new Bird(payload.sender.id).CanCharge().then(function(CanCharge){
                    if(CanCharge)
                    {
                        convo.set('Type','Charger'); // Upadte that the user is Charger
                        AskLocation(convo, Bot);
                    }
                    else
                    {
                        convo.say("Your account not register as bird charger account so you want be able to serach scooter for charge")
                        convo.end();
                        Bot.SendMenu(payload.sender.id);
                    }
                });
            }
            else
            {
                convo.say("You can't use bird without registered please choose different operator")
                FindScooter(convo,Bot) // return the user back to the chooseing operator area.
            }
        }
        else if(payload.postback.payload === 'Lime')
        {
            
            if(new new require('../../../ScootersCompenys/limes/LimeUsers.js').LimeUser().Know(payload.sender.id))
            {
                convo.set('operator','Lime'); // Upadate that the user looking for Lime
                convo.set('Type','Charger')
                AskLocation(convo, Bot);
                
            }
            else
            {
                convo.say("You can't use bird without registered please choose different operator")
                FindScooter(convo,Bot) // return the user back to the chooseing operator area.
            }
            
        }
        else
        {
            convo.end();
        }
    });
};

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
            AskLocation(convo, Bot)
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


const AskLocation = (convo,Bot) =>{
    convo.ask('Please share your location either by typing it or just using FB location service', (payload, convo, data) => {
        const text = payload.message.text;
        
        let ATC = new new require('../../AdressToCord/ATC.js').AtoC()
        ATC.AdressToCoordinate(text).then(function(cord){
            
            if(cord != false)
            {
                if(convo.get('operator') === 'Lime')
                {
                    FindLime(convo,Bot,cord,payload) // send the lime to the user
                }
                else if(convo.get('operator') === 'Bird')
                {
                    FindBird(convo,Bot,cord,payload) // send the bird to the user
                }
            }
            else
            {
                if(convo.get('CountOfAdress') == '1')
                {
                    convo.say("We are still not able to find your process. Please use Facebook location service")
                    AskLocation(convo)
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
                if(convo.get('operator') === 'Lime')
                {
                    FindLime(convo,Bot,{lat:LOC.lat,lng:LOC.long},payload);
                }
                else if(convo.get('operator') === 'Bird')
                {   
                    FindBird(convo,Bot,{lat:LOC.lat,lng:LOC.long},payload) // send the bird to the user
                }
            }
        }
    ]
    );
}

const FindBird = (convo,Bot,Location,payload) =>{
    if(convo.get('Type') == 'Rider')
    {
        let bird = new Bird(payload.sender.id);
        bird.GetBirdForRide(Location.lat,Location.lng).then(function(scooter){
            if(scooter != false)
            {
                bird.GetMessageForRiders(scooter).then(function(msg){
                    Bot.SendMap(payload.sender.id,'BirdRider',Location.lat,Location.lng,msg)
                })
                convo.end();
            }
            else
            {
                convo.say({
                    text: "Sorry I didnt Find scooter For You ):",
                    quickReplies: ['Menu']
                });
                convo.end();
            }
        })
    }
    else if(convo.get('Type') == 'Charger')
    {
        let bird = new Bird(payload.sender.id);
        bird.CanCharge().then(function(CanCharge){
            if(CanCharge == true)
            {
                bird.GetBirdForCharge(Location.lat,Location.lng).then(function(scooter){
                    if(scooter != false)
                    {
                        bird.GetMessageForCharger(scooter).then(function(msg){
                            Bot.SendMap(payload.sender.id,'BirdCharger',Location.lat,Location.lng,msg)
                        })
                    }
                    else
                    {
                        convo.say({
                            text: "I didnt Find any scooters around you",
                            quickReplies: ['Menu']
                        });
                    }
                    convo.end();
                });
            }
            else
            {
                convo.say({
                    text: "sorry your user cant charge scooters",
                    quickReplies: ['Menu']
                });
                convo.end();
            }
        })
    }
}


const FindLime = (convo,Bot,Location,payload) => {
    if(convo.get('Type') == 'Rider')
    {
        let lime = new Lime();
        lime.FindScooterRider(Location.lat,Location.lng).then(function(scooter)
        {
            if(scooter != false)
            {
                lime.GetMessegeForRiders(scooter,Location.lat,Location.lng).then(function(msg){
                    Bot.SendMap(payload.sender.id,'LimeRider',Location.lat,Location.lng,msg);
                })
                convo.end();
            }
            else
            {
                convo.say({
                            text: "Sorry I didnt Find scooter For You ):",
                            quickReplies: ['Menu']
                        });
                convo.end();
            }
            })
        }
                    
        else if(convo.get('Type') == 'Charger')
        {
            let lime = new Lime();
            lime.FindNearbyScooterCharger(Location.lat,Location.lng).then(function(scooter)
            {
                if(scooter != false)
                {
                    lime.GetMessegeForChargerScooter(scooter,Location.lat,Location.lng).then(function(msg){
                        Bot.SendMap(payload.sender.id,'LimeCharger',Location.lat,Location.lng,msg);
                    })
                    convo.end();
                }
                else
                {
                    convo.say({
                                text: "Sorry I didnt Find scooter For You ):",
                                quickReplies: ['Menu']
                            });
                    convo.end();
                }
            })
        }
}


module.exports.FindScooter = FindScooter;