export default function (src, callback) {
  const script = document.createElement('script')
  script.onload = () => callback
  script.src = src
  document.head.appendChild(script)
}
