import * as THREE from '../../vendors/three/build/three.module.js'
import { GLTFLoader } from '../../vendors/three/examples/jsm/loaders/GLTFLoader.js'

export { Board }

class Board {
	constructor(scene) {
		// Constants
		this.WHITE = 0xaaaaaa
		this.VALID_COLOR = 0x779977
		this.INVALID_COLOR = 0x777777

		// Scene
		this.scene = scene

		// 20x20 grid of zeros
		this.grid = []
		for (let i = 0; i < 20; i++) {
			let row = []
			for (let j = 0; j < 20; j++) {
				row.push(0)
			}
			this.grid.push(row)
		}

		// Creating the mesh (from geometry and material)
		let plane = new THREE.Shape([
			new THREE.Vector2(-10,10),
			new THREE.Vector2(10,10),
			new THREE.Vector2(10,-10),
			new THREE.Vector2(-10,-10)
			])
		let extrudeSettings = {steps:1, depth:0.5 , bevelEnabled:false}
		let geometry = new THREE.ExtrudeGeometry(plane, extrudeSettings)
		geometry.rotateX(Math.PI/2)
		let material = new THREE.MeshStandardMaterial({ color: this.WHITE })
		this.mesh = new THREE.Mesh(geometry, material)
		scene.add(this.mesh)

		// A 2-dimensional array for storing the game board studs (20x20)
		this.studs = []
		this.cornerStuds = {}
	}

	addStuds() {
		// GLTF loader (for importing 3D models)
		let loader = new GLTFLoader()
		loader.setPath('resources/static/')

		return new Promise( (resolve, reject) => {	
			loader.load('stud.glb', (gltf) => {
				gltf.scene.traverse( (child) => {
					if (child.type == 'Mesh') {
						resolve(child)
					}
				})
			})
		}).then((mesh) => {
			let material = new THREE.MeshStandardMaterial({ color: this.WHITE })
			for (let k = -10; k < 10; k++) {
				let row = []
				for (let i = -10; i < 10; i++) {
					let m = mesh.clone()
					m.material = material.clone()
					m.position.set(i+0.5,0,k+0.5)
					row.push(m)
					this.scene.add(m)
				}
				this.studs.push(row)
			}

			this.cornerStuds[45] = this.studs[19][19]
			this.cornerStuds[135] = this.studs[0][19]
			this.cornerStuds[225] = this.studs[0][0]
			this.cornerStuds[315] = this.studs[19][0]
		})
	}

	clean() {
		for (const row of this.studs) {
			for (const stud of row) {
				stud.material.color.set(this.WHITE)
			}
		}
	}
}