'use babel';

import ClickableNpmScriptsView from './clickable-npm-scripts-view';
import { CompositeDisposable } from 'atom';

export default {

  clickableNpmScriptsView: null,
  tile: null,
  subscriptions: null,

  activate(state) {
		this.clickableNpmScriptsView = new ClickableNpmScriptsView(state.clickableNpmScriptsViewState);
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'clickable-npm-scripts:toggle': () => this.toggle()
    }));
    // Register command that refreshs the package
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'clickable-npm-scripts:refresh': () => this.refresh()
    }));

    if(!atom.project.getDirectories().length){
       atom.project.onDidChangePaths((paths) => this.onPathsChanged(paths));
    }

  },

  consumeStatusBar(statusBar){
    console.info('StatusBar linked',statusBar);
		this.statusBar = statusBar;
		if(this.terminal){
      this.start();
    }
  },

  start(){
    try{
  			this.clickableNpmScriptsView.createElements(this.terminal, this.refresh.bind(this));
    		const button = this.clickableNpmScriptsView.getButton();
    		if(button){
    			this.statusBar.addLeftTile({
    				item : button
    			});
    		}

  	}catch(err){
    		console.error(err);
    		atom.notifications.addFatalError('A Fatal error occurred', {
    			description : err,
    			dismissable : true
    		});
  	}
  },
  onPathsChanged(){
    this.refresh();
  },

  refresh(){
    try {
      this.deactivate();
      this.activate(this.serialize());
      console.log(this);
      if(this.statusBar){
          this.consumeStatusBar(this.statusBar);
      }
    }catch(err){
      console.error(err);
      atom.notifications.addFatalError('A Fatal error occurred', {
        description : err,
        dismissable : true
      });
    }
  },

	consumeRunInTerminal(terminal){
			console.info('Terminal linked',terminal);
			this.terminal = terminal;
      if(this.statusBar){
        this.start();
      }
	},

  deactivate() {
    //this.bottomPanel.destroy();
    this.subscriptions.dispose();
    this.clickableNpmScriptsView.destroy();
  },

	toggle(){
		this.clickableNpmScriptsView.toggle();
	},

  hide(){
		this.clickableNpmScriptsView.toggle();
	},

  serialize() {
    return {
      clickableNpmScriptsViewState: this.clickableNpmScriptsView.serialize()
    };
  },

};
