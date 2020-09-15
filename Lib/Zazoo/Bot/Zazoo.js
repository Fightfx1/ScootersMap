const BootBot = require('bootbot')
const https = require('https');


class Zazoo extends BootBot
{
    constructor(SetUp)
    {
        super(SetUp) // Getting all the parameters of the bot and useing them for start the bot.

        this.WebHook = SetUp.Url // Saveing the url of Were the bot running.

        this.setGetStartedButton("Get Started");
        this.httpsServer = undefined;
    }
    

    SendMesgFromPython()
    {
      this.app.get('/SendMsgFromPython',(req, res) =>{
        let ChatId = req.query.ChatId
        let Msg = req.query.Msg

        this.say(ChatId,Msg)
        res.sendStatus(200)
        return;
      })
    }


    SendMenu(ChatId)
    {
        this.sendTemplate(ChatId,{
            template_type:"generic",
            elements:[
                {
                  title: "Swipe left/right for more options.",
                  buttons: [
                    {
                      "type": "postback",
                      "title": "My Account",
                      "payload": "My Account"
                    },
                    {
                      "type": "postback",
                      "title": "Push notifications",
                      "payload": "Scooter Alerts"
                    },
                    {
                        "title":"Premium",
                        "type":"web_url",
                        "url": this.WebHook,
                        "webview_height_ratio": "compact",
                        "messenger_extensions": true,
                        "webview_share_button" : "hide"
                    }
                  ]
                },
                {
                  title: "Swipe left/right for more options.",
                  buttons: [
                    {
                      "type": "postback",
                      "title": "Find scooter to charge",
                      "payload": "Find scooter to charge"
                    },
                    {
                      "type": "postback",
                      "title": "Find scooter to ride",
                      "payload": "Find scooter to ride"
                    },
                    {
                      "type": "postback",
                      "title": "Add Operators",
                      "payload": "Add Operators"
                    }
                  ]
                }
              ]
        })




        /*
        // Sending Menu to the user that asked for.
        this.sendTemplate(ChatId,{
            template_type: 'button',
            text: "Menu",
            buttons:[
                {type: 'postback', title: 'My account', payload: 'My Account'},
                {type: 'postback', title: 'Push notifications', payload: 'Scooter Alerts'},
                {type: 'postback', title: 'Find scooter to charge | ride', payload: 'Find Scooter'}
            ]
        })
        */
    }

    PremiumWebSite()
    {
        let WebSiteFiles = require('../WebSiteFolder/app.js') // Getting All website files form the folder
        WebSiteFiles.WebSite(this.app) // Putting Express Inside the Website Start File
    }

    

    StartMapService()
    {
        /*
            * This function Used for starting The Map service of the bot 
            * The function useing "Maps" folder that in Zazoo folder
        */

        this.sendProfileRequest({
            whitelisted_domains: [
            this.WebHook
            ]
            });

        this.app.engine('html', require('ejs').renderFile);

        require('../Maps/BirdRiderMap.js').BirdRiderMap(this.app); // Starting Bird Riders Map.

        require('../Maps/BirdChargerMap.js').BirdChargerMap(this.app); // Starting Bird Chargers Map.

        require('../Maps/LimeRiderMap.js').LimeRiderMap(this.app) // Starting Lime Riders Map.

        require('../Maps/LimeChargerMap.js').LimeChargerMap(this.app) // Starting Lime Chargers Map.

    }

    SendMap(ChatId,type,Latitude,Longitude,Messenge)
    {
        // Sending Map Template
        this.sendTemplate(ChatId,{
            template_type: 'button',
            text: Messenge,
            buttons:[
                {
                    "title":"Map",
                    "type":"web_url",
                    "url": this.WebHook + "Map/" + type + "?ChatId=" + ChatId + "&latitude=" + Latitude + "&longitude=" + Longitude,
                    "webview_height_ratio": "compact",
                    "messenger_extensions": true,
                    "webview_share_button" : "hide"
                },
                {type: 'postback', title: 'Menu', payload: 'menu'}

            ]
        })
    }


    start(port, credentials) {
      this._initWebhook();
      this.app.set('port', port || 3000);
      if (credentials) {
        // Start the HTTPS server
        this.httpsServer = https.createServer(credentials, this.app);
        this.httpsServer.listen(this.app.get('port'), () => {
          const portNum = this.app.get('port');
          console.log(`BootBot running with SSL/TLS on port ${portNum}`);
          console.log(`Facebook Webhook running with SSL/TLS on localhost:${portNum}${this.webhook}`);
        });
      } else {
        // Start the express server
        this.server = this.app.listen(this.app.get('port'), () => {
          const portNum = this.app.get('port');
          console.log(`BootBot running without SSL/TLS on port ${portNum}`);
          console.log(`Facebook Webhook running without SSL/TLS on localhost:${portNum}${this.webhook}`);
        });
      }
    }
}

module.exports.Zazoo = Zazoo