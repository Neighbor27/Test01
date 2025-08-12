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

    // 알림 관련 요소
    const notificationButtonDesktop = document.getElementById('notification-button-desktop');
    const notificationButtonMobile = document.getElementById('notification-button-mobile');
    const notificationPanel = document.getElementById('notification-panel');
    const notificationList = document.getElementById('notification-list');
    const emptyState = document.getElementById('notification-empty-state');
    const notificationFooter = document.getElementById('notification-footer');

    // *** 수정된 부분: 햄버거 메뉴 토글 기능 ***
    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        const isMenuHidden = mobileMenu.classList.contains('hidden');
        
        // 메뉴 패널 보이기/숨기기
        mobileMenu.classList.toggle('hidden');
        
        // 버튼에 'active' 클래스를 토글하여 불 들어온 효과 주기
        mobileMenuButton.classList.toggle('active');
        
        // body 스크롤 제어
        document.body.style.overflow = isMenuHidden ? 'hidden' : '';

        // 메뉴가 열릴 때, 혹시 열려있을 수 있는 알림창은 닫기
        if (isMenuHidden && notificationPanel) {
          notificationPanel.classList.add('hidden');
        }
      });
    }

    // 2. 알림 상태 체크 함수 (기존과 동일)
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

    // 3. 알림창 토글 기능 (데스크톱) (기존과 동일)
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
        
        // 모바일 메뉴 닫기 및 버튼 활성 상태 제거
        if (mobileMenu && mobileMenuButton) {
          mobileMenu.classList.add('hidden');
          mobileMenuButton.classList.remove('active'); 
          document.body.style.overflow = '';
        }
        
        // 알림창 열기
        notificationPanel.classList.remove('hidden');
        checkNotifications();
      });
    }

    // 5. 외부 클릭 시 패널 닫기 (기존과 동일)
    document.addEventListener('click', (event) => {
      if (notificationPanel && !notificationPanel.classList.contains('hidden')) {
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
