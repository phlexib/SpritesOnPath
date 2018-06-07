function makeShapeBox(refLayer){
    var rec = refLayer.sourceRectAtTime(time,false);
    var recLeft = rec.left + refLayer.position[0] - refLayer.anchorPoint[0];
    var recTop = rec.top + refLayer.position[1] - refLayer.anchorPoint[1];
    var topLeft = [recLeft,recTop];
    var recWidth =rec.width * (refLayer.scale[0]/100);
    var recHeight = rec.height * (refLayer.scale[1]/100);
    var recRight = recLeft + recWidth;
    var recBottom = recTop + recHeight;
    var upperRight = [recRight, recTop],
    var bottomLeft = [recLeft,recBottom],
    var bottomright [recRight,recbottom]
    var box = {'left' : recLeft,
    'width' : recWidth,
    'top': recTop,'height': recHeight,
    'right' : recRight ,
    'bottom' : recBottom ,
    'upperLeft' : topLeft,
    'upperRight' : upperRight,
    'bottomLeft' : bottomLeft,
    'bottomRight' : bottomRight
    };
      return box;}
    
    function collision(rect1,rect2){
        if (rect1.left < rect2.left + rect2.width
          && rect1.left + rect1.width > rect2.left
          && rect1.top < rect2.top + rect2.height
          && rect1.height + rect1.top > rect2.top) {
     return 'true'; }
      else{
      return 'false';
      };
      };
    var box1 = makeShapeBox(thisComp.layer("Box1"));
    
    box1.toSource();