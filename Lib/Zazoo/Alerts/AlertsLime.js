const AlertsUsers = require('./AlertsUsers.js'); // Import Alerts Users Class
const Lime = new new require('../../ScootersCompenys/limes/limes.js').Lime()




function Start(Bot)
{
    let Users = new AlertsUsers.AlertsUsers();
        
    let User = Users.GetAll();

    for(let i = 0; i < User.length; i++)
    {
        if(Users.GetStatus(User[i].ChatId) == 'On')
        {
            if(User[i].Operator == 'lime' || User[i].Operator == 'bird,lime')
            {
                Lime.FindNearbyScooterCharger(User[i].Latitude,User[i].Longitude).then(function(scooter){
                    
                    if(scooter!=false)
                    {
                        for(let j = 0; j < scooter.length; j++)
                        {
                            if(!User[i].LastScooters.Limes.includes(scooter[j].id))
                            {
                                Users.AddLime(User[i].ChatId,scooter[j].id)
                                let scot = []
                                scot.push(scooter[j])
                                Lime.GetMessegeForChargerScooter(scot,User[i].Latitude,User[i].Longitude).then(function(msg){
                                    Bot.SendMap(User[i].ChatId,'LimeCharger',User[i].Latitude,User[i].Longitude,msg)
                                })
                                break
                            }
                        }
                    }
                })
            }
        }
    }
}





module.exports.StartBirdAlerts = Start;
