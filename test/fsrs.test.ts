import * as model from "../src";
let Card = new model.Card;
let FSRS = new model.FSRS;

describe('Card', () => {
    it('Card.state', () => {
        expect(Card.state).toEqual(0);
    });
});

describe('FSRS', () => {
    console.log(FSRS.init_stability(0))
    it('FSRS.p', () => {
        expect(FSRS.p.w).toEqual([0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61]);
    });
});

function test_repeat() {
    // let rating = new model.Rating();
    let f = new model.FSRS;
    let card = new model.Card;
    let now = new Date(2022, 10, 29, 12, 30, 0, 0);
    let scheduling_cards = f.repeat(card, now);

    console.log(scheduling_cards);

    card = scheduling_cards[2].card;
    now = card.due;
    scheduling_cards = f.repeat(card, now);
    console.log(scheduling_cards);

    card = scheduling_cards[2].card;
    now = card.due;
    scheduling_cards = f.repeat(card, now);
    console.log(scheduling_cards);


    //     card = scheduling_cards[rating.Good].card;
    //     now = card.due;
    //     scheduling_cards = f.repeat(card, now);
    //     console.log(scheduling_cards);

    //     card = scheduling_cards[rating.Again].card;
    //     now = card.due;
    //     scheduling_cards = f.repeat(card, now);
    //     console.log(scheduling_cards);

    //     card = scheduling_cards[rating.Good].card;
    //     now = card.due;
    //     scheduling_cards = f.repeat(card, now);
    //     console.log(scheduling_cards);
}

test_repeat();

console.log(Card)