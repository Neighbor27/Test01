// loadComponents.js (최종 수정본)

document.addEventListener("DOMContentLoaded", async () => {

  // --- 헤더의 모든 기능을 초기화하는 함수 ---
  const initializeHeader = () => {
    // 모바일 메뉴 관련 요소
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // 알림 관련 요소
    const notificationButtonDesktop = document.getElementById('notification-button-desktop');
    const notificationButtonMobile = document.getElementById('notification-button-mobile');
    const notificationPanel = document.getElementById('notification-panel');
    const notificationList = document.getElementById('notification-list');
    const emptyState = document.getElementById('notification-empty-state');
    const notificationFooter = document.getElementById('notification-footer');

    // 1. 햄버거 메뉴 토글 기능
    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.toggle('hidden');
        document.body.style.overflow = isHidden ? '' : 'hidden';
        
        // 버튼에 is-active 클래스를 토글하여 CSS 애니메이션을 제어
        mobileMenuButton.classList.toggle('is-active', !isHidden);

        // 메뉴 열 때 다른 패널(알림창)은 닫기
        if (!isHidden && notificationPanel) {
          notificationPanel.classList.add('hidden');
        }
      });
    }

    // 2. 알림 상태 체크 함수
    const checkNotifications = () => {
      if (!notificationList || !emptyState || !notificationFooter) return;
      const notificationItemsCount = notificationList.children.length;
      emptyState.classList.toggle('hidden', notificationItemsCount > 0);
      notificationFooter.classList.toggle('hidden', notificationItemsCount === 0);
    };

    // 3. 알림창 토글 기능 (데스크톱)
    if (notificationButtonDesktop && notificationPanel) {
      notificationButtonDesktop.addEventListener('click', (event) => {
        event.stopPropagation();
        notificationPanel.classList.toggle('hidden');
        if (!notificationPanel.classList.contains('hidden')) {
          checkNotifications();
        }
      });
    }

    // 4. 알림창 열기 기능 (모바일 메뉴 안에서)
    if (notificationButtonMobile && notificationPanel) {
      notificationButtonMobile.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        if (mobileMenu && mobileMenuButton) {
          mobileMenu.classList.add('hidden');
          document.body.style.overflow = '';

          // 메뉴를 닫았으니 is-active 클래스 제거하여 아이콘을 원래대로
          mobileMenuButton.classList.remove('is-active');
        }
        
        notificationPanel.classList.remove('hidden');
        checkNotifications();
      });
    }

    // 5. 외부 클릭 시 알림창 닫기
    document.addEventListener('click', (event) => {
      if (notificationPanel && !notificationPanel.classList.contains('hidden')) {
        if (!notificationPanel.contains(event.target) && 
            !notificationButtonDesktop.contains(event.target) &&
            !notificationButtonMobile.contains(event.target)) {
          notificationPanel.classList.add('hidden');
        }
      }
    });

    // 초기 로드 시 알림 상태 확인 (필요 시)
    checkNotifications();
  };


  // --- 컴포넌트 로딩 로직 ---
  const loadComponent = (url, elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return Promise.resolve();
    
    return fetch(url)
      .then(response => response.ok ? response.text() : Promise.reject(`Failed to load ${url}`))
      .then(data => { element.innerHTML = data; })
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
    // 4. 모든 부품이 로드된 후, 헤더 기능 초기화
    initializeHeader();
    
    // 5. 페이지별 스크립트 실행 신호
    document.dispatchEvent(new Event('componentsLoaded'));
  });
});
