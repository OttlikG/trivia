var Game = require('./game').Game;
var Random = require('./prng').Random;

describe("The test environment", function() {
  it("should pass", function() {
    expect(true).toBe(true);
  });

  it("should access game", function() {
    expect(Game).toBeDefined();
  });
});

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
