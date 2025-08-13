// loadComponents.js (최종 수정본)

document.addEventListener("DOMContentLoaded", async () => {

  // --- 헤더의 모든 기능을 초기화하는 함수 ---
  const initializeHeader = () => {
    // --- ▼▼▼ 데스크톱 햄버거 메뉴 로직 (수정됨) ▼▼▼ ---
    const desktopHamburgerButton = document.getElementById('desktop-hamburger-button');
    const desktopMenu = document.getElementById('desktop-aside-menu');
    
    // 'X' 버튼이 HTML에서 제거되었으므로 관련 코드 삭제
    // const closeDesktopMenuButton = document.getElementById('close-desktop-menu-button');

    // 메뉴를 토글하는 함수 (내용 변경 없음)
    const toggleDesktopMenu = () => {
        if (desktopMenu) {
            desktopMenu.classList.toggle('desktop-menu-open');
            desktopMenu.classList.toggle('desktop-menu-closed');
        }
    };

    // 햄버거 버튼 클릭 시 메뉴 토글
    if (desktopHamburgerButton) {
        desktopHamburgerButton.addEventListener('click', (event) => {
            // 이벤트 전파를 막아 document의 클릭 리스너에 영향 주지 않도록 함
            event.stopPropagation(); 
            toggleDesktopMenu();
        });
    }

    // 'X' 버튼 이벤트 리스너 삭제
    // if (closeDesktopMenuButton) { ... }

    // --- ▼▼▼ 외부 클릭 시 데스크톱 메뉴 닫기 (새로 추가) ▼▼▼ ---
    document.addEventListener('click', (event) => {
        if (desktopMenu && !desktopMenu.classList.contains('desktop-menu-closed')) {
            // 메뉴가 열려있고, 클릭된 곳이 메뉴나 햄버거 버튼이 아닐 때
            if (!desktopMenu.contains(event.target) && !desktopHamburgerButton.contains(event.target)) {
                // 메뉴를 닫음
                desktopMenu.classList.remove('desktop-menu-open');
                desktopMenu.classList.add('desktop-menu-closed');
            }
        }
    });
    // --- ▲▲▲ 외부 클릭 시 데스크톱 메뉴 닫기 (새로 추가) ▲▲▲ ---


    // --- 모바일 메뉴 로직 (수정 없음) ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        document.body.style.overflow = mobileMenu.classList.contains('hidden') ? '' : 'hidden';
        mobileMenuButton.classList.toggle('is-active');
        
        // 모바일 메뉴 열 때 데스크톱 알림 패널이 있다면 닫기
        const notificationPanel = document.getElementById('notification-panel');
        if (!mobileMenu.classList.contains('hidden') && notificationPanel) {
          notificationPanel.classList.add('hidden');
        }
      });
    }


    // --- 알림 관련 로직 (수정 없음) ---
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
          mobileMenu.classList.add('hidden');
          document.body.style.overflow = '';
          mobileMenuButton.classList.remove('is-active');
        }
        
        notificationPanel.classList.remove('hidden');
        checkNotifications();
      });
    }

    // 알림 패널 외부 클릭 시 닫기 (기존 로직 유지)
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