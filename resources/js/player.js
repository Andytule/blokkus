import * as THREE from '../../vendors/three/build/three.module.js'

import { toRadians } from './math.js'
import { Piece } from './piece.js'

export { Player }

// Class for player 
class Player { 
	constructor(scene, board, name, color, angle) { // Takes three arguments (name, color, angle)
		this.scene = scene;
		this.name = name; // Player name
		this.color = color; // Color of player's tiles
		this.angle = angle; // Where the player is sitting around the table in degrees
		this.score = 0; // Player score
		this.continue = true; // Forfeit status
		this.openingStud = board.cornerStuds[angle - (angle%90) + 45]; // The corner stud that the player starts off on
		this.pieces = [];
	}

	// Takes an angle (which side of the board to put it on) - either 0, 90, 180, 270
	addNewPieceSet(angle) {

		// Blokus pieces
		// Grid goes down and right
		// 1 = Tile
		// 0 = Space beside a tile
		// -1 = Corner tile
		// -2 = Non connected tile
		let pieces = [
			new Piece(3, 3, 1, 1, 1, [[-1, 0, -1], [0, 1, 0], [-1, 0, -1]]),
			new Piece(3, 4, 1, 1, 2, [[-1, 0, 0, -1], [0, 1, 1, 0], [-1, 0, 0, -1]]),
			new Piece(4, 4, 1, 2, 3, [[-1, 0, 0, -1], [0, 1, 1, 0], [-1, 0, 1, 0], [-2, -1, 0, -1]]),
			new Piece(3, 5, 1, 2, 3, [[-1, 0, 0, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]),
			new Piece(4, 4, 2, 1, 4, [[-1, 0, 0, -1], [0, 1, 1, 0], [0, 1, 1, 0], [-1, 0, 0, -1]]),
			new Piece(4, 5, 2, 2, 4, [[-2, -1, 0, -1, -2], [-1, 0, 1, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]),
			new Piece(3, 6, 1, 2, 4, [[-1, 0, 0, 0, 0, -1], [0, 1, 1, 1, 1, 0], [-1, 0, 0, 0, 0, -1]]),
			new Piece(4, 5, 2, 3, 4, [[-2, -2, -1, 0, -1], [-1, 0, 0, 1, 0], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]),
			new Piece(4, 5, 2, 2, 4, [[-2, -1, 0, 0, -1], [-1, 0, 1, 1, 0], [0, 1, 1, 0, -1], [-1, 0, 0, -1, -2]]),
			new Piece(4, 6, 2, 1, 5, [[-1, 0, -1, -2, -2, -2], [0, 1, 0, 0, 0, -1], [0, 1, 1, 1, 1, 0], [-1, 0, 0, 0, 0, -1]]),
			new Piece(5, 5, 3, 2, 5, [[-2, -1, 0, -1, -2], [-2, 0, 1, 0, -2], [-1, 0, 1, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]),
			new Piece(5, 5, 3, 1, 5, [[-1, 0, -1, -2, -2], [0, 1, 0, -2, -2], [0, 1, 0, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]),
			new Piece(4, 6, 1, 2, 5, [[-2, -1, 0, 0, 0, -1], [-1, 0, 1, 1, 1, 0], [0, 1, 1, 0, 0, -1], [-1, 0, 0, -1, -2, -2]]),
			new Piece(5, 5, 2, 2, 5, [[-2, -2, -1, 0, -1], [-1, 0, 0, 1, 0], [0, 1, 1, 1, 0], [0, 1, 0, 0, -1], [-1, 0, -1, -2, -2]]),
			new Piece(7, 3, 3, 1, 5, [[-1, 0, -1], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [-1, 0, -1]]),
			new Piece(5, 4, 2, 1, 5, [[-1, 0, -1, -2], [0, 1, 0, -1], [0, 1, 1, 0], [0, 1, 1, 0], [-1, 0, 0, -1]]),
			new Piece(5, 5, 2, 2, 5, [[-2, -1, 0, 0, -1], [-1, 0, 1, 1, 0], [0, 1, 1, 0, -1], [0, 1, 0, -1, -2], [-1, 0, -1, -2, -2]]),
			new Piece(5, 4, 2, 1, 5, [[-1, 0, 0, -1], [0, 1, 1, 0], [0, 1, 0, -1], [0, 1, 1, 0], [-1, 0, 0, -1]]),
			new Piece(5, 5, 2, 2, 5, [[-2, -1, 0, 0, -1], [-1, 0, 1, 1, 0], [0, 1, 1, 0, -1], [-1, 0, 1, 0, -2], [-2, -1, 0, -1, -2]]),
			new Piece(5, 5, 2, 2, 5, [[-2, -1, 0, -1, -2], [-1, 0, 1, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 1, 0, -1], [-2, -1, 0, -1, -2]]),
			new Piece(4, 6, 2, 2, 5, [[-2, -1, 0, -1, -2, -2], [-1, 0, 1, 0, 0, -1], [0, 1, 1, 1, 1, 0], [-1, 0, 0, 0, 0, -1]]),
		];

		// x- and z- coordinates for all the pieces
		let pos = {
			0  : { x:6    , z:15.5 },	// i1
			1  : { x:-5.5 , z:12.5 },	// i2
			2  : { x:4.5  , z:15.5 },	// v3
			3  : { x:3.5  , z:14   },	// I3
			4  : { x:-1.5 , z:12.5 },	// O4
			5  : { x:6    , z:18   },	// T4
			6  : { x:-7   , z:11   },	// I4
			7  : { x:3    , z:18   },	// L4
			8  : { x:2    , z:12   },	// Z4
			9  : { x:-10  , z:12.5 },	// L5
			10 : { x:8.5  , z:16.5 },	// T5
			11 : { x:-3   , z:14   },	// V5
			12 : { x:4.5  , z:11.5 },	// N
			13 : { x:7    , z:13   },	// Z5
			14 : { x:10   , z:13   },	// I5
			15 : { x:-1.5 , z:17   },	// P
			16 : { x:-5.5 , z:15   },	// W
			17 : { x:-4   , z:16.5 },	// U
			18 : { x:-9.5 , z:15   },	// F
			19 : { x:1    , z:15.5 },	// X
			20 : { x:-8   , z:17.5 }	// Y
		}

		let rotatedMatrix = new THREE.Matrix4().makeRotationY( toRadians(angle) )

		for (const [i, piece] of pieces.entries()) {
			piece.createPieceMesh(this.color).then( () => {

				piece.mesh.position.set(pos[i].x,-0.5,pos[i].z).applyMatrix4(rotatedMatrix)
				
				// Rotate the piece mesh
				piece.mesh.rotation.y = toRadians(angle)
				
				// Rotate the piece grid
				piece.rotate( 4 - (angle/90) ) // '4-rotations' is to rotate the piece CCW

				this.pieces.push(piece)
				this.scene.add(piece.mesh)
			})
		}

		return this
	}
}