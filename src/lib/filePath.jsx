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

function writeFile(presets,filepath){
  // get the text file
  var write_file = File(filepath);

  if (!write_file.exists) {
    // if the file does not exist create one
    write_file = new File(filepath);
  } else {
    // if it exists ask the user if it should be overwritten
    var res = confirm("The file already exists. Should I overwrite it", true, "titleWINonly");
    // if the user hits no stop the script
    if (res !== true) {
      return;
    }
  }

  var out; // our output
  // we know already that the file exist
  // but to be sure
  if (write_file !== '') {
    //Open the file for writing.
    out = write_file.open('w', undefined, undefined);
    write_file.encoding = "UTF-8";
    write_file.lineFeed = "Unix"; //convert to UNIX lineFeed
    // txtFile.lineFeed = "Windows";
    // txtFile.lineFeed = "Macintosh";
  }
  // got an output?
  if (out !== false) {
    // loop the list and write each item to the file
    write_file.write(presets);
    // always close files!
    write_file.close();
  }
}

function readFile(filepath){
  var read_file = File(filepath);
  read_file.open('r', undefined, undefined);
  if (read_file !== '') {
    alert("this is read only\n " + read_file.read());
    read_file.close();
  }
}

function appendFile(filepath){
  var append_file = File(filepath);
  append_file.open('a', undefined, undefined);
  if (append_file !== '') {
    append_file.writeln("Hello I'm an appended line!");

  append_file.close();
  }
}

