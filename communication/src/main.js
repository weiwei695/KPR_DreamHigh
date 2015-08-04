//@program
var whiteSkin = new Skin({fill:"white"});

var titleStyle = new Style({font:"bold 70px", color:"black"});
var resultStyle = new Style({font:"45px", color:"black"});

var mainColumn = new Column({
  left: 0, right: 0, top: 0, bottom: 0,
  skin: whiteSkin,
  contents:[
    new Label({left: 0, right: 0, height: 70, string: "Your IP:", style: titleStyle}),
    new Label({left: 0, right: 0, height: 70, string: "Loading...", style: resultStyle, name:"ipLabel"}),
    new Label({left: 0, right: 0, height: 70, string: "Time:", style: titleStyle}),
    new Label({left: 0, right: 0, height: 70, string: "Loading...", style: resultStyle, name:"timeLabel"}),
  ]
});

Handler.bind("/getIP", {
  onInvoke: function(handler, message){
    handler.invoke(new Message("http://ip.jsontest.com/"), Message.JSON);
  },
  onComplete: function(handler, message, json){
    trace("Returned IP is: " + json.ip + "\n");
  }
});

Handler.bind("/getTime", {
  onInvoke: function(handler, message){
    handler.invoke(new Message("http://time.jsontest.com/"), Message.JSON);
  },
  onComplete: function(handler, message, json){
     trace("Returned Time is: " + json.time + "\n");
  }
});

application.behavior = Object.create(Behavior.prototype, {	
  onLaunch: { value: function(application, data){
    application.add(mainColumn);
    application.invoke(new Message("/getIP"));
    application.invoke(new Message("/getTime"));
  }}
});
