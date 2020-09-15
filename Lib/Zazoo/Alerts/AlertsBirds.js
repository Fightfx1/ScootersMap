const AlertsUsers = require('./AlertsUsers.js'); // Import Alerts Users Class
const BirdClass = require('../../ScootersCompenys/birds/Bird.js'); // Import Bird Class



function Start(Bot)
{
    let Users = new AlertsUsers.AlertsUsers();
        
    let User = Users.GetAll();

    for(let i = 0; i < User.length; i++)
    {
        if(Users.GetStatus(User[i].ChatId) == 'On')
        {
            if(User[i].Operator == 'bird' || User[i].Operator == 'bird,lime')
            {
                let Bird = new BirdClass.Bird(User[i].ChatId)
    
                Bird.CanCharge().then(function(CanCharge){
    
                    if(CanCharge != false)
                    {
                        Bird.GetBirdForChargeAlerts(User[i].Latitude,User[i].Longitude).then(function(scooters){
                            
                            for(let j = 0; j <  scooters.length; j++)
                            {
                                if(!User[i].LastScooters.Birds.includes(scooters[j].id))
                                {
                                    Users.AddBird(User[i].ChatId, scooters[j].id);
                                    Bird.GetMessageForCharger(scooters[j]).then(function(msg){
                                        Bot.SendMap(User[i].ChatId,'BirdCharger',scooters[j].latitude,scooters[j].longitude,msg)
                                    })
                                    break;
                                }
                            }
                        })
                    }
                })
            }
        }
    }
}


module.exports.StartBirdAlerts = Start;
