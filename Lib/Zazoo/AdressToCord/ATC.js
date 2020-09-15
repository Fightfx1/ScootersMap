const axios = require('axios');


class AtoC
{
    constructor()
    {
        this.requestAddress = axios.create({
            baseURL: 'https://maps.googleapis.com'
        });
    }

    async AdressToCoordinate(Adresss)
    {
        try{
            let Cord = await this.requestAddress({
                url: '/maps/api/geocode/json',
                method: 'GET',
                params: {
                    address:Adresss,
                    key:"AIzaSyDtXWlvE-ANrkeS5U1tP6Oe1PqTFFFVWu8"
                }
            })
            return Cord.data.results[0].geometry.location
        } 
        catch(err)
        {
            return false;
        }
    }   
}


module.exports.AtoC = AtoC;