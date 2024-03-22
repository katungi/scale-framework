# Scale Framework Documentation

## Introduction
Scale is a hypothetical front-end framework designed to provide a simple, HTML-first syntax while leveraging the concept of "islands" for efficient loading and initialization of interactive components.

## How to run

1. Clone the repository
2. We use Deno 🦕, no need to install any dependencies
3. Run `deno run -A main.ts`

## Syntax

Scale components are written in `.scale` files, which contain HTML-like syntax, JavaScript, and CSS. Here's a basic example:

This is the current syntax for Scale components:
```html
<script>
  let counter = 0;
  const increment = () => counter++;
  const decrement = () => counter--;
</script>

<button on:click={decrement}>Decrement</button>
<div>{counter}</div>
<button on:click={increment}>Increment</button>

```

This is the proposed syntax for Scale components:
```html
<Scale>
  <template>
    <h1>{count}</h1>
    <button on:click={increment}>You've clicked {count} times</button>
    <button on:click={decrement}>You've clicked {count} times</button>
  </template>

  <script>
    let count = 0;
    let title = 'Hello, Scale!';
    function increment() {
      count += 1;
    }
    function decrement() {
      count --
    }
  </script>

  <style>
    h1 {
      color: blue;
    }
    button {
      background-color: lightblue;
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
    }
  </style>
</Scale>
```

## Islands Architecture

Each Scale component is an "island" of interactivity. During the build process, the Scale compiler identifies these islands and splits them into separate JavaScript bundles. This allows each island to be loaded and initialized independently, improving performance.

## State Management

Scale provides built-in state management, allowing you to easily share state between components. This could be done using a reactive store, similar to Svelte's writable stores.

## Integration with Other Libraries

Scale allows you to write components in other libraries like React, Vue, or Svelte. This is done using a special syntax or a specific tag. For example:

```html
<Scale>
  <template>
    <ReactIsland />
  </template>

  <script>
    import React from 'react';

    function ReactIsland() {
      const [count, setCount] = React.useState(0);

      return (
        <div>
          <p>You clicked {count} times</p>
          <button onClick={() => setCount(count + 1)}>
            Click me
          </button>
        </div>
      );
    }
  </script>
</Scale>
```

## CSS and Tailwind Integration

Scale supports CSS in a dedicated `<style>` tag within the `.scale` files. It also supports Tailwind CSS by default. During the setup process of a new Scale project, Tailwind CSS is automatically installed as a dependency.

## Compiler Specification

The Scale compiler is a crucial part of the framework. Here's a high-level overview of what it needs to do:

1. **Parse `.scale` Files**: The compiler needs to parse the `.scale` files and understand the different sections (template, script, style).

2. **Identify Islands**: The compiler needs to identify the "islands" of interactivity within the components.

3. **Generate Bundles**: For each island, the compiler needs to generate a separate JavaScript bundle. This involves compiling the JavaScript code within the `<script>` tags.

4. **Handle CSS**: The compiler needs to process the CSS within the `<style>` tags and generate a separate CSS file for each component.

5. **Integrate with Tailwind CSS**: If Tailwind CSS classes are used within the components, the compiler needs to generate the corresponding styles.

6. **Support Other Libraries**: The compiler needs to support components written in other libraries like React, Vue, or Svelte.

Remember, this is a high-level specification and the actual implementation would depend on your specific requirements and constraints.
