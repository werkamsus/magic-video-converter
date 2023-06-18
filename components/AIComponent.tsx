"use client"

import { useCallback } from "react"
import { useCompletion } from "ai/react"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "./ui/button"
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
        `Input file: '${inputFileName}', user request: ${c}
Output:\n`
      )
      if (!completion) throw new Error("Failed to check typos")
      return completion
    },
    [complete, inputFileName]
  )

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        const transformPromise = inputFileTransform(input)
        toast.promise(transformPromise, {
          loading: "Using AI to generate FFMPEG command...",
          success: (data) => {
            const aiResponseWithoutFFmpeg = data.replaceAll("ffmpeg ", "")
            const aiOutputJson = JSON.parse(aiResponseWithoutFFmpeg)
            const output = aiOutputSchema.parse(aiOutputJson)

            return `Command: ${output.command}\n\nOutput type: ${output.output_type}`
          },
          error: (error) =>
            `Something went wrong. Please try our examples, or try again. Might be AI randomness.`,
        })
      }}
    >
      <Input
        value={input}
        placeholder="'Convert to mp3', 'trim first 10 seconds'"
        onChange={handleInputChange}
      />
      {isLoading && (
        <Button disabled type="button">
          Generating...
        </Button>
      )}
      {!isLoading &&
        (completion ? (
          <Button variant="outline" disabled={!input}>
            Re-run conversion
          </Button>
        ) : (
          <Button disabled={!input}>Convert file</Button>
        ))}
    </form>
  )
}
