const fsrsJs = require('fsrs.js');

let fsrs = new fsrsJs.FSRS();
let card = new fsrsJs.Card();
let rating = fsrsJs.Rating;
let state = fsrsJs.State;

describe('rating', () => {
  it('rating', () => {
    expect(rating.Again).toEqual(1);
  });
});

describe('state', () => {
  it('state', () => {
    expect(state.New).toEqual(0);
  });
});

describe('card', () => {
  it('card.state', () => {
    expect(card.state).toEqual(0);
  });
});

describe('fsrs', () => {
  console.log(fsrs.init_stability(0));
  it('fsrs.p', () => {
    expect(fsrs.p.w).toEqual([
      0.4,
      0.6,
      2.4,
      5.8,
      4.93,
      0.94,
      0.86,
      0.01,
      1.49,
      0.14,
      0.94,
      2.18,
      0.05,
      0.34,
      1.26,
      0.29,
      2.61,
    ]);
  });
});

function test_repeat() {
  let f = new fsrsJs.FSRS();
  f.p.w = [
    1.14,
    1.01,
    5.44,
    14.67,
    5.3024,
    1.5662,
    1.2503,
    0.0028,
    1.5489,
    0.1763,
    0.9953,
    2.7473,
    0.0179,
    0.3105,
    0.3976,
    0.0,
    2.0902,
  ];
  let card_test = new fsrsJs.Card();
  let revlog = new fsrsJs.ReviewLog();
  let now = new Date(2022, 10, 29, 12, 30, 0, 0);
  let scheduling_cards = f.repeat(card_test, now);

  console.log(scheduling_cards);
  let ratings = [
    rating.Good,
    rating.Good,
    rating.Good,
    rating.Good,
    rating.Good,
    rating.Good,
    rating.Again,
    rating.Again,
    rating.Good,
    rating.Good,
    rating.Good,
    rating.Good,
    rating.Good,
  ];
  let ivl_history = new Array<number>();
  let state_history = new Array<typeof state>();

  for (let i = 0; i < ratings.length; i++) {
    card_test = scheduling_cards[ratings[i]].card;
    ivl_history.push(card_test.scheduled_days);
    revlog = scheduling_cards[ratings[i]].review_log;
    state_history.push(revlog.state);
    now = card_test.due;
    scheduling_cards = f.repeat(card_test, now);
    console.log(scheduling_cards);
  }

  console.log(ivl_history);
  console.log(state_history);
  console.log(card_test);

  expect(ivl_history).toEqual([
    0,
    5,
    16,
    43,
    106,
    236,
    0,
    0,
    12,
    25,
    47,
    85,
    147,
  ]);

  expect(state_history).toEqual([
    state.New,
    state.Learning,
    state.Review,
    state.Review,
    state.Review,
    state.Review,
    state.Review,
    state.Relearning,
    state.Relearning,
    state.Review,
    state.Review,
    state.Review,
    state.Review,
  ]);
}

test_repeat();
