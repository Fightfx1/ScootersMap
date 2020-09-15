const BirdNewUser = new new require('../../ScootersCompenys/birds/Bird.js').BirdNewUser(); // import the class BirdNewUser from lib birds bird.js the class used for save client informetion in the first time...


const NewClient = (convo) => {
    let text = `Zazoo would assist you in finding nearby scooters to ride or charge.
Our push notifications service will notify you whenever a Scooter needs some charging,
while aggregating multiple operators according to your choice.
Good luck:)`
    convo.say(text); // say the start text
    convo.ask((convo) => {
        const buttons = [
            {type: 'postback', title: 'Yes', payload: 'Yes'},
            {type: 'postback', title: 'No', payload: 'No'}
        ];
        convo.sendButtonTemplate(`Are you ready?`, buttons);
    }, (payload, convo, data) => {
        console.log(payload.postback.payload);
        if (payload.postback.payload === 'Yes')
        {
            NewClient2(convo); // will send the user to the next register function;
        }
        else if(payload.postback.payload === 'No')
        {            
            convo.say("Would you like to tell us why you wouldn't like to help us improve our service? Our mail is zazoo.io.main@gmail.com");
            return NewClient(convo)
        }
        else
        {
            convo.end();
        }
    });
};

const NewClient2 = (convo) => {
    convo.ask((convo) => {
        const buttons = [
            {type: 'postback', title: 'Bird', payload: 'Bird'},
            {type: 'postback', title: 'Lime', payload: 'Lime'}
        ];
        convo.sendButtonTemplate(`What scooters vendor do you use?`, buttons);
    }, (payload, convo, data) => {
        console.log(payload.postback.payload);
        if (payload.postback.payload === 'Bird')
        {
            NewClientBird(convo);
        }
        else if(payload.postback.payload === 'Lime')
        {
            NewClientLime(convo);
        }
        else
        {
            convo.end();
        }
    });
};

const NewClientBird = (convo) => {
    convo.ask(`Could you please provide your email address?`, (payload, convo) => {
        const text = payload.message.text;

        BirdNewUser.login(text,payload.sender.id); // Send To the User Mail.
        NewClientBirdverifyEmail(convo,text);

    });
};

const NewClientBirdverifyEmail = (convo,Email) => {
    convo.say({
        attachment: 'image',
        url: 'https://i.imgur.com/tULqhWV.png'
    });
    convo.ask((convo) => {
   
        let buttons = [
            {
                 type: 'postback',
                 title: 'Change Email',
                 payload: 'Change Email'              
            }
        ];
  
        convo.sendButtonTemplate(`Please check your email and verify your account using the code that was sent to you`,buttons);
    
     }, (payload,convo,data) => {
  
        try
        {
            if (payload.postback.payload === 'Change Email')
            {
                BirdNewUser.deleteUser(payload.sender.id);
                return NewClientBird(convo);
            }
        }
        catch(err)
        {
            let text = payload.message.text;
            
            if(text == undefined || text == null) text = payload.postback.payload;
 
            let verified = BirdNewUser.verifyEmail(text,payload.sender.id)
            verified.then(function(yesorno){
               if(yesorno != false)// The Token From The User
               {
  
                   let KnownUsers = new new require('../KnownUsers/KnownUsers.js').KnownUsers();
                   KnownUsers.NewUser(payload.sender.id,Email);
                   convo.say({
                       text: "Cool, now you are verified. Let's start our journey by clicking on menu",
                       quickReplies: ['Menu']
                   });
                   convo.end();
               }
              
               else
               {
                   convo.say("The code is worng")
                   return NewClientBirdverifyEmail(convo,Email);
               }
            })

        }
     })
};


const NewClientLime = (convo) =>{
    convo.ask(`Can you send your email address?`, (payload, convo, data) => {
        const text = payload.message.text;
        let LimeUser = new new require('../../ScootersCompenys/limes/LimeUsers.js').LimeUser(); //  Get Lime Users Class 
        LimeUser.NewUser(payload.sender.id,text) 
        let KnownUsers = new new require('../KnownUsers/KnownUsers.js').KnownUsers();
        KnownUsers.NewUser(payload.sender.id,text);
        convo.say({
            text: "Cool now I know you Let Back to the menu",
            quickReplies: ['Menu']
        });
        convo.end();
    })
}


module.exports.NewClient = NewClient;
