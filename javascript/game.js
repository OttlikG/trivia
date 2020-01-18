exports.Game = function() {
  var players          = new Array();
  this.isKid           = new Array();
  this.places           = new Array(6);
  this.purses           = new Array(6);
  this.inPenaltyBox     = new Array(6);
  this.markets = new Array('US', 'China', 'Hungary', 'Germany', 'UK');
  this.market = this.markets[2]

  var popQuestions     = new Array();
  var scienceQuestions = new Array();
  var sportsQuestions  = new Array();
  var rockQuestions    = new Array();

  var markets = new Array('US', 'China', 'Hungary', 'Germany', 'UK');

  this.currentPlayer    = 0;
  var isGettingOutOfPenaltyBox = false;

  this.didPlayerWin = () => {
    const coinsNeeded = this.isKid[this.currentPlayer] ? 4 : 6;
    return !(this.purses[this.currentPlayer] == coinsNeeded)
  };

  this.getMarketQuestion = (category) => {
    const currentCategory = this.currentCategory()

    if(this.market == 'US') {
      if(currentCategory == 'Science') {
        return 'Politics'
  }
    }

    return currentCategory
  }

  this.currentCategory = () => {
    if(this.places[this.currentPlayer] == 0)
      return 'Pop';
    if(this.places[this.currentPlayer] == 4)
      return 'Pop';
    if(this.places[this.currentPlayer] == 8)
      return 'Pop';
    if(this.places[this.currentPlayer] == 1)
      return 'Science';
    if(this.places[this.currentPlayer] == 5)
      return 'Science';
    if(this.places[this.currentPlayer] == 9)
      return 'Science';
    if(this.places[this.currentPlayer] == 2)
      return 'Sports';
    if(this.places[this.currentPlayer] == 6)
      return 'Sports';
    if(this.places[this.currentPlayer] == 10)
      return 'Sports';
    return 'Rock';
  };

  this.createRockQuestion = (index) => {
    return "Rock Question "+index;
  };

  for(var i = 0; i < 50; i++){
    popQuestions.push("Pop Question "+i);
    scienceQuestions.push("Science Question "+i);
    sportsQuestions.push("Sports Question "+i);
    rockQuestions.push(this.createRockQuestion(i));
  };

  this.add = (playerName, isKid) => {
    players.push(playerName);
    this.places[this.howManyPlayers() - 1] = 0;
    this.isKid[this.howManyPlayers() - 1] = !!isKid;
    this.purses[this.howManyPlayers() - 1] = 0;
    this.inPenaltyBox[this.howManyPlayers() - 1] = false;

    console.log(playerName + " was added");
    console.log("They are player number " + players.length);

    return true;
  };

  this.howManyPlayers = () => {
    return players.length;
  };


  var askQuestion = () => {
    if(this.getMarketQuestion() == 'Pop')
      console.log(popQuestions.shift());
    if(this.getMarketQuestion() == 'Science')
      console.log(scienceQuestions.shift());
    if(this.getMarketQuestion() == 'Sports')
      console.log(sportsQuestions.shift());
    if(this.getMarketQuestion() == 'Rock')
      console.log(rockQuestions.shift());
  };

  this.roll = (roll) => {
    console.log(players[this.currentPlayer] + " is the current player");
    console.log("They have rolled a " + roll);

    if(this.inPenaltyBox[this.currentPlayer]){
      if(roll % 2 != 0){
        isGettingOutOfPenaltyBox = true;

        console.log(players[this.currentPlayer] + " is getting out of the penalty box");
        this.places[this.currentPlayer] = this.places[this.currentPlayer] + roll;
        if(this.places[this.currentPlayer] > 11){
          this.places[this.currentPlayer] = this.places[this.currentPlayer] - 12;
        }

        console.log(players[this.currentPlayer] + "'s new location is " + this.places[this.currentPlayer]);
        console.log("The category is " + this.getMarketQuestion());
        askQuestion();
      }else{
        console.log(players[this.currentPlayer] + " is not getting out of the penalty box");
        isGettingOutOfPenaltyBox = false;
      }
    }else{

      this.places[this.currentPlayer] = this.places[this.currentPlayer] + roll;
      if(this.places[this.currentPlayer] > 11){
        this.places[this.currentPlayer] = this.places[this.currentPlayer] - 12;
      }

      console.log(players[this.currentPlayer] + "'s new location is " + this.places[this.currentPlayer]);
      console.log("The category is " + this.getMarketQuestion());
      askQuestion();
    }
  };

  this.wasCorrectlyAnswered = () => {
    if(this.inPenaltyBox[this.currentPlayer]){
      if(isGettingOutOfPenaltyBox){
        console.log('Answer was correct!!!!');
        this.purses[this.currentPlayer] += 1;
        console.log(players[this.currentPlayer] + " now has " +
                    this.purses[this.currentPlayer]  + " Gold Coins.");

        var winner = this.didPlayerWin();
        this.currentPlayer += 1;
        if(this.currentPlayer == players.length)
          this.currentPlayer = 0;

        return winner;
      }else{
        this.currentPlayer += 1;
        if(this.currentPlayer == players.length)
          this.currentPlayer = 0;
        return true;
      }



    }else{

      console.log("Answer was correct!!!!");

      this.purses[this.currentPlayer] += 1;
      console.log(players[this.currentPlayer] + " now has " +
                  this.purses[this.currentPlayer]  + " Gold Coins.");

      var winner = this.didPlayerWin();

      this.currentPlayer += 1;
      if(this.currentPlayer == players.length)
        this.currentPlayer = 0;

      return winner;
    }
  };

  this.wrongAnswer = () => {
    console.log('Question was incorrectly answered');

    // Only send adults to the penalty box, unless it's Pop, everybody knows Pop
    if(!this.isKid[this.currentPlayer] || this.currentCategory() == 'Pop') {
      console.log(players[this.currentPlayer] + " was sent to the penalty box");
      this.inPenaltyBox[this.currentPlayer] = true;
    }

    this.currentPlayer += 1;
    if(this.currentPlayer == players.length)
      this.currentPlayer = 0;
		return true;
  };

  this.run = () => {
    var notAWinner = false;
    
    do{

      this.roll(Math.floor(Math.random()*6) + 1);
    
      if(Math.floor(Math.random()*10) == 7){
        notAWinner = this.wrongAnswer();
      }else{
        notAWinner = this.wasCorrectlyAnswered();
      }
    
    }while(notAWinner);
  }
};
