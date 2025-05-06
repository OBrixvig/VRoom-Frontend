# CSS Cheat Sheet

## Selectors
- `*` - Universal selector
- `#id` - Select by ID
- `.class` - Select by class
- `element` - Select by element
- `element, element` - Grouping selectors
- `element element` - Descendant selector
- `element > element` - Direct child selector
- `element + element` - Adjacent sibling selector
- `element ~ element` - General sibling selector

## Box Model
- `margin` - Space outside the element
- `border` - Border around the element
- `padding` - Space inside the element
- `width` / `height` - Content dimensions

## Positioning
- `static` - Default positioning
- `relative` - Position relative to itself
- `absolute` - Position relative to nearest positioned ancestor
- `fixed` - Position relative to the viewport
- `sticky` - Toggles between relative and fixed

## Flexbox
- `display: flex;` - Enable flexbox
- `flex-direction` - Row, column, row-reverse, column-reverse
- `justify-content` - Align items horizontally
- `align-items` - Align items vertically
- `align-self` - Align a single item
- `flex-wrap` - Wrap items

## Grid
- `display: grid;` - Enable grid
- `grid-template-columns` / `grid-template-rows` - Define grid structure
- `gap` - Space between grid items
- `grid-column` / `grid-row` - Position items in the grid
- `align-items` / `justify-items` - Align items in the grid

## Typography
- `font-family` - Set font
- `font-size` - Set font size
- `font-weight` - Set font weight
- `line-height` - Set line height
- `letter-spacing` - Adjust spacing between letters
- `text-align` - Align text (left, right, center, justify)

## Colors
- `color` - Text color
- `background-color` - Background color
- `border-color` - Border color
- `opacity` - Transparency level

## Pseudo-classes
- `:hover` - Hover state
- `:focus` - Focus state
- `:nth-child(n)` - Select nth child
- `:first-child` / `:last-child` - First/last child

## Pseudo-elements
- `::before` / `::after` - Insert content before/after
- `::placeholder` - Style input placeholder

## Transitions & Animations
- `transition` - Smooth property changes
- `animation` - Define keyframe animations
- `@keyframes` - Specify animation steps

## Media Queries
```css
@media (max-width: 600px) {
    /* Styles for small screens */
}
```

## Common Units
- `px` - Pixels
- `%` - Percentage
- `em` / `rem` - Relative to font size
- `vh` / `vw` - Viewport height/width

## Useful Properties
- `overflow` - Handle overflow (visible, hidden, scroll, auto)
- `z-index` - Stack order
- `box-shadow` - Add shadow to elements
- `border-radius` - Round corners
- `cursor` - Change cursor style
