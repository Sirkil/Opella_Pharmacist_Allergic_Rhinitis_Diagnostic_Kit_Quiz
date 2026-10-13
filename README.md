# Clearer Days | Opella

A phone-first pharmacy symptom check using the supplied Opella logo and fonts, dark green `#042B0B`, and warm cream `#F7EFE6`. A restrained animated wave leads into twelve focused questions, one at a time. The flat header gives the logo room; progress appears once the check begins. The app sits within 5% top and bottom viewport margins, and phone screens divide their content into equal upper and lower halves. Answer choices are large and descriptive. A result and optional pharmacist details follow. Desktop keeps the same journey and adds a progress panel. Motion can be turned off.

## Run locally

Open `dist/index.html` in a browser, or serve `dist` with a static HTTP server. No build step, dependencies, account, or patient identifier is required. Answers stay in memory only and reset when the page reloads or **New check** is selected.

## Decision-support behavior

- First match wins. Any reported fever, thick yellow or green discharge, facial sinus pain, or duration over 14 days prompts pharmacist referral assessment before any self-care pathway.
- The allergy and air pathway requires clear watery discharge, itching, no listed safety flag, and a manually selected AQI above 100. Reported worsening on polluted days and agreement between today's AQI and symptom severity add context, but are not required for this pathway.
- The cold pathway uses watery discharge, sneezing, and congestion without itching, a listed safety flag, or reported pollution worsening. The additional no-itch check sends mixed allergy/cold clues to pharmacist review. Mild malaise and shorter duration are supporting context.
- Missing answers and other mixed patterns go to **Further review**.

AQI is manual by user choice; no live data source is connected. The app does not diagnose, prescribe, or store patient data. Medication and referral decisions require clinical validation and pharmacist judgment. The deck's fixed fexofenadine range and statement that suspected infection requires antibiotics were not placed into patient recommendations: dosing depends on indication, age and local labeling, and coloured mucus alone does not establish a bacterial infection. The pharmacist panel names fexofenadine as an option to assess without an automatic dose. Air-quality categories follow [AirNow](https://www.airnow.gov/aqi/aqi-basics/). Medical wording was checked against [NHS fexofenadine dosing](https://www.nhs.uk/medicines/fexofenadine/how-and-when-to-take-fexofenadine/), [NHS allergic rhinitis](https://www.nhs.uk/conditions/allergic-rhinitis/), [CDC common cold guidance](https://www.cdc.gov/common-cold/about/), and [CDC sinus infection guidance](https://www.cdc.gov/sinus-infection/about/).

## Verify

Run `node tests/logic.cjs` to check the four result paths and render the introduction, all questions, and both result views without browser dependencies.
