# Reflector

Graphical web application built as a project for [VIN](https://www.fit.vut.cz/study/course/VIN/.en) course at [VUT FIT](https://www.fit.vut.cz/.en).

## Usage

1. Open the app in a modern web browser
2. Upload an image using drag & drop or file selector
3. Adjust parameters using the control panel:
   - Drag sliders to change values
   - Select reflection type from dropdown
   - Pick background color
4. Move mouse to change refletion center
5. Export your creation as image or GIF

### Keyboard Shortcuts

- `s` - Save image as PNG
- `p` - Pause/Resume animation
- `g` - Quick GIF export (1.5s duration, 0.5s delay)
- `Esc` - Close dialogs

## Installation

1. Clone the repository:
```bash
git clone https://github.com/MudrakIvan/VIN
```
2. Serve the files using a local web server. For example using python:
```bash
python -m http.server 8000
```
3. Open `http://localhost:8000` in your browser

## Development

The project is structured in modules:
- `reflection-renderer.js` - Handles rendering logic
- `reflection-state-manager.js` - Manages application state
- `init.js` - Initializes the application and UI

## Credits

Created as a school project for [VIN](https://www.fit.vut.cz/study/course/VIN/.en) course at [VUT FIT](https://www.fit.vut.cz/.en).
