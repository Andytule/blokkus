# Blokkus
**By [Andy Le](https://andytule.github.io) and [Amos Yu](https://amosyu2000.github.io)**  
**Stack:** HTML · CSS · JavaScript · jQuery · three.js · Blender &nbsp;|&nbsp; **Built:** December 2019 – January 2020

🎮 **[Play it live →](https://amosyu2000.github.io/blokkus)**

A browser-based 3D implementation of the award-winning board game [Blokus](https://www.mattelgames.com/en-ca/blokus) by Mattel Games. Supports 2, 3, and 4 players. All 21 Blokus pieces are rendered as interactive 3D models on a 20×20 board, with a fully orbitable camera, piece placement validation, and a final leaderboard.

---

## Features

- **2–4 player support** — player count and names are entered on the home screen and passed to the game via URL query parameters.
- **Full 3D scene** — the board, studs, and all 21 pieces per player are rendered using three.js with ambient and point lighting, anti-aliasing, and a transparent renderer background.
- **Orbitable camera** — powered by the Camera Controls library; scroll to zoom, and the camera automatically rotates to face each player's side of the board on their turn.
- **Piece interaction** — click a piece to select it (it rises with a smooth easing animation); click again to deselect (it drops back). Press `Z` to rotate 90°, `X` to flip.
- **Piece shadow** — when a piece is selected and the cursor hovers over the board, a colour-coded shadow projects onto the grid studs: green for a valid placement, grey for invalid.
- **Placement validation** — enforces all Blokus rules: pieces must touch a corner of a same-colour piece (or the opening corner on the first move), and cannot touch the face of any same-colour piece.
- **Blinking opening stud** — on each player's first turn, their starting corner pulses to guide placement.
- **Forfeit** — any player can forfeit their remaining pieces; the last remaining player gets a "Finish" prompt and the game ends when all players are done.
- **Final leaderboard** — displays all players ranked by score (tiles placed) with gold/silver/bronze medals, with a "Play Again" button to restart.
- **Animated home screen** — six SVG Blokus pieces float at random positions and drift slowly in response to mouse movement, randomly rotating in the background.

---

## Architecture

### Pages
- **`index.html`** — home screen; player count selection and name entry form. Names are submitted as GET parameters to `blokkus.html`.
- **`blokkus.html`** — the game page; a full-viewport three.js canvas with a floating HUD (current player, score, controls) and forfeit button.

### JavaScript Modules (`resources/js/`)

| File | Responsibility |
|---|---|
| `blokkus.js` | Main game controller — scene setup, render loop, raycasting, piece placement, turn management, game end |
| `board.js` | `Board` class — constructs the 20×20 extruded plane mesh, loads and positions 400 stud meshes from a `.glb` model, tracks board state as a 2D grid |
| `piece.js` | `Piece` class — stores piece geometry as a 2D grid (`1`=tile, `0`=adjacent space, `-1`=corner, `-2`=disconnected), implements `rotate()` (clockwise 90° with anchor point recalculation) and `flip()` (vertical mirror), and `createPieceMesh()` (merges individual tile `.glb` models into a single geometry per piece) |
| `player.js` | `Player` class — stores player state (name, colour, angle, score, forfeit flag), constructs all 21 Blokus pieces with correct pre-rotation for the player's side of the board, and positions them in 3D space |
| `home.js` | Home screen logic — jQuery animations for the player select form, SVG piece parallax mouse-tracking, random piece rotation loop |
| `leaderboard.js` | `createLeaderboard()` — generates the end-game leaderboard HTML; `rankPlayers()` sorts players by score using insertion sort |
| `math.js` | Utility functions — `randInt`, `toHundred`, `toRadians`, `toDegrees` |

### 3D Assets (`resources/static/`)
The `tile.glb` and `stud.glb` models were custom-designed in **Blender**. At runtime, `Piece.createPieceMesh()` loads the tile model and merges one copy per tile in the piece's grid into a single `THREE.Geometry`, reducing draw calls per piece. The board's 400 studs are individually cloned from one loaded mesh.

### Piece Representation
Each of the 21 Blokus pieces is defined as a 2D array in `player.js` using a four-value cell encoding:

```
 1  = a tile that is part of the piece
 0  = a cell adjacent (face-touching) to a tile — cannot place same-colour piece here
-1  = a corner cell — a same-colour piece CAN touch here
-2  = a cell with no relevant relationship to the piece
```

This encoding lets the placement validator check adjacency and corner rules directly by reading the piece grid overlaid onto the board grid, without separate geometry calculations.

---

## How to Play

1. Open `index.html` in a browser (or visit the [live site](https://amosyu2000.github.io/blokkus)).
2. Choose 2, 3, or 4 players and enter player names.
3. Click **Start Game**.
4. On your turn:
   - Click a piece to select it (it lifts off the table).
   - Press **Z** to rotate, **X** to flip.
   - Hover over the board to preview placement (green = valid, grey = invalid).
   - Click a valid board position to place the piece.
5. The game ends when all players have forfeited or placed all their pieces.
6. Scores are the total number of tiles placed. See the [full rules](https://www.ultraboardgames.com/blokus/game-rules.php).

---

## Project Structure

```
blokkus-master/
├── index.html                  # Home screen — player count & name entry
├── blokkus.html                # Game page — three.js canvas & HUD
├── resources/
│   ├── css/
│   │   ├── index.css           # Home screen styles
│   │   └── blokkus.css         # Game page styles
│   ├── js/
│   │   ├── blokkus.js          # Main game controller
│   │   ├── board.js            # Board class
│   │   ├── piece.js            # Piece class (geometry, rotate, flip, 3D mesh)
│   │   ├── player.js           # Player class (piece set, positioning)
│   │   ├── home.js             # Home screen animations & jQuery UI
│   │   ├── leaderboard.js      # End-game leaderboard generation & sort
│   │   └── math.js             # Utility math functions
│   └── static/
│       ├── tile.glb            # 3D tile model (Blender export)
│       ├── stud.glb            # 3D board stud model (Blender export)
│       └── tile.blend / stud.blend  # Source Blender files
└── vendors/
    ├── jquery/                 # jQuery 3.4.1
    ├── three/                  # three.js r112
    └── camera-controls/        # Camera Controls library
```

## Running Locally

Because the game uses ES modules and loads `.glb` assets via `fetch`, it requires a local HTTP server (opening `index.html` directly as a `file://` URL will not work).

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

Then open `http://localhost:8000` in your browser.

---

*Built by [Andy Le](https://andytule.github.io) and [Amos Yu](https://amosyu2000.github.io) — 2019/2020*
