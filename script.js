var initialMousePos = { x: 0, y: 0 };
var initialTextBoxPos = { x: 0, y: 0 };
var isDragging = false;
var activeTextBox = null;
var undoStack = [];
var redoStack = [];

function addTextBox() {
    var newTextBox = document.createElement('input');
    newTextBox.type = 'text';
    newTextBox.className = 'textBox';
    newTextBox.value = 'Your Text Here';
    newTextBox.style.position = 'absolute';
    newTextBox.style.left = '0px';
    newTextBox.style.top = '0px';
    newTextBox.addEventListener('mousedown', function(e) {
        initialMousePos.x = e.clientX;
        initialMousePos.y = e.clientY;
        initialTextBoxPos.x = parseInt(this.style.left, 10);
        initialTextBoxPos.y = parseInt(this.style.top, 10);
        isDragging = true;
        activeTextBox = this;
    });
    document.getElementById('weddingCard').appendChild(newTextBox);

    // Add the action to the undo stack
    undoStack.push({ action: 'add', textBox: newTextBox });
    // Clear the redo stack when a new action is performed
    redoStack = [];
}

document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        var dx = e.clientX - initialMousePos.x;
        var dy = e.clientY - initialMousePos.y;
        activeTextBox.style.left = (initialTextBoxPos.x + dx) + 'px';
        activeTextBox.style.top = (initialTextBoxPos.y + dy) + 'px';
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});

document.addEventListener('keydown', function(event) {
    if (event.code === 'Delete' && activeTextBox) {
        // Add the action to the undo stack before deleting
        undoStack.push({ action: 'delete', textBox: activeTextBox });
        // Clear the redo stack when a new action is performed
        redoStack = [];

        activeTextBox.parentNode.removeChild(activeTextBox);
        activeTextBox = null;
    }
});

document.getElementById('color').addEventListener('input', function() {
    if (activeTextBox) {
        activeTextBox.style.color = this.value;
    }
});

document.getElementById('font').addEventListener('change', function() {
    if (activeTextBox) {
        activeTextBox.style.fontFamily = this.value;
    }
});

document.getElementById('size').addEventListener('change', function() {
    if (activeTextBox) {
        activeTextBox.style.fontSize = this.value + 'px';
    }
});

document.getElementById('addTextBox').addEventListener('click', addTextBox);

document.getElementById('undo').addEventListener('click', function() {
    // Undo the last action from the undo stack
    var lastAction = undoStack.pop();
    if (lastAction) {
        if (lastAction.action === 'add') {
            lastAction.textBox.parentNode.removeChild(lastAction.textBox);
        } else if (lastAction.action === 'delete') {
            document.getElementById('weddingCard').appendChild(lastAction.textBox);
        }
        // Add the undone action to the redo stack
        redoStack.push(lastAction);
    }
});

document.getElementById('redo').addEventListener('click', function() {
    // Redo the last undone action from the redo stack
    var lastRedoAction = redoStack.pop();
    if (lastRedoAction) {
        if (lastRedoAction.action === 'add') {
            document.getElementById('weddingCard').appendChild(lastRedoAction.textBox);
        } else if (lastRedoAction.action === 'delete') {
            lastRedoAction.textBox.parentNode.removeChild(lastRedoAction.textBox);
        }
        // Add the redone action back to the undo stack
        undoStack.push(lastRedoAction);
    }
});