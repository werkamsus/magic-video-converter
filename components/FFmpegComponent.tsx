"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { createFFmpeg } from "@ffmpeg/ffmpeg"

import { Input } from "./ui/input"

const ffmpeg = createFFmpeg({
  log: true,
  mainName: "main",
  corePath: "https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js",
})
export default function FFmpegComponent() {
  const [ready, setReady] = useState(false)
  const [video, setVideo] = useState<File>()
  const [gif, setGif] = useState()

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

  return (
    <div>
      <h1>Loading FFMPEG {ready && <p>Ready!</p>}</h1>
      <Input type="file" onChange={handleVideoChange} />

      {video && <video controls width="250" src={URL.createObjectURL(video)} />}
    </div>
  )
}
