"use strict";


class Utils {

  static clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  static fillCircle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  static fillBox(ctx, x, y, w, h, style) {
    const oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
  }

  static collidesWithRectangleTopLeft(r1, r2){
    const dx=(r1.x+r1.w/2)-(r2.x+r2.w/2);
    const dy=(r1.y+r1.h/2)-(r2.y+r2.h/2);
    const width=(r1.w+r2.w)/2;
    const height=(r1.h+r2.h)/2;
    const crossWidth=width*dy;
    const crossHeight=height*dx;
    let collision=null;
    //
    if(Math.abs(dx)<=width && Math.abs(dy)<=height){
      if(crossWidth>crossHeight){
        collision=(crossWidth>(-crossHeight))?'bottom':'left';
      }else{
        collision=(crossWidth>-(crossHeight))?'right':'top';
      }
    }
    return(collision);
  }

  static collidesWithRectangle(r1, r2) {
    const x = r1.x - r1.w / 2;
    const y = r1.y - r1.h / 2;
    const w = r1.w;
    const h = r1.h;
    const dx = (x + w / 2) - (r2.x + r2.w / 2);
    const dy = (y + h / 2) - (r2.y + r2.h / 2);
    const width = (w + r2.w) / 2;
    const height = (h + r2.h) / 2;
    const crossWidth = width * dy;
    const crossHeight = height * dx;
    let collision = null;
    //
    if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
      if (crossWidth > crossHeight) {
        collision = (crossWidth > (-crossHeight)) ? 'top' : 'right';
      } else {
        collision = (crossWidth > -(crossHeight)) ? 'left' : 'bottom';
      }
    }
    return collision;
  }
}
