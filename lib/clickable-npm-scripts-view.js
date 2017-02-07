'use babel';
import readPkgUp from 'read-pkg-up';
const debug = require('debug')('test-cps');
import $ from 'jquery';
export default class ClickableNpmScriptsView {

	element = null;
	button = null;

	constructor(serializedState) {

  }



	createElements(terminal){
		try{
			debug('creating elements');
			const path  = atom.project.getPaths()[0];
			const {pkg} = readPkgUp.sync({cwd : path});
			debug(pkg)

			if(!pkg || !pkg.scripts || Object.keys(pkg.scripts).length == 0){
				return;
			}
			 const {scripts}= pkg;
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
						 debug(err);
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
			this.button.addEventListener('click',(e)=>{
				e.stopPropagation();
				this.showModal();
			});
			return this.element;
		}catch(err){

			debug(err);
			this.element = null;
			return this.element;
		}
	}
  // Returns an object that can be retrieved when package is activated
  serialize() {}

	showModal(){
		debug('show modal')
			if(this.modal){
				this.modal.show();
				this.handler = (e,...rest)=>{
					debug('handler',e);
					e.stopPropagation();
					if(e.type ==='click' && !$.contains(this.modal.item,e.target)){
						return this.hideModal();
					}
					if(e.type==='keydown' && e.which === 27){
						//escape key
						return this.hideModal();
					}
				}
				$(document).on('click',this.handler);
			}
	}
	hideModal(){
		debug('hide modal')
		if(this.modal && this.modal.visible){
			this.modal.hide();
			if(this.handler){
				$(document).off('click',this.handler);
				this.handler = null;
			}
		}
	}
	toggle(){
		if(this.modal){
			if(this.modal.visible){
				this.hideModal();
			}else{
				this.showModal()
			}
		}
	}
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
