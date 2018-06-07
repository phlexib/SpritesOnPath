/* jshint ignore:start */
#include "../lib/OS.jsx";
#include "../lib/filePath.jsx"
/* jshint ignore:end */

/**
 * Create a new effector instance
 * @param {LayerItem} effectorLayer 
 * @param {LayerItem} shape 
 * @param {CompItem} comp 
 */
function Effector(effectorLayer,shape,comp) {

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

  this.effectorLayer = effectorLayer;
  this.comp = comp;
  this.shape = shape;
  var pseudoGrp;
  var name = this.effectorLayer.name;
  var effBox;
  var properties = [];
    
  function applyPropToSprite(propLayers,effProp){
    var propertyIndex = effProp.index;
    var parentMatchName = effProp.matchName;
    var min = effProp.min;
    var max = effProp.max;

    properties.push(parentMatchName);

    for(var pl = 0 ; pl< propLayers.length ; pl++){
      var propLayer = propLayers[pl];
      var propLayer = propLayers[pl];
      var effectsProperty = propLayer.property("ADBE Effect Parade");
      var newProp = effectsProperty.addProperty(parentMatchName);
      newProp.property(propertyIndex).expression = effectorExpression(min,max);
      newProp.name += " | " + shape.name; 
    }
  }

  function buildPseudoEffect(effName){
    var eff = new XML('<Effect/>');
    eff.@matchName= effName;
    eff.@name = "$$$/AE/Preset/"+ effName.replace(" ","") + "=" + effName;

    var child = buildPseudoEffectProperty(EFFECTOR_PROP_TYPE.SLIDER,{"name":"slider Test"});
    eff.appendChild(child);
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
      pseudoFile = File ("c:\\Program Files\\Adobe\\Adobe After Effects CC 2018\\Support Files\\PresetEffects.xml");
    }else{
      pseudoFile = File ("/Applications/Adobe After Effects CC 2018/Adobe After Effects CC 2018.app/Contents/Resources/PresetEffects.xml");
    }

    var backUpFile = File(pseudoFile.fsName.replace("PresetEffects","PresetEffects_backup"));
    if(!backUpFile.exists){
     var backUp = pseudoFile.copy(new File(backUpFile.URI));  
    };

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


  


function effectorExpression (min,max){
  return "function makeShapeBox(refLayer){\n"+
  "var rec = refLayer.sourceRectAtTime(time,false);\n"+
  "var recLeft = rec.left + refLayer.position[0] - refLayer.anchorPoint[0];\n"+
  "var recTop = rec.top + refLayer.position[1] - refLayer.anchorPoint[1];\n"+
  "var topLeft = [recLeft,recTop];\n"+
  "var recWidth = rec.width  * (refLayer.scale[0]/100);\n"+
  "var recHeight = rec.height  * (refLayer.scale[1]/100);\n"+ 
  "var recRight = recLeft + recWidth;\n"+
  "var recBottom = recTop + recHeight;\n"+
  "var box = "+
  "{'left' : recLeft,"+
  "'width' : recWidth,"+
  "'top': recTop,"+
  "'height': recHeight,"+
  "'right' : recRight ,"+
  "'bottom' : recBottom ,"+
  "'topLeft' : topLeft };\n"+
  "  return box;}\n"+
  "\n"+
  "function collision(rect1,rect2){\n"+
  "    if (rect1.left < rect2.left + rect2.width\n"+
  "      && rect1.left + rect1.width > rect2.left\n"+
  "      && rect1.top < rect2.top + rect2.height\n"+
  "      && rect1.height + rect1.top > rect2.top) {\n"+
  " return 'true'; }\n"+
  "  else{\n"+
  "  return 'false';\n"+
  "  };\n"+
  "  };\n"+
  "var box1 = makeShapeBox(thisComp.layer(\""+effectorLayer.name+"\"));\n"+
  "var box2 = makeShapeBox(thisLayer);\n"+
  "collision(box1,box2);\n"+
  "x_overlap = Math.max(0, Math.min(box1.right, box2.right) - Math.max(box1.left, box2.left));\n"+
  "y_overlap = Math.max(0, Math.min(box1.bottom, box2.bottom) - Math.max(box1.top, box2.top));\n"+
  "overlapArea = x_overlap * y_overlap;\n"+
  "var res = Math.sqrt(overlapArea);\n"+
  "linear(parseFloat(res),0,box2.width,"+ max + ","+ min +");\n";
  }

  function removeEffProperty(effPropIndex){
    properties.splice(effPropIndex, 1);
  }



  this.getPseudoXmlFile = getPseudoXmlFile;
  this.appendPseudoEffectToXml = appendPseudoEffectToXml;
  this.savePresetFile = savePresetFile;
  this.properties = properties;
  this.name = name;
  this.applyPropToSprite = applyPropToSprite;   
  this.removeEffProperty = removeEffProperty
}

// var xml = new Effector();
// var presets = xml.getPseudoXmlFile().xml;
// xml.appendPseudoEffectToXml(presets,"Test");
// xml.savePresetFile(presets.toXMLString(),"~/Desktop/test.xml");
