const fs = require('fs');
const { execSync } = require('child_process');

const mdPath = "C:\\Users\\Administrator\\.gemini\\antigravity-ide\\brain\\7edee38d-386b-4dc2-8d41-89ae9633139d\\analysis_results.md";
const docPath = "c:\\Users\\Administrator\\.gemini\\antigravity-ide\\scratch\\DysCare_v3-main\\Analisis_DysCare_V3.doc";

try {
  console.log("Generating HTML from Markdown...");
  const html = execSync(`npx -y marked "${mdPath}"`).toString();
  
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
</style>
</head>
<body>
${html}
</body>
</html>`;

  fs.writeFileSync(docPath, docContent, 'utf8');
  console.log('✅ File DOC berhasil dibuat di:', docPath);
} catch (e) {
  console.error("Gagal membuat file DOC:", e.message);
}
