class Params {
    request_retention: number;
    maximum_interval: number;
    easy_bonus: number;
    hard_factor: number;
    w: number[];

    constructor() {
        this.request_retention = 0.9;
        this.maximum_interval = 36500;
        this.easy_bonus = 1.3;
        this.hard_factor = 1.2;
        this.w = [1.0, 1.0, 5.0, -0.5, -0.5, 0.2, 1.4, -0.12, 0.8, 2.0, -0.2, 0.2, 1.0];
    }
}

class State {
    New: number = 0;
    Learning: number = 1;
    Review: number = 2;
    Relearning: number = 3;
}

class Rating {
    Again: number = 0;
    Hard: number = 1;
    Good: number = 2;
    Easy: number = 3;
}

class ReviewLog {
    rating: number;
    elapsed_days: number;
    scheduled_days: number;
    review: Date;
    state: number;

    constructor(rating: number, elapsed_days: number, scheduled_days: number, review: Date, state: number) {
        this.rating = rating;
        this.elapsed_days = elapsed_days;
        this.scheduled_days = scheduled_days;
        this.review = review;
        this.state = state;
    }
}

class Card {
    due: Date;
    stability: number;
    difficulty: number;
    elapsed_days: number;
    scheduled_days: number;
    reps: number;
    lapses: number;
    state: number;
    last_review!: Date;

    constructor() {
        this.due = new Date();
        this.stability = 0;
        this.difficulty = 0;
        this.elapsed_days = 0;
        this.scheduled_days = 0;
        this.reps = 0;
        this.lapses = 0;
        this.state = new State().New;
    }
}

class SchedulingInfo {
    card: Card;
    review_log: ReviewLog;

    constructor(card: Card, review_log: ReviewLog) {
        this.card = card;
        this.review_log = review_log;
    }
}

class SchedulingCards {
    again: Card;
    hard: Card;
    good: Card;
    easy: Card;

    constructor(card: Card) {
        this.again = card;
        this.hard = card;
        this.good = card;
        this.easy = card;
    }

    update_state(state: number) {
        if (state == new State().New) {
            this.again.state = new State().Learning;
            this.hard.state = new State().Learning;
            this.good.state = new State().Learning;
            this.easy.state = new State().Review;
            this.again.lapses += 1;
        } else if (state == new State().Learning || state == new State().Relearning) {
            this.again.state = state;
            this.hard.state = new State().Review;
            this.good.state = new State().Review;
            this.easy.state = new State().Review;
        } else if (state == new State().Review) {
            this.again.state = new State().Relearning;
            this.hard.state = new State().Review;
            this.good.state = new State().Review;
            this.easy.state = new State().Review;
            this.again.lapses += 1;
        }
    }

    schedule(now: Date, hard_interval: number, good_interval: number, easy_interval: number) {
        this.again.scheduled_days = 0;
        this.hard.scheduled_days = hard_interval;
        this.good.scheduled_days = good_interval;
        this.easy.scheduled_days = easy_interval;
        this.again.due = new Date(now.getTime() + 5 * 60 * 1000);
        this.hard.due = new Date(now.getTime() + hard_interval * 24 * 60 * 60 * 1000);
        this.good.due = new Date(now.getTime() + good_interval * 24 * 60 * 60 * 1000);
        this.easy.due = new Date(now.getTime() + easy_interval * 24 * 60 * 60 * 1000);
    }

    record_log(card: Card, now: Date) {
        return {
            [new Rating().Again]: new SchedulingInfo(this.again, new ReviewLog(new Rating().Again, this.again.scheduled_days, card.elapsed_days, now, card.state)),
            [new Rating().Hard]: new SchedulingInfo(this.hard, new ReviewLog(new Rating().Hard, this.hard.scheduled_days, card.elapsed_days, now, card.state)),
            [new Rating().Good]: new SchedulingInfo(this.good, new ReviewLog(new Rating().Good, this.good.scheduled_days, card.elapsed_days, now, card.state)),
            [new Rating().Easy]: new SchedulingInfo(this.easy, new ReviewLog(new Rating().Easy, this.easy.scheduled_days, card.elapsed_days, now, card.state))
        };
    }
}

class FSRS {
    p: Params;

    constructor() {
        this.p = new Params();
    }

    init_difficulty(r: number) {
        return Math.min(Math.max(this.p.w[2] + this.p.w[3] * (r - 2), 1), 10)
    }

    init_stability(r: number) {
        return Math.max(this.p.w[0] + this.p.w[1] * r, 0.1)
    }

    init_ds(s: SchedulingCards) {
        s.again.difficulty = this.init_difficulty(new Rating().Again);
        s.again.stability = this.init_stability(new Rating().Again);
        s.hard.difficulty = this.init_difficulty(new Rating().Hard);
        s.hard.stability = this.init_stability(new Rating().Hard);
        s.good.difficulty = this.init_difficulty(new Rating().Good);
        s.good.stability = this.init_stability(new Rating().Good);
        s.easy.difficulty = this.init_difficulty(new Rating().Easy);
        s.easy.stability = this.init_stability(new Rating().Easy);
    }

    mean_reversion(init: number, current: number) {
        return this.p.w[5] * init + (1 - this.p.w[5]) * current;
    }

    next_difficulty(d: number, r: number) {
        let next_d = d + this.p.w[4] * (r - 2);
        return Math.min(Math.max(this.mean_reversion(this.p.w[2], next_d), 1), 10);
    }

    next_forget_stability(d: number, s: number, r: number) {
        return this.p.w[9] * Math.pow(d, this.p.w[10]) * Math.pow(s, this.p.w[11]) * Math.exp((1 - r) * this.p.w[12]);
    }

    next_recall_stability(d: number, s: number, r: number) {
        return s * (1 + Math.exp(this.p.w[6]) * (11 - d) * Math.pow(s, this.p.w[7]) * (Math.exp((1 - r) * this.p.w[8]) - 1));
    }

    next_interval(s: number) {
        return Math.min(Math.max(Math.round(s * Math.log(this.p.request_retention) / Math.log(0.9)), 1), this.p.maximum_interval);
    }

    next_ds(s: SchedulingCards, last_d: number, last_s: number, retrievability: number) {
        s.again.difficulty = this.next_difficulty(last_d, new Rating().Again);
        s.again.stability = this.next_forget_stability(s.again.difficulty, last_s, retrievability);
        s.hard.difficulty = this.next_difficulty(last_d, new Rating().Hard);
        s.hard.stability = this.next_recall_stability(s.hard.difficulty, last_s, retrievability);
        s.good.difficulty = this.next_difficulty(last_d, new Rating().Good);
        s.good.stability = this.next_recall_stability(s.good.difficulty, last_s, retrievability);
        s.easy.difficulty = this.next_difficulty(last_d, new Rating().Easy);
        s.easy.stability = this.next_recall_stability(s.easy.difficulty, last_s, retrievability);
    }

    repeat(card: Card, now: Date) {
        if (card.state == new State().New) {
            card.elapsed_days = 0;
        } else {
            card.elapsed_days = (now.getTime() - card.last_review.getTime()) / 86400000;
        }

        card.last_review = now;
        card.reps += 1;

        let s = new SchedulingCards(card);
        s.update_state(card.state);

        if (card.state == new State().New) {
            this.init_ds(s);
            s.again.due = new Date(now.getTime() + 60000);
            s.hard.due = new Date(now.getTime() + 300000);
            s.good.due = new Date(now.getTime() + 600000);

            let easy_interval = this.next_interval(s.easy.stability * this.p.easy_bonus);
            s.easy.scheduled_days = easy_interval;
            s.easy.due = new Date(now.getTime() + easy_interval * 86400000);
        } else if (card.state == new State().Learning || card.state == new State().Relearning) {
            let hard_interval = this.next_interval(s.hard.stability);
            let good_interval = Math.max(this.next_interval(s.good.stability), hard_interval + 1);
            let easy_interval = Math.max(this.next_interval(s.easy.stability * this.p.easy_bonus), good_interval + 1);

            s.schedule(now, hard_interval, good_interval, easy_interval);
        } else if (card.state == new State().Review) {
            let interval = card.elapsed_days;
            let last_d = s.easy.difficulty;
            let last_s = s.easy.stability;
            let retrievability = Math.exp(Math.log(0.9) * interval / last_s);

            this.next_ds(s, last_d, last_s, retrievability);

            let hard_interval = this.next_interval(last_s * this.p.hard_factor);
            let good_interval = this.next_interval(s.good.stability);

            hard_interval = Math.min(hard_interval, good_interval)
            good_interval = Math.max(good_interval, hard_interval + 1);

            let easy_interval = Math.max(this.next_interval(s.easy.stability * this.p.hard_factor), good_interval + 1);

            s.schedule(now, hard_interval, good_interval, easy_interval);
        }

        return s.record_log(card, now);
    }
}

export { Params, Rating, Card, FSRS };