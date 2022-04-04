/*
 * Name          : joy.js
 * @author       : Roberto D'Amico (Bobboteck)
 * Last modified : 09.06.2020
 * Revision      : 1.1.6
 *
 * Modification History:
 * Date         Version     Modified By     Description
 * 2021-12-21   2.0.0       Roberto D'Amico New version of the project that integrates the callback functions, while 
 *                                          maintaining compatibility with previous versions. Fixed Issue #27 too, 
 *                                          thanks to @artisticfox8 for the suggestion.
 * 2020-06-09   1.1.6       Roberto D'Amico Fixed Issue #10 and #11
 * 2020-04-20   1.1.5       Roberto D'Amico Correct: Two sticks in a row, thanks to @liamw9534 for the suggestion
 * 2020-04-03               Roberto D'Amico Correct: InternalRadius when change the size of canvas, thanks to 
 *                                          @vanslipon for the suggestion
 * 2020-01-07   1.1.4       Roberto D'Amico Close #6 by implementing a new parameter to set the functionality of 
 *                                          auto-return to 0 position
 * 2019-11-18   1.1.3       Roberto D'Amico Close #5 correct indication of East direction
 * 2019-11-12   1.1.2       Roberto D'Amico Removed Fix #4 incorrectly introduced and restored operation with touch 
 *                                          devices
 * 2019-11-12   1.1.1       Roberto D'Amico Fixed Issue #4 - Now JoyStick work in any position in the page, not only 
 *                                          at 0,0
 * 
 * The MIT License (MIT)
 *
 *  This file is part of the JoyStick Project (https://github.com/bobboteck/JoyStick).
 *	Copyright (c) 2015 Roberto D'Amico (Bobboteck).
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


export let StickStatus =
  {
    xPosition: 0,
    yPosition: 0,
    x: 0,
    y: 0,
    cardinalDirection: "C"
  };

/**
 * @desc Principal object that draw a joystick, you only need to initialize the object and suggest the HTML container
 * @constructor
 * @param container {String} - HTML object that contains the Joystick
 * @param parameters (optional) - object with following keys:
 *  title {String} (optional) - The ID of canvas (Default value is 'joystick')
 *  width {Int} (optional) - The width of canvas, if not specified is setted at width of container object (Default value is the width of container object)
 *  height {Int} (optional) - The height of canvas, if not specified is setted at height of container object (Default value is the height of container object)
 *  internalFillColor {String} (optional) - Internal color of Stick (Default value is '#00AA00')
 *  internalLineWidth {Int} (optional) - Border width of Stick (Default value is 2)
 *  internalStrokeColor {String}(optional) - Border color of Stick (Default value is '#003300')
 *  externalLineWidth {Int} (optional) - External reference circonference width (Default value is 2)
 *  externalStrokeColor {String} (optional) - External reference circonference color (Default value is '#008000')
 *  autoReturnToCenter {Bool} (optional) - Sets the behavior of the stick, whether or not, it should return to zero position when released (Default value is True and return to zero)
 * @param callback {StickStatus} -
 */
export default class JoyStick {
  objContainer: HTMLElement | null = null;
  canvas: HTMLCanvasElement | null = null;
  title;
  height;
  width;
  internalRadius!: number;
  directionHorizontalLimitPos!: number;
  directionVerticalLimitPos!: number;
  centerX!: number;
  centerY!: number;
  callback;
  private pressed: number | undefined;
  private readonly internalFillColor: any;
  private readonly internalLineWidth: any;
  private readonly internalStrokeColor: any;
  private readonly externalLineWidth: any;
  private readonly externalStrokeColor: any;
  private readonly autoReturnToCenter: any;
  private circumference!: number;
  private maxMoveStick: any;
  private externalRadius: any;
  private directionHorizontalLimitNeg!: number;
  private directionVerticalLimitNeg!: number;
  private movedX: any;
  private movedY: any;

  constructor(private container: string, parameters?: { title?: any; width?: any; height?: any; internalFillColor?: any; internalLineWidth?: any; internalStrokeColor?: any; externalLineWidth?: any; externalStrokeColor?: any; autoReturnToCenter?: any; } | undefined, callback?: ((StickStatus: any) => void) | undefined) {
    parameters = parameters || {};
    this.title = (typeof parameters.title === "undefined" ? "joystick" : parameters.title)
    this.width = (typeof parameters.width === "undefined" ? 0 : parameters.width)
    this.height = (typeof parameters.height === "undefined" ? 0 : parameters.height)
    this.internalFillColor = (typeof parameters.internalFillColor === "undefined" ? "#00AA00" : parameters.internalFillColor)
    this.internalLineWidth = (typeof parameters.internalLineWidth === "undefined" ? 2 : parameters.internalLineWidth)
    this.internalStrokeColor = (typeof parameters.internalStrokeColor === "undefined" ? "#003300" : parameters.internalStrokeColor)
    this.externalLineWidth = (typeof parameters.externalLineWidth === "undefined" ? 2 : parameters.externalLineWidth)
    this.externalStrokeColor = (typeof parameters.externalStrokeColor === "undefined" ? "#008000" : parameters.externalStrokeColor)
    this.autoReturnToCenter = (typeof parameters.autoReturnToCenter === "undefined" ? true : parameters.autoReturnToCenter)

    this.callback = callback || function(StickStatus) {
    };


    this.start()
  }

  private start() {
// Create Canvas element and add it in the Container object
    this.objContainer = document.getElementById(this.container);

    // Fixing Unable to preventDefault inside passive event listener due to target being treated as passive in Chrome [Thanks to https://github.com/artisticfox8 for this suggestion]
    if(!this.objContainer) throw new Error("Container not found");
    this.objContainer.style.touchAction = "none";

    this.canvas = document.createElement("canvas");
    console.log(this.canvas)
    this.canvas.id = this.title;
    if (this.width === 0) {
      this.width = this.objContainer.clientWidth;
    }
    if (this.height === 0) {
      this.height = this.objContainer.clientHeight;
    }
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.objContainer.appendChild(this.canvas);
    this.context = this.canvas.getContext("2d");

    this.pressed = 0; // Bool - 1=Yes - 0=No
    this.circumference = 2 * Math.PI;
    this.internalRadius = (this.canvas.width - ((this.canvas.width / 2) + 10)) / 2;
    this.maxMoveStick = this.internalRadius + 5;
    this.externalRadius = this.internalRadius + 30;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.directionHorizontalLimitPos = this.canvas.width / 10;
    this.directionHorizontalLimitNeg = this.directionHorizontalLimitPos * -1;
    this.directionVerticalLimitPos = this.canvas.height / 10;
    this.directionVerticalLimitNeg = this.directionVerticalLimitPos * -1;
// Used to save current position of stick
    this.movedX = this.centerX;
    this.movedY = this.centerY;

// Check if the device support the touch or not
    if ("ontouchstart" in document.documentElement) {
      this.canvas.addEventListener("touchstart", this.onTouchStart.bind(this), false);
      document.addEventListener("touchmove", this.onTouchMove.bind(this), false);
      document.addEventListener("touchend", this.onTouchEnd.bind(this), false);
    } else {
      this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this), false);
      document.addEventListener("mousemove", this.onMouseMove.bind(this), false);
      document.addEventListener("mouseup", this.onMouseUp.bind(this), false);
    }
// Draw the object
    this.drawExternal();
    this.drawInternal();

  }


  /******************************************************
   * Private methods
   *****************************************************/
  context: CanvasRenderingContext2D | null = null;

  /**
   * @desc Draw the external circle used as reference position
   */
  drawExternal() {
    if(!this.context) throw new Error("Context not found");
    this.context.beginPath();
    this.context.arc(this.centerX, this.centerY, this.externalRadius, 0, this.circumference, false);
    this.context.lineWidth = this.externalLineWidth;
    this.context.strokeStyle = this.externalStrokeColor;
    this.context.stroke();
  }

  /**
   * @desc Draw the internal stick in the current position the user have moved it
   */
  drawInternal() {
    if(!this.context) throw new Error("Context not found");
    if(!this.canvas) throw new Error("Canvas not found");
    this.context.beginPath();
    if (this.movedX < this.internalRadius) {
      this.movedX = this.maxMoveStick;
    }
    if ((this.movedX + this.internalRadius) > this.canvas.width) {
      this.movedX = this.canvas.width - (this.maxMoveStick);
    }
    if (this.movedY < this.internalRadius) {
      this.movedY = this.maxMoveStick;
    }
    if ((this.movedY + this.internalRadius) > this.canvas.height) {
      this.movedY = this.canvas.height - (this.maxMoveStick);
    }
    this.context.arc(this.movedX, this.movedY, this.internalRadius, 0, this.circumference, false);
    // create radial gradient
    const grd = this.context.createRadialGradient(this.centerX, this.centerY, 5, this.centerX, this.centerY, 200);
    // Light color
    grd.addColorStop(0, this.internalFillColor);
    // Dark color
    grd.addColorStop(1, this.internalStrokeColor);
    this.context.fillStyle = grd;
    this.context.fill();
    this.context.lineWidth = this.internalLineWidth;
    this.context.strokeStyle = this.internalStrokeColor;
    this.context.stroke();
  }

  /**
   * @desc Events for manage touch
   */

  onTouchStart() {
    this.pressed = 1;
  }

  onTouchMove(event: TouchEvent) {
    if(!this.context) throw new Error("Context not found");
    if(!this.canvas) throw new Error("Canvas not found");

    if (this.pressed === 1 && event.targetTouches[0].target === this.canvas) {
      this.movedX = event.targetTouches[0].pageX;
      this.movedY = event.targetTouches[0].pageY;
      // Manage offset
      // @ts-ignore
      if (this.canvas.offsetParent.tagName.toUpperCase() === "BODY") {
        this.movedX -= this.canvas.offsetLeft;
        this.movedY -= this.canvas.offsetTop;
      } else {
        // @ts-ignore
        this.movedX -= this.canvas.offsetParent.offsetLeft;
        // @ts-ignore
        this.movedY -= this.canvas.offsetParent.offsetTop;
      }
      // Delete canvas
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // Redraw object
      this.drawExternal();
      this.drawInternal();

      // Set attribute of callback
      StickStatus.xPosition = this.movedX;
      StickStatus.yPosition = this.movedY;
      StickStatus.x = 100 * ((this.movedX - this.centerX) / this.maxMoveStick);
      StickStatus.y = (100 * ((this.movedY - this.centerY) / this.maxMoveStick)) * -1;
      StickStatus.cardinalDirection = this.getCardinalDirection();
      this.callback(StickStatus);
    }
  }

  onTouchEnd() {
    if(!this.canvas) throw new Error("Canvas not found");
    if(!this.context) throw new Error("Context not found");
    this.pressed = 0;
    // If required reset position store variable
    if (this.autoReturnToCenter) {
      this.movedX = this.centerX;
      this.movedY = this.centerY;
    }
    // Delete canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Redraw object
    this.drawExternal();
    this.drawInternal();

    // Set attribute of callback
    StickStatus.xPosition = this.movedX;
    StickStatus.yPosition = this.movedY;
    StickStatus.x = 100 * ((this.movedX - this.centerX) / this.maxMoveStick);
    StickStatus.y = (100 * ((this.movedY - this.centerY) / this.maxMoveStick)) * -1;
    StickStatus.cardinalDirection = this.getCardinalDirection();
    this.callback(StickStatus);
  }

  /**
   * @desc Events for manage mouse
   */
  onMouseDown() {
    this.pressed = 1;
  }

  /* To simplify this code there was a new experimental feature here: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/offsetX , but it present only in Mouse case not metod presents in Touch case :-( */
  onMouseMove(event: MouseEvent) {
    if(!this.canvas) return;
    if(!this.context) return;
    if (this.pressed === 1) {
      this.movedX = event.pageX;
      this.movedY = event.pageY;
      // Manage offset
      const { offsetParent } = this.canvas;
      if (offsetParent?.tagName.toUpperCase() === "BODY") {
        this.movedX -= this.canvas.offsetLeft;
        this.movedY -= this.canvas.offsetTop;
      } else {
        // @ts-ignore
        this.movedX -= this.canvas.offsetParent.offsetLeft;
        // @ts-ignore
        this.movedY -= this.canvas.offsetParent.offsetTop;
      }
      // Delete canvas
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // Redraw object
      this.drawExternal();
      this.drawInternal();

      // Set attribute of callback
      StickStatus.xPosition = this.movedX;
      StickStatus.yPosition = this.movedY;
      StickStatus.x = 100 * ((this.movedX - this.centerX) / this.maxMoveStick);
      StickStatus.y = (100 * ((this.movedY - this.centerY) / this.maxMoveStick)) * -1;
      StickStatus.cardinalDirection = this.getCardinalDirection();
      this.callback(StickStatus);
    }
  }

  onMouseUp() {
    if(!this.canvas) {
      console.error('Canvas not found')
      return;
    }
    if(!this.context) {
      console.error('Context not found')
      return;
    }
    this.pressed = 0;
    // If required reset position store variable
    if (this.autoReturnToCenter) {
      this.movedX = this.centerX;
      this.movedY = this.centerY;
    }
    // Delete canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Redraw object
    this.drawExternal();
    this.drawInternal();

    // Set attribute of callback
    StickStatus.xPosition = this.movedX;
    StickStatus.yPosition = this.movedY;
    StickStatus.x = 100 * ((this.movedX - this.centerX) / this.maxMoveStick);
    StickStatus.y = (100 * ((this.movedY - this.centerY) / this.maxMoveStick)) * -1;
    StickStatus.cardinalDirection = this.getCardinalDirection();
    this.callback(StickStatus);
  }

  getCardinalDirection() {
    let result = "";
    let orizontal = this.movedX - this.centerX;
    let vertical = this.movedY - this.centerY;

    if (vertical >= this.directionVerticalLimitNeg && vertical <= this.directionVerticalLimitPos) {
      result = "C";
    }
    if (vertical < this.directionVerticalLimitNeg) {
      result = "N";
    }
    if (vertical > this.directionVerticalLimitPos) {
      result = "S";
    }

    if (orizontal < this.directionHorizontalLimitNeg) {
      if (result === "C") {
        result = "W";
      } else {
        result += "W";
      }
    }
    if (orizontal > this.directionHorizontalLimitPos) {
      if (result === "C") {
        result = "E";
      } else {
        result += "E";
      }
    }

    return result;
  }

  /******************************************************
   * Public methods
   *****************************************************/

  /**
   * @desc The width of canvas
   * @return Number of pixel width
   */
  GetWidth = () => {
    if(!this.canvas) throw new Error("Canvas not found");
    return this.canvas.width;
  };

  /**
   * @desc The height of canvas
   * @return Number of pixel height
   */
  GetHeight = () => {
    if(!this.canvas) throw new Error("Canvas not found");
    return this.canvas.height;
  };

  /**
   * @desc The X position of the cursor relative to the canvas that contains it and to its dimensions
   * @return Number that indicate relative position
   */
  GetPosX = () => {
    return this.movedX;
  };

  /**
   * @desc The Y position of the cursor relative to the canvas that contains it and to its dimensions
   * @return Number that indicate relative position
   */
  GetPosY = () => {
    return this.movedY;
  };

  /**
   * @desc Normalizzed value of X move of stick
   * @return Integer from -100 to +100
   */
  GetX = () => {
    return (100 * ((this.movedX - this.centerX) / this.maxMoveStick)).toFixed();
  };

  /**
   * @desc Normalizzed value of Y move of stick
   * @return Integer from -100 to +100
   */
  GetY = () => {
    return ((100 * ((this.movedY - this.centerY) / this.maxMoveStick)) * -1).toFixed();
  };

  /**
   * @desc Get the direction of the cursor as a string that indicates the cardinal points where this is oriented
   * @return String of cardinal point N, NE, E, SE, S, SW, W, NW and C when it is placed in the center
   */
  GetDir = () => {
    return this.getCardinalDirection();
  };


}