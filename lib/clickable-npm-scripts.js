'use babel';

import ClickableNpmScriptsView from './clickable-npm-scripts-view';
import { CompositeDisposable } from 'atom';

export default {

  clickableNpmScriptsView: null,
  tile: null,
  subscriptions: null,

  activate(state) {
		this.clickableNpmScriptsView = new ClickableNpmScriptsView(state.clickableNpmScriptsViewState);
    console.log(atom);


    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'clickable-npm-scripts:toggle': () => this.toggle()
    }));

    if(!atom.project.getDirectories().length){
       atom.project.onDidChangePaths((paths) => this.onPathsChanged(paths));
    }

  },

  consumeStatusBar(statusBar){
		this.statusBar = statusBar;
		try{
  			this.clickableNpmScriptsView.createElements(this.terminal);
    		const button = this.clickableNpmScriptsView.getButton();
    		if(button){
    			statusBar.addLeftTile({
    				item : button
    			});
    		}

  	}catch(err){
    		console.log(err);
    		atom.notifications.addFatalError('A Fatal error occurred', {
    			description : err,
    			dismissable : true
    		});
  	}
  },

  onPathsChanged(){
    this.deactivate();
    this.activate(this.serialize());
    console.log(this);
    if(this.statusBar){
        this.consumeStatusBar(this.statusBar);
    }

  },

	consumeRunInTerminal(terminal){
			console.log('terminal arrived',terminal);
				this.terminal = terminal;
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
