/**
 * Create a UI Panel in Extenscript 
 * @param {Object} thisObj 
 * @param {String} userInterfaceString 
 * @param {String} scriptName 
 */
function createUserInterface (thisObj,userInterfaceString,scriptName){
  var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName,
  undefined,{resizeable: true});
  if (pal === null) return pal;

  var UI=pal.add(userInterfaceString);

  pal.layout.layout(true);
  pal.layout.resize();
  pal.onResizing = pal.onResize = function () {
    this.layout.resize();
  };
  if ((pal !== null) && (pal instanceof Window)) {
    pal.show();
  }
  return UI;
}
