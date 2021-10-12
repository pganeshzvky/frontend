import { ROSI_GAME_MAX_DURATION_SEC } from 'constants/RosiGame';
import * as PIXI from 'pixi.js';
import { calcPercent, isMobileRosiGame } from './utils';

export class CoinAnimation {
  constructor(app) {
    this.app = app;
    this.container = new PIXI.Container();

    this.trajectory = new PIXI.Graphics();
    this.container.addChild(this.trajectory);

    this.elonAndCoin = new PIXI.Container();
    this.container.addChild(this.elonAndCoin);

    this.coin = new PIXI.Sprite(this.app.loader.resources.coin.texture);
    this.elonAndCoin.addChild(this.coin);

    const spritesheet =
      this.app.loader.resources['elon-coin-animation'].spritesheet;
    this.elon = new PIXI.AnimatedSprite(Object.values(spritesheet.textures));
    this.elon.x = -92 / (isMobileRosiGame ? 2 : 1);
    this.elon.y = -111 / (isMobileRosiGame ? 2 : 1);
    this.elonAndCoin.addChild(this.elon);

    this.elonAndCoindAnimationHandle = null;
    this.elonAfterExplosionAnimationHandle = null;

    this.setCoinDefaultPosition();

    this.container.visible = false;
    this.ySegments = [];
  }

  getCurrentElonFrame() {
    return this.elon.currentFrame;
  }

  getElonFramesCount() {
    return this.elon.totalFrames;
  }

  advanceElonAnim() {
    if (this.elon.currentFrame + 1 < this.elon.totalFrames) {
      this.elon.gotoAndStop(this.elon.currentFrame + 1);
    }
  }

  setElonFrame(frame) {
    if (frame <= this.elon.totalFrames) {
      this.elon.gotoAndStop(frame);
    }
  }

  setCoinDefaultPosition() {
    this.elonAndCoin.scale.set(1);
    this.elonAndCoin.x = 0;
    this.elonAndCoin.y = this.app.renderer.height - this.coin.height / 2;
  }

  getCoinExplosionPosition() {
    const coinGlobalPos = this.coin.toGlobal(this.coin.position);
    return {
      x: coinGlobalPos.x + this.coin.width / 2,
      y: coinGlobalPos.y + this.coin.height / 2,
    };
  }

  getCoinCrashPosition() {
    const coinGlobalPos = this.coin.toGlobal(this.coin.position);
    return {
      x: coinGlobalPos.x,
      y: coinGlobalPos.y + this.coin.height,
    };
  }

  startCoinFlyingAnimation() {
    this.container.visible = true;
    this.resetAllAnimations();
    this.setCoinDefaultPosition();

    this.prevCrashFactor = 1;
    this.prevElapsedTime = 0;
    this.incCount = 0;

    /* Coin and Elon */
    // const destX = calcPercent(this.app.renderer.width, 90);
    // const destY = calcPercent(this.app.renderer.height, 35);
    this.destX = this.app.renderer.width;
    this.destY = 0;
    const distanceX = this.destX - this.elonAndCoin.x;
    const distanceY = this.destY - this.elonAndCoin.y;
    const length = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
    const vx = distanceX / length;
    const vy = distanceY / length;
    const defaultSpeed = length / (ROSI_GAME_MAX_DURATION_SEC * 100);
    // start with higher speed for the boost effect
    // let speed = defaultSpeed * 170;
    let speed = 0;
    this.elonAndCoin.x = this.app.renderer.width - this.coin.width;
    this.elonAndCoin.y = this.elonAndCoin.height / 2;

    // save for later elon flying animation after coin explosion
    this.elonAndCoin.vx = vx;
    this.elonAndCoin.vy = vy;
    this.elonAndCoin.speed = speed;
    this.elonAndCoin.defaultSpeed = defaultSpeed;
  }

  update(dt, elapsedTime, crashFactor) {
    const vx = this.elonAndCoin.vx;
    const vy = this.elonAndCoin.vy;
    const defaultSpeed = this.elonAndCoin.defaultSpeed;
    const coinPos = this.getCoinCrashPosition();
    // this.elonAndCoin.visible = false;
    this.elon.visible = false;

    if (this.elonAndCoin.x < this.destX || this.elonAndCoin.y > this.destY) {
      this.elonAndCoin.x += vx * this.elonAndCoin.speed * dt;
      this.elonAndCoin.y += vy * this.elonAndCoin.speed * dt;
    }

    // let x = 0;
    // let y = this.app.renderer.height - (1 * this.app.renderer.height) / 10;

    const startX = 0;
    const startY = this.app.renderer.height;

    // console.log(elapsedTime, crashFactor);

    // x += vx * this.elonAndCoin.speed * dt;
    // y += vy * this.elonAndCoin.speed * dt;
    // x = calcX(elapsedTime, crashFactor, crashFactor, 1);
    // y = calcY(elapsedTime, crashFactor, elapsedTime, 1);

    // this.trajectory.lineStyle(2, 0x7300d8, 1);
    // this.trajectory.moveTo(this.prev_x || startX, this.prev_y || startY);
    // this.trajectory.lineTo(x, this.app.renderer.height - y);
    // this.trajectory.scale.set(scaleX, scaleY);

    // this.prev_x = x;
    // this.prev_y = this.app.renderer.height - y;

    // if (!this.drawn) {
    //   this.trajectory.bezierCurveTo(
    //     this.app.renderer.width,
    //     this.app.renderer.height,
    //     this.app.renderer.width,
    //     this.app.renderer.height - ((10 - 1) * this.app.renderer.height) / (10 - 1),
    //     this.app.renderer.width,
    //     this.app.renderer.height - ((10 - 1) * this.app.renderer.height) / (10 - 1),
    //   )

    //   this.drawn = true;
    // }

    // if (this.elonAndCoin.speed > defaultSpeed) {
    //   this.elonAndCoin.speed -= defaultSpeed * 2.5 * dt; // 8 is a magic number...
    // } else {
    //   // this.elonAndCoin.speed = defaultSpeed;
    //   this.elonAndCoin.speed = 0;
    // }

    // if (crashFactor - this.prevCrashFactor >= 0.01) {
    //   this.xSegments.push(elapsedTime);
    //   this.prevCrashFactor = crashFactor;
    // }

    const colors = [0x7300d8, 0x7300d8];

    this.segments = this.segments || 0;
    this.prevElapsedTime = this.prevElapsedTime || 0;

    let step = 0.1;

    if (elapsedTime - this.prevElapsedTime >= step) {
      console.log(
        elapsedTime,
        elapsedTime - this.prevElapsedTime,
        this.segments
      );
      this.segments += 1;
      this.ySegments.push(crashFactor - this.prevCrashFactor);
      this.prevElapsedTime = elapsedTime;
      this.prevCrashFactor = crashFactor;
    }

    this.trajectory.clear();

    const sw = coinPos.x;
    const sh = this.app.renderer.height;
    const scaleY = sh / (crashFactor - 1);
    let countY = 0;
    let prevX = 0;
    let prevY = 0;
    let prevXScreen = 0;
    let prevYScreen = sh / 2 + coinPos.y / 2;

    for (let i = 0; i < this.segments; i++) {
      const segmentWidth = elapsedTime / this.segments;
      const x = prevX + segmentWidth;
      // const y = prevY + this.ySegments[i];
      const y = prevY + 0.01;

      const Pcx = 0;
      const Pcy = 0;
      const scaleX = (sw * 2) / (-elapsedTime - x);

      const toScreenX = (x, Pcx, scaleX) =>
        sw / 2 + (-x - Pcx) * scaleX - sw / 2;
      const toScreenY = (y, Pcy, scaleY) =>
        sh / 2 - (y - Pcy) * scaleY + coinPos.y / 2;

      const xScreen = toScreenX(x, Pcx, scaleX);
      const yScreen = toScreenY(y, Pcy, scaleY);

      this.trajectory.lineStyle(2, colors[Math.floor(i % 2)], 1);
      this.trajectory.moveTo(prevXScreen, prevYScreen);

      if (countY === 2) {
        this.trajectory.lineTo(xScreen, yScreen);

        prevY = y;
        countY = 0;
      } else {
        this.trajectory.lineTo(xScreen, prevYScreen);
        countY += 1;
      }

      prevX = x;
      prevXScreen = toScreenX(prevX, Pcx, scaleX);
      prevYScreen = toScreenY(prevY, Pcy, scaleY);
    }

    return;

    //const colors = [0xff0000, 0x7300d8];

    //this.trajectory.clear();

    //const scaleY = coinPos.y / (crashFactor - 1);
    //const segments = Math.trunc((crashFactor - 1) * 100);
    //let prevX = 0;

    //for (let i = 0; i < segments; i++) {
    //  const segmentTime = this.xSegments[i];
    //  const Pcy = 0;
    //  const Pcx = (-elapsedTime) / 2;
    //  const scaleX = (coinPos.x) / (-elapsedTime - i);
    //  const y = coinPos.y / 2 - ((1 + i * 0.01) - Pcy) * scaleY + scaleY + coinPos.y;
    //  const x = coinPos.x / 2 - (-elapsedTime - Pcx) * scaleX + coinPos.x / 2;
    //  //
    //  // const scaleX = (coinPos.x) / (-elapsedTime - i);
    //  // const y = this.app.renderer.height;
    //  // const x = coinPos.x / 2 - (-elapsedTime - Pcx) * scaleX + coinPos.x / 2;

    //  if (i === -1) {
    //    console.log(x - prevX)
    //    return;
    //    console.log(`
    //      y: ${y}
    //      scaleY: ${scaleY}
    //      segmentTime: ${segmentTime}
    //    `)
    //  }

    //  this.trajectory.lineStyle(4, colors[Math.floor(i % 2)], 1);
    //  this.trajectory.moveTo(prevX, y);
    //  this.trajectory.lineTo(x, y);

    //  prevX = x;
    //}
  }

  endCoinFlyingAnimation() {
    if (this.elonAndCoindAnimationHandle) {
      this.app.ticker.remove(this.elonAndCoindAnimationHandle);
      this.elonAndCoindAnimationHandle = null;
    }

    this.coin.alpha = 0;
    this.elon.alpha = 0;
  }

  startElonAfterExplosionAnimation() {
    // const rotationSpeed = 0.005;
    // For the sake of simplicty animate elonAndCoin container instead of just elon.
    // Coin is hidden anyway and positions are already being reset before next animation.
    // const update = dt => {
    //   this.elonAndCoin.rotation += rotationSpeed * dt;
    //   this.elonAndCoin.x += this.elonAndCoin.vx * this.elonAndCoin.speed * dt;
    //   this.elonAndCoin.y += this.elonAndCoin.vy * this.elonAndCoin.speed * dt;
    // };
    // this.elonAfterExplosionAnimationHandle = update;
    // this.app.ticker.add(update);
  }

  resetAllAnimations() {
    if (this.elonAndCoindAnimationHandle) {
      this.app.ticker.remove(this.elonAndCoindAnimationHandle);
      this.elonAndCoindAnimationHandle = null;
    }

    if (this.elonAfterExplosionAnimationHandle) {
      this.app.ticker.remove(this.elonAfterExplosionAnimationHandle);
      this.elonAfterExplosionAnimationHandle = null;
    }

    this.coin.alpha = 1;
    this.elon.alpha = 1;
    this.elonAndCoin.rotation = 0;
    this.elon.gotoAndStop(0);
    // this.trajectory.clear();
  }

  getCurrentVelocty() {
    return {
      x: this.elonAndCoin.vx,
      y: this.elonAndCoin.vy,
    };
  }
}
