import { Rating, Card, FSRS } from "../src";

let rating = new Rating();

function test_repeat() {
    let f = new FSRS();
    let card = new Card();
    let now = new Date(2022, 11, 29, 12, 30, 0, 0);
    let scheduling_cards = f.repeat(card, now);

    console.log(scheduling_cards);

    card = scheduling_cards[rating.Good].card;
    now = card.due;
    scheduling_cards = f.repeat(card, now);
    console.log(scheduling_cards);

    card = scheduling_cards[rating.Good].card;
    now = card.due;
    scheduling_cards = f.repeat(card, now);
    console.log(scheduling_cards);

    card = scheduling_cards[rating.Again].card;
    now = card.due;
    scheduling_cards = f.repeat(card, now);
    console.log(scheduling_cards);

    card = scheduling_cards[rating.Good].card;
    now = card.due;
    scheduling_cards = f.repeat(card, now);
    console.log(scheduling_cards);
}

test_repeat();