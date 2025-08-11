// loadComponents.js

document.addEventListener("DOMContentLoaded", () => {
  const loadComponent = (url, elementId) => {
    return fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
      })
      .then((data) => {
        const element = document.getElementById(elementId);
        if (element) element.innerHTML = data;
      })
      .catch((error) =>
        console.error(`Could not load component from ${url}:`, error)
      );
  };

  Promise.all([
    loadComponent("header.html", "header-placeholder"),
    loadComponent("footer.html", "footer-placeholder"),
    loadComponent("next-button.html", "next-button-placeholder"),
  ]).then(() => {
    // 모든 컴포넌트 로딩이 완료된 후, 커스텀 이벤트를 발생시킵니다.
    document.dispatchEvent(new Event('componentsLoaded'));
  });
});