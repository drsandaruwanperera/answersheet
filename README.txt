MAIN WEBSITE ADMIN MODULE

Copy the entire website folder into the root of your answersheet GitHub repository.
It expects ../firebase.js and the existing admin authentication/session system.

All pages are superadmin management pages and use Firestore collections:
websiteGallery, websitePrograms, websiteAbout, websiteResults, websiteTestimonials, websiteResources, websiteClasses, websiteFAQ, websiteContact, websiteSettings.

Images are NOT uploaded to Firebase Storage. Put image files in the GitHub repo assets/ folder and enter the relative path in the relevant admin field.

IMPORTANT: Firestore security rules must restrict these collections to authorized admins. Client-side UI protection alone is not security.
