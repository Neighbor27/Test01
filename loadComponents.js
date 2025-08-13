// loadComponents.js

document.addEventListener("DOMContentLoaded", async () => {

  // --- 헤더의 모든 기능을 초기화하는 함수 ---
  const initializeHeader = () => {
    // --- 데스크톱 햄버거 메뉴 로직 (새로 추가) ---
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


    // --- 기존 모바일 메뉴 로직 (변경 없음) ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu'); // 모바일 메뉴는 별도로 존재해야 합니다.
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.toggle('hidden'); // 또는 menu-open/menu-closed 사용
        document.body.style.overflow = isHidden ? '' : 'hidden';
        
        if (hamburgerIcon && closeIcon) {
          hamburgerIcon.classList.toggle('hidden', !isHidden);
          closeIcon.classList.toggle('hidden', isHidden);
        }
        
        if (!isHidden && notificationPanel) {
          notificationPanel.classList.add('hidden');
        }
      });
    }

    // --- 알림 관련 로직 (기존과 동일) ---
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

          if (hamburgerIcon && closeIcon) {
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
          }
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


  // --- 컴포넌트 로딩 로직 (기존과 동일) ---
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