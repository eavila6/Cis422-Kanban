import DropZone from "./DropZone.js";
import KanbanAPI from "../api/KanbanAPI.js";

//hopefully colNum'll help us achieve a functionality we want
//the idea is that only items with a colNum of 1'll have the option of being deleted
export default class Item {
	constructor(id, content) {
		const bottomDropZone = DropZone.createDropZone();

		this.elements = {};
		this.elements.root = Item.createRoot();
		this.elements.input = this.elements.root.querySelector(".kanban__item-input");

		//id is the randomly generated id from KanbanAPI, not the given one in Kanban
		this.elements.root.dataset.id = id;
		this.elements.input.textContent = content;
		this.content = content;
		this.elements.root.appendChild(bottomDropZone);

		const onBlur = () => {
			const newContent = this.elements.input.textContent.trim();

			if (newContent == this.content) {
				return;
			}

			this.content = newContent;

			KanbanAPI.updateItem(id, {
				content: this.content
			});
		};

		this.elements.input.addEventListener("blur", onBlur);
		this.elements.root.addEventListener("dblclick", () => {
			const check = confirm("Are you sure you want to delete this item?");

			if (check) {
				KanbanAPI.deleteItem(id);

				this.elements.input.removeEventListener("blur", onBlur);
				this.elements.root.parentElement.removeChild(this.elements.root);
			}
		});

		this.elements.root.addEventListener("dragstart", e => {
			e.dataTransfer.setData("text/plain", id);
		});

		this.elements.input.addEventListener("drop", e => {
			e.preventDefault();
		});
	}

	static createRoot() {
		const range = document.createRange();

		range.selectNode(document.body);

		return range.createContextualFragment(`
			<div class="kanban__item" draggable="true">
				<div class="kanban__item-input" contenteditable></div>
			</div>
		`).children[0];
	}

	// get deleteSelf(){
	// 	this.deleting();
	// }

	*deleting(){
		KanbanAPI.deleteItem(this.elements.root.dataset.id);
		this.elements.input.removeEventListener("blur", onBlur);
		this.elements.root.parentElement.removeChild(this.elements.root);
	}
}

// const j = Item(1, "erer");
// j.deleting