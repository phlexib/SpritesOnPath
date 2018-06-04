/* jshint ignore:start */
#include "../lib/OS.jsx";
#include "../lib/filePath.jsx"
/* jshint ignore:end */

function Effector() {

  var EFFECTOR_PROP_TYPE = {
    GROUP: {"matchName" : "Group", "name": "",INVISIBLE : false},
    ANGLE: {"matchName" : "Angle", "name": "","default" : 0,CANNOT_TIME_VARY:false},
    CHECKBOX: {"matchName" : "Checkbox", "name": "","default" : false,"CANNOT_TIME_VARY":false},
    POPUP: {"matchName" : "Popup", "name": "","default" : false, "popup_string":"","CANNOT_TIME_VARY": false},
    COLOR:{"matchName" : "Color", "name": "","default_red" : 1,"default_green" : 1,"default_blue" : 1, "popup_string":"","CANNOT_TIME_VARY": false},
    LAYER: {"matchName" : "Layer", "name": "","default_self" : true},
    POINT:{"matchName" : "Point", "name": "","default_x" : 0.5, "default_y":0.5,"CANNOT_TIME_VARY":false, "INVISIBLE": false},
    SLIDER :{"matchName" : "Slider", "name": "","default" : 0,"valid_min" : -100,"valid_max":100,"slider_min":-100,"slider_max":100,"CANNOT_TIME_VARY":false,"DISPLAY_PERCENT":true, "DISPLAY_PIXEL":false, "INVISIBLE":false},
  };
  var pseudoGrp;
  var effLayer;
  var name;
  var shape;
  var effBox;
  var effProperties;
  

  function buildPseudoEffect(effName){
    var eff = new XML('<Effect/>');
    eff.@matchName= effName;
    eff.@name = "$$$/AE/Preset/"+ effName.replace(" ","") + "=" + effName;

    var child = buildPseudoEffectProperty(EFFECTOR_PROP_TYPE.SLIDER,{"name":"slider Test"});
    eff.appendChild(child);
    alert(eff.toXMLString())
    return eff;
  }

  function buildPseudoEffectProperty(propType, options){
    /* <Slider name="$$$/AE/Preset/CropAmount=Crop Amount" default="5" valid_min="0" valid_max="50" DISPLAY_PERCENT="true"/> */
  //   function makeXML (first, last) {
  //     return <person first={first} last={last}>{first + " " + last}</person>;
  // }
    
    var eff = new XML('<'+propType.matchName+'/>');
    
    for (var key in propType){
      if(key === "matchName"){
        continue;
      }else if(key === "name"){
        eff.@name = "$$$/AE/Preset/"+ options.name.replace(" ","") + "=" + options.name;
      }else{
        if(options[key]){
          eff.@[key] = options[key];
        }else{
          eff.@[key] = propType[key]
        }
        
      }
    }
    return eff;
  }

  function appendPseudoEffectToXml(presetXml,pseudoEffectName){
    var newPseudoEffect = buildPseudoEffect(pseudoEffectName);
    presetXml.appendChild(newPseudoEffect);
  }

  function getPseudoXmlFile(){
    var pseudoFile;
    if (OS.isWindows()){
      pseudoFile = ("/Volumes/Adobe After Effects CC 2018/Adobe\ After\ Effects\ 7.0/Adobe\ After\ Effects\ 7.0.app/Contents/Resources/")
    }else{
      pseudoFile = File ("/Applications/Adobe After Effects CC 2018/Adobe After Effects CC 2018.app/Contents/Resources/PresetEffects.xml");
    }

    if(pseudoFile){
      pseudoFile.open("r");  
      var xmlString = pseudoFile.read();  
      var pseudoXml = new XML(xmlString);  
      pseudoFile.close();  
      return {"xml": pseudoXml, "file":pseudoFile};
      } else {  
        alert("Could not open file");  
      }  
    };

  function createEffector(effectorLayer) {
    effectorLayer.scale.expression = "[100,100]";
    var effectsProperty = effectorLayer.property("ADBE Effect Parade");
    var amountEffect = effectsProperty.addProperty("ADBE Slider Control");
    amountEffect.name = "EFFECTOR AMOUNT";
    amountEffect.property("Slider").setValue(0);
  }

  function makeShapeBox(effLayer) {
    var rec = effLayer.sourceRectAtTime();
    var recLeft = rec.left + effLayer.position[0];
    var recTop = rec.top + effLayer.position[1];
    var recWidth = rec.width;
    var recHeight = rec.height;
    var recRight = recLeft + recWidth;
    var recBottom = recTop + recHeight;
    var box = {
      left: recLeft,
      right: recRight,
      top: recTop,
      bottom: recBottom,
      height: recHeight,
      width: recWidth
    };

    return box;
  }

  function savePresetFile(presetFile,filePath){
    writeFile(presetFile,filePath);
  }

  // function rectangleCollision(rect1, rect2) {
  //   if (
  //     rect1.left < rect2.left + rect2.width &&
  //     rect1.left + rect1.width > rect2.lft &&
  //     rect1.top < rect2.top + rect2.height &&
  //     rect1.height + rect1.top > rect2.top
  //   ) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

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
  this.getPseudoXmlFile = getPseudoXmlFile;
  this.appendPseudoEffectToXml = appendPseudoEffectToXml;
  this.savePresetFile = savePresetFile;
}

var xml = new Effector();
var presets = xml.getPseudoXmlFile().xml;
xml.appendPseudoEffectToXml(presets,"Test");
xml.savePresetFile(presets.toXMLString(),"/Users/benjamin/Desktop/test.xml");
