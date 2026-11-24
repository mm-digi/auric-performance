// Everything about the 280 Club that a coach might want to change lives here.

export const CLUB = {
  name: "Auric 280 Club",
  firstClassDate: "2027-01-02", // Saturday 2 January 2027
  weeksAhead: 6, // how many upcoming Saturdays are open for booking
  capacity: 10,
  pricePence: 1000,
  maxChildren: 2,
  holdMinutes: 32, // place is held while the customer pays (Stripe needs at least 30)
  refundCutoffHours: 24, // cancel by Friday 07:30 for a full refund
  offerHours: 12, // how long a waiting-list offer is held for
  time: "07:30–08:30",
  venue: "Park Room at COACH, French Weir Park, Taunton, TA1 1AW",
  venueUrl: "https://coach-taunton.org.uk/find-us/",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=COACH+French+Weir+Park+Taunton+TA1+1AW",
  parking: "Wood Street Car Park, Enfield Car Park, Tangier Car Park",
  coffee: "The Weir Café at COACH, downstairs from 09:00. Drinks purchased individually.",
  children: "Up to two children per dad, supervised by their parent throughout.",
  replyTo: "info@auricperformance.co.uk",
} as const;

export const CANCELLATION_POLICY = [
  "Cancel by Friday at 07:30: full refund for Saturday’s class.",
  "Cancel after that deadline or don’t attend: no refund.",
  "If we cancel the class: everyone receives a full refund.",
];

// Bump the version whenever the wording changes; each booking stores the
// version the customer agreed to.
export const WAIVER_VERSION = "2026-11-draft-1";

export const WAIVER_TITLE = "Participation waiver and terms";

export const WAIVER: string[] = [
  "The Auric 280 Club is a group exercise class run by Auric Performance. Taking part involves physical exertion, including bodyweight exercises, running and lifting. Like any exercise, it carries a risk of injury.",
  "By booking, you confirm that you are in good health and know of no medical reason why you should not take part. If you have a medical condition, injury, or are unsure whether exercise is suitable for you, you will speak to your GP before attending and tell the coach before the session starts.",
  "You will work at a level that is right for you, follow the coach’s instructions, and stop and tell the coach straight away if you feel unwell, dizzy or in pain.",
  "You take part voluntarily and accept the risks that come with exercise. Auric Performance does not accept liability for injury, loss or damage except where caused by its own negligence. Nothing in this waiver limits liability for death or personal injury caused by negligence.",
  "Children attend free and remain your responsibility at all times. You will supervise any children you bring (up to two) throughout the session, keep them safe around the training area, and accept responsibility for their wellbeing.",
  "You are responsible for your own belongings. Please bring water and suitable clothing and footwear for training indoors or outdoors.",
  "Photos and videos may be taken during sessions for Auric Performance’s website and social media. Tell the coach on the day if you or your children would prefer not to appear.",
  "Payment of £10 is taken when you book to confirm your place. Cancellation policy: " +
    CANCELLATION_POLICY.join(" "),
];
