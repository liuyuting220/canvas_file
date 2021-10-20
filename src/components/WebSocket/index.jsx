let websocket,lockReconnect = false;
const url = 'ws://localhost:8080'
let createWebSocket = (data,filename) => {
  websocket = new WebSocket(url);

  websocket.onopen = () => {
    heartCheck.reset().start();
    console.log(data,filename);
    websocket.send(data+'?'+filename)
  }
  websocket.onerror = () => {
    reconnect(url);
  }
  websocket.onmessage = (e) => {
    lockReconnect = true;
    console.log(e.data);
  }
  websocket.onclose = (e) => {
    console.log('websocket断开连接',e.code,e.reason,e.wasClean);
  }
  
}
let reconnect = (url) => {
  if (lockReconnect) return;
  //没连接上会一直重连，设置延迟避免请求过多
  setTimeout(function () {
      createWebSocket(url);
      lockReconnect = false;
  }, 4000);
}
let heartCheck = {
  timeout: 60000, //60秒
  timeoutObj: null,
  reset: function () {
      clearInterval(this.timeoutObj);
      return this;
  },
  start: function () {
      this.timeoutObj = setInterval(function () {
          //这里发送一个心跳，后端收到后，返回一个心跳消息，
          //onmessage拿到返回的心跳就说明连接正常
          websocket.send("HeartBeat");
      }, this.timeout)
  }
}
//关闭连接
let closeWebSocket=()=> {
  websocket && websocket.close();
}
export{
  websocket,
  createWebSocket,
  closeWebSocket
}