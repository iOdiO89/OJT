export default function Home(): HTMLElement {
  const container = document.createElement('div')
  container.innerHTML = `
    <h1>Welcome to Home</h1>
    <p>This is the home page.</p>
  `
  return container
}
