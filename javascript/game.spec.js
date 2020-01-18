var Game = require('./game').Game;

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
    Math.random = jest.fn(() => 0.5)
    console.log = consoleSpy
  })

  afterEach(() => {
    console.log = _console
    Math.random = _random
  })

  it('Should be the same output on every run', () => {
    const game = new Game()
    game.add('Chet')
    game.add('Pat')

    game.run()

    expect(consoleSpy).toMatchSnapshot()
  })
});
