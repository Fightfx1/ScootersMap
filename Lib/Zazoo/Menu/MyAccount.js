const BirdUsers = new new require('../../ScootersCompenys/birds/BirdUsers.js').BirdUsers();
const LimeUsers = new new require('../../ScootersCompenys/limes/LimeUsers.js').LimeUser();




function MyAcoount(payload, chat)
{
    chat.sendTemplate({
        template_type: 'button',
        text: "My account",
        buttons:[
            {type: 'postback', title: 'Add Operators', payload: 'Add Operators'},
            {type: 'postback', title: 'Menu', payload: 'Menu'}
        ]
    })
}


const AddOperators = (chat, payload) => {
    
    if(BirdUsers.Know(payload.sender.id) && LimeUsers.Know(payload.sender.id))
    { 
        chat.say("You are using all our operators");
    }
    else if(BirdUsers.Know(payload.sender.id) && !LimeUsers.Know(payload.sender.id))
    {
        // היוזר רשום רק לבירד
        chat.sendTemplate({
            
                template_type: 'button',
                text: "Menu",
                buttons:[
                    {type: 'postback', title: 'Add Lime', payload: 'Add Lime'},
                    {type: 'postback', title: 'Menu', payload: 'Menu'},
                ]
            
        })
    }
    else if(!BirdUsers.Know(payload.sender.id) && LimeUsers.Know(payload.sender.id))
    {
        chat.sendTemplate({
            
            template_type: 'button',
            text: "Menu",
            buttons:[
                {type: 'postback', title: 'Add bird', payload: 'Add bird'},
                {type: 'postback', title: 'Menu', payload: 'Menu'},
            ]
        
    })
    }
}







module.exports.AddOperators = AddOperators;
module.exports.MyAcoount = MyAcoount
