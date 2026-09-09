import ProfileColourText from './ProfileColourText'

export default function ProfilePageOne() {
  return (
    <article className="profile-page profile-page-one-live">
      <div className="profile-page-one-left">
        <div className="profile-page-one-images">
          <img className="profile-page-one-red" src="/profile/page-one-red.JPG" alt="Portrait under red light" />
          <img className="profile-page-one-human" src="/profile/page-one-human.jpeg" alt="Human Being packaging graphic" />
        </div>
        <h1 className="profile-colour-text"><ProfileColourText>WHO I AM</ProfileColourText></h1>
      </div>
      <div className="profile-page-one-copy">
        <p className="profile-page-one-degree profile-colour-text"><ProfileColourText>(Bachelor’s Degree<br />in Visual Design)</ProfileColourText></p>
        <div className="profile-page-one-rule" />
        <p className="profile-page-one-experience profile-colour-text"><ProfileColourText>Nearly 10 years of experience across product operations, analytics and marketing roles in the social media and mobile technology industries.</ProfileColourText></p>
        <p className="profile-page-one-statement profile-colour-text"><ProfileColourText>Turning messy user behaviour, cultural trends and business questions into products, campaigns and practical systems people want to use.</ProfileColourText></p>
        <p className="profile-page-one-shift profile-colour-text"><ProfileColourText>In 2024, I made a career shift into software development and began studying overseas.</ProfileColourText></p>
      </div>
    </article>
  )
}
