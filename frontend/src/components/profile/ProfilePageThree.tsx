import ProfileColourText from './ProfileColourText'

export default function ProfilePageThree() {
  return (
    <article className="profile-page profile-page-three-live">
      <div className="profile-page-three-copy">
        <h1 className="profile-colour-text"><ProfileColourText>INNER FULFILMENT</ProfileColourText></h1>
        <p className="profile-colour-text"><ProfileColourText>I made this transition because I wanted my career to be driven by inner fulfilment and the opportunity to contribute through work that creates long-term value for society.</ProfileColourText></p>
        <p className="profile-colour-text"><ProfileColourText>I have always been curious about how technology shapes the future and how different technical solutions can lead to different outcomes.</ProfileColourText></p>
        <p className="profile-colour-text"><ProfileColourText>Leaving a stable job and a familiar environment was part of that decision. I wanted to build the confidence and independence to live overseas and push myself to explore the world from new perspectives.</ProfileColourText></p>
        <p className="profile-colour-text"><ProfileColourText>Much of my earlier work was centred on online communities, where I saw how technology can help people express themselves, find a sense of belonging and connect with one another. Commercial results matter, but they are not the only measure of meaningful work. I hope to continue developing the skills and perspective needed to create lasting value for people and communities.</ProfileColourText></p>
      </div>
      <div className="profile-page-three-gallery">
        <div className="profile-page-three-column profile-page-three-column-left">
          <img className="profile-page-three-market" src="/profile/page-three-market.JPG" alt="Market" />
          <img className="profile-page-three-circle" src="/profile/page-three-circle.JPG" alt="Circular garden doorway" />
        </div>
        <div className="profile-page-three-column profile-page-three-column-right">
          <img className="profile-page-three-city" src="/profile/page-three-city.JPG" alt="City view" />
          <img className="profile-page-three-window" src="/profile/page-three-window.jpg" alt="Sunlit window" />
        </div>
      </div>
      <div className="profile-page-three-title profile-colour-text"><ProfileColourText>Why I am here</ProfileColourText></div>
    </article>
  )
}
