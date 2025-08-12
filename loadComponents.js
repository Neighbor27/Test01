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

    // 터치(pointer) 로 버튼 누를 때, 포커스가 남지 않도록 blur()
    if (mobileMenuButton) {
      mobileMenuButton.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') {
          mobileMenuButton.blur();
        }
      });
    }

    // 모바일 메뉴 토글 (aria-expanded 기반)
    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        const isOpen = mobileMenuButton.getAttribute('aria-expanded') === 'true';

        mobileMenu.classList.toggle('hidden', isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
        mobileMenuButton.setAttribute('aria-expanded', String(!isOpen));

        if (!isOpen && notificationPanel) {
          notificationPanel.classList.add('hidden');
        }
      });
    }

    // 알림 관련 요소
    const notificationButtonDesktop = document.getElementById('notification-button-desktop');
    const notificationButtonMobile = document.getElementById('notification-button-mobile');
    const notificationPanel = document.getElementById('notification-panel');
    const notificationList = document.getElementById('notification-list');
    const emptyState = document.getElementById('notification-empty-state');
    const notificationFooter = document.getElementById('notification-footer');

    // 2. 알림 상태 체크 함수
    const checkNotifications = () => {
      if (!notificationList || !emptyState || !notificationFooter) return;
      const count = notificationList.children.length;

      if (count > 0) {
        emptyState.classList.add('hidden');
        notificationFooter.classList.remove('hidden');
      } else {
        emptyState.classList.remove('hidden');
        notificationFooter.classList.add('hidden');
      }
    };

    // 3. 데스크톱 알림창 토글
    if (notificationButtonDesktop && notificationPanel) {
      notificationButtonDesktop.addEventListener('click', (event) => {
        event.stopPropagation();
        notificationPanel.classList.toggle('hidden');
        if (!notificationPanel.classList.contains('hidden')) {
          checkNotifications();
        }
      });
    }

    // 4. 모바일 메뉴 안에서 알림창 열기
    if (notificationButtonMobile && notificationPanel) {
      notificationButtonMobile.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (mobileMenu && mobileMenuButton) {
          mobileMenu.classList.add('hidden');
          mobileMenuButton.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }

        notificationPanel.classList.remove('hidden');
        checkNotifications();
      });
    }

    // 5. 외부 클릭 시 알림창 닫기
    document.addEventListener('click', (event) => {
      if (
        notificationPanel &&
        !notificationPanel.classList.contains('hidden') &&
        !notificationPanel.contains(event.target) &&
        !notificationButtonDesktop.contains(event.target) &&
        !notificationButtonMobile.contains(event.target)
      ) {
        notificationPanel.classList.add('hidden');
      }
    });

    // 초기 로드 시 알림 상태 확인
    checkNotifications();

    // --- 헤더 기능 초기화 종료 ---

    // 모든 컴포넌트 로드 완료 알림
    document.dispatchEvent(new Event('componentsLoaded'));
  });
});
