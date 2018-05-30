function renderComp(comp, options){

    function applyArrayToOutputModules(rqItem, array, doSomething){
      if(!(array instanceof Array)) array = [array];
      for(var i=0; i< array.length; i++){
        if(i >= rqItem.outputModules.length) rqItem.outputModules.add();
        doSomething(rqItem.outputModule(i+1), array[i]);
      }
    }

    function applyOutputModuleTemplates(rqItem,omTemplates){
      applyArrayToOutputModules(rqItem,omTemplates,function(om, omTemplate){
        om.applyTemplate(omTemplate);
      });
    }

    function applyOutputModuleFiles(rqItem,files){
      applyArrayToOutputModules(rqItem,files,function(om, myFile){
        if(!(myFile instanceof File)) myFile = new File(myFile);
        om.file = myFile;
      });
    }

    function applyOutputModuleSettings(rqItem, omSettings){
      applyArrayToOutputModules(rqItem,omSettings,function(om, mySettings){
        om.setSettings(mySettings);
      });
    }

    function clearRenderQueue(){
      forAllRenderQueueItems(function(rqItem){
        rqItem.remove();
      }, {backwards:true});
    }

    function forAllRenderQueueItems(doSomething, options){
      var i;
      options = options || {};
      if(options.backwards === true){
        for(i=app.project.renderQueue.items.length; i>0; i--){
          doSomething(app.project.renderQueue.item(i),i);
        }
      }
      else {
        for(i=1; i <= app.project.renderQueue.items.length; i++){
          doSomething(app.project.renderQueue.item(i),i);
        }
      }
    }

    options = options || {};

    if(options.clearRenderQueue !== false) clearRenderQueue();
    var rqItem = app.project.renderQueue.items.add(comp);
    if(options.renderSettingsTemplate) rqItem.applyTemplate(options.renderSettingsTemplate);
    if(options.outputModuleTemplate) applyOutputModuleTemplates(rqItem,options.outputModuleTemplate);
    if(options.file) applyOutputModuleFiles(rqItem,options.file);
    if(options.renderSettings) rqItem.setSettings(options.renderSettings);
    if(options.outputModuleSettings) applyOutputModuleSettings(rqItem, options.outputModuleSettings);

    var doRender = (options.startRender !== false);
    if(options.renderInAME === true){
      app.project.renderQueue.queueInAME(doRender);
    }
    else {
      if(doRender) app.project.renderQueue.render();
    }

}

/* example rendering with AME
renderComp(app.project.activeItem, {
  renderSettingsTemplate: "Draft Settings",
  file: "~/bar.mov",
  renderInAME:true
});
*/

/* complex example
renderComp(app.project.activeItem, {
  renderSettingsTemplate: "Draft Settings",
  outputModuleTemplate: ["prores 4444","Lossless"],
  file: [new File("~/temp/foo.mov"),"~/bar.mov"],
  renderSettings: {
    "Time Span": "Length of Comp"
  },
  outputModuleSettings: [
    {Resize:"true", "Resize Quality":"High", "Resize to":{x:1300, y:731}},
    {Resize:"true", "Resize Quality":"High", "Resize to":{x:1600, y:831}}
  ],
  startRender: false,
  clearRenderQueue: false
});
*/
