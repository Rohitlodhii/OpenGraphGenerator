import {
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Globe
} from "lucide-react"
import { LucideIcon } from "lucide-react"

export type DimensionPreset = {
  id: string
  name: string
  width: number
  height: number
  ratio: string
  icon: LucideIcon
}

export const DimensionPresets: DimensionPreset[] = [
  {
    id: "open-graph",
    name: "Open Graph (Universal)",
    width: 1200,
    height: 630,
    ratio: "1.91:1",
    icon: Globe
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    width: 1200,
    height: 627,
    ratio: "1.91:1",
    icon: Linkedin
  },
  {
    id: "twitter",
    name: "Twitter / X (Large Card)",
    width: 1200,
    height: 675,
    ratio: "16:9",
    icon: Twitter
  },
  {
    id: "facebook",
    name: "Facebook",
    width: 1200,
    height: 630,
    ratio: "1.91:1",
    icon: Facebook
  },
  {
    id: "instagram-post",
    name: "Instagram Post",
    width: 1080,
    height: 1080,
    ratio: "1:1",
    icon: Instagram
  },
  {
    id: "instagram-story",
    name: "Instagram Story",
    width: 1080 ,
    height: 1920,
    ratio: "9:16",
    icon: Instagram
  },
  {
    id: "youtube-thumbnail",
    name: "YouTube Thumbnail",
    width: 1280,
    height: 720,
    ratio: "16:9",
    icon: Youtube
  }
]