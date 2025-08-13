// loadComponents.js (최종 수정본)

document.addEventListener("DOMContentLoaded", async () => {

  // --- 헤더의 모든 기능을 초기화하는 함수 ---
  const initializeHeader = () => {
    // [수정] 모바일 메뉴 관련 요소 선택 변경
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel'); // ID 변경
    const closeMenuButton = document.getElementById('close-menu-button'); // 닫기 버튼 추가

    // 알림 관련 요소
    const notificationButtonDesktop = document.getElementById('notification-button-desktop');
    const notificationButtonMobile = document.getElementById('notification-button-mobile');
    const notificationPanel = document.getElementById('notification-panel');
    const notificationList = document.getElementById('notification-list');
    const emptyState = document.getElementById('notification-empty-state');
    const notificationFooter = document.getElementById('notification-footer');

    // --- [수정] 1. 슬라이딩 메뉴 토글 기능 ---
    if (mobileMenuButton && mobileMenuPanel && closeMenuButton) {
      const toggleMenu = () => {
        // 클래스를 토글하여 메뉴 패널을 열고 닫음
        mobileMenuPanel.classList.toggle('menu-open');
        mobileMenuPanel.classList.toggle('menu-closed');

        // 햄버거 아이콘 애니메이션을 위한 클래스 토글
        mobileMenuButton.classList.toggle('is-active');

        // 메뉴가 열려있으면 본문 스크롤을 막고, 닫혀있으면 풀어줌
        const isOpen = mobileMenuPanel.classList.contains('menu-open');
        document.body.style.overflow = isOpen ? 'hidden' : '';

        // 메뉴 열 때 다른 패널(알림창)은 닫기
        if (isOpen && notificationPanel) {
          notificationPanel.classList.add('hidden');
        }
      };

      // 햄버거 버튼과 닫기 버튼에 클릭 이벤트 할당
      mobileMenuButton.addEventListener('click', toggleMenu);
      closeMenuButton.addEventListener('click', toggleMenu);
    }
    // --- [수정] 끝 ---


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

    // [수정] 4. 알림창 열기 기능 (모바일 메뉴 안에서) - 기존 로직은 메뉴 구조 변경으로 불필요하여 제거
    if (notificationButtonMobile && notificationPanel) {
      notificationButtonMobile.addEventListener('click', (event) => {
        event.preventDefault(); // 링크의 기본 동작 방지
        event.stopPropagation();
        
        // 메뉴 패널을 닫음 (만약 열려있다면)
        if (mobileMenuPanel && mobileMenuPanel.classList.contains('menu-open')) {
          closeMenuButton.click(); // 닫기 버튼을 프로그래밍적으로 클릭하여 메뉴 닫기
        }
        
        // 알림창을 보여줌
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


  // --- 컴포넌트 로딩 로직 (기존과 동일) ---
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