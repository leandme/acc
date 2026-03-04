import { permanentRedirect } from "next/navigation";

export default function SkinTypeDetectorRedirectPage() {
  permanentRedirect("/skin-analyzer");
}
