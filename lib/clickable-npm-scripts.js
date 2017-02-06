'use babel';

import ClickableNpmScriptsView from './clickable-npm-scripts-view';
import { CompositeDisposable } from 'atom';

export default {

  clickableNpmScriptsView: null,
  tile: null,
  subscriptions: null,

  activate(state) {
    console.log('activate');
		this.clickableNpmScriptsView = new ClickableNpmScriptsView(state.clickableNpmScriptsViewState);
    console.log(atom);


    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'clickable-npm-scripts:toggle': () => this.toggle()
    }));
  },

  consumeStatusBar(statusBar){
		try{
			this.clickableNpmScriptsView.createElements(this.terminal);
		const element = this.clickableNpmScriptsView.getElement();
		const button = this.clickableNpmScriptsView.getButton();
		statusBar.addLeftTile({
			item : button
		});
	}catch(err){
		console.log(atom);
		atom.notifications.addFatalError('A Fatal error occurred', {
			description : err,
			dismissable : true
		})
	}
		//this.modal.show();
		// elements.forEach(_el=>{

		// })
  },

	consumeRunInTerminal(terminal){
				this.terminal = terminal;
	},

  deactivate() {
    //this.bottomPanel.destroy();
    this.subscriptions.dispose();
    this.clickableNpmScriptsView.destroy();
  },

  serialize() {
    return {
      clickableNpmScriptsViewState: this.clickableNpmScriptsView.serialize()
    };
  },



};
