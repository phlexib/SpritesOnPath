function getSetting(keyName) {
  return app.settings.getSetting(scriptName, keyName);
}

function haveSetting(keyName) {
  return app.settings.haveSetting(scriptName, keyName);
}

function saveSettings(keyName, value) {
  app.settings.saveSetting(scriptName, keyName, value.toString());
}

function saveToDisk() {
  app.preferences.saveToDisk();
}

function getSelectedLayers(targetComp) {
  var targetLayers = targetComp.selectedLayers;
  return targetLayers;
}

function createNull(targetComp) {
  return targetComp.layers.addNull();
}

function getSelectedProperties(targetLayer) {
  var props = targetLayer.selectedProperties;
  if (props.length < 1) {
    return null;
  }
  return props;
}

function forEachLayer(targetLayerArray, doSomething) {
  for (var i = 0, ii = targetLayerArray.length; i < ii; i++) {
    doSomething(targetLayerArray[i]);
  }
}

function forEachProperty(targetProps, doSomething) {
  for (var i = 0, ii = targetProps.length; i < ii; i++) {
    doSomething(targetProps[i]);
  }
}

function forEachEffect(targetLayer, doSomething) {
  for (
    var i = 1, ii = targetLayer.property("ADBE Effect Parade").numProperties; i <= ii; i++
  ) {
    doSomething(targetLayer.property("ADBE Effect Parade").property(i));
  }
}

function matchMatchName(targetEffect, matchNameString) {
  if (targetEffect != null && targetEffect.matchName === matchNameString) {
    return targetEffect;
  } else {
    return null;
  }
}

function getPropPath(currentProp, pathHierarchy) {
  var pathPath = "";
  while (currentProp.parentProperty !== null) {
    if (
      currentProp.parentProperty.propertyType === PropertyType.INDEXED_GROUP
    ) {
      pathHierarchy.unshift(currentProp.propertyIndex);
      pathPath = "(" + currentProp.propertyIndex + ")" + pathPath;
    } else {
      pathPath = '("' + currentProp.matchName.toString() + '")' + pathPath;
    }

    // Traverse up the property tree
    currentProp = currentProp.parentProperty;
  }
  alert(pathPath)
  return pathPath;
}

function getPathPoints(path) {
  return path.value.vertices;
}

function getPathInTangents(path) {
  return path.value.inTangents;
}

function getPathOutTangents(path) {
  return path.value.outTangents;
}