/* ==========================================================================
   AI: Integrasi Gemini API (Text, Vision, Image Generation)
   ========================================================================== */

/**
 * Generate teks menggunakan Gemini
 * @param {string} prompt - Prompt dalam Bahasa Indonesia
 * @returns {Promise<string|null>}
 */
async function generateAIContent(prompt) {
    try {
        const response = await fetch(TEXT_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("AI Text Error:", error);
        return null;
    }
}

/**
 * Generate analisis gambar menggunakan Gemini Vision
 * @param {string} prompt
 * @param {string} base64Image
 * @returns {Promise<string>}
 */
async function generateMultimodalContent(prompt, base64Image) {
    try {
        const mimeType = "image/png";
        const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg);base64,/, "");

        const response = await fetch(VISION_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: mimeType, data: cleanBase64 } }
                    ]
                }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("AI Vision Error:", error);
        return "Maaf, AI sedang sibuk. Coba lagi nanti.";
    }
}

/**
 * Generate gambar menggunakan Imagen
 * @param {string} prompt
 * @returns {Promise<string|null>} base64 image or null
 */
async function generateImage(prompt) {
    try {
        if (!API_KEY) throw new Error("API Key belum diatur");

        const res = await fetch(IMAGE_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                instances: [{ prompt }],
                parameters: { sampleCount: 1 }
            })
        });
        const data = await res.json();

        if (data.predictions?.[0]?.bytesBase64Encoded) {
            return data.predictions[0].bytesBase64Encoded;
        }
        throw new Error("Gagal mengambil gambar dari AI");
    } catch (error) {
        console.error("AI Image Error:", error);
        return null;
    }
}
