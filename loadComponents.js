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
    // *** 추가된 부분: 새로운 모바일 메뉴 컴포넌트 로드 ***
    loadComponent("mobile-menu.html", "mobile-menu-placeholder"),
  ]).then(() => {
    // --- 헤더 기능 초기화 시작 ---

    // *** 수정된 부분: 새로운 슬라이드 메뉴 로직 ***
    const hamburgerButton = document.getElementById('hamburger-button');
    const closeMenuButton = document.getElementById('close-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    const toggleMenu = () => {
      if (mobileMenu) {
        mobileMenu.classList.toggle('menu-open');
        mobileMenu.classList.toggle('menu-closed');
      }
    };

    if (hamburgerButton) {
      hamburgerButton.addEventListener('click', toggleMenu);
    }
    if (closeMenuButton) {
      closeMenuButton.addEventListener('click', toggleMenu);
    }

    // 알림 관련 요소 (기존 로직 유지)
    const notificationButtonDesktop = document.getElementById('notification-button-desktop');
    const notificationButtonMobile = document.getElementById('notification-button-mobile');
    const notificationPanel = document.getElementById('notification-panel');
    const notificationList = document.getElementById('notification-list');
    const emptyState = document.getElementById('notification-empty-state');
    const notificationFooter = document.getElementById('notification-footer');

    const checkNotifications = () => {
      if (!notificationList || !emptyState || !notificationFooter) return;
      const notificationItemsCount = notificationList.children.length;
      if (notificationItemsCount > 0) {
        emptyState.classList.add('hidden');
        notificationFooter.classList.remove('hidden');
      } else {
        emptyState.classList.remove('hidden');
        notificationFooter.classList.add('hidden');
      }
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
        toggleMenu(); // 메뉴를 닫고
        notificationPanel.classList.remove('hidden'); // 알림창을 연다
        checkNotifications();
      });
    }

    document.addEventListener('click', (event) => {
      if (notificationPanel && !notificationPanel.classList.contains('hidden')) {
        if (!notificationPanel.contains(event.target) && 
            !notificationButtonDesktop.contains(event.target) &&
            !notificationButtonMobile.contains(event.target)) {
          notificationPanel.classList.add('hidden');
        }
      }
    });

    checkNotifications();

    // --- 헤더 기능 초기화 종료 ---
    document.dispatchEvent(new Event('componentsLoaded'));
  });
});
