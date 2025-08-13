// loadComponents.js (최종 수정본)

document.addEventListener("DOMContentLoaded", async () => {

  // --- 헤더의 모든 기능을 초기화하는 함수 ---
  const initializeHeader = () => {
    // --- 데스크톱 햄버거 메뉴 로직 (수정 없음, 정상 작동) ---
    const desktopHamburgerButton = document.getElementById('desktop-hamburger-button');
    const closeDesktopMenuButton = document.getElementById('close-desktop-menu-button');
    const desktopMenu = document.getElementById('desktop-aside-menu');

    const toggleDesktopMenu = () => {
        if (desktopMenu) {
            desktopMenu.classList.toggle('desktop-menu-open');
            desktopMenu.classList.toggle('desktop-menu-closed');
        }
    };

    if (desktopHamburgerButton) {
        desktopHamburgerButton.addEventListener('click', toggleDesktopMenu);
    }
    if (closeDesktopMenuButton) {
        closeDesktopMenuButton.addEventListener('click', toggleDesktopMenu);
    }


    // --- 모바일 메뉴 로직 (애니메이션에 맞게 수정) ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ 수정된 부분 ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
    // 더 이상 사용되지 않는 아이콘 변수 삭제
    // const hamburgerIcon = document.getElementById('hamburger-icon');
    // const closeIcon = document.getElementById('close-icon');

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        // 메뉴 패널을 토글
        mobileMenu.classList.toggle('hidden');
        
        // body 스크롤 방지
        document.body.style.overflow = mobileMenu.classList.contains('hidden') ? '' : 'hidden';
        
        // 버튼 자체에 'is-active' 클래스를 토글하여 CSS 애니메이션을 트리거
        mobileMenuButton.classList.toggle('is-active');

        // 알림 패널이 열려있다면 닫기
        if (!mobileMenu.classList.contains('hidden') && notificationPanel) {
          notificationPanel.classList.add('hidden');
        }
      });
    }
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ 수정된 부분 ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲


    // --- 알림 관련 로직 (일부 수정) ---
    const notificationButtonDesktop = document.getElementById('notification-button-desktop');
    const notificationButtonMobile = document.getElementById('notification-button-mobile');
    const notificationPanel = document.getElementById('notification-panel');
    const notificationList = document.getElementById('notification-list');
    const emptyState = document.getElementById('notification-empty-state');
    const notificationFooter = document.getElementById('notification-footer');

    const checkNotifications = () => {
      if (!notificationList || !emptyState || !notificationFooter) return;
      const notificationItemsCount = notificationList.children.length;
      emptyState.classList.toggle('hidden', notificationItemsCount > 0);
      notificationFooter.classList.toggle('hidden', notificationItemsCount === 0);
    };

    if (notificationButtonDesktop && notificationPanel) {
      notificationButtonDesktop.addEventListener('click', (event) => {
        event.stopPropagation();
        notificationPanel.classList.toggle('hidden');
        if (!notificationPanel.classList.contains('hidden')) {
          checkNotifications();
        }
      });
    }

    if (notificationButtonMobile && notificationPanel) {
      notificationButtonMobile.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        if (mobileMenu && mobileMenuButton) {
          // 메뉴 패널 닫기
          mobileMenu.classList.add('hidden');
          document.body.style.overflow = '';
          
          // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ 추가된 부분 ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
          // 메뉴를 닫았으므로 햄버거 아이콘 상태를 원래대로 복원
          mobileMenuButton.classList.remove('is-active');
          // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ 추가된 부분 ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
        }
        
        notificationPanel.classList.remove('hidden');
        checkNotifications();
      });
    }

    document.addEventListener('click', (event) => {
      if (notificationPanel && !notificationPanel.classList.contains('hidden')) {
        if (!notificationPanel.contains(event.target) && 
            notificationButtonDesktop && !notificationButtonDesktop.contains(event.target) &&
            notificationButtonMobile && !notificationButtonMobile.contains(event.target)) {
          notificationPanel.classList.add('hidden');
        }
      }
    });

    checkNotifications();
  };


  // --- 컴포넌트 로딩 로직 (수정 없음) ---
  const loadComponent = (url, elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return Promise.resolve();
    
    return fetch(url)
      .then(response => response.ok ? response.text() : Promise.reject(`Failed to load ${url}`))
      .then(data => { element.innerHTML = data; })
      .catch(error => console.error(error));
  };
  
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

  const pageContent = document.getElementById('page-content');
  const mainPlaceholder = document.getElementById('main-content-placeholder');
  if (pageContent && mainPlaceholder) {
    mainPlaceholder.append(...pageContent.children);
    pageContent.remove();
  }
  
  Promise.all([
    loadComponent("header.html", "header-placeholder"),
    loadComponent("footer.html", "footer-placeholder"),
    loadComponent("next-button.html", "next-button-placeholder"),
  ]).then(() => {
    initializeHeader();
    document.dispatchEvent(new Event('componentsLoaded'));
  });
});