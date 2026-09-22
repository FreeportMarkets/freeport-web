# Referral install handoff

The root `?ref=FREE-XXXXXX` page displays the code, with store buttons and an
installed-app link. Download attempts the clipboard write within the user's
gesture, awaits it, then opens the existing Freeport AppsFlyer OneLink template.
No clipboard write is attempted on page load. If copy fails, the page keeps the
code visible and offers an explicit continue link with manual-entry instructions.

The default template is `https://freeport.onelink.me/N9I3`, verified on
September22,2026 against the iOS App Store and Android app package. OneLink carries
`deep_link_value=referral`, `deep_link_sub1=<code>` and
`af_dp=freeport://referral/<code>`. The clipboard backup retains
`FREEPORT_REF:<code>` for existing builds. The optional public build-time
`NEXT_PUBLIC_REFERRAL_ONELINK_URL` may override the template only on the same
`freeport.onelink.me` host; invalid overrides fall back to the verified template.
Jason confirmed the existing short link `https://freeport.onelink.me/N9I3/rgpcemn5`
on the same date. This flow uses its underlying N9I3 template with explicit
per-code parameters, so unrelated short-link campaign defaults are not inherited.

The link is delivery evidence, not completed attribution. FreeApp must receive
and persist the referral, wait for authentication, and redeem it in the backend.
Verify a clean physical-device install through the store, then confirm both the
new user's `referral_links` and `creator_qualifications` records. Store redirects
and browser tests alone do not prove deferred delivery to a new install.

No-ref store links, trade pages and partner pages retain their existing behavior.
