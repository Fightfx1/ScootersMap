const BirdNewUser = new new require('../../ScootersCompenys/birds/Bird.js').BirdNewUser(); // import the class BirdNewUser from lib birds bird.js the class used for save client informetion in the first time...


const NewClientBird = (convo) => {
    convo.ask({
        text: 'Could you please provide your email address?',
        quickReplies: [{
            "content_type":"user_email"
        }]
    }, (payload, convo, data) => {
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
    convo.ask(`Please check your email and verify your account using the code that was sent to you`, (payload, convo, data) => {
        const text = payload.message.text;
        if(BirdNewUser.verifyEmail(text,payload.sender.id) != false)// The Token From The User 
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
            convo.say("Something wrong, please connect us via this Email zazoo.io.main@gmail.com")
        }
        convo.end();
      });
};


module.exports.AddBird = NewClientBird;