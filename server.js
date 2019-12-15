// 引入websocket
const websocket = require('ws');

const ws = new websocket.Server({port : 7080},()=>{
    console.log("ws://0.0.0.0:"+7080);
});//创建一个websocket对象，监听端口7080

// 保存连接socket对象的set容器
var clients = new Set();

// 保存会话的session容器
var sessions = [];

// 刷新房间内人员信息
function updatePees(){
    var peers = [];
    clients.forEach(function (client) {
        var peer = {};
        if(client.hasOwnProperty('id')){
            peer.id = client.id;
        }

        if(client.hasOwnProperty('name')){
            peer.name = client.name.name;
        }

        if(client.hasOwnProperty('session_id')){
            peer.session_id = client.session_id;
        }
        peer.add(peer);
    });

    var msg = {
        type: "peers",
        data : peers
    };
    clients.forEach(function (client) {
        send(client,JSON.stringify(msg));
    })
}

// 连接处理
ws.on('connection',function (client_self) {
    clients.add(client_self);
    // 收到消息处理
    client_self.on('message',function (message) {
        try{
            message = JSON.parse(message);
            console.log("message.type:::"+message.type+",\n body:"+JSON.stringify())
        }catch (e) {
            console.log(e.message)
        }

        switch (message.type){
            //新成员加入
            // 离开房间
            //转发offer
            //转发anwer
                //收到候选者转发 candidate
                //keepalive心跳

            case 'new':
            {
                client_self.id = ""+message.id;
                client_self.name = message.name;
                client_self.user_agent = message.user_agent;
                //向客户端发送有新用户进入房间需要刷新
                updatePeers();
            }
            break;

            // 离开房间
            case 'bye':
            {
                var session = null;
                session.forEach((sess) => {
                    if(sess.id == message.session_id){
                        session = sess;
                    }
                });

                if(!session){
                    var msg = {type:"error",data:{
                        error: "Invalid session"+
                        }};

                }
            }
        }
        
    })
})

// 发送消息
function send() {
    try{
        client.send(message);
    }catch (e) {
        console.log()
    }
    client.send(message);
}
