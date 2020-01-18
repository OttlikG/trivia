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
