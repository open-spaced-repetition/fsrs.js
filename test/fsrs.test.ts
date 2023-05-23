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
        expect(FSRS.p.w).toEqual([1.0, 1.0, 5.0, -0.5, -0.5, 0.2, 1.4, -0.12, 0.8, 2.0, -0.2, 0.2, 1.0]);
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