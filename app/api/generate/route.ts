import { OpenAIStream, StreamingTextResponse } from "ai"
import { Configuration, OpenAIApi } from "openai-edge"

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

export const runtime = "edge"

export async function POST(req: Request): Promise<Response> {
  //rate limiting

  let { prompt: content } = await req.json()

  // remove line breaks,
  // remove trailing slash
  // limit to 5000 characters
  content = content.replace(/\n/g, " ").replace(/\/$/, "").slice(0, 5000)

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are an AI assistant that generates FFMPEG commands based on what the user would like to do.
          You always output JSON like this. You don't output anything other than this json. Don't talk. Only output JSON.
          Full ffmpeg command.
          Example:
          {
            "command": "...",
            "output_type": "<file format for html contenttype>",
          }`,
      },
      {
        role: "user",
        content,
      },
    ],
    max_tokens: 100,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)

  // Respond with the stream
  return new StreamingTextResponse(stream)
}
