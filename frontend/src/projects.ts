export type Project = {
  slug: string
  title: string
  tag: string
  meta: string
  blurb: string
  body: string[]
  cover?: string // optional photo cover; falls back to a coloured book cover
}

// the deck on the home page and the /project/:slug detail pages share this list
export const PROJECTS: Project[] = [
  {
    slug: 'music-match',
    title: 'Music Match',
    tag: 'Full-stack',
    meta: 'React · Node · Python',
    blurb: 'Turns raw audio into a taste profile and matches listeners.',
    body: [
      'Music Match listens to a track, pulls out the features that describe how it actually sounds, and uses that to connect people with overlapping taste.',
      'A Python service handles the audio analysis, a Node API stitches it together, and a React front end turns the numbers into something a person wants to browse.',
    ],
  },
  {
    slug: 'first-step',
    title: 'First Step Solution',
    tag: 'Blockchain',
    meta: 'React · ASP.NET Core',
    cover: '/projects/first-step.jpg',
    blurb: 'A data-sovereignty platform built with Māori communities.',
    body: [
      'First Step is a platform for storing and sharing community data on the community’s own terms — who can see what, and for how long, stays with the people the data belongs to.',
      'I worked across the problem framing and the front end, translating a set of tikanga-led principles into concrete permissions, audit trails and a plain-language consent flow.',
    ],
  },
  {
    slug: 'theta',
    title: 'Theta',
    tag: 'Engineering',
    meta: 'Wellington · 2024',
    blurb: 'Shipping real features on a consultancy delivery team.',
    body: [
      'At Theta I worked inside a delivery team, picking up tickets across the stack and learning how software actually gets shipped for a client rather than for a demo.',
      'Most of my growth here was in the unglamorous parts — reading an unfamiliar codebase, writing tests, and asking the question that unblocks a review.',
    ],
  },
  {
    slug: 'video-edit-tool',
    title: 'Video-edit Tool',
    tag: 'Product',
    meta: 'RedNote · 2021 — 2023',
    cover: '/projects/video-edit.jpg',
    blurb: 'Templates that turn a camera roll into a publishable post in minutes.',
    body: [
      'On RedNote I helped plan the in-app creation tools — template-driven video and photo layouts that take a creator from raw footage to a finished post without leaving the app.',
      'The work was about removing friction: fewer taps to a good-looking result, so more people actually hit publish.',
    ],
  },
]
