
// Initialize variables
let activeCell = null;
let copiedText = '';
let boldActive = false;
let italicActive = false;
let underlineActive = false;

// Text formatting functions
function setFont(select) {
    if (activeCell) {
        activeCell.style.fontFamily = select.value;
    }
}

function setSize(select) {
    if (activeCell) {
        activeCell.style.fontSize = select.value + 'px';
    }
}

function toggleBold(button) {
    if (activeCell) {
        boldActive = !boldActive;
        activeCell.style.fontWeight = boldActive ? 'bold' : 'normal';
        button.classList.toggle('active', boldActive);
    }
}

function toggleItalic(button) {
    if (activeCell) {
        italicActive = !italicActive;
        activeCell.style.fontStyle = italicActive ? 'italic' : 'normal';
        button.classList.toggle('active', italicActive);
    }
}

function toggleUnderline(button) {
    if (activeCell) {
        underlineActive = !underlineActive;
        activeCell.style.textDecoration = underlineActive ? 'underline' : 'none';
        button.classList.toggle('active', underlineActive);
    }
}

function setAlignment(align, button) {
    if (activeCell) {
        // Set text alignment based on the button clicked
        activeCell.style.textAlign = align;

        // Reset background color for all alignment buttons
        document.querySelectorAll('.format-button').forEach(btn => btn.classList.remove('active'));

        // Highlight the selected alignment button
        button.classList.add('active');
    }
}

function textColor(input) {
    if (activeCell) {
        activeCell.style.color = input.value;
    }
}

function backgroundColor(input) {
    if (activeCell) {
        activeCell.style.backgroundColor = input.value;
    }
}

// Clipboard functions
function copyText() {
    if (activeCell) {
        copiedText = activeCell.innerText;
        console.log("Copied:", copiedText); // Display the copied text
    }
}

function cutText() {
    if (activeCell) {
        copiedText = activeCell.innerText;
        activeCell.innerText = '';
        document.getElementById('formula-input').value = '';
        updateFooterStats(); // Update stats after cutting text
    }
}

function pasteText() {
    if (activeCell && copiedText) {
        activeCell.innerText = copiedText;
        document.getElementById('formula-input').value = copiedText;
        updateFooterStats(); // Update stats after pasting text
    }
}

// Calculation functions
function trimCells() {
    if (activeCell) {
        activeCell.innerText = activeCell.innerText.trim();
        updateFooterStats(); // Update stats after trimming
    }
}

function upperCaseCells() {
    if (activeCell) {
        activeCell.innerText = activeCell.innerText.toUpperCase();
        updateFooterStats(); // Update stats after changing to uppercase
    }
}

function lowerCaseCells() {
    if (activeCell) {
        activeCell.innerText = activeCell.innerText.toLowerCase();
        updateFooterStats(); // Update stats after changing to lowercase
    }
}

function removeDuplicates() {
    const uniqueValues = new Set();
    document.querySelectorAll('.grid-cell').forEach(cell => {
        const trimmedValue = cell.innerText.trim();
        if (trimmedValue && uniqueValues.has(trimmedValue)) {
            cell.innerText = '';
        } else {
            uniqueValues.add(trimmedValue);
        }
    });
    updateFooterStats(); // Update stats after removing duplicates
}

function findAndReplace(findText, replaceText) {
    const selectedCells = document.querySelectorAll('.grid-cell');
    selectedCells.forEach(cell => {
        if (cell.innerText.includes(findText)) {
            cell.innerText = cell.innerText.replace(new RegExp(findText, 'g'), replaceText);
        }
    });
    updateFooterStats(); // Update stats after find and replace
}

function updateFooterStats() {
    let sum = 0;
    let count = 0;
    let min = Infinity;
    let max = -Infinity;

    document.querySelectorAll('.grid-cell').forEach(cell => {
        const value = parseFloat(cell.innerText);
        if (!isNaN(value)) {
            sum += value;
            count++;
            if (value < min) min = value; // Update min
            if (value > max) max = value; // Update max
        }
    });

    const avg = count > 0 ? (sum / count).toFixed(2) : 0;
    const minDisplay = count > 0 ? min : 0; // Display 0 if no valid numbers are present
    const maxDisplay = count > 0 ? max : 0; // Display 0 if no valid numbers are present

    document.getElementById('sum').querySelector('span').innerText = sum;
    document.getElementById('count').querySelector('span').innerText = count;
    document.getElementById('average').querySelector('span').innerText = avg;
    document.getElementById('min').querySelector('span').innerText = minDisplay;
    document.getElementById('max').querySelector('span').innerText = maxDisplay;
}

function exportData() {
    const data = [];
    document.querySelectorAll('.grid-cell').forEach(cell => {
        data.push({
            address: cell.dataset.address,
            value: cell.innerText.trim()
        });
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'spreadsheet.json'; // File name for export
    a.click();
}

// Event listeners for cells to set activeCell and update stats
const cells = document.querySelectorAll('.grid-cell');
cells.forEach(cell => {
    cell.addEventListener('focus', function () {
        activeCell = cell; // Update the active cell
        // No need to update stats here; they are updated in the input event
    });
});
