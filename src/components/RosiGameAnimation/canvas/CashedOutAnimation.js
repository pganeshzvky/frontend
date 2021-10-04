import * as PIXI from 'pixi.js';
import TWEEN from '@tweenjs/tween.js';
import { isMobileRosiGame } from './utils';

const AMOUNT_TEXT_FILL_COLOR = 0x00de1e;
const AMOUNT_TEXT_FONT_FAMILY = 'Arial';
const CRASH_FACTOR_FILL_COLOR = 0xefff54;
const CRASH_FACTOR_FONT_FAMILY = 'Arial';
const DESIRED_FONT_SIZE = 13;
const FONT_SIZE = DESIRED_FONT_SIZE * 2;
const TEXT_SCALE = DESIRED_FONT_SIZE / FONT_SIZE;
const COIN_DEFAULT_SCALE = isMobileRosiGame ? 0.5 : 0.3;

class Animation {
  constructor(app) {
    this.app = app;
    this.vx = 0;
    this.vy = 0;
    this.container = new PIXI.Container();

    const [coin, coinTween] = this.createCoin();
    this.coin = coin;
    this.coinTween = coinTween;

    const [amountText, amountTextTween] = this.createAmountText();
    this.amountText = amountText;
    this.amountTextTween = amountTextTween;

    this.crashFactorText = this.createCashFactorText();
  }

  createAmountText() {
    const amountText = new PIXI.BitmapText('0W', {
      fontName: 'AmountTextBitmapFont',
    });

    amountText.defaultScale = TEXT_SCALE;
    amountText.scale.set(amountText.defaultScale);
    amountText.anchor.set(0.5);
    amountText.visible = false;
    this.container.addChild(amountText);

    const tweenTime = 900;
    const tweenData = { scale: 0 };
    const amountTextTween = new TWEEN.Tween(tweenData)
      .to({ scale: amountText.defaultScale }, tweenTime)
      .easing(TWEEN.Easing.Back.Out)
      .onStart(() => {
        amountText.scale.set(0);
        tweenData.scale = 0;
        amountText.visible = true;
      })
      .onUpdate(() => {
        amountText.scale.set(tweenData.scale);
      });

    return [amountText, amountTextTween];
  }

  createCashFactorText() {
    const crashFactorText = new PIXI.BitmapText('0.00x', {
      fontName: 'FactorTextBitmapFont',
    });

    crashFactorText.defaultScale = TEXT_SCALE;
    crashFactorText.scale.set(crashFactorText.defaultScale);
    crashFactorText.anchor.set(0.5);

    this.container.addChild(crashFactorText);

    return crashFactorText;
  }

  createCoin() {
    const tweenTime = 700;

    const coin = new PIXI.Sprite(this.app.loader.resources.coin.texture);
    coin.x = 0;
    coin.y = 0;
    coin.anchor.set(0.5);
    coin.scale.set(COIN_DEFAULT_SCALE);
    this.container.addChild(coin);

    const tweenData = { scale: 0 };
    const coinTween = new TWEEN.Tween(tweenData)
      .to({ scale: COIN_DEFAULT_SCALE }, tweenTime)
      .easing(TWEEN.Easing.Back.Out)
      .onStart(() => {
        tweenData.scale = 0;
        coin.scale.set(0);
      })
      .onUpdate(() => {
        coin.scale.set(tweenData.scale);
      });

    return [coin, coinTween];
  }

  positionElements(x, y, textOrientation = 'bottom') {
    const plusOrMinus = textOrientation === 'bottom' ? 1 : -1;
    this.amountText.y = this.coin.height * plusOrMinus;
    this.crashFactorText.y =
      this.amountText.y + this.amountText.height * plusOrMinus;

    // move whole cointainer to the crash point
    this.container.x = x;
    this.container.y = y;
  }

  setTextValues(amount, crashFactor) {
    this.amountText.text = `${amount}W`;
    this.crashFactorText.text = `${crashFactor}x`;
  }

  scaleInAnimation() {
    this.amountText.scale.set(this.amountText.defaultScale);
    this.coin.scale.set(0);
    this.coinTween.start();
    this.amountTextTween.start();
    this.container.visible = true;
  }

  reset() {
    this.amountText.scale.set(this.amountText.defaultScale);
    this.amountText.visible = false;
    this.coin.scale.set(COIN_DEFAULT_SCALE);
    this.container.visible = false;
  }

  setVelocity(vx, vy) {
    this.vx = vx;
    this.vy = vy;
  }

  update(dt, speed) {
    this.container.x -= this.vx * speed * dt;
    this.container.y -= this.vy * speed * dt;
  }

  getWidth() {
    return this.container.width;
  }

  getX() {
    return this.container.x;
  }
}

class CashedOutAnimation {
  constructor(app) {
    this.app = app;
    this.container = new PIXI.Container();
    this.currentAnims = [];
    this.cachedAnims = [];
    this.currentTextOrientation = 'bottom';

    PIXI.BitmapFont.from(
      'AmountTextBitmapFont',
      {
        fontFamily: AMOUNT_TEXT_FONT_FAMILY,
        fontSize: FONT_SIZE,
        fill: AMOUNT_TEXT_FILL_COLOR,
        fontWeight: 'bold',
      },
      { chars: [...PIXI.BitmapFont.NUMERIC, '.', ',', 'W'] }
    );

    PIXI.BitmapFont.from(
      'FactorTextBitmapFont',
      {
        fontFamily: CRASH_FACTOR_FONT_FAMILY,
        fontSize: FONT_SIZE,
        fill: CRASH_FACTOR_FILL_COLOR,
        fontWeight: '700',
      },
      { chars: [...PIXI.BitmapFont.NUMERIC, '.', ',', 'x'] }
    );
  }

  animate(x, y, amount, crashFactor, velocity) {
    const previousAnimX =
      this.currentAnims.length > 0
        ? this.currentAnims[this.currentAnims.length - 1].getX()
        : 0;

    let anim;

    if (this.cachedAnims.length > 0) {
      anim = this.cachedAnims.pop();
    } else {
      anim = new Animation(this.app);
      this.container.addChild(anim.container);
    }

    anim.setVelocity(velocity.x, velocity.y);
    this.currentAnims.push(anim);

    anim.setTextValues(amount, crashFactor);

    const spaceBetween = 4;
    const isSmallDistanceBetweenCrashes =
      x - previousAnimX - spaceBetween <= anim.getWidth();
    if (isSmallDistanceBetweenCrashes) {
      this.currentTextOrientation =
        this.currentTextOrientation === 'bottom' ? 'top' : 'bottom';
    } else {
      this.currentTextOrientation = 'bottom';
    }

    anim.positionElements(x, y, this.currentTextOrientation);
    anim.scaleInAnimation();
  }

  reset() {
    this.cachedAnims = this.currentAnims.slice();
    this.currentAnims = [];
    this.currentTextOrientation = 'bottom';

    for (const anim of this.cachedAnims) {
      anim.reset();
    }
  }

  update(dt, speed) {
    for (const anim of this.currentAnims) {
      anim.update(dt, speed);
    }
  }
}

export default CashedOutAnimation;
