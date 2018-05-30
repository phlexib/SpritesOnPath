/* jshint ignore:start */
#include "OS.jsx"
/* jshint ignore:end */

function joinPath(components){
  var pathSeparator = getPathSeparatorSymbol();
  return components.join(pathSeparator);
}

function getPathSeparatorSymbol(){
   return (OS.isWindows() ? "\\":"/");
}

function getUserDataFolderPath(){
  return Folder.userData.fsName;
}
