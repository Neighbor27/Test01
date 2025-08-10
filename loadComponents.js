document.addEventListener("DOMContentLoaded", () => {
  const loadComponent = (url, elementId) => {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        const element = document.getElementById(elementId);
        if (element) {
          element.innerHTML = data;
        } else {
          console.error(`Element with id "${elementId}" not found.`);
        }
      })
      .catch((error) =>
        console.error(`Could not load component from ${url}:`, error)
      );
  };

  // 헤더와 푸터를 동시에 불러옵니다.
  Promise.all([
    loadComponent("header.html", "header-placeholder"),
    loadComponent("footer.html", "footer-placeholder"),
  ]);
});