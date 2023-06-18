"use client"

import { useCallback } from "react"
import { useCompletion } from "ai/react"
import { toast } from "sonner"
import { z } from "zod"

import { Input } from "./ui/input"

export const aiOutputSchema = z.object({
  command: z.string(),
  output_type: z.string(),
})

export default function AIComponent({
  inputFileName,
  onComplete,
}: {
  inputFileName: string
  onComplete?: (res: string) => void
}) {
  const {
    completion,
    complete,
    input,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    id: "novel",
    api: "/api/generate",
    onFinish: (res, completion) => {
      console.log(res)
      console.log(completion)
      toast.success("AI generated text")
      if (onComplete) {
        onComplete(completion)
      }
    },
    onResponse: (response) => {
      console.log(response)
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.")
        // va.track("Rate Limit Reached")
        return
      }
    },
    onError: () => {
      toast.error("Something went wrong.")
    },
  })

  const inputFileTransform = useCallback(
    async (c: string) => {
      const completion = await complete(
        // a precise prompt is important for the AI to reply with the correct tokens
        `Input file: ${inputFileName}, user request: ${c}
Output:\n`
      )
      if (!completion) throw new Error("Failed to check typos")
    },
    [complete, inputFileName]
  )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        inputFileTransform(input)
      }}
    >
      <Input
        value={input}
        placeholder="Convert to mp3"
        onChange={handleInputChange}
      />
      <p>Completion result: {completion}</p>
    </form>
  )
}
