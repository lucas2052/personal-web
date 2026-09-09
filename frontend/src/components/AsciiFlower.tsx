// The portrait is pre-rendered as a looping GIF so its character flow is
// consistent across browsers and does not depend on Canvas frame timing.
export default function AsciiFlower({ src = '/portrait-flow-4.webp' }: { src?: string }) {
  return <img className="nf-ascii" src={src} alt="Animated flowing character portrait" />
}
