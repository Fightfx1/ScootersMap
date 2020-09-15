const Fs = require('fs');




class AlertsUsers
{
    constructor()
    {
        this.path = 'Lib/Zazoo/Alerts/AlertsUsers.json'; // Save Path
        this.jsonData = require('./AlertsUsers.json'); // Get File
    }


    GetAll()
    {
        return this.jsonData.Users;
    }

    NewUser(ChatId,Latitude,Longitude,Operator)
    {
        let json = {
                    "ChatId":ChatId,
                    "Latitude":Latitude,
                    "Longitude":Longitude,
                    "Operator": Operator,
                    "Status":"On",
                    "LastScooters":{
                                    "Birds":[],
                                    "Limes":[]
                                    }
                    
                    }

        this.jsonData.Users.push(json);
        Fs.writeFile(this.path, JSON.stringify(this.jsonData), (err) => {
            if(err) {
                console.log(err);
                throw err;
            }
            console.log('Saved data to file');
        });
    }
    AddBird(ChatId,BirdId)
    {
        let i = this.jsonData.Users.indexOf(this.jsonData.Users.find(item => item.ChatId === ChatId)) // Get Index Of User

        this.jsonData.Users[i].LastScooters.Birds.push(BirdId)
        Fs.writeFile(this.path, JSON.stringify(this.jsonData), (err) => {
            if(err) {
                console.log(err);
                throw err;
            }
            console.log('Saved data to file');
        });
    }

    Known(ChatId) // if the user know in the json flie return true else return false
    {
        
        try
        {
            let user = this.jsonData.Users.find(item => item.ChatId === ChatId);
            return user != undefined;

        }
        catch(err)
        {
            return false;
        }
    }

    GetStatus(ChatId)
    {
        try
        {
            let user = this.jsonData.Users.find(item => item.ChatId === ChatId);
            return user.Status

        }
        catch(err)
        {
            return false;
        }
    }

    UpdateStatus(ChatId,Status)
    {
        try
        {
            let i = this.jsonData.Users.indexOf(this.jsonData.Users.find(item => item.ChatId === ChatId))
            this.jsonData.Users[i].Status = Status
            Fs.writeFile(this.path, JSON.stringify(this.jsonData), (err) => {
                if(err) {
                    console.log(err);
                    throw err;
                }
                console.log('Saved data to file');
                });
            }
        catch(error)
        {
            return false;
        }
    }

    UpdateUserLocation(ChatId, Latitude, Longitude)
    {
        try
        {
            let i = this.jsonData.Users.indexOf(this.jsonData.Users.find(item => item.ChatId === ChatId))
            this.jsonData.Users[i].Latitude = Latitude;
            this.jsonData.Users[i].Longitude = Longitude;
            Fs.writeFile(this.path, JSON.stringify(this.jsonData), (err) => {
                if(err) {
                    console.log(err);
                    throw err;
                }
                console.log('Saved data to file');
                });
            }
        catch(error)
        {
            return false;
        }
    }

    GetUser(ChatId)
    {
       return this.jsonData.Users.find(item => item.ChatId === ChatId)
    }

    AddLime(ChatId,LimeId)
    {
        let i = this.jsonData.Users.indexOf(this.jsonData.Users.find(item => item.ChatId === ChatId)) // Get Index Of User

        this.jsonData.Users[i].LastScooters.Limes.push(LimeId)
        Fs.writeFile(this.path, JSON.stringify(this.jsonData), (err) => {
            if(err) {
                console.log(err);
                throw err;
            }
            console.log('Saved data to file');
        });
    }
    ClearLimes()
    {
        for(let i = 0; i<this.jsonData.Users.length;i++)
        {
            this.jsonData.Users[i].LastScooters.Limes = []
        }
        Fs.writeFile(this.path, JSON.stringify(this.jsonData), (err) => {
            if(err) {
                console.log(err);
                throw err;
            }
            console.log('Saved data to file');
        });
    }

    ClearBirds()
    {
        for(let i = 0; i<this.jsonData.Users.length;i++)
        {
            this.jsonData.Users[i].LastScooters.Birds = []
        }
        Fs.writeFile(this.path, JSON.stringify(this.jsonData), (err) => {
            if(err) {
                console.log(err);
                throw err;
            }
            console.log('Saved data to file');
        });
    }



}



module.exports.AlertsUsers = AlertsUsers; // export the class