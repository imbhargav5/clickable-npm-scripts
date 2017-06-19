'use babel';
import fs from 'fs';
import readPkgUp from 'read-pkg-up';
import $ from 'jquery';
export default class ClickableNpmScriptsView {

	element = null;
	button = null;
	container = null;

	createElements(terminal, refresh){
		try{
			const path  = atom.project.getPaths()[0];
			const {pkg, path: packagePath} = readPkgUp.sync({cwd : path});

			if(!pkg || !pkg.scripts || Object.keys(pkg.scripts).length == 0){
				return;
			}
			if(path){
				fs.unwatchFile(packagePath);
				fs.watchFile(packagePath, refresh);
			}
			 const {scripts}= pkg;
			this.container = document.createElement('div');
			this.container.classList.add('select-list');
			this.element = document.createElement('ol');
			this.element.classList.add('list-group');
			this.button = document.createElement('div');
			this.button.classList.add('inline-block');
			this.button.innerHTML = '<a>Npm scripts</a>';
			Object.keys(scripts).forEach(script=>{
				 const _el = document.createElement('li');
				 _el.innerHTML = `<a style="font-size:16px"><span style="text-transform:uppercase;font-weight:bold; color: #81C784;">${script}</span>  : <span style="font-style:italic;">${scripts[script]}</span></a>`;
				 _el.addEventListener('click',()=>{
					 if(this.modal.visible){
						 this.modal.hide();
					 }
					 try{
						 terminal.run([`npm run ${script}`]);
						 const terminalViews = terminal.getTerminalViews();
						 terminalViews[terminalViews.length-1].statusIcon.innerHTML = `<i class="icon icon-terminal"></i><span class="name"> ${script} </span>`;
					 }catch(err){
						 console.error(err);
						 atom.notifications.addFatalError('A Fatal error occurred', {
							description : 'Please make sure platformio-atom-ide-terminal is installed and is active',
							dismissable : true
						});
					 }

			 	 });
				 this.element.appendChild(_el);
			});
			this.container.appendChild(this.element);
			this.modal = atom.workspace.addModalPanel({
				item : this.container,
				visible : false,
				priority : 25
			});
			this.button.addEventListener('click',(e)=>{
				e.stopPropagation();
				this.showModal();
			});
			return this.element;
		}catch(err){

			this.element = null;
			return this.element;
		}
	}
  // Returns an object that can be retrieved when package is activated
  serialize() {}

	showModal(){
			if(this.modal){
				this.modal.show();
				this.handler = (e)=>{
					e.stopPropagation();
					if(e.type ==='click' && !$.contains(this.modal.item,e.target)){
						return this.hideModal();
					}
					if(e.type==='keydown' && e.which === 27){
						//escape key
						return this.hideModal();
					}
				};
				$(document).on('click',this.handler);
			}
	}
	hideModal(){
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
				this.showModal();
			}
		}
	}
  // Tear down any state and detach
  destroy() {
		if(!this.container){
			return;
		}
		this.container.remove();
		this.container = null;
		this.element = null;
		if(!this.button){
			return;
		}
		this.button.remove();
  }
	getContainer(){
		return this.container;
	}
  getElement() {
    return this.element;
  }
	getButton() {
		return this.button;
	}

}
