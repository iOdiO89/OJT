export default function NotFound(): HTMLElement {
  const container = document.createElement('div')
  container.innerHTML = `
    <h1>Welcome to 404</h1>
    <p>This is the 404 page.</p>
  `
  return container
}
