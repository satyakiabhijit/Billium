window.addEventListener('error', event => {
  console.error('Unhandled error:', event.error);
});

window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
});
