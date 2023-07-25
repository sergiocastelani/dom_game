export function getRotationAngle(target) 
{
  const obj = window.getComputedStyle(target, null);
  const matrix = obj.getPropertyValue('-webkit-transform') || 
    obj.getPropertyValue('-moz-transform') ||
    obj.getPropertyValue('-ms-transform') ||
    obj.getPropertyValue('-o-transform') ||
    obj.getPropertyValue('transform');
  let angle = 0; 

  if (matrix !== 'none') 
  {
    const values = matrix.split('(')[1].split(')')[0].split(',');
    const a = values[0];
    const b = values[1];
    angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
  }

  if (target.style.rotate)
  {
    let angle2 = parseFloat(target.style.rotate);
    if (target.style.rotate.includes('rad'))
      angle2 *= 180 / Math.PI;

    angle += angle2;
  }

  return (angle < 0) ? angle +=360 : angle;
}

export function rotateVector(vec, degrees)
{
    let ang = -degrees * (Math.PI/180);
    let cos = Math.cos(ang);
    let sin = Math.sin(ang);

    return new Array(Math.round(10000*(vec[0] * cos - vec[1] * sin))/10000, Math.round(10000*(vec[0] * sin + vec[1] * cos))/10000);
};