


const AddLime = (convo) => 
{
    
    convo.ask(`Can you send your email address?`, (payload, convo, data) => {
            const text = payload.message.text;
            let LimeUser = new new require('../../ScootersCompenys/limes/LimeUsers.js').LimeUser(); //  Get Lime Users Class 
            LimeUser.NewUser(payload.sender.id,text) 
            convo.say({
                text: "Lime acsess been activated",
                quickReplies: ['Menu']
            });
            
            convo.end();
    })
    
}

module.exports.AddLime = AddLime;