// Vercel Serverless Function for HuggingFace AI Summary Generation
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Only POST requests are allowed" });
    }

    const { text } = req.body;

    if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: "Text is required" });
    }

    // Get HuggingFace token from environment variables
    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
        return res.status(500).json({ 
            error: "HuggingFace API token not configured",
            message: "Please set HF_TOKEN in Vercel environment variables"
        });
    }

    try {
        // Call HuggingFace Inference API
        const response = await fetch(
            'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HF_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: text,
                    parameters: {
                        max_length: 130,
                        min_length: 30,
                        do_sample: false
                    }
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('HuggingFace API error:', response.status, errorText);
            
            if (response.status === 503) {
                return res.status(503).json({ 
                    error: "Model is loading",
                    message: "The AI model is loading. Please try again in 10-20 seconds."
                });
            }
            
            return res.status(response.status).json({ 
                error: "HuggingFace API error",
                details: errorText
            });
        }

        const data = await response.json();
        
        // HuggingFace returns an array with summary_text
        if (Array.isArray(data) && data.length > 0 && data[0].summary_text) {
            return res.status(200).json({ summary: data[0].summary_text });
        } else {
            console.error('Unexpected HuggingFace response format:', data);
            return res.status(500).json({ 
                error: "Unexpected response format from AI service",
                data: data
            });
        }
    } catch (error) {
        console.error('Error in summarize function:', error);
        return res.status(500).json({ 
            error: "Failed to generate summary",
            message: error.message
        });
    }
}

