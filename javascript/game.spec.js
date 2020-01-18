var Game = require('./game').Game;
var Random = require('./prng').Random;

describe("Game", function () {
  let consoleSpy
  let _console = console.log
  let _random = Math.random

  beforeEach(() => {
    consoleSpy = jest.fn()
    console.log = consoleSpy
  })

  afterEach(() => {
    console.log = _console
    Math.random = _random
  })

  it('Should be the same output on every run', () => {
    Math.random = jest.fn(() => 0.5)
    
    const game = new Game()
    game.add('Chet')
    game.add('Pat')

    game.run()

    expect(consoleSpy.mock.calls.flat()).toMatchSnapshot()
  })

  test.each([
    [0],
    [1],
    [2],
    [3],
  ])('Should be the same output on every run', (seed) => {
    let random = new Random(seed)
    Math.random = jest.fn(() => random.nextFloat())

    const game = new Game()
    game.add('Player1')
    game.add('Player2')
    game.add('Player3')
    game.add('Player4')

    game.run()

    expect(consoleSpy.mock.calls.flat()).toMatchSnapshot()
  })
});

describe('didThePlayerWin', () => {
  it('should the player win the game if the current player purses not equal to 6', () => {
    const game = new Game()

    game.purses = [5]
    expect(game.didPlayerWin()).toBe(true)
  })

  it('should return with false if the current player\'s purses equal 6', () => {
    const game = new Game()
    game.purses = [6]

    expect(game.didPlayerWin()).toBe(false)
  })
})

describe('wrongAnswer', () => {
  let consoleSpy
  let _console = console.log

  beforeEach(() => {
    consoleSpy = jest.fn()
    console.log = consoleSpy
  })

  afterEach(() => {
    console.log = _console
  })

  it('should have the next player up for turn', () => {
    const game = new Game();
    game.add('Bob');
    game.add('Alice');
    game.add('Kate');
    expect(game.currentPlayer).toBe(0);
    game.wrongAnswer();
    expect(game.currentPlayer).toBe(1);
    game.wrongAnswer();
    expect(game.currentPlayer).toBe(2);
    game.wrongAnswer();
    expect(game.currentPlayer).toBe(0);
  })

  it('should return result indicating the game should continue', () => {
    const game = new Game();
    const gameContinues = game.wrongAnswer();
    expect(gameContinues).toBe(true);
  })

  it('should place the player in the penalty box', () => {
    const game = new Game();
    game.add('Bob')
    consoleSpy.mockClear()
    game.wrongAnswer();
    expect(game.inPenaltyBox[0]).toBe(true)
  })  

  it.each([
    'Rock',
    'Science',
    'Sports',
  ])('should not place kids in the penalty box for %s questions', (categoryType) => {
    const game = new Game();
    game.add('Bob', true)
    game.currentCategory = () => categoryType;
    game.wrongAnswer();
    expect(game.inPenaltyBox[0]).toBe(false)
  })  

  test('should place kids in the penalty box for Pop questions', () => {
    const game = new Game();
    game.add('Bob', true)
    game.currentCategory = () => 'Pop';
    game.wrongAnswer();
    expect(game.inPenaltyBox[0]).toBe(true)
  })  

  it('should print to console the expected output', () => {
    const game = new Game();
    game.add('Bob')
    game.add('Clara')
    consoleSpy.mockClear()
    game.wrongAnswer();
    expect(consoleSpy.mock.calls.flat()).toEqual([
      "Question was incorrectly answered",
      "Bob was sent to the penalty box"
    ]);
  })
})

describe('Player wins', () => {
  let game

  beforeEach(() => {
    game = new Game()
    game.add('Adult')
    game.add('Kid', true)
  })

  it('when adult and has 6 coins', () => {
    game.currentPlayer = 0;
    game.purses[game.currentPlayer] = 6;
    expect(game.didPlayerWin()).toBe(false) // false means win
  })

  it('when kid and has 4 coins', () => {
    game.currentPlayer = 1;
    game.purses[game.currentPlayer] = 4;
    expect(game.didPlayerWin()).toBe(false) // false means win
  })
})

describe('Player does not win', () => {
  let game

  beforeEach(() => {
    game = new Game()
    game.add('Adult')
    game.add('Kid', true)
  })

  it('when adult and does not have 6 coins', () => {
    game.currentPlayer = 0;
    game.purses[game.currentPlayer] = 5;
    expect(game.didPlayerWin()).toBe(true) // true means NO win
  })

  it('when kid and does not have 4 coins', () => {
    game.currentPlayer = 1;
    game.purses[game.currentPlayer] = 3;
    expect(game.didPlayerWin()).toBe(true) // true means NO win
  })
})

describe('currentCategory', () => {
  let game

  beforeEach(() => {
    game = new Game()
    game.add('Player1')
    game.add('Player2')
  })

  it.each([
    ['Pop', 0],
    ['Pop', 4],
    ['Pop', 8],
    ['Science', 1],
    ['Science', 5],
    ['Science', 9],
    ['Sports', 2],
    ['Sports', 6],
    ['Sports', 10],
    ['Rock', 3],
    ['Rock', 7],
    ['Rock', 11],
    ['Rock', 12]
  ])('should return with %s', (categoryType, number) => {
    game.places[game.currentPlayer] = number
    expect(game.currentCategory()).toBe(categoryType)
  })
})

describe('getMarketQuestion', () => {
  let game

  beforeEach(() => {
    game = new Game()
  })

  it('should return with Politics insted of Scienc on US market', () => {
    game.add('Player1')
    game.market = 'US'
    game.places[0] = 1

    const questionType = game.getMarketQuestion()
    expect(questionType).toBe('Politics')
  })

  it('should return with defualt category when the market it\'s not US', () => {
    game.add('Plaer1')
    game.market = 'Hungary'
    game.places[0] = 0

    const questionType = game.getMarketQuestion()
    expect(questionType).toBe('Pop')
  })
})
