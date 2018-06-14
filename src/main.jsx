/* jshint ignore:start */
#include "./components/spritesOnPath.jsx"
#include "./components/effector.jsx"
#include "./components/effProperty.jsx"
/* jshint ignore:end */

var spritesToUI = (function(thisObj) {
  /// Globals Variables
  var spritesArray = [];
  var MASTER = {
    "comp":"",
    "layer":"",
    "spritesLayers":[],
    "path":"",
    "numberOfSprites":0,
    "isTangent":true,
    "isLooped" : false,
    "isStepped" : false,
    "isSequential" : true,
    "effector" : {}
};

  ///// START UI
  var win = buildUI(thisObj);
  function buildUI(thisObj) {
    var pal = thisObj instanceof Panel? thisObj : new Window("palette", "@@name @@version", undefined, {
            resizeable: true
          });
    return pal;
  }

  ///// TITLE GRP
  var titleGrp = win.add("group", [0, 0, 300, 20]);
  titleGrp.orientation = "row";
  titleGrp.alignment = "left";
  var title = titleGrp.add("statictext", [0, 10, 50, 20], "v" + "@@version");

  //// Tabs
  var tabPanel =  win.add ("tabbedpanel", [0, 0, 300, 300]);
  var shapePanel = tabPanel.add("tab",undefined,"Sprites");

  // SHAPE GRP
  var shapeSetup = shapePanel.add("panel", [10, 10, 215, 90], "Shape Setup");
  var shapeGrp = shapeSetup.add("group", [0, 0, 300, 100], "undefined");
  var shapeBtn = shapeGrp.add("button", [10, 10, 90, 30], "Set Path");
  var pathName = shapeGrp.add("statictext", [100, 10, 200, 30], "Select a Path.", {
    multiline: true
  });

  var spriteGrp = shapeSetup.add("group", [0, 0, 300, 100], "undefined");
  var spriteBtn = spriteGrp.add("button", [10, 40, 90, 60], "Set Sprite");
  var selectedSprite = spriteGrp.add(
    "statictext",
    [100, 40, 200, 60],
    "Select Sprites.",
    { multiline: true }
  );
  var spriteNumberGrp = shapeSetup.add("group", [0, 0, 300, 100], "undefined");
  var spriteNumberLabel = spriteNumberGrp.add("statictext", [10, 40, 120, 60], "Number of Sprites : ");
  var spriteNumber = spriteNumberGrp.add("editText", [100, 40, 160, 60],"10",
    { multiline: false }
  );

  // OPTIONS
  var optionsPanel = shapePanel.add("panel", [10, 100, 215, 200], "options");
  optionsPanel.alignment = "column";
  optionsPanel.alignChildren = "left";
  var orientationGrp = optionsPanel.add("group", [5, 5, 285, 55], "undefined");
  orientationGrp.alignment = "row";
  orientationGrp.alignChildren = "left";
  var radioTangent = orientationGrp.add("radiobutton", [10, 10, 100, 30], "tangential");
  radioTangent.value = 1;
  var radioPerpendicular = orientationGrp.add(
    "radiobutton",
    [100, 10, 190, 30],
    "perpendicular"
  );
  var sequenceGrp = optionsPanel.add("group", [5, 5, 285, 55], "undefined");
  sequenceGrp.alignment = "row";
  sequenceGrp.alignChildren = "left";
  var radioSequence = sequenceGrp.add("radiobutton", [10, 10, 100, 30], "Sequential");
  radioSequence.value = 1;
  var radioRandom = sequenceGrp.add("radiobutton",[100, 10, 190, 30],"Random");
  var stepBox = optionsPanel.add("checkbox", [10, 30, 80, 50], "stepped");
  stepBox.value = 0;
  var loopBox = optionsPanel.add("checkbox", [10, 50, 80, 70], "looped");
  loopBox.value = 0;
  var applyGrp = shapePanel.add("group", [0, 5, 240, 305], "undefined");
  var applyBtn = applyGrp.add("button", [10, 200, 215, 220], "CREATE SPRITES");
  applyBtn.enabled = false;

  shapeBtn.onClick = function() {
    pathName.text = setPath();
  };
  spriteBtn.onClick = function() {
      setSprite();
      if(MASTER.sprite.length >1){
        selectedSprite.text = "Multiple Sprites";
      }else if (MASTER.sprite.length ===1){
        selectedSprite.text = MASTER.sprite[0].name;
      }
      else{

       alert("Select a footage or Comp to use as Sprite.");
      }

  };

  applyBtn.onClick = function() {
    app.beginUndoGroup("Sprites On Path");
    runSpritesOnPath();
  };



  // EFFECTOR GRP
  var effectorSetup = tabPanel.add("tab", [10, 10, 215, 90], "Effector");
  var effectorGrp = effectorSetup.add("group", [0, 0, 300, 100], "undefined");
  effectorGrp.alignment = 'left';
  var setEffectorBtn = effectorGrp.add("button", [10, 10, 90, 30], "Set effector");
  setEffectorBtn.enabled = false;
  setEffectorBtn.onClick = function() {
    effectorName.text = setEffector();
  };
  var effectorName = effectorGrp.add("statictext", [10, 10, 150, 30], "Select a Shape Layer.", {
    multiline: true
  });
  
  /// EFFECTOR PROPERTY GRP
  var effectorPropGrpUI =  effectorSetup.add("group", [0, 0, 300, 100], "undefined");
  effectorPropGrpUI.orientation = 'column';
  effectorPropGrpUI.alignment = 'left';
  effectorPropGrpUI.alignchildren = 'left';
  addEffectorPropertyUI(effectorPropGrpUI);

  function addEffectorPropertyUI(parent){
    var effectorPropertyGrp = parent.add("group", [0, 0, 300, 100], "undefined");
    effectorPropertyGrp.alignment = 'left';
    effectorPropertyGrp.alignChildren = 'left';
    var addEffectorPropertyBtn = effectorPropertyGrp.add("button", [10, 10, 30, 30], "+");
    addEffectorPropertyBtn.enabled = false;
    addEffectorPropertyBtn.onClick = function() {
      var propMin = parseFloat(this.parent.children[3].text);
      var propMax = parseFloat(this.parent.children[4].text);
      this.parent.children[2].text = setPropertyToEffector(propMin,propMax);
      addEffectorPropertyUI(parent);
      enablePropertyGrpChildren();
    };
    var thisIndex = parent.children.length-1;

    var removePropertyEffectorBtn = effectorPropertyGrp.add("button", [10, 10, 30, 30], "-");
    removePropertyEffectorBtn.enabled = false;
    removePropertyEffectorBtn.onClick = function() {
      var kids = effectorPropGrpUI.children;
      if(kids.length>1){
        effectorPropGrpUI.remove(kids[thisIndex]);
        MASTER.effector.removeEffProperty(thisIndex,MASTER.spritesLayers);
      }
     
      updateUILayout(parent); //Update UI
    };

    var propertyName = effectorPropertyGrp.add("statictext", [10, 10,100, 30], "Add a Property.", {
    multiline: true
    });
    var minText = effectorPropertyGrp.add("edittext",undefined,"100");
    var maxText = effectorPropertyGrp.add("edittext",undefined,"100");
    var applyValuesBtn = effectorPropertyGrp.add("button", [10, 10, 25, 25], ">");
    
    applyValuesBtn.onClick = function() {
      MASTER.effector.properties[thisIndex].min = minText.text;
      MASTER.effector.properties[thisIndex].max = maxText.text;
      MASTER.effector.updateProp(MASTER.spritesLayers, MASTER.effector.properties[thisIndex]);
    };
    parent.alignment = 'left';
    parent.alignChildren = 'left';
    updateUILayout(parent); //Update UI
  }


  win.onResizing = win.onResize = function() {
    this.layout.resize();
  };

  if (win instanceof Window) {
    win.center();
    win.show();
  } else {
    win.layout.layout(true);
    win.layout.resize();
  }

  ///// UI FUNCTIONS
  function updateUILayout(container) {
    container.layout.layout(true); //Update the container
    win.layout.layout(true); //Then update the main UI layout
  }

  win.active = true;
  win.layout.layout(true);
  win.layout.resize();
  win.onResizing = win.onResize = function() {
    this.layout.resize();
  };

  //// END UI

  function setPath() {
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) {
      alert("Please Select a Comp");7 
    } else {
    MASTER.comp = comp;
      var layer = getSelectedLayers(comp)[0];
      if (!(layer instanceof ShapeLayer)) {
        alert("You can only select a Path Property.");
      } else {  
        MASTER.layer = layer;       
        var shapeProps = getSelectedProperties(layer)[1];
        if(shapeProps){
          if (shapeProps.matchName != "ADBE Vector Shape") {
            alert("You can only select a Path Property.");
          }
          else {
            MASTER.path = shapeProps;
            if(checkPathAndSprite){applyBtn.enabled = true}
            return layer.name;
          }
        }else{
          alert("You can only select a Path Property.");
        }
      }
    }
  }

  function setSprite() {
    for (var i = 1; i <= app.project.numItems; i++) {
      if (app.project.item(i).selected) {
          spritesArray.push(app.project.item(i));
          if(checkPathAndSprite){applyBtn.enabled = true}
      }
    }
    MASTER.sprite = app.project.selection;
  }

  function setSpriteNumber(){
    var spritesNumber = parseInt(spriteNumber.text);
    if(!spriteNumber){
        alert("Number of Sprites is incorrect.");
    }else{
      MASTER.numberOfSprites = spritesNumber;
  }
}

function checkPathAndSprite(){
  if((MASTER.path ) && (MASTER.spritesLayers.length >0)){
    return true;
  }else{
    return false;
  }
}

function setTangentProperty(){
   radioTangent.value ? MASTER.isTangent= true :  MASTER.isTangent = false;
}

function setStepProperty(){
   stepBox.value ?  MASTER.isStepped = true :  MASTER.isStepped = false;
}

function setLoopProperty(){
    loopBox.value ?  MASTER.isLooped = true :  MASTER.isLooped = false;
}

function setsequentialProperty(){
  radioSequence.value ?  MASTER.isSequential = true :  MASTER.isSequential = false;
}

function setEffector(){
  var comp = app.project.activeItem;
  if (!(comp instanceof CompItem)) {
      alert("Please Select a Comp");
  } 
  else {
    var layer = getSelectedLayers(comp)[0];
    if (!(layer instanceof ShapeLayer)) {
      alert("You can only select a Path Property.");
    } else { 
      SpritesOnPath.addPathToComment(MASTER.layer,layer);
      var effector = new Effector(layer,MASTER.layer,comp);
      effector.effectorLayer.scale.expression = "[100,100]";
      MASTER.effector = effector;
     enablePropertyGrpChildren();
      return layer.name; 
    }
  }
}

function enablePropertyGrpChildren(){
  var kids = effectorPropGrpUI.children;
  
  for (var k = 0 ; k< kids.length ; k++){
    var propGrp = kids[k].children;

    for(var kk=0 ; kk<propGrp.length; kk++){
      if(propGrp[kk].type === "button"){
        propGrp[kk].enabled = true;
      }
    }
  }
}

function setPropertyToEffector(min,max){
  var props =  SpritesOnPath.getSelectedProperties(MASTER.comp.selectedLayers[0]);
  var effectorProp = props[props.length-1];

  if(effectorProp.canSetExpression){
    var neweffProp = new EffPropertry(effectorProp,min,max);
    MASTER.effector.properties.push(neweffProp);
    MASTER.effector.applyPropToSprite(MASTER.spritesLayers,neweffProp);
    return neweffProp.name;

  }else{
    alert("Select a Property on a Sprite Layer.")
    return "Add a Property."
  }
  
}

function runSpritesOnPath (){
  setSpriteNumber();
  setStepProperty();
  setLoopProperty();
  setTangentProperty();
  setsequentialProperty();
  MASTER.spritesLayers = SpritesOnPath.buildSprites(MASTER);   
  setEffectorBtn.enabled = true;
}

//// UTILS

  function getSelectedLayers(targetComp) {
    var targetLayers = targetComp.selectedLayers;
    return targetLayers;
  }

  function getSelectedProperties(targetLayer) {
    var props = targetLayer.selectedProperties;
    if (props.length < 1) {
      return null;
    }
    return props;
  }

  return {
    setSprite:setSprite,
    setPath:setPath,
    master: MASTER
};
})(this);
