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
  const [progress, setProgress] = useState<number>(0)

  ffmpeg.setProgress(({ ratio }) => {
    console.log(`Complete: ${ratio}`)
    setProgress(ratio)
  })

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
        <div>
          <p className="font-bold">File selected</p>
          <p>Enter your command below.</p>
          {/* {file.type} / {file.name}` */}
        </div>
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
    // toast(`Success, CMD: ${output.command}, type: ${output.output_type}`)
  }

  return (
    <div className="flex flex-col gap-2 transition-all">
      {/* <Toaster /> */}
      {ready ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <p>1. Choose file</p>
            <p>{"2. Tell AI how you'd like to convert it"}</p>
            <p>3. Download result</p>
            <Input type="file" onChange={handleFileChange} />
            <AIComponent
              inputFileName={inputFile?.name || ""}
              onComplete={handleAICallback}
            />
            <Input
              type="text"
              placeholder="AI will generate this"
              disabled
              value={ffmpegCommand}
              onChange={(e) => setFFmpegCommand(e.target.value)}
            />
            <Button
              disabled={!inputFile || !ffmpegCommand}
              onClick={() => {
                const mediaPromise = convertMedia()
                toast.promise(mediaPromise, {
                  loading: `Converting... ${progress}`,
                  success: `Successfully converted! Download the file below.`,
                  error: "Error converting",
                })
              }}
            >
              Convert
            </Button>
          </div>
          <div>
            {inputFile && (
              <div>
                <p>Input file</p>
                <video
                  controls
                  width="250"
                  src={URL.createObjectURL(inputFile)}
                />
              </div>
            )}
          </div>
          {outputFile && <video controls width="250" src={outputFile} />}
        </div>
      ) : (
        <p>
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading FFMPEG...
        </p>
      )}
    </div>
  )
}
