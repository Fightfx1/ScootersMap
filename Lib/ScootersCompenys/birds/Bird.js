// * Bird Scooters Lib
const BirdUsers = new new require('./BirdUsers').BirdUsers();
const vincenty = require('node-vincenty');
const axios = require('axios');
const faker = require('faker')
const HttpsProxyAgent = require('https-proxy-agent')

var agent = new HttpsProxyAgent('http://lum-customer-zazoo_io-zone-zone1:ayhw1yjy029d@zproxy.lum-superproxy.io:22225');

class BirdNewUser
{
    constructor()
    {
        this.request = axios.create({
            baseURL: 'https://api.birdapp.com',
            httpsAgent: agent,
            headers: {
                'Device-id': faker.random.uuid(),
                "App-Version": "4.41.0",
                "Content-Type": "application/json",
                "Platform" : 'ios'
            }
        })
    }
    async login(email, ChatId) {
        try {
            let response = await this.request({
                method: 'POST',
                url: '/user/login',
                data: {
                    email: email
                },
                responseType: 'json'
            })
            console.log(response.config.headers['Device-id']);            
            BirdUsers.NewUser(ChatId,response.config.headers['Device-id'],"waiting",email)
            return true
        } catch (err) {
            console.log('error with login', err)
            return err
        }
    }


    
    async verifyEmail(code,ChatId) {
        try {
            let response = await this.request({
                method: 'PUT',
                url: `/request/accept`,
                headers: {
                    'Device-id': BirdUsers.GetUser(ChatId)['Device-id']
                },
                data: {
                    token: code
                },
                responseType: 'json'
            })
            BirdUsers.UpdateToken(ChatId, "Bird " + response.data.token)
            return response.data
        } catch (err) {
            console.log('error with verifyEmail', err)
            return false
        }
    }

    /**
     * 
     * @param {string} ChatId 
     */
    deleteUser (ChatId)
    {
        BirdUsers.deleteUser(ChatId)
    }


}





class Bird
{
    constructor(ChatId)
    {
        this.request = axios.create({
            baseURL: 'https://api.birdapp.com',
            httpsAgent: agent,
            headers: {
                "Device-id": BirdUsers.GetUser(ChatId)['Device-id'],
                "Authorization" : BirdUsers.GetUser(ChatId)['Token'],
                "App-Version": "4.41.0",
                "Content-Type": "application/json",
                "Platform" : 'ios'
            }
        });
        this.requestAddress = axios.create({
            baseURL: 'https://maps.googleapis.com'
        });
    }
    
    GetMap(ScooterLocation, MyLocation) {
        let Cord = ScooterLocation.latitude + ',' + ScooterLocation.longitude;
        let MyCord = MyLocation.latitude + ',' + MyLocation.longitude;
        let Zoom = 15
        let MarkersLime = "&markers=icon:https://i.imgur.com/Qw9uGSk.png%7C" + Cord;
        return "http://maps.googleapis.com/maps/api/staticmap?&center=" + MyCord + "&zoom=" + Zoom + "&size=600x400&style=visibility:on&style=feature:water%7Celement:geometry%7Cvisibility:on&style=feature:administrative%7Celement:geometry%7Cvisibility:off&style=feature:poi%7Cvisibility:off&style=feature:road%7Celement:labels.icon%7Cvisibility:off&style=feature:transit%7Cvisibility:off" + MarkersLime + "&markers=icon:https://i.imgur.com/vXE8qxh.png%7C" + MyCord + "&key=AIzaSyDtXWlvE-ANrkeS5U1tP6Oe1PqTFFFVWu8"

    }

    async GetBirdForRide(Latitude, Longitude, radius = 500) {
        try {
            let response = await this.request({
                method: 'GET',
                url: `/bird/nearby`,
                params: {
                    latitude: Latitude,
                    longitude: Longitude,
                    radius: radius
                },
                headers: {
                    Location: JSON.stringify({
                        latitude: Latitude,
                        longitude: Longitude,
                        altitude: 500,
                        accuracy: 100,
                        speed: -1,
                        heading: -1
                    })
                },
                responseType: 'json'
            });
            response = response.data.birds[0];
            let distance = Math.round(vincenty.distVincenty(response.location.latitude, response.location.longitude, Latitude, Longitude).distance);
            let scooter = {
                latitude: response.location.latitude,
                longitude: response.location.longitude,
                battery_percentage: response.battery_level,
                estimated_range: response.estimated_range,
                distance: distance + " matters",
                Distance: distance
            };
            return scooter;
        } catch (err) {
            console.log('error with getScootersNearby', err);
            return false
        }
    }

    async GetMessageForRiders(Scooter) {
        try {
            let response = await this.requestAddress({
                method: 'get',
                url: '/maps/api/geocode/json',
                params: {
                    latlng: Scooter.latitude + ',' + Scooter.longitude,
                    key: 'AIzaSyDtXWlvE-ANrkeS5U1tP6Oe1PqTFFFVWu8'
                },
                responseType: 'json'
            });
            let Address = response.data.results[0]['formatted_address'];
            let text = "Hey there, Zazoo has found a new Scooter for you :)\n\nOperator: Bird\nDistance from You: " + Scooter.distance + "\nAddress: " + Address + '\nestimated range: ' + Scooter.estimated_range + "\nBattery Status: " + Scooter.battery_percentage + "%\n\nThank you for using Zazoo";
            return text

        } catch (err) {

        }
    }

    async GetMessageForCharger(Scooter) {
        try {
            let response = await this.requestAddress({
                method: 'get',
                url: '/maps/api/geocode/json',
                params: {
                    latlng: Scooter.latitude + ',' + Scooter.longitude,
                    key: 'AIzaSyDtXWlvE-ANrkeS5U1tP6Oe1PqTFFFVWu8'
                },
                responseType: 'json'
            });
            let Address = response.data.results[0]['formatted_address'];
            let text = "Hey there, Zazoo has found a new Scooter for you :)\n\nOperator: Bird\nDistance from You: " + Scooter.distance + "\nAddress: " + Address + "\nPrice: " + Scooter.amount + "\nBattery Status: " + Scooter.battery_percentage + "%\n\nThank you for using Zazoo";
            return text

        } catch (err) {

        }
    }

    async GetBirdForCharge(latitude, longitude, radius = 2000) {
        try {
            let response = await this.request({
                method: 'GET',
                url: `/bird/bounty`,
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    radius: radius
                },
                headers: {
                    Location: JSON.stringify({
                        latitude: latitude,
                        longitude: longitude,
                        altitude: 500,
                        accuracy: 100,
                        speed: -1,
                        heading: -1
                    })
                },
                responseType: 'json'
            });
            response = response.data.birds;
            for (let i = 0; i < response.length; i++) {
                let now = new Date();
                let DateFromAPITimeStamp = (new Date(response[i]['last_ride_ended_at'])).getTime();
                let nowTimeStamp = now.getTime();
                let microSecondsDiff = Math.abs(DateFromAPITimeStamp - nowTimeStamp);
                let HoursDiff = Math.floor(microSecondsDiff / (1000 * 60 * 60));
                if (HoursDiff < 4) {
                    let distance = Math.round(vincenty.distVincenty(response[i].location.latitude, response[i].location.longitude, latitude, longitude).distance);
                    let scooter = {
                        id: response[i].id,
                        latitude: response[i].location.latitude,
                        longitude: response[i].location.longitude,
                        battery_percentage: response[i].battery_level,
                        distance: distance + " matters",
                        Distance: distance,
                        amount: response[i].bounty_price / 100 + ' ' + response[i].bounty_currency
                    };
                    return scooter;
                }

            }
            return false;

        } catch (err) {
            return false;
        }

    }
    
    async CanCharge(){
        try {
            let response = await this.request({
                method: 'GET',
                url: `/user`,
                responseType: 'json'
            })
            return response.data.can_charge
        } catch (err) {
            console.log('error with getProfile', err)
            return err
        }
    }


    async GetBirdForChargeAlerts(latitude, longitude, radius = 2000) {
        try {
            let response = await this.request({
                method: 'GET',
                url: `/bird/bounty`,
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    radius: radius
                },
                headers: {
                    Location: JSON.stringify({
                        latitude: latitude,
                        longitude: longitude,
                        altitude: 500,
                        accuracy: 100,
                        speed: -1,
                        heading: -1
                    })
                },
                responseType: 'json'
            });
            response = response.data.birds;
            
            
            const scooters = [];
            for (let i = 0; i < response.length; i++) {
            // =====================================================================================================
                let now = new Date();                                                                          
                let DateFromAPITimeStamp = (new Date(response[i]['last_ride_ended_at'])).getTime();            
                let nowTimeStamp = now.getTime();
                let microSecondsDiff = Math.abs(DateFromAPITimeStamp - nowTimeStamp);
                let HoursDiff = Math.floor(microSecondsDiff / (1000 * 60 * 60));
            // ======================================================================================================
                
                if (HoursDiff < 4) {
                    let distance = Math.round(vincenty.distVincenty(response[i].location.latitude, response[i].location.longitude, latitude, longitude).distance);
                    scooters.push( {
                        id: response[i].id,
                        latitude: response[i].location.latitude,
                        longitude: response[i].location.longitude,
                        battery_percentage: response[i].battery_level,
                        distance: distance + " matters",
                        Distance: distance,
                        amount: response[i].bounty_price / 100 + ' ' + response[i].bounty_currency
                    });
                }

            }
            return scooters;

        } catch (err) {
            console.log(err)
            return false;
        }

    }

    async GetBirdsForPremuimRiders(Latitude, Longitude, radius = 500)
    {
        try {
            let response = await this.request({
                method: 'GET',
                url: `/bird/nearby`,
                params: {
                    latitude: Latitude,
                    longitude: Longitude,
                    radius: radius
                },
                headers: {
                    Location: JSON.stringify({
                        latitude: Latitude,
                        longitude: Longitude,
                        altitude: 500,
                        accuracy: 100,
                        speed: -1,
                        heading: -1
                    })
                },
                responseType: 'json'
            });


            const scooter = []
            response = response.data.birds
            for(let i = 0; i<response.length;i++)
            {
                let distance = Math.round(vincenty.distVincenty(response[i].location.latitude, response[i].location.longitude, Latitude, Longitude).distance);
                scooter.push({
                    latitude: response[i].location.latitude,
                    longitude: response[i].location.longitude,
                    battery_percentage: response[i].battery_level,
                    estimated_range: response[i].estimated_range,
                    distance: distance + " matters",
                    Distance: distance,
                    brand: "Bird"
                })
            }
            return scooter;
        } catch (err) {
            console.log('error with getScootersNearby', err);
            return false
        }
    }
}






module.exports.BirdNewUser = BirdNewUser;
module.exports.Bird = Bird;