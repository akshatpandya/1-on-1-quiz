# 1-on-1-quiz
One on One multiplayer quiz webapp using `sockets.io` for real time connection and NodeJS and express to host the server.
The questions currently are hard-coded in an excel sheet and are read from that using a JS library 'excel'.

Steps to use:

1) ```cd 1-on-1-quiz```
2) ```node quiz.js```
3) open two browser windows and go to ```http://localhost:4000```
4) Start the quiz!

Rules:

1) 5 questions each player
2) Before each question the player gets to challenge the question
3) Each correct answer - 1 point, when challenged: correct answer 2 points and wrong answer -1 point

Possible enhancements:

1) After each quiz the server needs to be restarted.
2) Questions could be in a google sheet and use wikipedia API to generate random questions.
