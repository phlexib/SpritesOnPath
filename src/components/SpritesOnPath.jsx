var SpritesOnPath = (function() {
  function buildSprites(master) {
    var targetComp = master.comp;
    var sprites = master.sprite;
    var pointPath = getPathPoints(master.path);
    var numberOfSprites = master.numberOfSprites;
    var refLayer = master.layer;
    var space = 1 / (numberOfSprites - 1);
    var propPath = getPropPath(master.path);
   
    setMasterTangent();
    alert(master.isSequential);
    switch (master.isSequential) {
       
      case true:
      for (var n = 0; n < numberOfSprites; n++) {
        var numSprites = sprites.length;
        addSpriteToPath(n * space, sprites[n % numSprites]); 
      }
       
        break;
      case false:
      for (var n = 0; n < numberOfSprites; n++) {
        var numSprites = sprites.length;
        addSpriteToPath(n * space, getRandom(sprites)); 
      }
        break;

      default:
        break;
    }

    

    function getRandom(arr){
      
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function setMasterTangent() {
      switch (master.isTangent) {
        case false:
          addLocalProperties(refLayer, {
            position: 0,
            rotation: 90,
            isMaster: true
          });
          break;
        case true:
          addLocalProperties(refLayer, {
            position: 0,
            rotation: 0,
            isMaster: true
          });
          break;
        default:
          addLocalProperties(refLayer, {
            position: 0,
            rotation: 90,
            isMaster: true
          });
          break;
      }
    }

    function buildOneDExpression(p) {
      var multiplier = 1;
      var masterOffset =
        "(" + p + " + globalPositionOffset + localPositionOffset)";
      master.isStepped ? (multiplier = Math.ceil(p * 10)) : (multiplier = 1);
      master.isLooped
        ? (masterOffset =
            "(" + p + " + globalPositionOffset + localPositionOffset)%1.00001")
        : (masterOffset =
            "(" + p + " + globalPositionOffset + localPositionOffset)");

      var positionExpression =
        'var srcLayer = thisComp.layer("' +
        refLayer.name +
        '");\
      var srcPath = srcLayer ' +
        propPath +
        ';\
      var globalPositionOffset = srcLayer.effect("positionOffset")("Slider");\
      var localPositionOffset = effect("positionOffset")("Slider");\
      var clamped = linear(' +
        masterOffset +
        ',0,1,srcLayer.effect("start")("Slider")/100,srcLayer.effect("end")("Slider")/100);\
      var pos = srcPath.pointOnPath(percentage = clamped + globalPositionOffset +localPositionOffset , t = time);\
      srcLayer.toComp(pos)';

      var rotationExpression =
        'var srcLayer = thisComp.layer("' +
        refLayer.name +
        '");\
      var globalRotationOffset = srcLayer.effect("rotationOffset")("Angle");\
      var globalPositionOffset = srcLayer.effect("positionOffset")("Slider");\
      var globalMultiplier = srcLayer.effect("stepMultiplier")("Slider");\
      var localRotationOffset = effect("rotationOffset")("Angle");\
      var localPositionOffset = effect("positionOffset")("Slider");\
      var clamped = linear(' +
        masterOffset +
        ',0,1,srcLayer.effect("start")("Slider")/100,srcLayer.effect("end")("Slider")/100);\
      var srcPath = srcLayer ' +
        propPath +
        ";\
      var pos = srcPath.tangentOnPath(percentage = clamped +globalPositionOffset + localPositionOffset, t = time);\
      var res = radiansToDegrees(Math.atan2(pos[1],pos[0]));\
      res * globalMultiplier * " +
        multiplier +
        " +localRotationOffset+globalRotationOffset;\
      ";

      return {
        positionExpression: positionExpression,
        rotationExpression: rotationExpression
      };
    }

    function buildTwoDExpression(p) {
      var multiplier = 1;
      master.isStepped
        ? (multiplier = Math.ceil(p * numberOfSprites) / 2)
        : (multiplier = 1);

      var scaleExpression =
        'var srcLayer = thisComp.layer("' +
        refLayer.name +
        '");\
      var globalScale = srcLayer.effect("spriteScale")("Slider");\
      var globalMultiplier = srcLayer.effect("stepMultiplier")("Slider");\
      var res = globalScale * ' +
        multiplier +
        " ;\
      [res,res];\
      ";

      return { scaleExpression: scaleExpression };
    }

    function addSpriteToPath(p, sprite) {
      var layers = targetComp.layers;

      var newSprite = layers.add(sprite);
      addLocalProperties(newSprite, {
        position: 0,
        rotation: 0,
        isMaster: false
      });
      newSprite.position.expression = buildOneDExpression(p).positionExpression;
      newSprite.rotation.expression = buildOneDExpression(p).rotationExpression;
      newSprite.scale.expression = buildTwoDExpression(p).scaleExpression;
      newSprite.name = "sprite_" + n.toString();
      newSprite.label = 10;
    }
  }

  function addLocalProperties(layer, options) {
    var effectsProperty = layer.property("ADBE Effect Parade");
    var positionOffset = effectsProperty.addProperty("ADBE Slider Control");
    positionOffset.name = "positionOffset";
    positionOffset.property("Slider").setValue(options.position);
    var rotationOffset = effectsProperty.addProperty("ADBE Angle Control");
    rotationOffset.name = "rotationOffset";
    rotationOffset.property("Angle").setValue(options.rotation);

    if (options.isMaster === true) {
      var stepMultiplier = effectsProperty.addProperty("ADBE Slider Control");
      stepMultiplier.name = "stepMultiplier";
      stepMultiplier.property("Slider").setValue(1);
      var spriteScale = effectsProperty.addProperty("ADBE Slider Control");
      spriteScale.name = "spriteScale";
      spriteScale.property("Slider").setValue(100);
      var start = effectsProperty.addProperty("ADBE Slider Control");
      start.name = "start";
      start.property("Slider").setValue(0);
      var end = effectsProperty.addProperty("ADBE Slider Control");
      end.name = "end";
      end.property("Slider").setValue(100);
    }
  }

  function getSelectedProperties(targetLayer) {
    var props = targetLayer.selectedProperties;
    if (props.length < 1) {
      return null;
    }
    return props;
  }

  /* General functions */

  function getPropPath(prop) {
    var layerRoot = false;
    var propPath = "";

    while (prop.parentProperty) {
      propPath = "('" + prop.name + "')" + propPath;
      prop = prop.parentProperty;
    }
    return propPath;
  }

  function getPathPoints(path) {
    return path.value.vertices;
  }

  return {
    buildSprites: buildSprites
  };
})();
