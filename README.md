## About The Project

fsrs.js is a JS Package implements [Free Spaced Repetition Scheduler algorithm](https://github.com/open-spaced-repetition/free-spaced-repetition-scheduler). It helps developers apply FSRS in their flashcard apps.

## Getting Started

```
npm install fsrs.js
```

## Usage

Create a card and review it at a given time:

```js
import * as fsrsjs from 'fsrs.js'

let fsrs = new fsrsjs.FSRS;
let card = new fsrsjs.Card;

//Set algorithm parameters
// fsrs.p.w=[1.0, 1.0, 5.0, -0.5, -0.5, 0.2, 1.4, -0.12, 0.8, 2.0, -0.2, 0.2, 1.0]
conslog(fsrs.p.w)

let now = new Date(2022, 10, 29, 12, 30, 0, 0);
let scheduling_cards = fsrs.repeat(card, now);
console.log(scheduling_cards);
```

There are four ratings:

```js
1: Forget //incorrect response
2: Hard //recall; correct response recalled with serious difficulty
3: Good //recall; correct response after a hesitation
4: Easy // recall; perfect response
```

There are four states:

```js
0: New //Never been studied
1: Learning //Been studied for the first time recently
2: Review //Graduate from learning state
3: Relearning //Forgotten in review state
```

```js
//Get the new state of card for each rating:
scheduling_cards[0].card
scheduling_cards[1].card
scheduling_cards[2].card
scheduling_cards[3].card

//Update the card after rating `Good`:
card = scheduling_cards[2].card

//Get the due date for card:
due = card.due

//Get the state for card:
state = card.state

//Get the review log after rating `Good`:
review_log = scheduling_cards[2].review_log
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
