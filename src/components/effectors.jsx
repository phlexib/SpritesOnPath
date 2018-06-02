var Effectors = ( function(){

function createEffector(effectorLayer){
  effectorLayer.scale.expression = "[100,100]";
  var effectsProperty = effectorLayer.property("ADBE Effect Parade");
  var amountEffect = effectsProperty.addProperty("ADBE Slider Control");
  amountEffect.name = "EFFECTOR AMOUNT";
  amountEffect.property("Slider").setValue(0);
  
}


function makeShapeBox(refLAyer){
  var refRec = refLayer.sourceRectAtTime();
  var recLeft = rec.left + refLayer.position[0];
  var recTop = rec.top + refLAyer.position[1];
  var recWidth = rec.width;
  var recRight = recLeft + recWidth;
  var recBottom = recTop + recHeight;
  var box = {
    "left" : recLeft,
    "right" : recRight,
    "top" : recTop,
    "bottom" : recBottom,
    "height" : recHeight,
    "width" : recWidth
  }

  return box;
}

function rectangleCollision (rect1,rect2){
  if(rect1.left < rect2.left + rect2.width &&
    rect1.left + rect1.width > rect2.lft &&
    rect1.top < rect2.top + rect2.height &&
    rect1.height + rect1.top > rect2.top){
      return true;
    }else{
      return false
    }
}

// function overlapBoxes (box1,box2){
//   var x_overlap = Math.max(0, Math.min(box1.right, box2.right) - Math.max(box1.left, box2.left));
//   var y_overlap = Math.max(0, Math.min(box1.bottom, box2.bottom) - Math.max(box1.top, box2.top));
//   overlapArea = x_overlap * y_overlap;
//   return overlapArea
// }

// function effectorExpression(effectorLayer){
//   return
//   'function makeShapeBox(refLayer){\n
//   var rec = refLayer.sourceRectAtTime(time,false);\n
//   var recLeft = rec.left + refLayer.position[0] - refLayer.anchorPoint[0];\n
//   var recTop = rec.top + refLayer.position[1] - refLayer.anchorPoint[1];\n
//   var topLeft = [recLeft,recTop];\n
//   var recWidth =rec.width;\n
//   var recHeight = rec.height;\n
//   var recRight = recLeft + recWidth;\n
//   var recBottom = recTop + recHeight\n
//   var box = {\n
//        "left" : recLeft ,\
//        "width" : recWidth,\
//        "top":recTop,\
//        "height":recHeight,\
//        "right" : recRight,\
//        "bottom : recBottom,\
//       "topLeft" : topLeft\
//   };\n
//   return box;\n
// }\n
// \n
// function collision(rect1,rect2){\n
//   if (rect1.left < rect2.left + rect2.width &&\
//   rect1.left + rect1.width > rect2.left &&\
//   rect1.top < rect2.top + rect2.height &&\
//   rect1.height + rect1.top > rect2.top) {\n
//    return "true"\n
//    }else{\n
//    return "false"\n
//    }\n
// }\n
// \n
// var box1 = makeShapeBox(thisComp.layer(\""+Box1+"\"));\n
// var box2 = makeShapeBox(thisLayer);\n

// collision(box1,box2);\n
// x_overlap = Math.max(0, Math.min(box1.right, box2.right) - Math.max(box1.left, box2.left));\n
// y_overlap = Math.max(0, Math.min(box1.bottom, box2.bottom) - Math.max(box1.top, box2.top));\n
// overlapArea = x_overlap * y_overlap;\n
// var res = Math.sqrt(overlapArea)\n
// linear(parseFloat(res),0,(box1.width*box1.height),100,0)\n
// '
// }

return{createEffector : createEffector}
})();
