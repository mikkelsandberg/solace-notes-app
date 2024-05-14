# Solace Notes App
Notes web app for the Solace technical assignment.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Notes

- The live version of this app can be found at: https://solace-notes-app-smoky.vercel.app/
- The authentication backend is scaffolded from a Vercel template: https://vercel.com/templates/next.js/prisma-postgres-auth-starter
- The UI is built using MUI: https://mui.com/
- The text editor for the notes uses `react-quill`: https://www.npmjs.com/package/react-quill

### Features
- Login to the app using the username and password provided.
- Once logged in, all of the notes for the user will be displayed.
  - Notes will be sorted from newest to oldest (based on when they were updated).
  - If no notes are present, a message will be displayed prompting the user to create a new note.
- New notes can be created by clicking on the "+" button in the top nav bar.
  - Notes can be formatted using the controls in the text box, including different heading types, bold, italic, underline, inserting links, and adding lists.
  - Notes must be between 20 characters and 300 characters in length, and this is enforced on the client side. The max length could not be enforced on the server side because the text editor needs to support formatting, which can add additional characters.
  - Note content is sanitized before being saved to the db (since the text editor uses HTML behind the scenes).
- Notes can be edited by clicking on the pencil icon, which opens the edit note dialog.
- Notes can be deleted by clicking on the trash icon.
  - Notes can also be deleted from the edit dialog.
- Search for notes by typing in the search bar and hitting enter or clicking on the Search button.
  - The search is implemented on the server side, and should be able to handle basic text search based on the note content.
  - If no notes match the search query, a message will be displayed indicating that no notes were found.
- Logout of the app using the button in the top nav bar.

### Future Improvements
> With more time, I would want to implement the following features and improvements (in no particular order):

- **Setup multiple environments.**
  - Currently, there is only a single environment (production). It would be good to have a local development environment for testing new features and a staging environment for testing before deploying to production.
- **Add tests.**
  - I would use Jest and React Testing Library to write unit and integration tests for the components and pages.
  - This would help ensure high quality and prevent regressions as the app grows.
- **Use a different or custom UI library.**
  - MUI is great for getting something built quickly and I was already familiar with it, but with more time I would research other UI libraries or build a custom UI library to make the app more unique.
  - I built a custom UI library called Scrapbook that would have been nice to use on this, and it is currently used on the TabletopTown app (https://tabletop.town/). However it is currently only built in Flutter and porting it to React would have taken too long for this assignment.
- **Add the ability to create new accounts.**
  - Since this is publicly available, I did not want to expose the ability to create new accounts without having robust security and anti-spam measures in place, which was out of scope for this assignment.
  - Additionally, I would have liked to implement additional login/signup methods (e.g. Google, Facebook, etc.) to make the app more user-friendly.
- **Basic user data management.**
  - For example, giving users the ability to change their password, update their username, delete their account, etc.
- **Pagination or lazy loading for the notes.**
  - Currently, all notes are loaded at once, which could be slow for users with many notes.
  - This would be one of the first areas I would improve if performance became an issue.
- **Implement an "eager update" strategy for mutations.**
  - For example, when you add or update a note, it submits the mutation and then refetches all of the notes to refresh the UI. Instead, you could update the UI with the submitted form and then let the mutation update things in the db in the background and cache the result. This would make the app feel more responsive, though it has a bit more complexity than was needed for this use-case.
- **Improve search functionality and add more ways to filter and sort results.**
  - The current search is very basic at the moment. I would improve this by using a more robust system like Elasticsearch or Algolia. Also, having additional pieces of metadata like a title or a tagging system would help users better organize their notes and filter based on those properties. It would also be nice to be able to sort notes in different ways as a user (e.g. by date, by title, etc.).
- **Other UX enhancements.**
  - I would make it a 2 step process to delete a note (e.g. click the trash icon, then confirm the deletion), as well as require confirmation before closing the add/edit note dialog if there are unsaved changes.

### Challenges and How I Overcame Them
- **Setting up the project.**
  - Like many endeavers in life, the hardest part is often getting started. Once I had a gameplan for what needed to be built, I decided to use Next.js to bootstrap the project and get a lot of the boilerplate out of the way. This allowed me to focus on building the features and functionality of the app.
  - Since this was going to be a publicly available app, I needed to make sure I had at least a basic level of authentication in place. A quick Google search led me to the Vercel template, which I was able to get up and running quickly. And as an added bonus, I was able to host everything on Vercel as well.
- **Building the UI.**
  - MUI is my go-to for building out a UI without having a concrete design in place. Most of the problems I ran into with MUI were easily resolved by referring to the documentation and Googling the odd issue.
- **Adding the text editor.**
  - Initially I was only going to have a simple, plain-text input field, but I decided that a rich text editor would be a better experience.
  - I have used the Quill editor in the past and have had good experiences with it, so I decided to use the React wrapper for Quill, `react-quill`.
  - I also used `react-hook-form` and `yup` to handle form validation, which made it easy to enforce the note length requirements.
  - The biggest challenge that this presented was sanitizing the HTML content before saving it to the db. I used the `sanitize-html` package to strip out any unwanted tags and attributes before saving the note content.
- **Adding search functionality.**
  - I decided to implement the search functionality on the server side, as this would be more robust and scalable than doing it on the client side.
  - I hadn't used the Drizzle ORM before, but it was easy to pick up and I was able to quickly write all of the back-end logic I needed across the app.

## Local Development

> For the purposes of this assignment, there is only a single environment (production), so access to the secrets will be required to run the app locally; reach out to me if you would like to run the app locally.

1. Create a `.env` file in the root of the project and add the contents provided.
2. Install dependencies (`npm i`) and run the development server (`npm run dev`).
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
