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

  it('should return with pop on 0 4 8', () => {
    const popCategories = [0, 4, 8]

    popCategories.map(popCategory => {
      game.places[game.currentPlayer] = popCategory
      
      expect(game.currentCategory()).toBe('Pop')
    })
  })

  it('should return with science on 1 5 9', () => {
    const scienceCategories = [1, 5, 9]

    scienceCategories.map(scienceCategory => {
      game.places[game.currentPlayer] = scienceCategory
      expect(game.currentCategory()).toBe('Science')
    })
  })

  it('should return with sports on 1 5 9', () => {
    const sportCategories = [2, 6, 10]

    sportCategories.map(sportCategory => {
      game.places[game.currentPlayer] = sportCategory
      expect(game.currentCategory()).toBe('Sports')
    })
  })

  it('should return with rock on 4 7 11 and greater', () => {
    const rockCategories = [3, 7, 11, 12]

    rockCategories.map(rockCategory => {
      game.places[game.currentPlayer] = rockCategory
      expect(game.currentCategory()).toBe('Rock')
    })
  })
})
