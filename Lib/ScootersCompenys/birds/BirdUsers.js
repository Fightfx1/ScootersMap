const Fs = require('fs')


class BirdUsers
{
    constructor()
    {
        this.path = 'Lib/ScootersCompenys/birds/BirdUser.json'
        this.jsonData = require('./BirdUser.json');
    }
    NewUser(ChatId,Device_id,Token,email)
    {
        let json = {"ChatId":ChatId,"Device-id":Device_id,"Token": Token,"Email":email}
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

    /**
     * 
     * @param {string} ChatId 
     */
    deleteUser (ChatId)
    {
        try
        {
            let i = this.jsonData.Users.indexOf(this.jsonData.Users.find(item => item.ChatId === ChatId))
            delete this.jsonData.Users[i]
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
}



module.exports.BirdUsers = BirdUsers;