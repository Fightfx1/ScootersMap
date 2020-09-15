const googleApiKey = "AIzaSyDtXWlvE-ANrkeS5U1tP6Oe1PqTFFFVWu8"
function LimeChargerMap(app)
{
    app.get('/Map/LimeCharger', function(req,res){
        function Map(List,Latitude,Longitude,myLocation={latitude:Latitude,longitude:Longitude})
        {
            let closest = {latitude:List[0].attributes.latitude, longitude:List[0].attributes.longitude}; // The Closest Scooter
            let zoomLevel = 18;

            let Scooters = []

            for(let i = 0; i < List.length; i++)
            {
                Scooters.push({brand:"Lime",latitude:List[i].attributes.latitude,longitude:List[i].attributes.longitude})
            }
            let html = `
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
                                travelMode: 'DRIVING'
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
        
        if(req.query.longitude != undefined && req.query.ChatId != undefined && req.query.latitude != undefined) // Chack That theren't miss parameter.
        {
            let ChatId = req.query.ChatId; // Save ChatId
            let latitude = req.query.latitude; // Save Latitude
            let longitude = req.query.longitude; // Save Longidude
            // ==================================================================

            let Lime = new new require('../../ScootersCompenys/limes/limes.js').Lime();
            Lime.FindNearbyScooterCharger(latitude,longitude).then(function(scooters){
                res.send(Map(scooters,latitude,longitude));
            })
        }

    })
}

module.exports.LimeChargerMap = LimeChargerMap;