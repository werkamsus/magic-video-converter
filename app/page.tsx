import FFmpegComponent from "@/components/FFmpegComponent"

export default function IndexPage() {
  return (
    <div>
      {/* <HeroDescription /> */}
      <section
        id="video-conversion"
        className="container grid items-center gap-6 pb-8 pt-6 md:py-10"
      >
        <FFmpegComponent />
        {/* <AIComponent /> */}
      </section>
    </div>
  )
}
