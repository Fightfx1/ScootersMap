const Fs = require('fs')

class LimeUser
{
    constructor()
    {
        this.path = 'Lib/ScootersCompenys/limes/LimeUsers.json'
        this.jsonData = require('./LimeUsers.json');
    }
    NewUser(ChatId,Cookie,Token,Email)
    {
        let json = {"ChatId":ChatId,"Cookie":Cookie,"Token": Token,"Email":Email}
        this.jsonData.Users.push(json)
        Fs.writeFile(this.path, JSON.stringify(this.jsonData), (err) => {
            if(err) {
                console.log(err);
                throw err;
            }
            console.log('Saved data to file');
        });
    }
    Know(ChatId)
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
    NewUser(ChatId,Email)
    {
        let json = {"ChatId":ChatId, "Email":Email}
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
    UpdateToken(ChatId,Token)
    { 
        try
        {
            let i = this.jsonData.Users.indexOf(this.jsonData.Users.find(item => item.ChatId === ChatId))
            this.jsonData.Users[i].Token = Token;
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
}



module.exports.LimeUser = LimeUser;