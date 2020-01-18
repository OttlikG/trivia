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

