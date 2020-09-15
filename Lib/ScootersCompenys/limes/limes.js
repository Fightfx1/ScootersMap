const axios = require('axios');
const vincenty = require('node-vincenty');
const express = require('express');
const googleApiKey = "AIzaSyC0v8_AHDqwL8stQLEMWYQgxfw__b5F0hU"

class LimeNewUser
{
    constructor()
    {
        this.request = axios.create({
            baseURL: 'https://web-production.lime.bike'
        });
    }

    async getOTP(ChatId,phone)
    {
        try
        {
            let LimeUsers = new new require('./LimeUsers.js').LimeUser();
            let response = await this.request({
                method: 'GET',
                url: `/api/rider/v1/login`,
                params: {
                    "phone": "+" + phone
                }
            })
            LimeUsers.NewUser(ChatId,response.headers['set-cookie'][1],"waiting");
            return response.headers['set-cookie'][1];
        }
        catch(err)
        {
            console.log(err);
        }
    }
    async verifyPhone(ChatId,phone,code)
    {
        try
        {
            let LimeUsers = new new require('./LimeUsers.js').LimeUser();
            let response = await this.request({
                method: 'POST',
                url: `/api/rider/v1/login`,
                data: {
                    login_code: code,
                    phone: "+" + phone
                },
                cookie: LimeUsers.GetUser(ChatId).cookie
            })
            LimeUsers.UpdateToken(ChatId,response.data.token);
            return response.data;
        }
        catch(e)
        {
            console.log(e)
        }
    }
}



function degreesToRadians(deg) {
    return deg * Math.PI / 180;
}

function getBoundingBox(pLatitude, pLongitude, pDistanceInMeters) {
    var latRadian = degreesToRadians(pLatitude);
    var degLatKm = 110.574235;
    var degLongKm = 110.572833 * Math.cos(latRadian);
    var deltaLat = pDistanceInMeters / 1000.0 / degLatKm;
    var deltaLong = pDistanceInMeters / 1000.0 / degLongKm;

    var topLat = pLatitude + deltaLat;
    var bottomLat = pLatitude - deltaLat;
    var leftLng = pLongitude - deltaLong;
    var rightLng = pLongitude + deltaLong;

    return {
        northEastLat: topLat,
        northEastLon: rightLng,
        southWestLat: bottomLat,
        southWestLon: leftLng,
        minLat: Math.min(topLat, bottomLat),
        maxLat: Math.max(topLat, bottomLat),
        minLon: Math.min(leftLng, rightLng),
        maxLon: Math.max(leftLng, rightLng)
    };
}

class Lime
{
    constructor()
    {
        this.request = axios.create({
            baseURL: 'https://web-production.lime.bike',

            Cookie: {
                '_limebike-web_session': 'eWZObFAra3p1OWFZVFRBNGc0UUMvUTRram9pTmN3NGZSNmZnQlRiVFRKaU9Rb1dHaUVUQXNobW41S3c5VWYySUREVU8wUmVSUENLdHJNdElKbHl1cVNsSWFZS3lOaXFNSjFZQ0pwZzhuTThIeXQrZzBrS0tYUkhFbWFCSFZSZDhLVVBFUGlxRk8zUGRtRXNBdnNBOXdndnFmQ2tPVDRlakZFMWt4QUVpQ0dmOFFHdkxZNEp5ZXZmVld0TEFaM1BnMVhkRmtPbmFJaFJPblpGdDRXOW00dXRicWJGVGoxdGhlVVB6RVpTSXF0bXpzK3NFSE95NEszK2twaFNHSTZZam0yV1BWd2pURUplZEFKZlQxVi9uZG1EZkRmLzRuWlh0dlFoZFlqVlRrZFBlMmd3NzdWaUc0MU1vcS9Fd01BRW4yNHZ1RlE0SjNJWHVJUTVXWkxSVkhmSFpLUVF2Nzhac3Y0SGQ2ZTZwMEllK0hDMUpyS3NOSWd1WGFtUUZwbXA4SzJ1OUZLK0dHL0xidzVaa1M4V3ZPQUFqeGNaRlY0YnJ6ZFUwd2U1QndXNkpvdjVZL3JadnZtOE91Z0diYnBPaU9QbVVJVk43Z3N1VlMyc0l3UkdkaHB0V3JFeWtGdElSUmxIRUdhTEFNbFJ3MUpoUzRnZVlhdXhVVXhUZnNvdWstLVFTSDY5Zi80d2xVZEtXaEdwNHZzZmc9PQ%3D%3D--075a929943cd2b9074383610e7a93585911dcba1'
            },
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX3Rva2VuIjoiRkpMVVk0U0JBSTVETCIsImxvZ2luX2NvdW50IjozN30.bJtycEVNY2t3xBDHfOqWc3nzPj3paLijjz8F4tkhxeA'
            },
        });

        this.requestAddress = axios.create({
            baseURL: 'https://maps.googleapis.com'
        });
    }

    async FindScooterRider(Latitude,Longitude)
    {
        try{
            let boundingBox = getBoundingBox(Latitude, Longitude, 1000)
            let response = await this.request({
                method: 'GET',
                url: `/api/rider/v1/views/map`,
                params: {
                    map_center_latitude: Latitude,
                    map_center_longitude: Longitude,
                    ne_lat: boundingBox.northEastLat,
                    ne_lng: boundingBox.northEastLon,
                    sw_lat: boundingBox.southWestLat,
                    sw_lng: boundingBox.southWestLon,
                    user_latitude: Latitude,
                    user_longitude: Longitude,
                    zoom: 17
                },
                responseType: 'json'
            })
            response = response.data.data.attributes.bikes[0].attributes
            return response
        }
        catch(err)
        {
            console.log(err)
            return false;
        }
    }

    
    async FindNearbyHotspot(Latitude,Longitude)
    {
        let boundingBox = getBoundingBox(Latitude, Longitude, 1000);
        let response = await this.request({
            method: 'GET',
            url: `/api/rider/v1/juicer/views/deploy?filter=%2A`,
            params: {
                map_center_latitude: Latitude,
                map_center_longitude: Longitude,
                ne_lat: boundingBox.northEastLat,
                ne_lng: boundingBox.northEastLon,
                sw_lat: boundingBox.southWestLat,
                sw_lng: boundingBox.southWestLon,
                user_latitude: Latitude,
                user_longitude: Longitude,
                zoom: 17
            },
            responseType: 'json'
        })
        return response.data.data.attributes.nearby_hotspots; // this is array
    }


    async FindNearbyScooterCharger(Latitude,Longitude)
    {
        try
        {
            let boundingBox = getBoundingBox(Latitude, Longitude, 2000);
            let response = await this.request({
                method: 'GET',
                url: `/api/rider/v1/juicer/views/main?filter=%2A`,
                params: {
                    map_center_latitude: Latitude,
                    map_center_longitude: Longitude,
                    ne_lat: boundingBox.northEastLat,
                    ne_lng: boundingBox.northEastLon,
                    sw_lat: boundingBox.southWestLat,
                    sw_lng: boundingBox.southWestLon,
                    user_latitude: Latitude,
                    user_longitude: Longitude,
                    zoom: 17
                },
                responseType: 'json'
            })
            return response.data.data.attributes.nearby_retrieval_scooters; // return array of all the scooters
        }
        catch(err)
        {
            
            return false;
        }
    }
 
    async GetMessegeForRiders(scooter, Latitude,Longitude, Distence = vincenty.distVincenty(Latitude, Longitude, scooter.latitude, scooter.longitude).distance)
    {
        Distence = Math.round(Distence);
        let address = await this.requestAddress({
            method: 'GET',
            url: `/maps/api/geocode/json`,
            params:{
                latlng: scooter.latitude + ',' + scooter.longitude,
                key:"AIzaSyDtXWlvE-ANrkeS5U1tP6Oe1PqTFFFVWu8"
            },
            responseType: 'json'
        })
        address = address.data.results[0].formatted_address // addres
        //#region 
        return `Hey there, Zazoo has found a new Scooter for you :)

Operator: Lime
Address: ${address}
Battery Status: ${scooter.battery_level}
Meter Range: ${scooter.meter_range/1000} km
Distance: ${Distence} Meters

Thank you for using Zazoo
        `
        //#endregion
    }

    async GetMessegeForChargerScooter(scooters,Latitude,Longitude, attributes = scooters[0].attributes, Distence = vincenty.distVincenty(Latitude, Longitude, attributes.latitude, attributes.longitude).distance)
    {
        let address = await this.requestAddress({
            method: 'GET',
            url: `/maps/api/geocode/json`,
            params:{
                latlng: attributes.latitude + ',' + attributes.longitude,
                key:"AIzaSyDtXWlvE-ANrkeS5U1tP6Oe1PqTFFFVWu8"
            },
            responseType: 'json'
        })
        address = address.data.results[0].formatted_address // addres
        return "Hey there, Zazoo has found a new Scooter for you :)\n\nOperator: Lime" + "\nAddress: " + address + "\nBattery Status: " + attributes.battery_percentage + 
        "%\namount: "+ attributes.juicer_earnings_amount.display_string +"\nTask Type: "+attributes.display_task.attributes.task_type+"\nDistance: " + Distence + " Meters\nThank you for using Zazoo";
    }
}



module.exports.Lime = Lime;



function Map(List,Latitude,Longitude,myLocation={latitude:Latitude,longitude:Longitude})
{
    let closest = {latitude:List[0].attributes.latitude, longitude:List[0].attributes.longitude}; // The Closest Scooter
    let zoomLevel = 18;

    let Scooters = []

    for(i in List)
    {
        Scooters.push({brand:"Lime",latitude:List[i].attributes.latitude,longitude:List[i].attributes.longitude})
    }

    console.log(Scooters)


    html = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta name="viewport" content="initial-scale=1.0">
                <meta charset="utf-8">
                <style>
                #map {
                height: 100%;
                }
                html,
                body {
                height: 100%;
                margin: 0;
                padding: 0;
                }
                </style>
            </head>
            <body>
                <div id="map"></div>
                <script>
                var map;
                
                function initMap() {
                    var myLocation = {
                        lat: ${myLocation.latitude},
                        lng: ${myLocation.longitude}
                    }
                    var closestLocation = {
                        lat: ${closest.latitude},
                        lng: ${closest.longitude}
                    }
                
                    map = new google.maps.Map(document.getElementById('map'), {
                        center: myLocation,
                        zoom: ${zoomLevel},
                        disableDefaultUI: true
                    });
                
                    var limeIcon = {
                        url: "https://i.imgur.com/U4D6sns.png",
                        scaledSize: new google.maps.Size(30, 30)
                    };
                    var birdIcon = {
                        url: "https://i.imgur.com/Qw9uGSk.png",
                        scaledSize: new google.maps.Size(30, 30)
                    };
                        var mylcos = {
                        url: "https://img.icons8.com/nolan/2x/map-pin.png",
                        scaledSize: new google.maps.Size(38, 38)
                    };
                    var iconForBrand = {
                        "Lime": limeIcon,
                        "Bird": birdIcon,
                        "myloc": mylcos,
                    };

                    new google.maps.Marker({
                        map: map,
                        position: myLocation,
                        icon: iconForBrand['myloc']
                    });

                    var nearbyScooters = ${JSON.stringify(Scooters)}
                    var marker = nearbyScooters.forEach(s => new google.maps.Marker({
                        map: map,  
                        position: {
                            lat: s.latitude,
                            lng: s.longitude
                        },
                        icon: iconForBrand[s.brand],
                        title: 'Uluru (Ayers Rock)',
                    }))

                    var directionsService = new google.maps.DirectionsService;
                    var directionsDisplay = new google.maps.DirectionsRenderer({
                        suppressMarkers: true,
                    });
                    directionsDisplay.setMap(map);
                    directionsService.route({
                        origin: myLocation,
                        destination: closestLocation,
                        travelMode: 'WALKING'
                    }, function (response, status) {
                        if (status === 'OK') {
                            directionsDisplay.setDirections(response);
                        }
                    });           
                }
                </script>
                <script src="https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&callback=initMap" async defer></script>
            </body>
        </html>
    `




    return html;
}