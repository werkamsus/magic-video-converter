import FFmpegComponent from "@/components/FFmpegComponent"
import { HeroDescription } from "@/components/HeroDescription"

export default function IndexPage() {
  return (
    <div>
      <HeroDescription />
      <section
        id="video-conversion"
        className="container grid items-center justify-center p-4 gap-6 pb-8 pt-2 md:py-10"
      >
        <FFmpegComponent />
        {/* <AIComponent /> */}
      </section>
    </div>
  )
}
