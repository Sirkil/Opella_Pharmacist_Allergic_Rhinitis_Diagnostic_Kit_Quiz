# Exact quiz tracks

The quiz has 12 answers. A track appears only when every answer matches one complete pattern below. Any other complete answer set is **undefined** (`review` in the code). Incomplete answers are also undefined.

| Question | Allergy and high AQI | Cold | Referral pattern |
| --- | --- | --- | --- |
| Nasal discharge | Watery and clear | Clear to slightly cloudy | Neither of those |
| Itching | Yes | No | No |
| Sneezing | Repeated bouts | Sneezing without repeated bouts | No |
| Nasal congestion | No | Yes | No |
| Mild malaise | No | Yes | No |
| Fever | No | No | Yes |
| Thick yellow or green discharge | No | No | Yes |
| Facial pain or sinus pressure | No | No | Yes |
| Symptom duration | Unknown | 7 to 10 days | More than 14 days |
| Symptoms worsen with pollution | Yes | No | No |
| AQI | 101–150 **or** 151+ | 0–50 | Unknown |
| AQI aligns with symptoms | Yes | No | No |

The allergy track has two explicit complete patterns, one for each AQI range above 100. The cold and referral tracks each have one complete pattern. Changing any answer produces an undefined result unless the change switches between the two accepted allergy AQI ranges.

The supplied deck specifies characteristic signs but does not fix all 12 answers. For the signs it leaves open, this implementation uses the fixed values shown above to meet the requested exact matching rule. The deck also says one warning sign is enough for referral; the requested exact referral rule takes precedence here. An undefined result still displays any reported warning signs and asks the user to discuss them with a pharmacist.
