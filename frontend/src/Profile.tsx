import { useEffect, useState } from 'react'
import SiteNav from './SiteNav'
import ProfilePageCurl from './components/ProfilePageCurl'
import ProfilePageOne from './components/profile/ProfilePageOne'
import ProfilePageTwo from './components/profile/ProfilePageTwo'
import ProfilePageThree from './components/profile/ProfilePageThree'
import './home.css'

export default function Profile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)')
    const update = () => setIsMobile(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return (
    <div className="nf nf-detail">
      <SiteNav />
      {isMobile ? (
        <main className="profile-mobile" aria-label="Profile">
          <ProfilePageOne />
          <ProfilePageTwo />
          <ProfilePageThree />
        </main>
      ) : (
        <ProfilePageCurl />
      )}
    </div>
  )
}
