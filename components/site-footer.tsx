import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

import { Separator } from "./ui/separator"

export function SiteFooter() {
  return (
    <footer className="bottom-0 w-full border-t bg-background">
      <div className="flex h-16 items-center space-x-4 p-4 sm:container sm:justify-between sm:space-x-0">
        <div className="flex flex-1 items-center justify-center">
          <nav className="flex h-7 items-center space-x-4">
            <div className="flex gap-3 text-xs text-muted-foreground sm:text-sm">
              <Link className="hidden hover:underline sm:inline" href={"/"}>
                Home
              </Link>
              <Link
                className="hover:underline"
                href={"https://waveformer.pro/legal/legal-notice"}
              >
                Legal Notice
              </Link>
              <Link
                className="hover:underline"
                href={"https://waveformer.pro/legal/privacy-policy"}
              >
                Privacy Policy
              </Link>
            </div>
            <Separator orientation="vertical" />
            <div className="flex items-center space-x-1">
              <Link
                href={siteConfig.externalLinks.twitter}
                target="_blank"
                rel="noreferrer"
              >
                <div
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  <Icons.twitter className="h-5 w-5 fill-current" />
                  <span className="sr-only">Twitter</span>
                </div>
              </Link>
              <Link
                href={siteConfig.externalLinks.githubProject}
                target="_blank"
                rel="noreferrer"
              >
                <div
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  <Icons.gitHub className="h-4 w-4 fill-current" />
                  <span className="sr-only">LinkedIn</span>
                </div>
              </Link>
              <Link
                href={siteConfig.externalLinks.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <div
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  <Icons.linkedin className="h-4 w-4 fill-current" />
                  <span className="sr-only">LinkedIn</span>
                </div>
              </Link>
              {/* <ThemeToggle /> */}
            </div>
          </nav>
        </div>
      </div>
    </footer>
  )
}
