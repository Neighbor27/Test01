// loadComponents.js

document.addEventListener("DOMContentLoaded", async () => {
  const layoutPlaceholder = document.getElementById('layout-placeholder');
  
  // 1. 레이아웃을 먼저 불러와서 body에 삽입합니다.
  if (layoutPlaceholder) {
    try {
      const response = await fetch('layout.html');
      if (!response.ok) throw new Error('Layout fetch failed');
      const layoutHtml = await response.text();
      // body의 첫 번째 자식으로 레이아웃을 삽입합니다.
      document.body.insertAdjacentHTML('afterbegin', layoutHtml);
      layoutPlaceholder.remove(); // 기존 placeholder는 제거
    } catch (error) {
      console.error("Could not load layout:", error);
      return; // 레이아웃 로드 실패 시 중단
    }
  }

  // 2. 레이아웃이 로드된 후, 페이지의 고유 콘텐츠를 레이아웃의 main-content-placeholder로 이동시킵니다.
  const pageContent = document.getElementById('page-content');
  const mainPlaceholder = document.getElementById('main-content-placeholder');
  if (pageContent && mainPlaceholder) {
    // page-content의 자식 노드들을 mainPlaceholder로 이동
    while (pageContent.firstChild) {
      mainPlaceholder.appendChild(pageContent.firstChild);
    }
    pageContent.remove(); // 내용물을 옮긴 후 빈 컨테이너는 제거
  }
  
  // 3. 이제 나머지 컴포넌트들(헤더, 푸터, 버튼)을 불러옵니다.
  const loadComponent = (url, elementId) => {
    return fetch(url)
      .then(response => response.text())
      .then(data => {
        const element = document.getElementById(elementId);
        if (element) element.innerHTML = data;
      })
      .catch(error => console.error(`Error loading ${url}:`, error));
  };

  Promise.all([
    loadComponent("header.html", "header-placeholder"),
    loadComponent("footer.html", "footer-placeholder"),
    loadComponent("next_button.html", "next-button-placeholder"),
  ]).then(() => {
    // 4. 모든 컴포넌트가 로드된 후, 헤더 기능 등을 초기화합니다.
    
    // --- 기존 헤더 기능 초기화 코드 (모바일 메뉴, 알림 등) ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    // ... (이하 모든 헤더 기능 초기화 코드는 그대로 유지)
    
    // 모든 작업 완료 후, 페이지별 스크립트를 실행하라는 신호를 보냅니다.
    document.dispatchEvent(new Event('componentsLoaded'));
  });
});
