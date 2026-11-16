'use client'

import { PageShell } from './Chrome'
import { NeutralKey } from './Art'

/* Same layout as D8/M8: neutral art, H1, body, primary button, link. */
export function OutcomePage({ title, body, primary, onPrimary, link, onLink }) {
  return (
    <PageShell>
      <div className="v3-ctr">
        <div className="v3-art">
          <NeutralKey />
        </div>
        <h1 className="v3-h1" style={{ marginTop: 22 }}>
          {title}
        </h1>
        <p className="v3-body" style={{ marginTop: 14 }}>
          {body}
        </p>
        <button type="button" className="v3-btn v3-btn-primary" style={{ marginTop: 26 }} onClick={onPrimary}>
          {primary}
        </button>
        <div style={{ marginTop: 12 }}>
          <button type="button" className="v3-linkbtn" onClick={onLink}>
            {link}
          </button>
        </div>
      </div>
    </PageShell>
  )
}
