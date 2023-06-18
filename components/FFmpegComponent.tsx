"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import AIComponent, { aiOutputSchema } from "./AIComponent"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

const ffmpeg = createFFmpeg({
  log: true,
  mainName: "main",
  corePath: "https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js",
  progress: (p) => console.log(p.ratio),
})

export default function FFmpegComponent() {
  const [ready, setReady] = useState<boolean>(false)
  const [inputFile, setInputFile] = useState<File>()
  const [outputFile, setOutputFile] = useState<string>()
  const [ffmpegCommand, setFFmpegCommand] = useState<string>("")

  const [aiCommandInput, setAiCommandInput] = useState<string>("")

  const load = async () => {
    if (!ffmpeg.isLoaded()) {
      setReady(true)
      return
    }
    await ffmpeg.load()
    setReady(true)
  }

  useEffect(() => {
    load()
  }, [])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const file = e.target.files.item(0)
      if (!file) {
        console.error("No file selected")
        return
      }
      //always rename to "input.{extension}"

      setInputFile(file)
      toast(
        `File selected!, Filetype, size: ${file.type} | ${file.size} | ${file.name}`
      )
    }
  }

  const handleCommandChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFFmpegCommand(e.target.value)
  }

  const convertMedia = async (): Promise<void> => {
    if (!inputFile || !ffmpegCommand) return

    ffmpeg.isLoaded() || (await ffmpeg.load())

    //get input extension
    const inputExtension = inputFile.name.split(".").pop()
    ffmpeg.FS("writeFile", `${inputFile.name}`, await fetchFile(inputFile))
    toast(`writing ${inputFile.name} to fs`)
    console.log(inputFile.name)
    console.log(ffmpegCommand)

    // // Extract output file extension
    const commandSplit = ffmpegCommand.split(" ")
    const outputFile = commandSplit[commandSplit.length - 1] // Assuming output file is always the last argument
    const outputFileExtension = outputFile.split(".").pop()

    const splitArgs = ffmpegCommand.split(" ")

    await ffmpeg.run(...splitArgs)

    const data = ffmpeg.FS("readFile", outputFile)

    const blob = new Blob([data.buffer], {
      type: `audio/${outputFileExtension}`,
    }) // Assuming it's a video output. Change according to your needs
    const url = URL.createObjectURL(blob)
    setOutputFile(url)
  }

  function handleAICallback(aiResponse: string) {
    console.log(aiResponse)
    // console.log(JSON.parse(aiResponse))

    const aiResponseWithoutFFmpeg = aiResponse.replaceAll("ffmpeg ", "")
    const aiOutputJson = JSON.parse(aiResponseWithoutFFmpeg)
    const output = aiOutputSchema.parse(aiOutputJson)

    //replace ffmpeg and first space with empty if exists

    const outputWithoutFFmpeg = {}
    setFFmpegCommand(output.command)
    toast(`Success, CMD: ${output.command}, type: ${output.output_type}`)
  }

  return (
    <div className="flex max-w-[600px] flex-col gap-2">
      {/* <Toaster /> */}
      {ready ? (
        <p>Ready!</p>
      ) : (
        <p>
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </p>
      )}

      <Input type="file" onChange={handleFileChange} />
      <Input
        type="text"
        placeholder="ffmpeg command in"
        value={ffmpegCommand}
        onChange={(e) => setFFmpegCommand(e.target.value)}
      />

      <AIComponent
        inputFileName={inputFile?.name || ""}
        onComplete={handleAICallback}
      />

      <Button onClick={convertMedia}>Convert</Button>
      {inputFile && (
        <video controls width="250" src={URL.createObjectURL(inputFile)} />
      )}
      {outputFile && <video controls width="250" src={outputFile} />}
    </div>
  )
}
