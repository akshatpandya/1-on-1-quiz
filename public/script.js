var socket = io.connect('http://localhost:4000');

var start = document.getElementById('start');
var question = document.getElementById('question-area');
var option1 = document.getElementById('option-1');
var option2 = document.getElementById('option-2');
var option3 = document.getElementById('option-3');
var option4 = document.getElementById('option-4');
var answer = document.getElementById('answer');
var submit = document.getElementById('send');
var next = document.getElementById('next');
var wait = document.getElementById('wait-area');
var wrapper = document.getElementById('wrapper');
var challenge = document.getElementById('challenge');

//Emit Events
start.addEventListener('click', function(){
  socket.emit('start',{
    status: 1
  });
});

next.addEventListener('click', function(){
  socket.emit('give-question',{
    status: 1
  });
});

challenge.addEventListener('click', function(){
  socket.emit('give-question',{
    status: 2
  });
});

submit.addEventListener('click', function(){
  socket.emit('user-answer',{
    answer: answer.value
  });
});




//Listen to Events
socket.on('user-answer', function(data){
    wait.style.display = "block";
    wrapper.style.display = "none";
    wait.innerHTML = '<p>Your answer ' + data.answer + ' is ' + data.eval + '<br> Your score is ' + data.score + '<br>Waiting for other player...</p>';
});

socket.on('give-question', function(data){
  next.style.display = "none";
  challenge.style.display = "none";
  wait.style.display = "none";
  wrapper.style.display = "block";
  question.innerHTML = '<p>' + data.question + '<br></p>';
  option1.innerHTML = '<p>' + data.option1 + '</p>';
  option2.innerHTML = '<p>' + data.option2 + '</p>';
  option3.innerHTML = '<p>' + data.option3 + '</p>';
  option4.innerHTML = '<p>' + data.option4 + '</p>';
});

socket.on('wait', function(data){
  wait.style.display = "block";
  wait.innerHTML = '<p>Wait for other player to answer</p>';
  wrapper.style.display = "none";
  next.style.display = "none";
  challenge.style.display = "none";
  start.style.display = "none";
});

socket.on('show-next', function(data){
  wait.style.display = "none";
  wrapper.style.display = "none";
  next.style.display = "block";
});

socket.on('start', function(data){
  wait.style.display = "none";
  start.style.display = "none";
  wrapper.style.display = "block";
  question.innerHTML = '<p>' + data.question + '<br></p>';
  option1.innerHTML = '<p>' + data.option1 + '</p>';
  option2.innerHTML = '<p>' + data.option2 + '</p>';
  option3.innerHTML = '<p>' + data.option3 + '</p>';
  option4.innerHTML = '<p>' + data.option4 + '</p>';
});

socket.on('ask-to-wait', function(data){
  wait.style.display = "block";
  wait.innerHTML = '<p>Wait for other player to join</p>';
});

socket.on('score', function(data){
  wait.style.display = "block";
  wrapper.style.display = "none";
  next.style.display = "none";
  challenge.style.display = "none";
  wait.innerHTML = '<p>Your score is ' + data + '</p>';
});

socket.on('show-challenge', function(data){
  challenge.style.display = "block";
});
