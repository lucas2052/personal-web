import { useState, type FormEvent } from 'react'
import SiteNav from './SiteNav'
import './home.css'

const CONTACT_EMAIL = 'llj13yffs@gmail.com'
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xyeyngrj'

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const sendEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    setStatus('sending')

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: form,
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) throw new Error('Form submission failed')
      formElement.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="nf nf-detail nf-contact-page">
      <SiteNav />
      <main className="nf-contact-card">
        <section className="nf-contact-intro">
          <h1>Get In Touch</h1>
          <p>Have a question or an opportunity in mind? Please don’t hesitate to start a conversation.</p>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </section>

        <form className="nf-contact-form" onSubmit={sendEmail}>
          <input type="hidden" name="_subject" value="New portfolio website enquiry" />
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" type="text" placeholder="First name & last name" autoComplete="name" required />

          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />

          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" placeholder="Enter your message here" rows={7} required />

          <button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send'}
          </button>
          <p className={`nf-contact-note nf-contact-${status}`} aria-live="polite">
            {status === 'sent' && 'Thank you — your message has been sent.'}
            {status === 'error' && 'Something went wrong. Please try again or email me directly.'}
          </p>
        </form>
      </main>
    </div>
  )
}
