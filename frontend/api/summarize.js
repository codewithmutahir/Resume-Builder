export default async function handler(req, res) {
    if (req.method === 'POST') {
        return res.status(405).json({error: "Only POST requests are allowed"})
    }

    const { text } = req.body

    const response = await axios.post('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
      headers: {
        'Authorization': `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: "POST",
      body: JSON.stringify({
        inputs: text,
      }),
    })

    const data = await response.json()
    return res.status(200).json({summary: data[0].summary_text})
}