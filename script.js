var timeEl = document.querySelector("#timer");
var startbutt = document.getElementById("startButton");
var questionList = document.querySelector("#listOfOptions");
var messageToUser = document.querySelector("#MessageToUser");
var initialsH2 = document.querySelector("#yourInitials");
var scoreH2 = document.querySelector("#yourScore");

var indexToScreen = -1;
var CONST_SECONDS_LEFT = 50;
var secondsLeft = CONST_SECONDS_LEFT;
var numberOfOptions = 4; // if you add another question to the set of questions, increment this.
timeEl.textContent = secondsLeft.toString();

var SAVE_INITIALS_SCORE_KEY = 'saveInitialsScore';


var saveKeys =
{
    initials: 'Initials',
    score: 0
}

var screens = [
    optionsArray1 = [
        question1a =
        {
            textquest: "Javascript is the most commonly used programming language in the world",
            correct: true
        }
        ,
        question1b =
        {
            textquest: "Perl is more commonly used than Javascript",
            correct: false
        }
        ,
        question1c =
        {
            textquest: "Python is more commonly used than Javascript",
            correct: false
        }

        ,
        question1d =
        {
            textquest: "No one language is the best",
            correct: false
        }

    ],


    optionsArray2 = [
        question2a =
        {
            textquest: "You cannot store a string in an array",
            correct: false
        }
        ,
        question2b =
        {
            textquest: "You cannot have arrays of integers in Javascript",
            correct: false
        }
        ,
        question2c =
        {
            textquest: "Objects do not exist in Javascript",
            correct: false
        }

        ,
        question2d =
        {
            textquest: "Arrays are collections of objects, one right after the other in memory",
            correct: true
        }

    ],

    optionsArray3 = [
        question3a =
        {
            textquest: "FlexBox Froggy is a game, only for children, and not for adults",
            correct: false
        }
        ,
        question3b =
        {
            textquest: "Bootstrap is a convention used in the C# engine",
            correct: false
        }
        ,
        question3c =
        {
            textquest: "Bootstrap us a useful framework, in Javascript, that helps you format your page",
            correct: true
        }

        ,
        question3d =
        {
            textquest: "You should reference Bootstrap from your README file to make your README more robust",
            correct: false
        }
    ]
];

// Set the time
function setTime() {
    var timerInterval = setInterval(function () { // set the time interval, which is 1 second
        secondsLeft--; // show 1 second less
        timeEl.textContent = secondsLeft; // display how many seconds are left

        if (secondsLeft <= 0 || indexToScreen == screens.length) { // if user ran out of time or she answered all questions
            clearInterval(timerInterval);
            sendMessage();
        }

    }, 1000);
}

function sendMessage() {
    timeEl.textContent = " ";
    RemoveChildrenFromUL();
    messageToUser.textContent = "Enter your initials in the textbox below, then click the Save Initials button to see your " +
        "new score";
    enterInitials();
    startbutt.textContent = "Save Initials";
    startbutt.removeEventListener('click', buttonStarted);
    startbutt.addEventListener('click', SaveInitials);
    startbutt.setAttribute('style', 'visibility: visible;');

}

function RenderScreen() {

    if (indexToScreen < screens.length) {

        var qarray = screens[indexToScreen];

        for (var i = 0; i < numberOfOptions; i++) {

            var listitem = document.createElement("li");
            var listbutton = document.createElement("button");

            var objgotten = qarray[i];
            listbutton.textContent = objgotten.textquest;

            listbutton.setAttribute('class', 'btn btn-success');
            listbutton.addEventListener('click', nextQuestion);
            listbutton.setAttribute('style', 'font-size: 1.5rem;')
            listitem.setAttribute('class', 'm-2');
            listitem.setAttribute('id', 'buttonSelected' + i.toString());
            listitem.appendChild(listbutton);
            questionList.appendChild(listitem);
        }
    }
}

// Do the next question
function nextQuestion(event) {
    event.preventDefault(); // prevent unexpected behavior
    var buttonselected = event.target; // get the element selected. Apparently there's a child in the button.
    var thebuttonclicked = buttonselected.parentElement.id; // get button
    var indextobuttonarray = thebuttonclicked.substring(14, 15); // get id
    var parsedIntIndex = parseInt(indextobuttonarray); // parse into int
    var screenitem = screens[indexToScreen]; // 

    var correctObjectGotten = screenitem[parsedIntIndex];

    if (!correctObjectGotten.correct) {
        secondsLeft -= 10;
    }
    else {
        saveKeys.score++;
    }


    while (questionList.hasChildNodes()) {
        questionList.removeChild(questionList.firstChild);
    }

    indexToScreen++;
    RenderScreen();
}

function RemoveChildrenFromUL() {
    while (questionList.hasChildNodes()) {
        questionList.removeChild(questionList.firstChild);
    }
}



function buttonStarted(event) {
    event.preventDefault();
    messageToUser.textContent = "Select the option that is true by clicking";

    RemoveChildrenFromUL();
    startbutt.setAttribute('style', 'visibility: hidden;');
    indexToScreen++;
    setTime();
    RenderScreen();
}

function SaveInitials(event) {
    event.preventDefault();
    var initials = document.querySelector("#userPutInitials");
    if (initials != null) {
        saveKeys.initials = initials.value;
        var temp = saveKeys.score;
        localStorage.setItem(SAVE_INITIALS_SCORE_KEY, JSON.stringify(saveKeys));
        ShowSavedData();
    }

}

function enterInitials() {

    var theinput = document.createElement('input');
    theinput.setAttribute('type', 'text');
    theinput.setAttribute('placeholder', 'Initials');
    theinput.setAttribute('id', 'userPutInitials');
    questionList.appendChild(theinput);
}

// oops. Used JQuery when I shouldn't have.  
// Show the restart quiz button at the end of the quiz
function ShowSavedData() {
    var saveditems = JSON.parse(localStorage.getItem(SAVE_INITIALS_SCORE_KEY)); //get JSON object
    if (saveditems != null) { // sanity check here
        initialsH2.textContent = saveditems.initials; // 
        scoreH2.textContent = saveditems.score;
        if ($("#startButton").text().includes("Start Quiz") === false) {

            if ($("#restartButton").length < 1) {
                var createdButton = $("<button>");
                createdButton.text("Restart Quiz");
                createdButton.attr('id', 'restartButton');
               
                createdButton.attr('class', 'btn btn-primary');
                $('#divButton').append(createdButton);
                $("#restartButton").on("click", RestartQuiz);
            }
            else {
                $("#restartButton").attr('style', 'visibility: visible;');
            }
        }
    }
}

function RestartQuiz(event) {
    event.preventDefault();
    var debug = 0;
    indexToScreen = -1;
    $("#restartButton").attr('style', 'visibility: hidden;');
    secondsLeft = CONST_SECONDS_LEFT;
    saveKeys.score = 0;
    buttonStarted(event);
}

ShowSavedData();
startbutt.addEventListener('click', buttonStarted);

