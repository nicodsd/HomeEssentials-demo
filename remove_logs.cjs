const fs = require('fs');
const path = require('path');

const dirs = [
    "c:/Users/Nicolas/REPOS git/HomeEssentials-demo/src",
    "c:/Users/Nicolas/REPOS git/Home-Essentials-backend/controllers",
    "c:/Users/Nicolas/REPOS git/Home-Essentials-backend/middlewares",
    "c:/Users/Nicolas/REPOS git/Home-Essentials-backend/models",
    "c:/Users/Nicolas/REPOS git/Home-Essentials-backend/config"
];

const keepRegex = /console\.log\(\s*(error|err|err\.stack|'done!'|'database connected'|`.*actualizado`)\s*\)/;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let lines = content.split('\n');
    let changed = false;
    
    let newLines = lines.map(line => {
        if (line.includes('console.log(') && !line.trim().startsWith('//')) {
            if (keepRegex.test(line)) {
                return line;
            } else {
                let trimmed = line.trim();
                if (trimmed.startsWith('console.log(') && (trimmed.endsWith(');') || trimmed.endsWith(')'))) {
                    changed = true;
                    return ''; // completely remove
                } else {
                    let newLine = line.replace(/console\.log\([^)]+\);?/g, '');
                    if (newLine !== line) {
                        changed = true;
                        return newLine.trim() === '' ? '' : newLine;
                    }
                }
            }
        }
        return line;
    }).filter(line => line !== ''); // remove empty lines caused by full replacement
    
    // Actually we shouldn't filter all empty lines, just the ones we made empty.
    // Let's do it better:
    let resultLines = [];
    for(let line of lines) {
        if (line.includes('console.log(') && !line.trim().startsWith('//')) {
            if (keepRegex.test(line)) {
                resultLines.push(line);
            } else {
                let trimmed = line.trim();
                if (trimmed.startsWith('console.log(') && (trimmed.endsWith(');') || trimmed.endsWith(')'))) {
                    changed = true;
                } else {
                    let newLine = line.replace(/console\.log\([^)]+\);?/g, '');
                    if (newLine !== line) {
                        changed = true;
                        if (newLine.trim() !== '') {
                            resultLines.push(newLine);
                        }
                    } else {
                        resultLines.push(line);
                    }
                }
            }
        } else {
            resultLines.push(line);
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, resultLines.join('\n'), 'utf8');
    }
}

function walk(dir) {
    let list = fs.readdirSync(dir);
    list.forEach(file => {
        let filePath = path.join(dir, file);
        let stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            walk(filePath);
        } else {
            if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
                processFile(filePath);
            }
        }
    });
}

dirs.forEach(dir => walk(dir));
console.log('Done removing logs!');
