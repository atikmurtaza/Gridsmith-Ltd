/** Frozen owner-approved H4-D-R1 staging source. Provider permission remains a production gate.
 * Recovered verbatim from the previously accepted H4-B local artifact; no provider request.
 * That artifact has no approved country fields, so no flag is inferred. */
import type { PublicReview } from './public-model.ts';
import { REVIEW_SOURCE_LABEL, REVIEW_SOURCE_URL } from './public-model.ts';

export const APPROVED_STAGING_REVIEWS: readonly PublicReview[] = Object.freeze(
  [
  {
    "key": "review-01",
    "reviewText": "Very good communicator, great artwork, on time and on budget. It was a great experience! Will hire them in the future for similar projects.",
    "rating": 5.0
  },
  {
    "key": "review-02",
    "reviewText": "Very good video, and has hit all the points in the brief, communication could be much better though, as it did go a few days at times with no messages and I had to chase the final product too once the funds had been released, but overall project completed and it does look good.   Would use again on a future project.",
    "rating": 4.6
  },
  {
    "key": "review-03",
    "reviewText": "He did 3D work for me. Very good work. I love it. I have more to do and when i have the budget im going to ask him to do it.",
    "rating": 5.0
  },
  {
    "key": "review-04",
    "reviewText": "I didn't really have a very clear brief in mind, but GridsmithLTD managed to turn my vague idea into a selection of great logo choices for me to choose from, really added value with additional things I hadn't thought of an delivered back much more than my initial request. I would happily work with them again in future, they made the process incredibly smooth and efficient.",
    "rating": 5.0
  },
  {
    "key": "review-05",
    "reviewText": "Very flexible and understanding!",
    "rating": 5.0
  },
  {
    "key": "review-06",
    "reviewText": "They were very communicative and did an excellent job.\n\nOn top of that, they were the first person for this project who was able to answer my questions and talk about their experience doing these types of projects which made me feel confident in hiring Gridsmith.",
    "rating": 5.0
  },
  {
    "key": "review-07",
    "reviewText": "Was relieved to find a professional who was able to\"get\" my thinking, anticipate my needs and execute my assignment so quickly!",
    "rating": 5.0
  },
  {
    "key": "review-08",
    "reviewText": "The work was completed to a high standard, and they were happy to make revisions where needed until everything was working exactly as expected. They were knowledgeable with Shopify and implemented the changes professionally and efficiently.\n\nOverall, I'm very happy with the service and wouldn't hesitate to work with them again on future Shopify projects. Highly recommended!",
    "rating": 5.0
  },
  {
    "key": "review-09",
    "reviewText": "They knew what they were doing, gave me quick results, made every change that I needed and even did a lot of extra things, I 100% recommend them, and the price was great!",
    "rating": 5.0
  },
  {
    "key": "review-10",
    "reviewText": "This Freelancer immediately understood the project,  only having to ask me a few questions.\n\nThe project deliverable was completed to a very high standard, and was demonstrated in a video.\n \nI very much look forward to working with him again!\n\nMany thanks",
    "rating": 5.0
  },
  {
    "key": "review-11",
    "reviewText": "Delivered beyond expectations and actually did more work than requested knowing what was required! Very happy overall and will 100% be using them again.",
    "rating": 5.0
  }
].map((review) => Object.freeze({ ...review, sourceLabel: REVIEW_SOURCE_LABEL, sourceUrl: REVIEW_SOURCE_URL })),
);
