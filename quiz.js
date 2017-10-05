var express = require('express');
var socket = require('socket.io');
//App setup
var app = express();
var server = app.listen(4000, function(){
  console.log("listening to port 4000");
});

//Static files
app.use(express.static('public'));

//Socket setup
var io = socket(server);

//Utility variables
var ques_count = 0,
    score = [0, 0],
    i = 0,
    player = [],
    row = 0,
    column = 0;

var p1chance = false, p2chance = false;
var p1challenge = false, p2challenge = false;

/* read the file */
var XLSX = require('xlsx');
var workbook = XLSX.readFile('questions.xlsx'); // parse the file
var sheet = workbook.Sheets[workbook.SheetNames[0]]; // get the first worksheet

function populate()
{
  var ques, opt1, opt2, opt3, opt4;
  var cellref = XLSX.utils.encode_cell({c:column, r:row});
  var cell = sheet[cellref];

  ques = cell.v;
  column += 1;
  var cellref = XLSX.utils.encode_cell({c:column, r:row});
  var cell = sheet[cellref];
  opt1 = cell.v;
  column += 1;
  var cellref = XLSX.utils.encode_cell({c:column, r:row});
  var cell = sheet[cellref];
  opt2 = cell.v;
  column += 1;
  var cellref = XLSX.utils.encode_cell({c:column, r:row});
  var cell = sheet[cellref];
  opt3 = cell.v;
  column += 1;
  var cellref = XLSX.utils.encode_cell({c:column, r:row});
  var cell = sheet[cellref];
  opt4 = cell.v;

  row = 0;
  column = 0;
  return ({question: ques, option1: opt1, option2: opt2, option3: opt3, option4: opt4});
}

function populate_answers() {
  var answer;
  var cellref = XLSX.utils.encode_cell({c:5, r:row});
  var cell = sheet[cellref];
  answer = cell.v;
  row = 0;
  column = 0;
  return answer;
}



io.on('connection', function(socket){
  console.log("connection made");
  player.push(socket.id);
  console.log(player[i]);
  i++;
  console.log(i);


  socket.on('start', function(data){
    if(player.length==2)
    {
      if(player[0] == socket.id)
        p1chance = true;
      if(player[1] == socket.id)
        p2chance = true;
      if(p1chance == true)
      {
        row = ques_count;
        column = 0;
        var q = populate();
        ques_count += 1;
        p1chance = false;
        io.sockets.connected[player[0]].emit('start', q);
        io.sockets.connected[player[1]].emit('wait', 1);
      }
      else if(p2chance == true)
      {
        row = ques_count;
        column = 0;
        var q = populate();
        ques_count += 1;
        p2chance = false;
        io.sockets.connected[player[1]].emit('start', q);
        io.sockets.connected[player[0]].emit('wait', 1);
      }
    }
    else
      io.sockets.connected[player[0]].emit('ask-to-wait', 1);
  });

  //give question
  socket.on('give-question', function(data){
    if(player[0] == socket.id)
      p1chance = true;
    else if(player[1] == socket.id)
      p2chance = true;

    if(p1chance == true)
    {
      if(data.status == 2)
        p1challenge = true;
      row = ques_count;
      column = 0;
      var q = populate();
      ques_count += 1;
      p1chance = false;
      io.sockets.connected[player[0]].emit('give-question', q);
      io.sockets.connected[player[1]].emit('wait', 1);
    }
    else if(p2chance == true)
    {
      if(data.status == 2)
        p2challenge = true;
      row = ques_count;
      column = 0;
      var q = populate();
      ques_count += 1;
      p2chance = false;
      io.sockets.connected[player[1]].emit('give-question', q);
      io.sockets.connected[player[0]].emit('wait', 1);
    }

  });


  //checking for correct answer
  socket.on('user-answer', function(data){
    row = ques_count - 1;
    var answer = populate_answers();
    if (answer == data.answer) {
      var correct = 'correct';
      if(socket.id == player[0]) {
        if(p1challenge == true)
        {
          score[0] += 2;
          p1challenge = false;
        }
        else
          score[0] += 1;
        io.sockets.connected[player[0]].emit('user-answer', {answer: data.answer, eval: correct, score: score[0]});
        io.sockets.connected[player[1]].emit('show-next', 1);
        io.sockets.connected[player[1]].emit('show-challenge', 1);
      }
      else {
        if(p2challenge == true)
        {
          score[1] += 2;
          p2challenge = false;
        }
        else
          score[1] += 1;
        io.sockets.connected[player[1]].emit('user-answer', {answer: data.answer, eval: correct, score: score[1]});
        io.sockets.connected[player[0]].emit('show-next', 1);
        io.sockets.connected[player[0]].emit('show-challenge', 1);
      }
    }

    else if (data.answer != answer) {
      var correct = 'incorrect';
      if(socket.id == player[0])
      {
        if(p1challenge == true)
          score[0] -= 1;
        p1challenge = false;
        io.sockets.connected[player[0]].emit('user-answer', {answer: data.answer, eval: correct, score: score[0]});
        io.sockets.connected[player[1]].emit('show-next', 1);
        io.sockets.connected[player[1]].emit('show-challenge', 1);
      }
      else
      {
        if(p2challenge == true)
          score[1] -= 1;
        p2challenge = false;
        io.sockets.connected[player[1]].emit('user-answer', {answer: data.answer, eval: correct, score: score[1]});
        io.sockets.connected[player[0]].emit('show-next', 1);
        io.sockets.connected[player[0]].emit('show-challenge', 1);
      }
    }

    if(ques_count == 10)
    {
      io.sockets.connected[player[0]].emit('score', score[0]);
      io.sockets.connected[player[1]].emit('score', score[1]);
    }

  });

});
