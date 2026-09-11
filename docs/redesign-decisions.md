# Tech Caller Redesign

## Structure

Home introduces Tech Caller, then presents three verified videos and two honest discovery routes: the actual mixed-archive playlist and the channel's stream tab. A brief Work With Us invitation and a small Resources link follow. About contains the longer creator story; Contact contains the enquiry flow.

Resources keeps its existing Supabase data, search, categories, sorting, pagination, detail pages and downloads. The redesign does not replace or reseed that data. A long-description wrapping fix prevents resource cards from overflowing narrow screens.

## Content Sources

Channel identity, selected video IDs, source titles, thumbnail URLs, playlist link and the November 2016 account date come from the channel analyst's direct YouTube research. See channel-research.md for confidence levels and limitations.

Owner clarification received September 9, 2026:

- Offers complete websites for small and large businesses, startups and service-based companies.
- Welcomes freelance work and partnerships.
- Approved public contact email: rohit990797@gmail.com.

These statements support the prospective development offering. They do not establish past clients, delivery results, qualifications or partnership credits. The website makes none of those claims. Gaming and collaboration sections invite discussions without promising outcomes.

## Assets and Maintenance

The original avatar and channel banner are retained. Three thumbnails were downloaded from verified YouTube oEmbed URLs. Images are rendered locally with Next Image, so the homepage does not depend on a live YouTube API call. No YouTube iframe, autoplay or tracking player loads on the homepage.

Update src/content/channel.ts to change the curated selection. Verify ownership, title, thumbnail and context before adding a video. The source LIVE word can occur in a recorded video's original title or thumbnail; the website labels it Stream replay and links to the actual recording.

No subscriber/view counters are shown. No dedicated topic playlists were invented. Older videos are clearly identified as archive material, and no older hack/download links were imported into Resources.

## Enquiry Delivery

Contact is an email-composition flow, not a server email service. The encoded subject and body include the selected enquiry type and entered details. Visitors review and send through their email app. A copyable draft is provided as a fallback. There is no false sent confirmation and no personal-data storage in the website.

## Accessibility and Layout

Navigation includes active-page indication, keyboard focus, a skip link, and a mobile menu that closes on selection or Escape. Forms use native labels, validation and a live status region. Motion respects reduced-motion preferences. Source images remain inspectable; thumbnails retain their original aspect ratio. Main content uses restrained graphite, off-white, mint, and YouTube-red accents.
