import * as THREE from '../../vendors/three/build/three.module.js'
import { GLTFLoader } from '../../vendors/three/examples/jsm/loaders/GLTFLoader.js'

export { Piece }

// Class for piece 
class Piece { 

	constructor(rows, columns, anchor_row, anchor_column, score, grid){ // Takes 5 arguments (length, height, index_x, index_y, values)
		this.rows = rows; // Row size of piece
		this.columns = columns; // Column size of piece
		this.anchor_point = [anchor_row, anchor_column]; // Rotational point of piece 
		this.top = 1; // Top position
		this.bottom = (rows - 2); // Bottom position
		this.left = 1; // Left position
		this.right = (columns - 2); // Right position
		this.score = score; // Number of tiles within piece
		this.grid = grid; // Actual piece as nested array
		
		//three.js stuff
		this.loader = new GLTFLoader(); // GLTF loader (for importing 3D models)
		this.loader.setPath('resources/static/');
		this.mesh // The 3D mesh associated with the piece
		this.isPlaced = false; // If piece is currently on or off the board
		this.animationFrame = null; // For storing the current animation of the piece (Ex. https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelAnimationFrame )
	}

	// Function to rotate the piece clockwise 90 degrees a given number of times
	rotate(numberOfRotations) {
		for (let rotation = 0; rotation < numberOfRotations; rotation++) {
			let new_grid = []; // New grid for new piece grid
			for (let i = 0; i < this.columns; i++) {
				let temp = [];
				for (let j = (this.rows - 1); 0 <= j; j--) {
					temp.push(this.grid[j][i]);
				}
				new_grid.push(temp);
			}

			let old_anchor_point_0 = this.anchor_point[0];
			// New anchor point
			this.anchor_point[0] = this.anchor_point[1];
			this.anchor_point[1] = this.rows - old_anchor_point_0 - 1; 

			// Switch rows and columns
			let old_rows = this.rows;
			this.rows = this.columns;
			this.columns = old_rows;

			this.bottom = (this.rows - 2); // Bottom position
			this.right = (this.columns - 2); // Right position

			this.grid = new_grid; // New grid
		}
	}

	// Function to flip pieces on the z-axis
	flip() {
		let new_grid = []; // New grid for new piece grid
		for (let i = (this.rows - 1); 0 <= i; i--) {
			new_grid.push(this.grid[i]);
		}

		let old_anchor_point_0 = this.anchor_point[0];
		// New anchor point
		this.anchor_point[0] = this.rows - 1 - old_anchor_point_0;

		this.grid = new_grid; // New grid
	}

	createPieceMesh(color) {
		let material = new THREE.MeshPhongMaterial({ color:color , shininess:50 })
		material.transparent = true
		material.opacity = 0.95

		return new Promise( (resolve, reject) => {	
			this.loader.load('tile.glb', (gltf) => {
				gltf.scene.traverse( (child) => {
					if (child.type == 'Mesh') {
						resolve(child)
					}
				})
			})
		}).then( (mesh) => {
			let pieceGeometry = new THREE.Geometry()
			for (const [k, row] of this.grid.entries()) {
				for (const [i, tile] of row.entries()) {
					if (tile == 1) {
						let posX = i - this.anchor_point[1]
						let posZ = k - this.anchor_point[0]

						let tileGeometry = new THREE.Geometry().fromBufferGeometry(mesh.clone().geometry)
						tileGeometry.translate(posX,0,posZ)
						pieceGeometry.merge(tileGeometry)
					}
				}
			}
			this.mesh = new THREE.Mesh(pieceGeometry, material)
		})
	}

}