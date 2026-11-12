# Interactive pharmacy diagnostic flow

The Arabic quiz implements the five steps supplied on 2026-11-12. Only questions on the chosen branch appear.

| Step | Answer | Next |
| --- | --- | --- |
| Q1 Fever | Yes | Q2 |
| Q1 Fever | No | Q3 |
| Q2 Symptoms beyond nose and throat | Yes | Likely flu |
| Q2 Symptoms beyond nose and throat | No | Possible common cold |
| Q3 Nasal discharge | Thick/yellowish | Possible common cold |
| Q3 Nasal discharge | Thin/clear/watery | Q4 |
| Q4 Sneezing, nasal itching, or itchy/watery eyes | Yes | Q5 |
| Q4 Sneezing, nasal itching, or itchy/watery eyes | No | Other causes of rhinitis; further assessment |
| Q5 Air pollution currently high | Yes | Allergic rhinitis with high air pollution |
| Q5 Air pollution currently high | No | Allergic rhinitis; other potential triggers |

The result screen gives the supplied recommendations for flu, cold, and the pollution path. The supplied text left the fourth recommendation blank, so the quiz gives only general pharmacist guidance for other potential triggers. The additional rhinitis result advises further assessment.

The air pollution answer does not establish that pollution caused the person's symptoms. The Fexofenadine statement summarizes a clinical trial in a controlled exposure setting; suitability for an individual requires pharmacist review. See https://pubmed.ncbi.nlm.nih.gov/33834054/.

For compatibility with the currently deployed Apps Script, every submission still contains seven non-empty legacy answer values: the five self-labeled new answers and two clearly marked unused placeholders. It also carries `schemaVersion: 2` and the five clean `answersV2` values. Questions skipped by branching are recorded as “لم يُطرح”. The updated local `Code.gs` writes version 2 entries to the separate **Diagnostic Flow v2** tab and still accepts historical seven-question submissions in `Sheet1`. It looks up submission IDs in column I for version 2 and column K for legacy entries. This Apps Script file is excluded by `.gitignore`, so it must be copied and redeployed separately. Until then, the deployed version saves self-labeled answers under the old Sheet1 headings.
