# ForceFlow Static Dashboard

A standalone Day 1 dashboard prototype built with HTML5, CSS3, vanilla JavaScript, and Bootstrap 5 CSS from the official CDN. It is isolated from the existing Vite implementation in the parent project.

## Open the dashboard

1. Open `index.html` in a modern browser.
2. Keep an internet connection available so Bootstrap 5 styles can load from jsDelivr. The custom layout and task interaction are local files.

No Node.js packages, build tools, backend, or account are needed.

## What works in this feature

- Today's date is generated in the browser.
- The mobile navigation opens and closes.
- **Edit Goal** explains that goal editing is not implemented yet.
- **Add Task** opens an inline form. A non-empty title and priority add a task to the visible list; Cancel and Escape close the form without adding one.
- Tasks are held in memory only and disappear after a page refresh.
- Summary figures are labeled sample data. The focus timer is a non-running preview.

## Manual test checklist

- [ ] Open the page on desktop, tablet, and a narrow mobile viewport.
- [ ] On mobile, open the menu, close it with the backdrop, and check keyboard focus.
- [ ] Click **Add Task** and confirm the title field receives focus.
- [ ] Submit an empty title and confirm the inline message appears and focus returns to the field.
- [ ] Add a task with each priority and confirm its title and priority appear in Today's Focus and the count increments.
- [ ] Open the form, enter text, click **Cancel**, and confirm no task was added.
- [ ] Open the form and press Escape; confirm it closes.
- [ ] Refresh and confirm tasks clear, sample statistics remain labeled, and the timer remains a preview.
- [ ] Check browser console for errors.
