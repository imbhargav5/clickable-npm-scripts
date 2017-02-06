'use babel';
import readPkgUp from 'read-pkg-up';
export default class ClickableNpmScriptsView {

	element = null;
	button = null;

	constructor(serializedState) {
		var editor = atom.workspace.getActivePaneItem()
		var file = editor? editor.buffer.file : null
		// console.log(editor);
		// console.log(file);
		// //const el = this.clickableNpmScriptsView.getElement();


  }



	createElements(terminal){
		try{

			const path  = atom.project.getPaths()[0];
			const {pkg : {scripts = {}}} = readPkgUp.sync({cwd : path});
			this.element = document.createElement('ol');
			this.element.classList.add('list-group');
			this.button = document.createElement('div');
			this.button.classList.add('inline-block');
			this.button.innerHTML = '<a>Npm scripts</a>';
			Object.keys(scripts).forEach(script=>{
				 const _el = document.createElement('li');
				 _el.innerHTML = `<a>${script}</a>`;
				 _el.addEventListener('click',()=>{
					 if(this.modal.visible){
						 this.modal.hide();
					 }
					 try{
						 terminal.run([scripts[script]]);
					 }catch(err){
						 atom.notifications.addFatalError('A Fatal error occurred', {
							description : 'Please make sure platformio-atom-ide-terminal is installed and is active',
							dismissable : true
						});
					 }

			 	 });
				 this.element.appendChild(_el);
			});
			this.modal = atom.workspace.addModalPanel({
				item : this.element,
				visible : false,
				priority : 25
			});
			this.button.addEventListener('click',()=>{
				this.modal.show();
			});
			return this.element;
		}catch(err){

			console.log(err);
			this.element = null;
			return this.element;
		}
	}
  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
		if(!this.element){
			return;
		}
		this.element.remove();
		if(!this.button){
			return;
		}
		this.button.remove();
  }

  getElement() {
    return this.element;
  }
	getButton() {
		return this.button;
	}

}
