// loadComponents.js

document.addEventListener("DOMContentLoaded", async () => {

  // --- 헤더 기능 초기화 함수 ---
  const initializeHeader = () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    // ... (기존 헤더의 다른 요소들: notificationButtonDesktop 등)

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.toggle('hidden');
        mobileMenuButton.classList.toggle('active', !isHidden);
        document.body.style.overflow = isHidden ? '' : 'hidden';
      });
    }
    // ... (기존 헤더의 다른 기능들: 알림창 토글, 외부 클릭 등)
  };

  // --- 컴포넌트 로딩 로직 ---
  const loadComponent = (url, elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return Promise.resolve();
    
    return fetch(url)
      .then(response => response.ok ? response.text() : Promise.reject(`Failed to load ${url}`))
      .then(data => {
        element.innerHTML = data;
      })
      .catch(error => console.error(error));
  };
  
  // 1. 레이아웃 로드
  const layoutPlaceholder = document.getElementById('layout-placeholder');
  if (layoutPlaceholder) {
    try {
      const response = await fetch('layout.html');
      if (!response.ok) throw new Error('Layout fetch failed');
      const layoutHtml = await response.text();
      layoutPlaceholder.outerHTML = layoutHtml;
    } catch (error) {
      console.error("Could not load layout:", error);
      return;
    }
  }

  // 2. 페이지 콘텐츠 삽입
  const pageContent = document.getElementById('page-content');
  const mainPlaceholder = document.getElementById('main-content-placeholder');
  if (pageContent && mainPlaceholder) {
    mainPlaceholder.append(...pageContent.children);
    pageContent.remove();
  }
  
  // 3. 나머지 컴포넌트(헤더, 푸터, 버튼) 로드
  Promise.all([
    loadComponent("header.html", "header-placeholder"),
    loadComponent("footer.html", "footer-placeholder"),
    loadComponent("next-button.html", "next-button-placeholder"),
  ]).then(() => {
    // 4. 헤더 기능 초기화
    initializeHeader();
    
    // 5. 페이지별 스크립트 실행 신호
    document.dispatchEvent(new Event('componentsLoaded'));
  });
});
