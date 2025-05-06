# HTML Cheatsheet

## Basic Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <!-- Content goes here -->
</body>
</html>
```

---

## Common Tags
- **Headings**: `<h1>` to `<h6>`
```html
<h1>Main Heading</h1>
<h2>Subheading</h2>
```

- **Paragraphs**: `<p>`
```html
<p>This is a paragraph.</p>
```

- **Links**: `<a>`
```html
<a href="https://example.com">Visit Example</a>
```

- **Images**: `<img>`
```html
<img src="image.jpg" alt="Description">
```

- **Lists**:
  - Ordered List: `<ol>`
  ```html
  <ol>
      <li>First item</li>
      <li>Second item</li>
  </ol>
  ```
  - Unordered List: `<ul>`
  ```html
  <ul>
      <li>Item 1</li>
      <li>Item 2</li>
  </ul>
  ```

---

## Forms
```html
<form action="/submit" method="POST">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name">
    <button type="submit">Submit</button>
</form>
```

---

## Tables
```html
<table>
    <thead>
        <tr>
            <th>Header 1</th>
            <th>Header 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Data 1</td>
            <td>Data 2</td>
        </tr>
    </tbody>
</table>
```

---

## Semantic Tags
- `<header>`: Defines a header for a document or section.
- `<footer>`: Defines a footer for a document or section.
- `<main>`: Specifies the main content of a document.
- `<section>`: Defines a section in a document.
- `<article>`: Defines an independent piece of content.
- `<aside>`: Defines content aside from the main content.

---

## Media
- **Video**:
```html
<video controls>
    <source src="video.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
```

- **Audio**:
```html
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    Your browser does not support the audio tag.
</audio>
```

---

## Forms with Validation
```html
<form>
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
    <button type="submit">Submit</button>
</form>
```

---

## Useful Attributes
- `id`: Unique identifier for an element.
- `class`: Specifies one or more class names for an element.
- `style`: Inline CSS styles.
- `title`: Adds a tooltip to an element.
- `alt`: Alternative text for images.

---

## Useful Links
- HTML Reference: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML)
- HTML Validator: [W3C Validator](https://validator.w3.org/)