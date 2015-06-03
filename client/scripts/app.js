
var App = function(server){
this.server = server;
this.room = 'defaultRoom';

}
App.prototype.init = function(){
    var that = this;
    that.fetch();

    $('form.messageBoxForm').on('submit', function(event){
      event.preventDefault();
      var message = {
        username: $(this).find('input').val(),
        text: $(this).find('textarea').val(),
        roomname: $('.newRoom').val()
      };

      that.send(message);
    });
    $('.roomCreation').on('submit', function(event){
      event.preventDefault();
      that.room = $('.newRoom').val();
      that.send({'roomname': that.room});
    })
    $('.roomSelector').on('change', function(){
      that.room = $('.roomSelector').val();
      that.fetch();

    });
  };

App.prototype.send = function(message){
    var that = this;
    $.ajax({
      url: this.server + 'classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        that.fetch();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  };

App.prototype.fetch = function(){

    var that = this;
    $.ajax({
      url: this.server + 'classes/messages',
      type: 'GET',
      contentType: 'application/json',
      data: '',
      success: function (data) {
        data = JSON.parse(data);
        console.log(data);
        console.log('chatterbox: Messages received');
        that.clearMessages();
        that.clearRooms();
        var rooms = {};
        for (var i = 0; i < data.results.length; i++) {
          rooms[data.results[i].roomname] = rooms[data.results[i].roomname] || [];
          rooms[data.results[i].roomname].push(data.results[i]);
        }
        for (var key in rooms) {
          that.addRoom(key);
        }
        $('.roomSelector option[value='+ that.room +']').prop('selected', true);
        debugger;
        that.displayMessages(that.room, rooms);
      },
      error: function (data) {
        console.error('chatterbox: Failed to fetch');
      }
    });
  };

App.prototype.displayMessages = function(room, rooms){
  var that = this;
  if(rooms[room] && rooms[room].length > 0) {
    for (var i = 0; i < rooms[room].length; i++) {
            that.addMessage(rooms[room][i]);
    }
  }

  };

App.prototype.clearRooms = function(){
    $('.roomSelector').html('');

  };

App.prototype.clearMessages = function(){
    $('.messageList').html('');
  };

App.prototype.addMessage = function(message){
    var that = this;
    var $htmlMsg = $('<div class="message"><div class="username"></div><div class="text"></div><div class="roomname"></div><div class="date"></div></div>');

    var messageHtml = $htmlMsg.clone();
    messageHtml.children('.username').text(message.username);
    messageHtml.children('.text').text(message.text);
    // messageHtml.children('.date').text(message.createdAt);
    messageHtml.children('.roomname').text(message.roomname);
    $('.messageList').append(messageHtml);
    $('.username').on('click', function(){
      that.addFriend();
    });
  };

App.prototype.addRoom = function(room) {
  var $htmlOption = $('<option></option>');
    var optionHtml = $htmlOption.clone();
    optionHtml.text(room).val(room);
    $('.roomSelector').append(optionHtml);
  };

App.prototype.addFriend = function(){
  };


$(document).ready(function(){
  // var app = new App("http://127.0.0.1:3000/");
  var app = new App("http://127.0.0.1:1337/");
  var $msgList = $('.messageList');
   // console.log('ht;', $htmlMsg.html());
  app.init();
  // setInterval(app.fetch.bind(app), 5000);
});
