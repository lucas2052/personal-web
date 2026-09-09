import ProfileColourText from './ProfileColourText'

export default function ProfilePageTwo() {
  return (
    <article className="profile-page profile-page-two-live">
      <div className="profile-page-two-copy">
        <h1 className="profile-colour-text">
          <ProfileColourText><span>SELECTED WORK IN <sup>*</sup></span><span>PRODUCT &amp; GROWTH</span></ProfileColourText>
        </h1>
        <p className="profile-colour-text"><ProfileColourText>Video templates, filters and AI-assisted<br />creation tools that gave niche styles,<br />fandoms and personal symbols room to<br />spread.</ProfileColourText></p>
        <p className="profile-colour-text"><ProfileColourText><strong>40,000</strong><br />new daily downloads from a feature<br />launch featured by the App Store</ProfileColourText></p>
        <p className="profile-colour-text"><ProfileColourText><strong>+0.7% YoY</strong><br />increase in daily publishing after<br />introducing lower-friction creation tools,<br />including an AI title generator</ProfileColourText></p>
      </div>
      <div className="profile-page-two-gallery">
        <img src="/profile/page-two-app.jpeg" alt="App Store feature" />
        <img src="/profile/page-two-cats.JPG" alt="Cat video template" />
        <img src="/profile/page-two-less.JPG" alt="LESS is MORE template" />
        <img src="/profile/page-two-moments.png" alt="Mobile creation tools" />
      </div>
    </article>
  )
}
