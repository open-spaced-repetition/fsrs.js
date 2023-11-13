import { FSRS, Card, State, Rating } from '../src/index';

describe('rating', () => {
  it('rating', () => {
    expect(Rating.Again).toEqual(1);
  });
});

describe('state', () => {
  it('state', () => {
    expect(State.New).toEqual(0);
  });
});

describe('card', () => {
  const card = new Card();
  it('card.state', () => {
    expect(card.state).toEqual(0);
  });
});

describe('fsrs', () => {
  const fsrs = new FSRS();
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
  let f = new FSRS();
  let card_test = new Card();
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

  let now = new Date(2022, 10, 29, 12, 30, 0, 0);
  let scheduling_cards = f.repeat(card_test, now);

  console.log(scheduling_cards);
  let ratings = [
    Rating.Good,
    Rating.Good,
    Rating.Good,
    Rating.Good,
    Rating.Good,
    Rating.Good,
    Rating.Again,
    Rating.Again,
    Rating.Good,
    Rating.Good,
    Rating.Good,
    Rating.Good,
    Rating.Good,
  ];
  let ivl_history = new Array<number>();
  let state_history = new Array<State>();

  for (let i = 0; i < ratings.length; i++) {
    card_test = scheduling_cards[ratings[i]].card;
    ivl_history.push(card_test.scheduled_days);
    state_history.push(scheduling_cards[ratings[i]].review_log.state);
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
    State.New,
    State.Learning,
    State.Review,
    State.Review,
    State.Review,
    State.Review,
    State.Review,
    State.Relearning,
    State.Relearning,
    State.Review,
    State.Review,
    State.Review,
    State.Review,
  ]);
}

test_repeat();

describe('ReviewLog', () => {
  it('elapsed days set to 0 for new cards when scheduled days is set', () => {
    const fsrs = new FSRS();
    const card = new Card();
    card.scheduled_days = 42;

    const log = fsrs.repeat(card, new Date('2023-11-10T23:20:47.297Z'));
    const againReviewLog = log[Rating.Again].review_log;

    expect(againReviewLog.elapsed_days).toEqual(0);
  });

  it('scheduled days set to 0 for "Again" ratings irregardless of elapsed days since last review', () => {
    const fsrs = new FSRS();
    const card = new Card();
    card.state = State.Learning;
    card.last_review = new Date('2023-11-06T23:20:47.297Z');

    const log = fsrs.repeat(card, new Date('2023-11-10T23:20:47.297Z'));
    const againReviewLog = log[Rating.Again].review_log;

    expect(againReviewLog.scheduled_days).toEqual(0);
  });
});
