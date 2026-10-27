# Diwali offer: The Greatest Show On Earth (27 Oct 2026)

## The offer
Book between 1 and 30 November 2026.

| Who | Regular | Diwali offer | Saving |
|---|---|---|---|
| Adult | ₹3,000 | ₹2,500 | ₹500 |
| Child (11 to 15) | ₹2,700 | ₹2,200 | ₹500 |
| Child (4 to 10) | ₹2,000 | ₹1,500 | ₹500 |

Regular prices are from the Airtable record "The Greatest Show On Earth (Winter)" (slug greatest-show-on-earth). The Summer record has different prices and is not part of this offer. 

## How the site shows it
- A dark green banner above the price table: the offer wording.
- A three column table: Regular price struck through in red, Offer price in green, "Save ₹500" under each.
- The experience side card shows "From ~~₹2,000~~ ₹1,500 per person" with the offer wording underneath.
- The offer ends by itself. After the last day the site shows only the regular prices again, with no edit needed.

## How to set it up in Airtable (Experiences, field Prices)
Replace the Prices text of the Winter record with:

```
Offer until 2026-11-30: Diwali offer. Book between 1 and 30 November 2026
Adult | ₹2,500 | ₹3,000
Child (11 to 15) | ₹2,200 | ₹2,700
Child (4 to 10) | ₹1,500 | ₹2,000
Excludes travel from Mumbai to the campsite and back.
```

Rules: "Label | offer price | regular price" makes an offer row. The first line is the banner and the last day (year-month-day). Use the same pattern for any future offer. To stop an offer early, delete the first line.

## Order of work
1. Code is built and tested on the branch. Not live, not on staging yet.
2. Airtable must be edited only after the code is live, because the live site reads Airtable and would show the raw text before then.
3. Go live, then edit Airtable. The change shows within about 5 minutes.

## Confirmed by Aaditya (27 Oct 2026)
- Trips taking place after 30 November are included, as long as the booking is made between 1 and 30 November.
- The village and trip leader payment per guest stays the same. The ₹500 reduction comes from Rock & Anchor (RAA), not from the village.
