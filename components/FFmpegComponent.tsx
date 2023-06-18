"use client"

import { ChangeEvent, useEffect, useState } from "react"
import Image from "next/image"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { Loader2 } from "lucide-react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

const ffmpeg = createFFmpeg({
  log: true,
  mainName: "main",
  corePath: "https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js",
})
export default function FFmpegComponent() {
  const [ready, setReady] = useState(false)
  const [video, setVideo] = useState<File>()
  const [gif, setGif] = useState<string>()

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

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const videoFile = e.target.files.item(0)

      if (!videoFile) {
        console.error("No video file")
        return
      }
      setVideo(videoFile)
    }
  }

  const convertToGif = async (): Promise<void> => {
    if (!video) return

    ffmpeg.isLoaded() || (await ffmpeg.load())
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(video))

    //detect uploaded file.
    const splitArgs = "-i test.mp4 -ss 5 -t 5 -acodec libmp3lame output".split(
      " "
    )
    await ffmpeg.run(...splitArgs)

    // await ffmpeg.run(
    //   "-i",
    //   "test.mp4",
    //   "-t",
    //   "2.5",
    //   "-ss",
    //   "2.0",
    //   "-f",
    //   "gif",
    //   "out.gif"
    // )

    const data = ffmpeg.FS("readFile", "output")

    
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "audio/mp3" })
    )
    setGif(url)
  }
  return (
    <div className="flex max-w-[600px] flex-col gap-2">
      {ready ? (
        <p>Ready!</p>
      ) : (
        <p>
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </p>
      )}
      <Input type="file" onChange={handleVideoChange} />

      <Button onClick={convertToGif}>Convert to gif</Button>
      {video && <video controls width="250" src={URL.createObjectURL(video)} />}
      {gif && <Image src={gif} width={200} height={200} alt="Converted GIF" />}
      {video && <video controls width="250" src={gif} />}
    </div>
  )
}
