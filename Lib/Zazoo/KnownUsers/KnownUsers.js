const Fs = require('fs')

class KnownUsers
{
    constructor()
    {
        this.path = 'Lib/Zazoo/KnownUsers/Users.json'
        this.jsonData = require('./Users.json');
    }

    NewUser(ChatId,Email)
    {
        let json = {"ChatId":ChatId,"Email":Email}
        this.jsonData.Users.push(json)
        Fs.writeFile(this.path, JSON.stringify(this.jsonData), (err) => {
            if(err) {
                console.log(err);
                throw err;
            }
            console.log('Saved data to file');
        });
    }

    GetUser(ChatId)
    {
        return this.jsonData.Users.find(item => item.ChatId === ChatId)
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
}



module.exports.KnownUsers = KnownUsers;