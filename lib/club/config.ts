// Everything about the 280 Club that a coach might want to change lives here.
// Wording for the waiver, health consent and screening questions comes from the
// client's documents (Docs/ folder). Whenever any of that wording changes, bump
// its version: every booking and submission stores the version that was accepted.

export const CLUB = {
  name: "Auric 280 Club",
  firstClassDate: "2027-01-02", // Saturday 2 January 2027
  weeksAhead: 6, // how many upcoming Saturdays are open for booking
  capacity: 12, // adults per class (children are not counted)
  pricePence: 1000,
  holdMinutes: 32, // place is held while the customer pays (Stripe needs at least 30)
  refundCutoffHours: 24, // cancel by Friday 07:30 for a full refund
  offerHours: 12, // how long a waiting-list offer is held for
  screeningRefreshMonths: 12, // proposed club review interval for a full questionnaire refresh
  time: "07:30–08:30",
  venue: "Park Room at COACH, French Weir Park, Taunton, TA1 1AW",
  venueUrl: "https://coach-taunton.org.uk/find-us/",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=COACH+French+Weir+Park+Taunton+TA1+1AW",
  parking: "Wood Street Car Park, Enfield Car Park, Tangier Car Park",
  coffee: "The Weir Café at COACH, downstairs from 09:00. Drinks purchased individually.",
  children: "Children attend free with their parent, who supervises them throughout.",
  replyTo: "info@auricperformance.co.uk",
  healthContact: "alex@auricperformance.co.uk", // consent withdrawal and private health questions
  coachName: "Alex",
  privacyUrl: "/privacy-policy",
} as const;

// Bump when the privacy notice linked above changes materially.
export const PRIVACY_VERSION = "2026-11";

export const CANCELLATION_POLICY = [
  "Cancel by Friday at 07:30: full refund for Saturday’s class.",
  "Cancel after that deadline or don’t attend: no refund.",
  "If we cancel the class: everyone receives a full refund.",
];

// ---------------------------------------------------------------------------
// Parent participation waiver (client document, version 1.4)
// ---------------------------------------------------------------------------

export const WAIVER_VERSION = "1.4";
export const WAIVER_TITLE = "Parent participation waiver";

export const WAIVER: { heading: string | null; body: string[] }[] = [
  {
    heading: null,
    body: [
      "Read this agreement before completing your booking. It records exercise risks and supervision responsibilities; it does not remove legal rights. Tick the single acknowledgement at the end to accept it.",
      "Auric 280 Club is operated by Alexander Peterson and Courtney Alexander trading in partnership as Auric Performance (Auric). Alex delivers adult circuit classes at the Park Room at COACH, Taunton. Questions or concerns: alex@auricperformance.co.uk. This version applies to the session or sessions in this booking.",
      "I am at least 18 and am accepting for my own participation as the named attending adult. A person paying for another adult cannot accept for that adult; each attending adult must accept personally. Child-related terms apply only when I bring children.",
    ],
  },
  {
    heading: "Exercise risks",
    body: [
      "Circuits may include bodyweight movements, free weights, balls, sandbags and conditioning. Risks include fatigue, soreness, dizziness, falls, collisions, strains, sprains, joint or back injuries, and injury from moving or dropped equipment. Serious injury, permanent disability and, rarely, death can occur. Babies and children may be injured by falls, collisions or equipment, whether or not they exercise.",
      "I choose to participate, recognising the ordinary inherent risks remaining despite reasonable care. This is not acceptance of negligent conduct. I will follow instructions, ask if unsure, and use suitable loads and intensity. I can decline, adapt, rest or stop. The 280-rep format never requires me to continue when tired, unwell or unsafe.",
    ],
  },
  {
    heading: "My health and safe participation",
    body: [
      "I will complete pre-exercise screening honestly before my first class and keep it current. Alex must review my answers before I exercise. For later bookings I will review my saved answers, confirm whether anything has changed and report new symptoms, conditions, injuries, medication effects or restrictions. Changes need review before exercise. I will seek appropriate healthcare advice if suitability is uncertain, and will not train while impaired by alcohol, drugs or illness.",
      "I will stop and tell Alex immediately about pain, chest discomfort, faintness, unusual breathlessness or other concerning symptoms. I will promptly report hazards, damaged equipment, accidents and near misses. Reporting is for safety and does not create a deadline for legal claims.",
    ],
  },
  {
    heading: "My responsibility for my children",
    body: [
      "I am each child’s parent or legal guardian, or have permission from a person with parental responsibility to bring and supervise them. I give prior consent for every child recorded in this booking to attend with me under my continuous supervision. I accept primary responsibility for their care and behaviour. Auric provides adult coaching, not childcare. These responsibilities do not replace Auric’s own duties towards adults or children.",
      "There is no fixed child-number limit, but I will bring only as many children as I can safely supervise. I will tell Auric their number and relevant ages before attending. Safe layout and venue occupancy limits still apply. I will remain present, keep children within sight and close enough to intervene, and stop exercising to attend to them. If safe supervision is not possible, I will stop and, if necessary, leave the session.",
    ],
  },
  {
    heading: "Children and training equipment",
    body: [
      "I will keep children clear of moving weights, loaded bars, equipment storage and other adults’ exercise space. They must not run through stations, climb on equipment or handle kit without permission. I will put my own load down safely before attending to a child. Buggies and belongings must be positioned as directed with exits clear; brakes and restraints must follow the manufacturer’s instructions. I will not use a child as a weight or exercise while holding or wearing a child.",
      "My consent allows children to accompany me; it does not automatically permit exercise. A child may copy a movement only after Alex specifically confirms that it is suitable and permitted by the qualifications, insurance and risk assessment, and I consent beforehand. Any required child screening and consent must also be completed. Adult loads and repetitions are not automatically suitable. I remain responsible for supervision and will stop a child if distressed or instructed.",
    ],
  },
  {
    heading: "Care and emergencies",
    body: [
      "I remain responsible for feeding, changing, toileting, medicines and allergy precautions. I will privately explain relevant safety or accessibility needs and collection restrictions. I will not leave children unattended or assume someone else will supervise them. My supervision responsibilities continue during arrival, setup, pack-down and any optional café visit.",
      "The class may stop in an emergency. Alex may contact emergency services and my emergency contact and provide first aid within his competence. If I cannot respond or supervise my children, necessary help may be sought lawfully. Relevant information may be shared with emergency responders where necessary and lawful. This is not blanket consent to treatment; lawful consent and treatment decisions remain with the appropriate people and healthcare professionals.",
    ],
  },
  {
    heading: "Conduct and legal responsibility",
    body: [
      "I will follow reasonable safety and evacuation instructions, respect other families and keep hot drinks outside the exercise area. Alex may pause, adapt or end an activity, or require a family to stop, where safety cannot reasonably be maintained. Auric will make reasonable adjustments where required by law. Any refund remains governed by fair booking terms and statutory rights; this agreement creates no automatic forfeiture.",
      "I accept responsibility for my exercise choices and supervision. An accident alone does not establish legal responsibility. Nothing here excludes or restricts liability for death or personal injury caused by negligence, fraud, fraudulent misrepresentation or any other liability that cannot lawfully be excluded or restricted. Auric remains responsible for reasonable care and skill. My statutory consumer rights are unaffected.",
      "I am not waiving any child’s or other person’s legal claims, agreeing to reimburse Auric for claims, or taking responsibility for Auric’s negligence. Accepting this agreement does not make Auric’s own safety duties my responsibility. Responsibility for injury, property damage or other loss depends on the facts and law. No claim is capped at the booking price.",
    ],
  },
  {
    heading: "Information and changes",
    body: [
      "Health-data, marketing and photography permissions remain separate. Relevant privacy information must be available when data is collected. Saved details may be reused after I review and update them; each booking records the information and waiver accepted at that time. Material changes to this agreement require fresh acceptance. Booking and cancellation terms must be shown before payment. Contact Alex if anything is unclear or an adjustment is needed.",
    ],
  },
];

export const WAIVER_ACK =
  "I have read, understood and agree to the full Auric 280 Club Parent Participation Waiver, version 1.4. I accept the responsibilities for my participation and the children I bring, consent to their attendance under my supervision, and acknowledge the risks described. My booking information is accurate to the best of my knowledge and I will report relevant changes. I understand that my and my children’s legal rights remain protected.";

/** Plain-text copy of the waiver for emails. */
export const waiverText = (): string[] =>
  WAIVER.flatMap((s) => [...(s.heading ? [s.heading.toUpperCase()] : []), ...s.body]).concat([
    "ACKNOWLEDGEMENT",
    WAIVER_ACK,
  ]);

// ---------------------------------------------------------------------------
// Health information: consent and pre-exercise screening (client document)
// ---------------------------------------------------------------------------

export const HEALTH_CONSENT_VERSION = "1.0";

export const HEALTH_INTRO =
  "Complete before your first class. Your name and booking details are linked automatically. Answer for yourself only. This questionnaire supports Alex’s review; it is not a diagnosis or medical clearance. If you think you have a medical emergency, call 999; this form is not monitored for urgent help.";

export const HEALTH_USE =
  "Auric Performance uses your answers and relevant follow-up to review exercise suitability, plan adjustments and keep screening current. Read the privacy notice for access, sharing and retention details. Withdraw consent through your account or alex@auricperformance.co.uk. If essential screening cannot be completed lawfully, exercise may need to pause. Withdrawal does not automatically erase records that must lawfully be retained.";

export const HEALTH_CONSENT =
  "I explicitly consent to Auric Performance collecting, securely storing and using my health answers and related follow-up for exercise screening, suitable adjustments and ongoing safety review.";

export const SCREENING_VERSION = "1.0";

export const SCREENING_QUESTIONS: { id: string; text: string }[] = [
  { id: "q1", text: "Have you been diagnosed with a heart or circulation condition, or raised blood pressure, that Alex should consider when planning exercise?" },
  { id: "q2", text: "Have you recently experienced unexplained chest pain, pressure or discomfort, whether during activity or at rest?" },
  { id: "q3", text: "In the past year, have you fainted, blacked out or had unexplained dizziness or balance problems?" },
  { id: "q4", text: "Do you experience unexpected breathlessness or breathing difficulty with ordinary activity or exercise?" },
  { id: "q5", text: "Do you have another health condition that could require exercise adjustments or an emergency plan, such as asthma, diabetes or seizures?" },
  { id: "q6", text: "Do pain, an injury, a mobility problem, recent surgery or ongoing recovery currently affect what exercise you can do?" },
  { id: "q7", text: "Could any medicines or ongoing treatment affect how you exercise safely, or are you unsure about their effects?" },
  { id: "q8", text: "Has a healthcare professional advised you to avoid or limit exercise, use medical supervision, or obtain further advice that is still relevant?" },
  { id: "q9", text: "Is there any other health concern, current illness or uncertainty about taking part that you need to discuss privately?" },
];

export type ScreeningAnswer = "yes" | "no" | "unsure";

export const SCREENING_ANSWER_HELP =
  "Choose Yes, No or Unsure. A Yes or Unsure answer prompts a private review; it does not automatically exclude you.";

export const SCREENING_DETAILS_HELP =
  "If Yes or Unsure: give only details relevant to safe exercise, including any existing restrictions or advice. Alternatively select “Please contact me privately”. Do not upload full medical records.";

export const SCREENING_DECLARATION =
  "Alex will review your answers before you exercise and discuss any follow-up or adjustments. All-No answers are not automatic medical clearance. If clinical approval is needed, wait for the agreed follow-up before exercising. By submitting, I confirm my answers are accurate to the best of my knowledge and agree to report relevant changes.";

export const HEALTH_CHANGE_QUESTION =
  "Since your last screening review, have any answers changed, or have you developed new symptoms, injuries, health conditions, medication effects or exercise restrictions?";

export const REVIEW_PENDING_NOTICE =
  "Screening review pending — do not exercise until Alex has reviewed your information.";

// Coach review outcomes. These are exercise-management decisions, not medical diagnoses.
export const REVIEW_STATUSES = {
  submitted: "Submitted",
  awaiting_discussion: "Awaiting discussion",
  awaiting_clinical_evidence: "Awaiting clinical evidence",
  suitable: "Reviewed – suitable",
  suitable_with_adjustments: "Reviewed – suitable with adjustments",
  deferred: "Exercise deferred",
} as const;

export type ReviewStatus = keyof typeof REVIEW_STATUSES;

// ---------------------------------------------------------------------------
// Optional permissions: separate from the waiver and health consent, unticked
// by default, never required to book, and changeable at any time.
// ---------------------------------------------------------------------------

export const PERMISSIONS_VERSION = "1.0";

export const PERMISSIONS = {
  photo: {
    label: "Photography (optional)",
    text: "I’m happy for Auric Performance to take photos and videos of me during sessions and use them on its website and social media. This covers me only. I can change this at any time.",
  },
  child_photo: {
    label: "Photographing my children (optional)",
    text: "I’m happy for Auric Performance to take photos and videos that include the children I bring to sessions and use them on its website and social media. Children’s names will never be published with them. I can change this at any time, and I can ask for a photo to be removed.",
  },
  marketing: {
    label: "News and offers (optional)",
    text: "Email me occasional news about the 280 Club and Auric Performance. I can unsubscribe at any time.",
  },
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
