// loadComponents.js

document.addEventListener("DOMContentLoaded", async () => {
  // 1. 레이아웃을 먼저 불러와서 body에 삽입합니다.
  const layoutPlaceholder = document.getElementById('layout-placeholder');
  if (layoutPlaceholder) {
    try {
      const response = await fetch('layout.html');
      if (!response.ok) throw new Error('Layout fetch failed');
      const layoutHtml = await response.text();
      // placeholder를 로드된 레이아웃으로 완전히 교체합니다.
      layoutPlaceholder.outerHTML = layoutHtml;
    } catch (error) {
      console.error("Could not load layout:", error);
      return; 
    }
  }

  // 2. 레이아웃이 로드된 후, 페이지의 고유 콘텐츠를 main-content-placeholder 안으로 이동시킵니다.
  const pageContent = document.getElementById('page-content');
  const mainPlaceholder = document.getElementById('main-content-placeholder');
  if (pageContent && mainPlaceholder) {
    mainPlaceholder.append(...pageContent.children); // 자식 요소들을 직접 이동
    pageContent.remove(); // 빈 컨테이너 제거
  }
  
  // 3. 이제 나머지 부품들(헤더, 푸터, 버튼)을 불러옵니다.
  const loadComponent = (url, elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return Promise.resolve(); // placeholder가 없으면 로드하지 않음
    
    return fetch(url)
      .then(response => response.ok ? response.text() : Promise.reject(`Failed to load ${url}`))
      .then(data => {
        element.innerHTML = data;
      })
      .catch(error => console.error(error));
  };

  // 4. 모든 부품을 병렬로 로드합니다.
  Promise.all([
    loadComponent("header.html", "header-placeholder"),
    loadComponent("footer.html", "footer-placeholder"),
    loadComponent("next_button.html", "next-button-placeholder"),
  ]).then(() => {
    // 5. 모든 부품이 로드된 후, 헤더 기능 등을 초기화합니다.
    
    // --- 기존 헤더 기능 초기화 코드 (모바일 메뉴, 알림 등) ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    // ... (이하 모든 헤더 기능 초기화 코드는 그대로 유지)
    
    // 모든 작업 완료 후, 페이지별 스크립트를 실행하라는 신호를 보냅니다.
    document.dispatchEvent(new Event('componentsLoaded'));
  });
});
