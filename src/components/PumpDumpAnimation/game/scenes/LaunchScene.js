import { ASSET_LIST } from "components/PumpDumpAnimation/config";
import { Container, Sprite } from "pixi.js";
import { PumpDumpGameMananger } from "../PumpDumpGameManager";
import TWEEN from '@tweenjs/tween.js';

export class LaunchScene extends Container {
    tweets = [];
    finalPositions = [];
    gap = 0;
    count = 0;

    constructor(launchTime, audioManager) {
        super();
        const resources = PumpDumpGameMananger.app.loader.resources;
        const width = PumpDumpGameMananger.width;
        const height = PumpDumpGameMananger.height;

        const tweetScale = 0.25;

        for (let i = 0; i < 5; ++i) {
            this.tweets[i] = new Sprite(resources[ASSET_LIST[`TWEET_${i + 1}`]].texture);
            this.tweets[i].scale.set(tweetScale);
            this.tweets[i].position.set(width * 1.5, height * 0.75);
            this.tweets[i].anchor.set(0.5, 0.5);
        }
        this.addChild(...this.tweets);

        const count = this.getPossibleTweetCount(width);
        const gap = this.getTweetGap(width, count);
        this.arrangeTweets(count, gap);

        this.count = count;
        this.gap = gap;
        this.startAnimation(count, 0, launchTime);
        console.warn('launchTime', launchTime);

    }

    stop() {

    }

    handleEndGame() {
        
    }

    getPossibleTweetCount(width) {
        const count = Math.floor(width / this.tweets[0].width);
        console.warn('count', count);
        return count;
    }

    getTweetGap(width, count) {
        let gap = width - (this.tweets[0].width * count);
        gap /= (count + 1);
        return gap;
    }

    arrangeTweets(count, gap) {
        const height = PumpDumpGameMananger.height;
        const width = PumpDumpGameMananger.width;

        for (let i = 0; i < 5; ++i) {
            if (i < count) {
                this.tweets[i].position.set(gap + this.tweets[i].width * 0.5 + (this.tweets[i].width + gap) * i, height * 0.75);
                this.finalPositions[i] = this.tweets[i].x;

                // position to the right of the screen out of view.
                this.tweets[i].x = width * 1.5;
            } else {
                this.tweets[i].visible = false;
            }
        }
    }

    // Tweet emerge from right to the center
    startAnimation(count, current, launchTime) {

        let width = PumpDumpGameMananger.width;
        const moveData = { x: this.tweets[current].x };

        const posX = current === 0 ? width * 0.5 : this.tweets[current - 1].x + this.tweets[current - 1].width + this.gap;

        this.moveTween = new TWEEN.Tween(moveData)
            .to({ x: posX }, launchTime / ((count * 2) - 1))
            .onUpdate(() => {
                this.tweets[current].x = moveData.x;
                if (moveData.x === posX && current < count) {
                    if ((current === 0 && count !== 2) || current > Math.floor(count / 2)) {
                        this.startAnimation(count, current + 1, launchTime);
                    } else if (current === 0 && count === 2) {
                        this.secondMoveSequenceAnimation(count, current + 1, launchTime);
                    } else {
                        this.secondMoveSequenceAnimation(count, current, launchTime);
                    }

                }
            })
            .easing(TWEEN.Easing.Quintic.Out)
            // .delay(500)
            .start();
    }

    secondMoveSequenceAnimation(count, current, launchTime) {
        // Tween to final positions
        if (current === count - 1) {
            for (let i = 0; i <= current; ++i) {
                const nextPosX = this.finalPositions[i];
                const nextMoveData = { x: this.tweets[i].x };
                new TWEEN.Tween(nextMoveData)
                    .to({ x: nextPosX }, launchTime / ((count * 2) - 1))
                    .onUpdate(() => {
                        this.tweets[i].x = nextMoveData.x;
                        if (nextMoveData.x === nextPosX && i === current) {
                            this.startAnimation(count, current + 1, launchTime, true);
                        }
                    })
                    .easing(TWEEN.Easing.Quintic.Out)
                    .start();
            }
        // Tween to intermediary positions
        } else {
            for (let i = 0; i <= current; ++i) {
                const nextPosX = this.tweets[i].x - (this.tweets[i].width + this.gap);
                const nextMoveData = { x: this.tweets[i].x };
                new TWEEN.Tween(nextMoveData)
                    .to({ x: nextPosX }, launchTime / ((count * 2) - 1))
                    .onUpdate(() => {
                        this.tweets[i].x = nextMoveData.x;
                        if (nextMoveData.x === nextPosX && i === current) {
                            this.startAnimation(count, current + 1, launchTime, true);
                        }
                    })
                    .easing(TWEEN.Easing.Quintic.Out)
                    .start();
            }
        }
        
    }

    // tweet emerge from bottom
    // startAnimation(count, current, launchTime) {

    //     let height = PumpDumpGameMananger.height;
    //     const moveData = { x: this.tweets[current].x, y: this.tweets[current].y };
    //     this.moveTween = new TWEEN.Tween(moveData)
    //         .to({ x: moveData.x, y: height * 0.75 }, launchTime / count)
    //         .onUpdate(() => {
    //             this.tweets[current].y = moveData.y;
    //             if (moveData.y === height * 0.75 && current < count) {
    //                 this.startAnimation(count, current + 1, launchTime);
    //             }
    //         })
    //         .easing(TWEEN.Easing.Quintic.Out)
    //         // .delay(500)
    //         .start();
    // }

    update(delta) {
    }
}