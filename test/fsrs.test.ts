import * as model from "../src";
import { Rating } from "../src";
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
    f.p.w = [1.14, 1.01, 5.44, 14.67, 5.3024, 1.5662, 1.2503, 0.0028, 1.5489, 0.1763, 0.9953, 2.7473, 0.0179, 0.3105, 0.3976, 0.0, 2.0902];
    let card = new model.Card;
    let now = new Date(2022, 10, 29, 12, 30, 0, 0);
    let scheduling_cards = f.repeat(card, now);

    console.log(scheduling_cards);
    let ratings = [Rating.Good, Rating.Good, Rating.Good, Rating.Good, Rating.Good, Rating.Good, Rating.Again, Rating.Again, Rating.Good, Rating.Good, Rating.Good, Rating.Good, Rating.Good]
    let ivl_history = new Array<number>();

    for (let i = 0; i < ratings.length; i++) {
        card = scheduling_cards[ratings[i]].card;
        ivl_history.push(card.scheduled_days);
        now = card.due;
        scheduling_cards = f.repeat(card, now);
        console.log(scheduling_cards);
    }

    console.log(ivl_history);
    expect(ivl_history).toEqual([0, 5, 16, 43, 106, 236, 0, 0, 12, 25, 47, 85, 147]);
}

test_repeat();

console.log(Card)