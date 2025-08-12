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
    // --- 헤더 기능 초기화 시작 ---

    // 모바일 메뉴 관련 요소
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    // 알림 관련 요소
    const notificationButtonDesktop = document.getElementById('notification-button-desktop');
    const notificationButtonMobile = document.getElementById('notification-button-mobile');
    const notificationPanel = document.getElementById('notification-panel');
    const notificationList = document.getElementById('notification-list');
    const emptyState = document.getElementById('notification-empty-state');
    const notificationFooter = document.getElementById('notification-footer');

    // 1. 햄버거 메뉴 토글 기능
    if (mobileMenuButton && mobileMenu && hamburgerIcon && closeIcon) {
      mobileMenuButton.addEventListener('click', () => {
        const isMenuHidden = mobileMenu.classList.contains('hidden');
        
        mobileMenu.classList.toggle('hidden', !isMenuHidden);
        hamburgerIcon.classList.toggle('hidden', !isMenuHidden);
        closeIcon.classList.toggle('hidden', isMenuHidden);
        
        document.body.style.overflow = isMenuHidden ? 'hidden' : '';

        // 메뉴가 열릴 때, 혹시 열려있을 수 있는 알림창은 닫기
        if (isMenuHidden && notificationPanel) {
          notificationPanel.classList.add('hidden');
        }
      });
    }

    // 2. 알림 상태 체크 함수
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
        
        // 모바일 메뉴 닫기
        if (mobileMenu) {
          mobileMenu.classList.add('hidden');
          hamburgerIcon.classList.remove('hidden');
          closeIcon.classList.add('hidden');
          document.body.style.overflow = '';
        }
        
        // 알림창 열기
        notificationPanel.classList.remove('hidden');
        checkNotifications();
      });
    }

    // 5. 외부 클릭 시 패널 닫기
    document.addEventListener('click', (event) => {
      if (notificationPanel && !notificationPanel.classList.contains('hidden')) {
        // 클릭된 곳이 알림 패널이나, 데스크톱/모바일 알림 버튼이 아닐 경우에만 닫기
        if (!notificationPanel.contains(event.target) && 
            !notificationButtonDesktop.contains(event.target) &&
            !notificationButtonMobile.contains(event.target)) {
          notificationPanel.classList.add('hidden');
        }
      }
    });

    // 초기 로드 시 알림 상태 확인
    checkNotifications();

    // --- 헤더 기능 초기화 종료 ---

    // 모든 컴포넌트 로드가 완료되었음을 알림
    document.dispatchEvent(new Event('componentsLoaded'));
  });
});
