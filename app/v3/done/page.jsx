'use client'

/* ──────────────────────────────────────────────────────────────
   /v3/done — end of study. Reached from "Finish study" on the
   account page (the demo bars are gone). Tells the tester a
   harmless demo passkey was saved for THIS site's host name and
   how to delete it, asks the browser (best-effort) to drop it,
   and "Start over" wipes the demo and returns to the homepage.
   ────────────────────────────────────────────────────────────── */

import { useEffect, useState } from 'react'
import { PageShell } from '../_components/Chrome'
import { ShieldCheck } from '../_components/Art'
import { signalStudyOver, siteHost } from '../lib/passkey'
import { logEvent, restartDemo } from '../lib/state'

function steps(host) {
  return [
    { key: 'apple', title: 'iPhone, iPad or Mac (Apple Passwords)', body: `Open Settings › Passwords on iPhone or iPad, or the Passwords app on a Mac. Search for ${host}, open it and delete the passkey.` },
    { key: 'chrome', title: 'Chrome (Google Password Manager)', body: `Go to chrome://password-manager or passwords.google.com, open ${host} and choose Delete.` },
    { key: 'windows', title: 'Windows (Windows Hello)', body: `Open Settings › Accounts › Passkeys, find ${host} and remove it.` },
    { key: 'android', title: 'Android (Google Password Manager)', body: `Open Google Password Manager, find ${host} and choose Delete.` },
    { key: 'edge', title: 'Microsoft Edge', body: `Go to edge://wallet/passwords, find ${host} and delete the passkey.` },
  ]
}

function detect() {
  const ua = navigator.userAgent || ''
  if (/Edg\//.test(ua)) return 'edge'
  if (/Android/.test(ua)) return 'android'
  if (/iPhone|iPad|Macintosh/.test(ua) && !/Chrome\/|CriOS/.test(ua)) return 'apple'
  if (/Windows/.test(ua) && !/Chrome\//.test(ua)) return 'windows'
  return 'chrome'
}

export default function DonePage() {
  const [host, setHost] = useState('this site')
  const [first, setFirst] = useState('chrome')

  useEffect(() => {
    setHost(siteHost())
    setFirst(detect())
    signalStudyOver()
    logEvent('study_finished')
  }, [])

  const list = steps(host)
  const mine = list.find((s) => s.key === first) || list[1]
  const others = list.filter((s) => s !== mine)

  return (
    <PageShell>
      <div className="v3-ctr">
        <div className="v3-art"><ShieldCheck /></div>
        <h1 className="v3-h1" style={{ marginTop: 22 }}>Thanks — you’re done</h1>
        <p className="v3-body" style={{ marginTop: 14 }}>
          This test saved a harmless demo passkey to your device&#39;s password manager. The prompt showed{' '}
          <strong style={{ color: '#1E1E35' }}>{host}</strong>. You can delete it now.
        </p>
      </div>

      <div className="v3-done-steps">
        <h2 className="v3-sub" style={{ fontSize: 16 }}>{mine.title}</h2>
        <p className="v3-note" style={{ marginTop: 6 }}>{mine.body}</p>
        {others.map((s) => (
          <details key={s.key} className="v3-done-more">
            <summary>{s.title}</summary>
            <p className="v3-note" style={{ marginTop: 6 }}>{s.body}</p>
          </details>
        ))}
      </div>

      <button type="button" className="v3-btn v3-btn-primary" style={{ marginTop: 26 }} onClick={restartDemo}>
        Start over
      </button>
    </PageShell>
  )
}
