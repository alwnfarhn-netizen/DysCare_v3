const fs = require('fs');
const zlib = require('zlib');
const https = require('https');
const { execSync } = require('child_process');
const path = require('path');

const mdPath = "C:\\Users\\Administrator\\.gemini\\antigravity-ide\\brain\\7edee38d-386b-4dc2-8d41-89ae9633139d\\analysis_results.md";
const docPath = "c:\\Users\\Administrator\\.gemini\\antigravity-ide\\scratch\\DysCare_v3-main\\Analisis_DysCare_V3_Final.doc";
const workspaceDir = "c:\\Users\\Administrator\\.gemini\\antigravity-ide\\scratch\\DysCare_v3-main";

function fetchImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            } else {
                reject(new Error(`Failed to fetch image: ${response.statusCode}`));
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function run() {
    console.log("Membaca file analisis markdown...");
    let mdContent = fs.readFileSync(mdPath, 'utf8');
    
    // Find mermaid blocks
    const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
    let match;
    let index = 1;
    const replacements = [];
    
    while ((match = mermaidRegex.exec(mdContent)) !== null) {
        const diagramCode = match[1];
        // Kroki encoding: zlib deflate -> base64 -> url-safe base64
        const compressed = zlib.deflateSync(Buffer.from(diagramCode, 'utf8'));
        const encoded = compressed.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        const url = `https://kroki.io/mermaid/png/${encoded}`;
        
        const imgName = `diagram_${index}.png`;
        const imgDest = path.join(workspaceDir, imgName);
        console.log(`Mengunduh gambar diagram ${index}...`);
        await fetchImage(url, imgDest);
        console.log(`Tersimpan: ${imgName}`);
        
        // Add to replacements
        replacements.push({
            original: match[0],
            replacement: `![Diagram ${index}](${imgDest.replace(/\\/g, '/')})`
        });
        index++;
    }
    
    // Replace in markdown
    for (const rep of replacements) {
        mdContent = mdContent.replace(rep.original, rep.replacement);
    }
    
    // Write temporary markdown
    const tempMdPath = path.join(workspaceDir, "temp_analysis.md");
    fs.writeFileSync(tempMdPath, mdContent);
    
    console.log("Konversi markdown ke HTML...");
    const html = execSync(`npx -y marked "${tempMdPath}"`).toString();
    
    const docContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset="utf-8"><title>Analisis DysCare V3</title>
<style>
body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
th { background-color: #f2f2f2; }
h1, h2, h3 { color: #2c3e50; }
code { background-color: #f8f9fa; padding: 2px 4px; border-radius: 4px; }
pre { background-color: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto; }
img { max-width: 100%; height: auto; margin: 15px 0; border: 1px solid #ddd; border-radius: 8px; padding: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
</style>
</head>
<body>
${html}
</body>
</html>`;

    fs.writeFileSync(docPath, docContent, 'utf8');
    fs.unlinkSync(tempMdPath);
    console.log('✅ File DOC berhasil diperbarui dengan gambar diagram di:', docPath);
}

run().catch(console.error);
