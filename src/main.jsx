/* jshint ignore:start */
#include "./components/SpritesOnPath.jsx"
/* jshint ignore:end */

var spritesToUI = (function(thisObj) {

  /// Globals Variables
  var spritesArray = [];
  var MASTER = {
    "comp":"",
    "layer":"",
    "path":"",
    "numberOfSprites":0,
    "isTangent":true,
    "isLooped" : false,
    "isStepped" : false,
    "isSequential" : true
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

  // SHAPE GRP
  var shapeSetup = win.add("panel", [10, 10, 215, 90], "Shape Setup");
  var shapeGrp = shapeSetup.add("group", [0, 0, 300, 100], "undefined");
  var shapeBtn = shapeGrp.add("button", [10, 10, 90, 30], "Set Path");
  var pathName = shapeGrp.add("statictext", [100, 10, 200, 30], "path name", {
    multiline: true
  });

  var spriteGrp = shapeSetup.add("group", [0, 0, 300, 100], "undefined");
  var spriteBtn = spriteGrp.add("button", [10, 40, 90, 60], "Set Sprite");
  var selectedSprite = spriteGrp.add(
    "statictext",
    [100, 40, 200, 60],
    "statictext",
    { multiline: true }
  );
  var spriteNumberGrp = shapeSetup.add("group", [0, 0, 300, 100], "undefined");
  var spriteNumberLabel = spriteNumberGrp.add("statictext", [10, 40, 120, 60], "Number of Sprites : ");
  var spriteNumber = spriteNumberGrp.add("editText", [100, 40, 160, 60],"10",
    { multiline: false }
  );

  // OPTIONS
  var optionsPanel = win.add("panel", [10, 100, 215, 200], "options");
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
  var applyGrp = win.add("group", [0, 5, 240, 305], "undefined");
  var applyBtn = applyGrp.add("button", [10, 200, 215, 220], "CREATE SPRITES");

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
      alert("Please Select a Comp");
    } else {
    MASTER.comp = comp;
      var layer = getSelectedLayers(comp)[0];

      if (!(layer instanceof ShapeLayer)) {
        alert("You can only select a Path Property.");
      } else {
          
        MASTER.layer = layer;
        
        var shapeProps = getSelectedProperties(layer)[1];

        if (shapeProps.matchName != "ADBE Vector Shape") {
          alert("You can only select a Path Property.");
        } else {
           
          MASTER.path = shapeProps;
          return layer.name;
        }
      }
    }
  }

  function setSprite() {
    for (var i = 1; i <= app.project.numItems; i++) {
      if (app.project.item(i).selected) {
          spritesArray.push(app.project.item(i));
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

  function runSpritesOnPath (){
    setSpriteNumber();
    setStepProperty();
    setLoopProperty();
    setTangentProperty();
    setsequentialProperty();
    SpritesOnPath.buildSprites(MASTER);   
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
    setPath:setPath
};
})(this);
