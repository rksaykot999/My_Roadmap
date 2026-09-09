const fs = require('fs');
const path = require('path');

const csvPath = 'C:\\Users\\rksai\\.gemini\\antigravity-ide\\brain\\ac28f617-5115-4822-abb7-ede8b8db4db5\\.system_generated\\steps\\24\\content.md';
const tsOutputPath = path.join('src', 'data', 'roadmapData.ts');

const content = fs.readFileSync(csvPath, 'utf-8');
const lines = content.split('\n');

// Find where the CSV starts
const startIndex = lines.findIndex(line => line.startsWith('দিন (Day)'));
if (startIndex === -1) {
    console.error('Could not find CSV start');
    process.exit(1);
}

const csvLines = lines.slice(startIndex + 1).filter(l => l.trim() !== '');

// Parse CSV logic (accounting for quotes)
function parseCSVLine(text) {
    let ret = [];
    let state = 0; // 0: unquoted, 1: quoted
    let value = "";
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (state === 0) {
            if (c === '"') { state = 1; }
            else if (c === ',') { ret.push(value); value = ""; }
            else { value += c; }
        } else {
            if (c === '"') {
                if (i + 1 < text.length && text[i + 1] === '"') {
                    value += '"'; // escaped quote
                    i++;
                } else {
                    state = 0;
                }
            } else {
                value += c;
            }
        }
    }
    ret.push(value);
    return ret;
}

const data = [];
for (const line of csvLines) {
    const parts = parseCSVLine(line);
    if (parts.length >= 5) {
        let dayStr = parts[0].trim();
        let dayNum = parseInt(dayStr.replace('Day ', ''));
        if (isNaN(dayNum)) continue;
        
        data.push({
            id: dayNum,
            day: dayStr,
            frontend: parts[1].trim(),
            backend: parts[2].trim(),
            aiTools: parts[3].trim(),
            deliverable: parts[4].trim()
        });
    }
}

fs.mkdirSync(path.dirname(tsOutputPath), { recursive: true });

const tsContent = `export interface RoadmapDay {
  id: number;
  day: string;
  frontend: string;
  backend: string;
  aiTools: string;
  deliverable: string;
}

export const roadmapData: RoadmapDay[] = ${JSON.stringify(data, null, 2)};
`;

fs.writeFileSync(tsOutputPath, tsContent, 'utf-8');
console.log('Successfully generated ' + tsOutputPath);
