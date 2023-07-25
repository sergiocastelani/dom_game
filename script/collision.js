
export class Rectangle
{
  constructor(x, y, width, height)
  {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  left() { return this.x;}
  right() { return this.x + this.width;}
  top() { return this.y; }
  bottom() { return this.y + this.height; }
}

export default class Collision 
{

  static collideRect(A, B)
  {
    var AisToTheRightOfB = A.left() > B.right();
    var AisToTheLeftOfB = A.right() < B.left();
    var AisAboveB = A.bottom() < B.top();
    var AisBelowB = A.top() > B.bottom();
    return !(AisToTheRightOfB
      || AisToTheLeftOfB
      || AisAboveB
      || AisBelowB);  
  }

  static collide(element1, element2, borderSize1 = 0, borderSize2 = 0)
  {
    const recA = element1.getBoundingClientRect();
    const A = new Rectangle(
      recA.x + borderSize1, 
      recA.y + borderSize1, 
      recA.width - borderSize1*2, 
      recA.height - borderSize1*2
    );

    const recB = element2.getBoundingClientRect();
    const B = new Rectangle(
      recB.x + borderSize2, 
      recB.y + borderSize2, 
      recB.width - borderSize2*2, 
      recB.height - borderSize2*2
    );

    return Collision.collideRect(A, B);
  }

  static collideAny(elements1, elements2, borderSize1 = 0, borderSize2 = 0) 
  {
    for(const e1 of elements1)
      for(const e2 of elements2)
        if(Collision.collide(e1, e2, borderSize1, borderSize2))
          return true;

    return false;
  }
}
