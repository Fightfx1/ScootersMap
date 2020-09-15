const AlertsUser = new new require('./AlertsUsers.js').AlertsUsers()

const FirstTime = (convo) =>
{
    convo.ask((convo) => {
        const buttons = [
            {type: 'postback', title: 'Yes', payload: 'Yes'},
            {type: 'postback', title: "No", payload: 'No'},
        ];
        convo.sendButtonTemplate("Welcome to Zazoo alerts program. From now on, we will notify you whenever a scooter nearby you, is available for ride or charge. Would you like to continue?", buttons);
    }, (payload, convo, data) => {
        console.log(payload.postback.payload);
        if (payload.postback.payload === 'Yes')
        {
            NextLevel(convo)
        }
        else if(payload.postback.payload === 'No')
        {
            convo.say({
                text:'Back to menu',
                quickReplies: ['menu']
            });
            convo.end()
        }
        else
        {
            convo.end();
        }
    });
       
}

const NextLevel = (convo) =>{
    convo.ask('Please type in your location. Zazoo will search for a scooter at a perimeter around your location'
    , (payload, convo, data) => {
        const text = payload.message.text;
        let ATC = new new require('../AdressToCord/ATC.js').AtoC()
        ATC.AdressToCoordinate(text).then(function(cord){
            
            if(cord != false)
            {
                Finish(convo,cord,ChatId=payload.sender.id)
            }
            else
            {
                
            }
        })
    },
    [
        {
            event: 'attachment',
            callback: (payload, convo) => {
                const LOC = payload.message.attachments[0].payload["coordinates"];
                Finish(convo,{lat:LOC.lat,lng:LOC.long},ChatId=payload.sender.id)
                
            }
        }
    ]
    );
}

const Finish = (convo,cord,ChatId) =>
{
    let BirdUser = new new require('../../ScootersCompenys/birds/BirdUsers.js').BirdUsers()

    if(BirdUser.Know(ChatId))
    {
        
        let Bird = new new require('../../ScootersCompenys/birds/Bird.js').Bird(ChatId)
        Bird.CanCharge().then(function(CanCharge){
            
            if(CanCharge)
            {
                AlertsUser.NewUser(ChatId,cord.lat,cord.lng,"bird");
                convo.say({
                    text:'Congrats. Your address was accepted. We are almost ready to go. Please click on Menu to continue',
                    quickReplies: ['menu']
                });
                convo.end()
            }
            else
            {
                convo.say({
                    text:'Your Bird account is not a charger account. You would have to be a charger in order to use Zazoo',
                    quickReplies: ['menu']
                });
                convo.end()
            }
        })
        
    }
    else
    {
        AlertsUser.NewUser(ChatId,cord.lat,cord.lng,"lime");
        convo.say({
            text:'Congrats. Your address was accepted. We are almost ready to go',
            quickReplies: ['menu']
        });
        convo.end()
    }
}


module.exports.FirstTime = FirstTime;